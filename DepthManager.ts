// either we can keep polling some endpoint for the orderbook data or we can use some sort of websocket API which will give us real time latest data.




import axios from "axios"

interface type {
    [key: string]: string
}


// can be accessed inside the class as well
// function outside_class(): any {
//     console.log("hi")
// }
// const name = "alpha"



export class DepthManager {
    // to understand about class see below
    private market: string;
    // for this.market to work in ts we have to define it like above first.

    private bids: type
    private asks: type


    constructor(market: string) {
        this.market = market
        this.bids = {}
        this.asks = {}

        // outside_class() : works if this fucntion is defined above.

        // see about the this context below. ALso see different possibilities tht can work here below.
        setInterval(() => {
            this.pollMarket()
            // console.log
        }, 2000)
        // first time it will hit the pollMarket function after 3 seconds. Not from the beginning

    }

    async pollMarket() {

        // const depth = await axios.get(`https://public.coindcx.com/market_data/orderbook/?pair=${this.market}`)

        // this.bids = depth.data.bids
        // // this.bids is an object like 
        // // this.bids = { '9468.060000000000': '3.307000',      
        // //   '9460.880000000000': '0.108000' }

        // this.asks = depth.data.asks
        // // console.log(this.bids)

        const res = await fetch(`https://public.coindcx.com/market_data/orderbook/?pair=${this.market}`)
        const data = await res.json()
        this.bids = data.bids
        this.asks = data.asks
    }

    getRelevantDepth() {
        let bids_keys_array = Object.keys(this.bids)

        let asks_keys_array = Object.keys(this.asks)
        // asksKeys will be an array ["110.6540", "110.6550", "110.6560", ...], which are the keys of the asks object. The keys are in the same order as they appear in the asks object.

        let highest_bid = "1111111"
        let lowest_ask = "0"


        // in the index.ts we execute the line new DepthManager and then as we go inside the constructor and encounter an the setInterval thing then it will run after 3 seconds for the first time itself in this 3 seconds it will be in the WebAPIs section, in the mean time we will again go in the index.ts and we move below in the index.ts and we are at the getRelevantDepth(), now in this since we don't have access to the actual this.bids in the very first iteration we will get undefined in object.keys(this.bids), in the very first iteration this.bids is an emty object, hence we defined highest_Bid and lowest_ask separately here.and now for the next iteration we will be having this.bids ready. Many setIntervals(like 3 of the main constructor and 1 more of the relevant depth ) will be queued in the WebAPIs section. Even if the constructor setInterval is called first in the callstack and hence it might seem that this.bids should be available for the next setInterval of the getRelevantDepth but this might not be the case because after the first 3 seconds the await thing will be encountered and this data fetching may also take time and hence it is better to define some values beforehand. 


        // if-else thing written so that we don't get to see undefined value of highest_bid and lowest_ask in the first method call ont this class.
        if (!bids_keys_array[0]) {
            highest_bid = "1111111"
            lowest_ask = "0"
        }

        else {
            highest_bid = bids_keys_array[0]
            lowest_ask = asks_keys_array[0]
        }

        return {
            "highest_bid": parseFloat(highest_bid),
            "lowest_ask": parseFloat(lowest_ask)
        }

    }

getPrecision(){
    
}


}







// CLASS

// class Car {
//   constructor(name, year) {
//     this.name = name;
//     this.year = year;
//   }
//   age() {
//     const date = new Date();
//     return date.getFullYear() - this.year;
//   }
// }

// const myCar = new Car("Ford", 2014);
// document.getElementById("demo").innerHTML =
// "My car is " + myCar.age() + " years old.";







// this context:
// In JavaScript, the `this` keyword refers to the context in which a function is called. It can be thought of as a reference to the object that owns the currently executing code. The specific value of `this` depends on how a function is called:

// 1. **Default Binding**: When a function is called as a standalone function (i.e., not as a method on an object or as a constructor), `this` inside the function refers to the global object (in a browser environment, it would be the `window` object).

// 2. **Implicit Binding**: When a function is called as a method on an object, `this` inside the function refers to the object on which the method is called.

// 3. **Explicit Binding**: When a function is called using the `call()`, `apply()`, or `bind()` methods, `this` inside the function refers to the object that is passed as the first argument to the `call()`, `apply()`, or `bind()` method.

// 4. **New Binding**: When a function is called as a constructor using the `new` keyword, `this` inside the function refers to a new object that is created by the constructor.

// 5. **Arrow Functions**: Arrow functions do not have their own `this` context. Instead, they inherit the `this` value from the surrounding lexical scope (i.e., the scope in which they are defined).

// In summary, the value of `this` is determined by how a function is called and can refer to different objects depending on the context in which the function is called.







// different setIntervals :


//doesn't work
// setInterval(function() {
//     this.pollMarket()
// }, 3000)
// "this" inside the regular function will refer to the global object by default. And there is nor pollMarket thing defined in the global scope/


// works
// setInterval(function() {
//     outside_class()
// }, 3000)


// works
// var self = this;
// setInterval(function () {
//     self.pollMarket();
// }, 3000);