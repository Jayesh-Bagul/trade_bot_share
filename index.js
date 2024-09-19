"use strict";
// console.log("Hello via Bun!");
// INJ
// UMA
// TON
//RUNE
// AZERO
// SNX
// UNI
// WAXP
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DepthManager_1 = require("./DepthManager");
const order_1 = require("./order");
const currency = "UMA";
const currency_INR_market = new DepthManager_1.DepthManager(`B-${currency}_INR`);
const margin_we_want = 2;
const t_before_first_depth = 4000;
const t_modify = 40;
function trade() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(function (resolve) {
            setTimeout(resolve, t_before_first_depth);
        });
        const to_fix = yield (0, order_1.getPrecision)(currency);
        const above = 1 / (10 ** to_fix);
        const buy_price = Number((currency_INR_market.getRelevantDepth().highest_bid + above).toFixed(to_fix));
        const quantity = (Number((105 / currency_INR_market.getRelevantDepth().highest_bid).toFixed(to_fix)));
        const buy_order_placed = yield (0, order_1.createOrder)("buy", `${currency}INR`, buy_price, quantity, Math.random().toString());
        let sell_trade_called = false;
        const interval1 = setInterval(function () {
            return __awaiter(this, void 0, void 0, function* () {
                const order_book_recieved = yield (0, order_1.order_book)(currency);
                let current_bids_keys_array = Object.keys(order_book_recieved.bids);
                let current_bids_values_array = Object.values(order_book_recieved.bids);
                let current_asks_keys_array = Object.keys(order_book_recieved.asks);
                const quantity_of_highest_bid = current_bids_values_array[0];
                const current_lowest_ask = Number(current_asks_keys_array[0]);
                const current_highest_bid = Number(current_bids_keys_array[0]);
                const current_2nd_highest_bid = Number(current_bids_keys_array[1]);
                const margin = current_lowest_ask - current_highest_bid;
                const margin_percent = (margin) * 100 / current_highest_bid;
                let set_price = current_highest_bid + above;
                const difference = Number((current_highest_bid - current_2nd_highest_bid).toFixed(to_fix));
                if (margin_percent > margin_we_want) {
                    console.log("inside if");
                    if (difference > above && quantity_of_highest_bid == quantity) {
                        set_price = current_2nd_highest_bid + above;
                        console.log("first");
                    }
                    else if (difference > above && quantity_of_highest_bid != quantity) {
                        set_price = current_highest_bid + above;
                        console.log("second");
                    }
                    else if (difference > above && quantity_of_highest_bid >= quantity) {
                        set_price = current_highest_bid + above;
                        console.log("third");
                    }
                    else if (difference == above && (quantity_of_highest_bid > quantity)) {
                        set_price = current_highest_bid + above;
                        console.log("fourth");
                    }
                    else if (difference == above && (quantity_of_highest_bid == quantity)) {
                        set_price = current_highest_bid;
                        console.log("fifth");
                    }
                }
                else {
                    console.log("inside else");
                    set_price = Number((current_lowest_ask * 100 / (100 + margin_we_want)).toFixed(to_fix));
                    console.log("seventh");
                }
                // const modified_order = await modify_order((buy_order_placed.orders[0].id).toString(), set_price)
                // await new Promise(function (resolve): any {
                //     setTimeout(resolve, 2000)
                // })
                const order_status_body = yield (0, order_1.order_status)((buy_order_placed.orders[0].client_order_id).toString());
                if (order_status_body.status == "filled" && !sell_trade_called) {
                    const avg_buy_price = order_status_body.avg_price;
                    clearInterval(interval1);
                    sell_trade(quantity, avg_buy_price);
                    sell_trade_called = true;
                }
                else if (!sell_trade_called) {
                    const modified_order = yield (0, order_1.modify_order)((buy_order_placed.orders[0].id).toString(), set_price);
                }
            });
        }, t_modify);
    });
}
function sell_trade(quantity_bought, buy_price) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(function (resolve) {
            setTimeout(resolve, 2);
        });
        const to_fix = yield (0, order_1.getPrecision)(currency);
        const below = 1 / (10 ** to_fix);
        console.log(below);
        const sell_price = Number((currency_INR_market.getRelevantDepth().lowest_ask + below).toFixed(to_fix));
        const quantity = quantity_bought;
        // const quantity = 2
        console.log(sell_price);
        const sell_order_placed = yield (0, order_1.createOrder)("sell", `${currency}INR`, sell_price, quantity, Math.random().toString());
        let sell_order_executed = false;
        const interval2 = setInterval(function () {
            return __awaiter(this, void 0, void 0, function* () {
                const order_book_recieved = yield (0, order_1.order_book)(currency);
                let current_bids_keys_array = Object.keys(order_book_recieved.bids);
                let current_asks_keys_array = Object.keys(order_book_recieved.asks);
                let current_asks_values_array = Object.values(order_book_recieved.asks);
                const quantity_of_lowest_ask = Number(current_asks_values_array[0]);
                const current_highest_bid = Number(current_bids_keys_array[0]);
                const current_lowest_ask = Number(current_asks_keys_array[0]);
                const current_2nd_lowest_ask = Number(current_asks_keys_array[1]);
                const margin = current_lowest_ask - buy_price;
                const margin_percent = (margin) * 100 / buy_price;
                let set_price = current_lowest_ask - below;
                const difference = Number((current_2nd_lowest_ask - current_lowest_ask).toFixed(to_fix));
                console.log(margin_percent);
                if (margin_percent > margin_we_want) {
                    console.log("inside if");
                    console.log(quantity_of_lowest_ask);
                    console.log(quantity);
                    if (difference > below && quantity_of_lowest_ask == quantity) {
                        set_price = current_2nd_lowest_ask - below;
                        console.log("first");
                    }
                    else if (difference > below && quantity_of_lowest_ask != quantity) {
                        set_price = current_lowest_ask - below;
                        console.log("second");
                    }
                    else if (difference > below && quantity_of_lowest_ask >= quantity) {
                        set_price = current_lowest_ask - below;
                        console.log("third");
                    }
                    else if (difference == below && (quantity_of_lowest_ask > quantity)) {
                        set_price = current_lowest_ask - below;
                        console.log("fourth");
                    }
                    else if (difference == below && (quantity_of_lowest_ask == quantity)) {
                        set_price = current_lowest_ask;
                        console.log("fifth");
                    }
                }
                else {
                    console.log("inside else");
                    set_price = Number((buy_price * (100 + margin_we_want) / 100).toFixed(to_fix));
                    console.log("seventh");
                }
                // const modified_order = await modify_order((sell_order_placed.orders[0].id).toString(), set_price)
                // await new Promise(function (resolve): any {
                //     setTimeout(resolve, 2000)
                // })
                const order_status_body = yield (0, order_1.order_status)((sell_order_placed.orders[0].client_order_id).toString());
                // if (order_status_body.status == "filled") {
                //     clearInterval(interval2)
                // }
                if (order_status_body.status == "filled" && !sell_order_executed) {
                    const avg_buy_price = order_status_body.avg_price;
                    clearInterval(interval2);
                    sell_order_executed = true;
                    // sell_trade(quantity, avg_buy_price)
                    // sell_trade_called = true
                }
                else if (!sell_order_executed) {
                    const modified_order = yield (0, order_1.modify_order)((sell_order_placed.orders[0].id).toString(), set_price);
                }
            });
        }, t_modify);
    });
}
trade();
// sell_trade(0.03, 3760.01)
