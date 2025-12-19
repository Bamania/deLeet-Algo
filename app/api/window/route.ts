import TokenLimiter from "@/lib/rateLimiter";
import { NextResponse } from "next/server";
const limiter=new TokenLimiter(5,60) // the capacity of the bucket will be == to the count of the req !
limiter.refiller() //start the refilling ()
export function GET(){
    const isAllowed=limiter.processReq(); //check can we process the REQ or not
  
  if (isAllowed === 0) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }
  
  return NextResponse.json({ message: "success " });

}