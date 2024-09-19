"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrecision = exports.order_book = exports.modify_order = exports.cancelAll = exports.order_status = exports.createOrder = void 0;
const request_1 = __importDefault(require("request"));
const crypto_1 = __importDefault(require("crypto"));
const keys_1 = require("./keys");
const baseurl = "https://api.coindcx.com";
const public_baseurl = "https://public.coindcx.com";
const createOrder = function (side, market, price, quantity, clientOrderId) {
    const Prom = new Promise(function (resolve) {
        const body = {
            "side": side, //Toggle between 'buy' or 'sell'.
            "order_type": "limit_order", //Toggle between a 'market_order' or 'limit_order'.
            "market": market, //Replace 'SNTBTC' with your desired market.
            "price_per_unit": price, //This parameter is only required for a 'limit_order'
            "total_quantity": quantity, //Replace this with the quantity you want
            "timestamp": Math.floor(Date.now()),
            "client_order_id": clientOrderId //Replace this with the client order id you want
        };
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto_1.default.createHmac('sha256', keys_1.secret).update(payload).digest('hex');
        // console.log("in promise of createOrder")
        const options = {
            url: baseurl + "/exchange/v1/orders/create",
            headers: {
                'X-AUTH-APIKEY': keys_1.key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        };
        request_1.default.post(options, function (error, response, body) {
            if (error) {
                console.log("error while placing orders");
            }
            else {
                console.log(body);
            }
            resolve(body);
        });
    });
    return Prom;
};
exports.createOrder = createOrder;
const order_status = function (client_order_id) {
    const status_prom = new Promise(function (resolve) {
        const status_body = {
            "client_order_id": client_order_id, //Replace it with your Client Order ID.
            "timestamp": Math.floor(Date.now())
        };
        const payload = new Buffer(JSON.stringify(status_body)).toString();
        const signature = crypto_1.default.createHmac('sha256', keys_1.secret).update(payload).digest('hex');
        // console.log("in promise of createOrder")
        const options = {
            url: baseurl + "/exchange/v1/orders/status",
            headers: {
                'X-AUTH-APIKEY': keys_1.key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: status_body
        };
        request_1.default.post(options, function (error, response, body) {
            if (error) {
                console.log("error while placing orders");
            }
            else {
                console.log(body);
            }
            resolve(body);
        });
    });
    return status_prom;
};
exports.order_status = order_status;
const cancelAll = function (market) {
    return new Promise(function (resolve) {
        const body = {
            market: market, //Replace 'SNTBTC' with your desired market pair.
            "timestamp": Math.floor(Date.now())
        };
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto_1.default.createHmac('sha256', keys_1.secret).update(payload).digest('hex');
        const options = {
            url: baseurl + "/exchange/v1/orders/cancel_all",
            headers: {
                'X-AUTH-APIKEY': keys_1.key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        };
        request_1.default.post(options, function (error, response, body) {
            if (error) {
                console.log("error while cancelling orders");
            }
            else {
                console.log(body);
            }
            resolve();
        });
    });
};
exports.cancelAll = cancelAll;
const modify_order = function (client_order_id, price) {
    return new Promise(function (resolve) {
        const body = {
            "id": client_order_id, // Enter your Order ID here.
            // "client_order_id": "2022.02.14-btcinr_1", // Replace this with your Client Order ID.
            "timestamp": Math.floor(Date.now()),
            "price_per_unit": price // Enter the new-price here
        };
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto_1.default.createHmac('sha256', keys_1.secret).update(payload).digest('hex');
        const options = {
            url: baseurl + "/exchange/v1/orders/edit",
            headers: {
                'X-AUTH-APIKEY': keys_1.key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        };
        request_1.default.post(options, function (error, response, body) {
            if (error) {
                console.log("error while editing orders");
            }
            else {
                console.log(body);
            }
            resolve();
        });
    });
};
exports.modify_order = modify_order;
const order_book = function (currency) {
    const prom = new Promise(function (resolve) {
        request_1.default.get(public_baseurl + `/market_data/orderbook?pair=B-${currency}_INR`, function (error, response, body) {
            if (error) {
                console.log("error while getting orderbook");
            }
            else {
                // console.log(body);//body is a string, not an object here
                body = JSON.parse(body);
                resolve(body);
            }
        });
    });
    return prom;
};
exports.order_book = order_book;
const getPrecision = function getPrecision(currency) {
    const prom = new Promise(function (resolve) {
        request_1.default.get(baseurl + "/exchange/v1/markets_details", function (error, response, body) {
            // console.log(body);
            if (error) {
                console.log("error while getting precision");
            }
            else {
                body = JSON.parse(body);
                const our_currency_pair = `${currency}INR`;
                const our_currency_pair_object = body.find((obj) => obj["coindcx_name"] === our_currency_pair);
                const precision = our_currency_pair_object["base_currency_precision"];
                resolve(precision);
            }
        });
    });
    return prom;
};
exports.getPrecision = getPrecision;
function hello() {
    return __awaiter(this, void 0, void 0, function* () {
        let start_time = new Date().getTime();
        const prec = yield (0, exports.getPrecision)("INJ");
        let end_time = new Date().getTime();
        console.log(end_time - start_time);
    });
}
hello();
