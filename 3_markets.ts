// console.log("Hello via Bun!");

import axios from "axios"

import { DepthManager } from "./DepthManager"
import { cancelAll, createOrder, modify_order, order_book, order_status } from "./order"

const currency = "WAXP"


const Sol_Inr_mkt = new DepthManager(`B-${currency}_INR`)
const Sol_Usdt_mkt = new DepthManager("B-ICP_USDT")
const Usdt_Inr_mkt = new DepthManager("B-USDT_INR")
// inj
// uma
// TON
//RUNE
// AZERO
// SNX
// UNI
// WAXP

// setInterval(function () {
//     // "bun index.ts" in wsl
//     console.log(Sol_Inr_mkt.getRelevantDepth())
//     console.log(Sol_Usdt_mkt.getRelevantDepth())
//     console.log(Usdt_Inr_mkt.getRelevantDepth())

//     // FIRST ROUTE : selling sol. Profit in terms of SOL. Problem is here we have to hold sol in the beginning, so if its price goes down then we are screwed. 
//     // sell SOL get INR, buy USDT with this INR, buy sol again from the USDT.

//     // only in case of illiquid market among the three we have to place a limit order in rest of the cases the difference between lowest ask and the highest bid is already low and hecne no need of placing a limit order with 0.001 difference.


//     // placing a limit order : just below the lowest ask so that the buyer who will place a market order will get matched with us. In this market the highest bid and lowest ask is having a big gap.
//     // illiquid market
//     const initial_inr_we_got_by_selling_1_sol = Sol_Inr_mkt.getRelevantDepth().lowest_ask - 0.001


//     // placing a market order : in case of the market ordr the order will be matched with the lowest ask order because we want to buy at the lowest price.
//     // liquid market
//     const amount_of_usdt_we_got_from_inr = initial_inr_we_got_by_selling_1_sol / Usdt_Inr_mkt.getRelevantDepth().lowest_ask


//     // placing a market order : in case of the market ordr the order will be matched with the lowest ask order because we want to buy at the lowest price.
//     // liquid market
//     const sol_that_can_be_bought_with_the_usdt_we_just_bought = amount_of_usdt_we_got_from_inr / Sol_Usdt_mkt.getRelevantDepth().lowest_ask

//     console.log(`initially you had 1 XAI and finally you got ${sol_that_can_be_bought_with_the_usdt_we_just_bought} XAI`)


//     // SECOND ROUTE : buying SOL. Profits in terms of INR. Here we are holding INR hence fine.
//     // buy SOL from INR, sell SOL and get USDT, sell USDT and get INR again.


//     const initial_inr = Sol_Inr_mkt.getRelevantDepth().highest_bid + 0.001
//     const amount_of_usdt_we_got_from_selling_sol = 1 * Sol_Usdt_mkt.getRelevantDepth().highest_bid
//     const inr_that_can_be_bought_by_selling_usdt_again = Usdt_Inr_mkt.getRelevantDepth().highest_bid * amount_of_usdt_we_got_from_selling_sol
//     // we multiplied becas=use we can have 1.01 usdt : "Usdt_Inr_mkt.getRelevantDepth().highest_bid" this is just for 1 usdt-inr

//     console.log(`initially you had ${initial_inr} and finally you got ${inr_that_can_be_bought_by_selling_usdt_again} `)




// }, 3000)

const t1 = 17000
const t2 = 20000


// const inter = setInterval(
//     async function trade() {


//         const highest_bid_present: number = (Sol_Inr_mkt.getRelevantDepth().highest_bid)
//         const lowest_ask_present: number = (Sol_Inr_mkt.getRelevantDepth().lowest_ask)
//         const buy_price: number = Number((highest_bid_present + 0.01).toFixed(3));
//         const sell_price: number = Number((lowest_ask_present - 0.001).toFixed(2));


//         const buy_order_placed = await createOrder("buy", `${currency}INR`, buy_price, 0.11, Math.random().toString())

// await new Promise(function (resolve): any {
//     setTimeout(resolve, t1)
// })


//         const order_status_body = await order_status((buy_order_placed.orders[0].client_order_id).toString())

//         // console.log("checking if order filled or not")

//         if (order_status_body.status == "filled") {
//             console.log("in filled")

//             clearInterval(inter)

//             const inter_sell = setInterval(async function clear() {

//                 const lowest_ask_present: number = (Sol_Inr_mkt.getRelevantDepth().lowest_ask)
// const sell_price: number = Number((lowest_ask_present - 0.01));
// const sell_order_placed = await createOrder("sell", `${currency}INR`, sell_price, 0.11, Math.random().toString())

