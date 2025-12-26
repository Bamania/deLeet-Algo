class TokenLimiter{
    count:number //this will define the no of request you want 
    duration:number // this will be in seconds
    capacity:number 
    lastRefillTime: number;
    
    constructor(count:number,duration:number){
        this.count=count;
        this.duration=duration;
        this.capacity=count; // capacity is hardcoded to count
        this.lastRefillTime = Date.now();
        

// in TokenBucket Limiter ! basically we check whether we have enough
// token in the bucket ,if yes we allow the requesst to pass if not we
// reject with 429 !

    }

    // Refill tokens based on elapsed time (called on-demand)
    refill(){
        const now = Date.now();
        const secondsElapsed = (now - this.lastRefillTime) / 1000;
        const tokensToAdd = (this.count / this.duration) * secondsElapsed;
        
        this.capacity = Math.min(this.capacity + tokensToAdd, this.count);
        this.lastRefillTime = now;
    }

    // Keep the interval-based refiller for backwards compatibility
    refiller(){
        setInterval(()=>{
            this.refill();
        }, 1000);
    }


    processReq():number{
        // Always refill before processing to ensure accurate capacity
        this.refill();
        
        if(this.capacity < 1){
            return 0;
            
        }
        this.capacity--;
        return 1;
        
    }

    // Get current capacity (refills first to get accurate count)
    getCapacity(): number {
        this.refill();
        return Math.floor(this.capacity);
    }

    // Get exact capacity including fractional tokens
    getExactCapacity(): number {
        this.refill();
        return this.capacity;
    }

    // Get time in seconds until next token is added
    getTimeUntilNextToken(): number {
        this.refill();
        
        // If at max capacity, next refill would overflow - show full duration
        if (this.capacity >= this.count) {
            return 0;
        }
        
        // Time to add 1 token = duration / count
        const timePerToken = this.duration / this.count;
        
        // How much of the current token is filled (fractional part)
        const fractionalPart = this.capacity - Math.floor(this.capacity);
        
        // Time until we get the next whole token
        const timeUntilNext = (1 - fractionalPart) * timePerToken;
        
        return Math.max(0, timeUntilNext);
    }
}

export default TokenLimiter;