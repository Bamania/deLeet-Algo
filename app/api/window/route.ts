import TokenLimiter from "@/lib/rateLimiter";
import { NextRequest, NextResponse } from "next/server";

// Store limiters by configuration key
const limiters = new Map<string, TokenLimiter>();

function getLimiter(count: number, duration: number): TokenLimiter {
  const key = `${count}-${duration}`;
  
  if (!limiters.has(key)) {
    const limiter = new TokenLimiter(count, duration);
    limiter.refiller();
    limiters.set(key, limiter);
  }
  
  return limiters.get(key)!;
}

// GET - Simple rate limited request
export function GET() {
  const limiter = getLimiter(5, 60);
  const isAllowed = limiter.processReq();
  
  if (isAllowed === 0) {
    return NextResponse.json(
      { 
        error: "Rate limit exceeded",
        capacity: limiter.capacity,
        maxCapacity: limiter.count,
      },
      { status: 429 }
    );
  }
  
  return NextResponse.json({ 
    message: "success",
    capacity: limiter.capacity,
    maxCapacity: limiter.count,
  });
}

// POST - Configurable rate limited request for playground
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 10, duration = 10 } = body;
    
    const limiter = getLimiter(count, duration);
    const isAllowed = limiter.processReq();
    
    // Get current capacity after processing
    const currentCapacity = limiter.getCapacity();
    
    if (isAllowed === 0) {
      const retryIn = (duration / count).toFixed(1);
      return NextResponse.json(
        { 
          success: false,
          error: "Rate limit exceeded",
          capacity: currentCapacity,
          maxCapacity: limiter.count,
          retryIn: parseFloat(retryIn),
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Request processed successfully",
      capacity: currentCapacity,
      maxCapacity: limiter.count,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// GET endpoint to check current limiter status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 10, duration = 10 } = body;
    
    const limiter = getLimiter(count, duration);
    
    // Use getCapacity() which refills first for accurate count
    const currentCapacity = limiter.getCapacity();
    const timeUntilNextToken = limiter.getTimeUntilNextToken();
    
    return NextResponse.json({
      capacity: currentCapacity,
      maxCapacity: limiter.count,
      duration: limiter.duration,
      timeUntilNextToken: parseFloat(timeUntilNextToken.toFixed(2)),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}