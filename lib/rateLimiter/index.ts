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

    refiller(){
        setInterval(()=>{
            const now = Date.now();
            const secondsElapsed = (now - this.lastRefillTime) / 1000;
            const tokensToAdd = (this.count / this.duration) * secondsElapsed;
            
            this.capacity = Math.min(this.capacity + tokensToAdd, this.count);
            this.lastRefillTime = now;
        }, 1000);
    }


    processReq():number{
        if(this.capacity<=0){
            return 0;
            
        }
        this.capacity--
        return 1
        
    }
}

export default TokenLimiter;