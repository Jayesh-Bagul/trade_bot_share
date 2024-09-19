import request from "request"
import crypto from "crypto"
import { key, secret } from "./keys"
import { resolve } from "bun"

const baseurl = "https://api.coindcx.com"
const public_baseurl = "https://public.coindcx.com"



export const createOrder = function (side: "buy" | "sell", market: string, price: number, quantity: number, clientOrderId: string) {

    const Prom: any = new Promise(function (resolve) {
        const body = {
            "side": side,  //Toggle between 'buy' or 'sell'.
            "order_type": "limit_order", //Toggle between a 'market_order' or 'limit_order'.
            "market": market, //Replace 'SNTBTC' with your desired market.
            "price_per_unit": price, //This parameter is only required for a 'limit_order'
            "total_quantity": quantity, //Replace this with the quantity you want
            "timestamp": Math.floor(Date.now()),
            "client_order_id": clientOrderId //Replace this with the client order id you want
        }

        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

        // console.log("in promise of createOrder")
        const options = {
            url: baseurl + "/exchange/v1/orders/create",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }

        request.post(options, function (error, response, body) {
            if (error) {
                console.log("error while placing orders")
            }
            else {
                console.log(body);
            }
            resolve(body)
        })
    })
    return Prom
}

export const order_status = function (client_order_id: string) {

    const status_prom: any = new Promise(function (resolve) {

        const status_body = {
            "client_order_id": client_order_id, //Replace it with your Client Order ID.
            "timestamp": Math.floor(Date.now())
        }

        const payload = new Buffer(JSON.stringify(status_body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

        // console.log("in promise of createOrder")
        const options = {
            url: baseurl + "/exchange/v1/orders/status",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: status_body
        }

        request.post(options, function (error, response, body) {
            if (error) {
                console.log("error while placing orders")
            }
            else {
                console.log(body);
            }
            resolve(body)
        })

    })
    return status_prom

}



export const cancelAll = function (market: string) {


    return new Promise<void>(function (resolve) {

        const body = {
            market: market, //Replace 'SNTBTC' with your desired market pair.
            "timestamp": Math.floor(Date.now())
        }

        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

        const options = {
            url: baseurl + "/exchange/v1/orders/cancel_all",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }

        request.post(options, function (error, response, body) {
            if (error) {
                console.log("error while cancelling orders")
            }
            else {
                console.log(body);
            }

            resolve()
        })
    })
}


export const modify_order = function (client_order_id: string, price: number) {

    return new Promise<void>(function (resolve) {

        const body = {
            "id": client_order_id, // Enter your Order ID here.
            // "client_order_id": "2022.02.14-btcinr_1", // Replace this with your Client Order ID.
            "timestamp": Math.floor(Date.now()),
            "price_per_unit": price // Enter the new-price here
        }

        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

        const options = {
            url: baseurl + "/exchange/v1/orders/edit",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }

        request.post(options, function (error, response, body) {
            if (error) {
                console.log("error while editing orders")
            }
            else {
                console.log(body);
            }

            resolve()
        })
    })

}

export const order_book = function (currency: string) {

    const prom: any = new Promise(function (resolve) {
        request.get(public_baseurl + `/market_data/orderbook?pair=B-${currency}_INR`, function (error, response, body) {
            if (error) {
                console.log("error while getting orderbook")
            }
            else {

                // console.log(body);//body is a string, not an object here

                body = JSON.parse(body)
                resolve(body)
            }
        })
    })

    return prom

}

export const getPrecision = function getPrecision(currency: String) {

    const prom: any = new Promise(function (resolve) {
        request.get(baseurl + "/exchange/v1/markets_details", function (error, response, body) {
            // console.log(body);


            if (error) {
                console.log("error while getting precision")
            }
            else {

                body = JSON.parse(body)

                const our_currency_pair = `${currency}INR`
                const our_currency_pair_object = body.find((obj: any) => obj["coindcx_name"] === our_currency_pair);

                const precision = our_currency_pair_object["base_currency_precision"]
                resolve(precision)
            }




        })
    })
    return prom
}


async function hello() {
    let start_time = new Date().getTime()
    const prec = await getPrecision("INJ")
    let end_time = new Date().getTime()

    console.log(end_time - start_time)
}

hello()