//                 await new Promise(function (resolve): any {
//                     setTimeout(resolve, t1)
//                 })

//                 const order_status_body = await order_status((sell_order_placed.orders[0].client_order_id).toString())

//                 if (order_status_body.status == "filled") {
//                     clearInterval(inter_sell)
//                 }


//                 else {
//                     await cancelAll(`${currency}INR`)
//                 }


//             }, t2)

//         }


//         else {
//             await cancelAll(`${currency}INR`)
//         }


//     }, t2)


async function trade() {

    await new Promise(function (resolve): any {
        setTimeout(resolve, 6000)
    })

    console.log("hi")
    const highest_bid_present: number = (Sol_Inr_mkt.getRelevantDepth().highest_bid)
    const lowest_ask_present: number = (Sol_Inr_mkt.getRelevantDepth().lowest_ask)
    const buy_price: number = Number((highest_bid_present).toFixed(2));
    const sell_price: number = Number((lowest_ask_present).toFixed(2));


    const buy_order_placed = await createOrder("buy", `${currency}INR`, buy_price, 17, Math.random().toString())
console.log(buy_price)

    const interval1 = setInterval(async function () {
        // const current_highest_bid =  Sol_Inr_mkt.getRelevantDepth().highest_bid

        const order_book_recieved = await order_book(currency)
        // console.log(order_book_recieved)

        let current_bids_keys_array = Object.keys(order_book_recieved.bids)
        let current_bids_values_array: any = Object.values(order_book_recieved.bids)
        let current_asks_keys_array = Object.keys(order_book_recieved.bids)

        const current_lowest_ask = Number(current_asks_keys_array[0])

        const current_highest_bid = Number(current_bids_keys_array[0])
        const current_2nd_highest_bid = Number(current_bids_keys_array[1])
        let set_price = current_highest_bid + 0.01

        if ((current_lowest_ask - current_highest_bid) >= 0.20) {
            if (current_highest_bid - current_2nd_highest_bid > 0.01 && current_bids_values_array[0] == 17) {
                set_price = current_2nd_highest_bid + 0.01
            }

            else if (current_highest_bid - current_2nd_highest_bid == 0.01 && (current_bids_values_array[0] >= 17)) {
                set_price = current_highest_bid + 0.01
            }

            else if (current_highest_bid - current_2nd_highest_bid == 0.01 && (current_bids_values_array[0] == 17)) {
                set_price = current_highest_bid
            }

        }

        else {
            set_price = current_2nd_highest_bid + 0.01
        }


        const modified_order = await modify_order((buy_order_placed.orders[0].id).toString(), set_price)


        // }
        await new Promise(function (resolve): any {
            setTimeout(resolve, 2000)
        })
        const order_status_body = await order_status((buy_order_placed.orders[0].client_order_id).toString())

        if (order_status_body.status == "filled") {
            clearInterval(interval1)
            sell_trade()
        }

    }, 5000)

}



async function sell_trade() {

    await new Promise(function (resolve): any {
        setTimeout(resolve, 6000)
    })

    // console.log("hi")
    const highest_bid_present: number = (Sol_Inr_mkt.getRelevantDepth().highest_bid)
    const lowest_ask_present: number = (Sol_Inr_mkt.getRelevantDepth().lowest_ask)
    const buy_price: number = Number((highest_bid_present + 0.01).toFixed(2));
    const sell_price: number = Number((lowest_ask_present - 0.01));

    const sell_order_placed = await createOrder("sell", `${currency}INR`, sell_price, 0.11, Math.random().toString())



    const interval2 = setInterval(async function () {
        // const current_highest_bid =  Sol_Inr_mkt.getRelevantDepth().highest_bid

        const order_book_recieved = await order_book(currency)
        // console.log(order_book_recieved)

        let current_asks_keys_array = Object.keys(order_book_recieved.asks)

        const current_lowest_ask = Number(current_asks_keys_array[0])

        const modified_order = await modify_order((sell_order_placed.orders[0].id).toString(), current_lowest_ask)
        // }
        await new Promise(function (resolve): any {
            setTimeout(resolve, 2000)
        })

        const order_status_body = await order_status((sell_order_placed.orders[0].client_order_id).toString())

        if (order_status_body.status == "filled") {
            clearInterval(interval2)
            // sell_trade()
        }

    }, 5000)

}


trade()
