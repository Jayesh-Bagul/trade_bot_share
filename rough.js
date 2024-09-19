// // // // // // function hello (name){
// // // // // //      this.beta = name
// // // // // //      console.log(this.beta)
// // // // // // }

// // // // // // const { resolve } = require("bun")

// // // // // // hello("Jayesh")

// // // // // // setInterval(function(){
// // // // // //      console.log("hi")
// // // // // // },5000)

// // // // // // console.log("Hello")

// // // // // async function prom() {

// // // // //      const prom = await new Promise(function (resolve) {

// // // // //           setTimeout(resolve, 8000)
// // // // //      })

// // // // //      return prom
// // // // // }


// // // // // async function test() {

// // // // //      const prom_var = await prom
// // // // //      console.log("hi in test")
// // // // // }

// // // // // test()

// // // // const start_time = new Date()

// // // // let a=0
// // // // for( let i=0; i < 5000000000; i++){
// // // // a++
// // // // }
// // // // const end_time = new Date()

// // // // console.log(end_time-start_time)

// // // // const a = 4

// // // // if(a>2){
// // // //     console.log("greater than 2")
// // // // }
// // // // else if(a>3){
// // // //     console.log("greater than 3")
// // // // }

async function sell_trade(quantity_bought: number) {

    await new Promise(function (resolve): any {
        setTimeout(resolve, t_before_first_depth)
    })

    const to_fix = (currency_INR_market.getRelevantDepth().highest_bid.toString().split('.')[1] || '').length;
    console.log(to_fix)

    const below = 1 / (10 ** to_fix)
    console.log(below)
    const sell_price: number = Number((currency_INR_market.getRelevantDepth().lowest_ask + below-0.01).toFixed(to_fix));
    const quantity = quantity_bought
    // const quantity = 2
    console.log(sell_price)
    const sell_order_placed = await createOrder("sell", `${currency}INR`, sell_price, quantity, Math.random().toString())


    const interval2 = setInterval(async function () {

        const order_book_recieved = await order_book(currency)

        let current_bids_keys_array = Object.keys(order_book_recieved.bids)
        let current_asks_keys_array = Object.keys(order_book_recieved.asks)
        let current_asks_values_array = Object.keys(order_book_recieved.asks)

        const quantity_of_lowest_ask = Number(current_asks_values_array[0])

        const current_highest_bid = Number(current_bids_keys_array[0])
        const current_lowest_ask = Number(current_asks_keys_array[0])
        const current_2nd_lowest_ask = Number(current_asks_keys_array[1])

        const margin = current_lowest_ask - current_highest_bid
        const margin_percent = (margin) * 100 / current_highest_bid

        let set_price = current_lowest_ask - 0.01

        const difference = Number((current_2nd_lowest_ask - current_lowest_ask).toFixed(to_fix))
        console.log(margin_percent)
        if (margin_percent > 3) {
            console.log("inside if")


            if (difference > 0.01 && quantity_of_lowest_ask == quantity) {
                set_price = current_2nd_lowest_ask - 0.01
                console.log("first")
            }
            else if (difference > 0.01 && quantity_of_lowest_ask != quantity) {
                set_price = current_lowest_ask - 0.01
                console.log("second")
            }
            else if (difference > 0.01 && quantity_of_lowest_ask >= quantity) {
                set_price = current_lowest_ask - 0.01
                console.log("third")
            }

            else if (difference == 0.01 && (quantity_of_lowest_ask > quantity)) {
                set_price = current_lowest_ask - 0.01
                console.log("fourth")

            }
            else if (difference == 0.01 && (quantity_of_lowest_ask == quantity)) {
                set_price = current_lowest_ask
                console.log("fifth")
    
            }



        }

        else {
            console.log("inside else")

            set_price = Number((current_highest_bid * 1.03).toFixed(to_fix))
            console.log("seventh")

        }

        const modified_order = await modify_order((sell_order_placed.orders[0].id).toString(), set_price)


        // await new Promise(function (resolve): any {
        //     setTimeout(resolve, 2000)
        // })
        const order_status_body = await order_status((sell_order_placed.orders[0].client_order_id).toString())

        if (order_status_body.status == "filled") {
            clearInterval(interval2)
        }

    }, t_modify)

}