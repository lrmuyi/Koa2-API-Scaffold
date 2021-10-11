const { Spot } = require('@binance/connector')
const fetch = require('node-fetch')


const apiKey = 'H2hr7bWmqfTbWNGkOF74lv4nmFP9XMAcwOziSFoTlI9HSiWmzs0V7u5lWBBjT6Rr'
const apiSecret = 'BNncYdRzykX8G0HbCaL3FaymVGIEtv3nMqKUU5FkWSoqOcUsRfm760VUVZjmIFDV'
const client = new Spot(apiKey, apiSecret, { baseURL: 'https://api1.binance.com' })

// console.info(await client.account({ recvWindow: 2000 }))
// // Place a new order
// client.newOrder('BNBUSDT', 'BUY', 'LIMIT', {
//     price: '350',
//     quantity: 1,
//     timeInForce: 'GTC'
// }).then(response => client.logger.log(response.data))
//     .catch(error => client.logger.error(error))

//     // /sapi/v1/system/status


class Binance {
    test = async () => {
        const response = await fetch('https://api.github.com/users/github');
        const data = await response.json();
        client.logger.info(data)
    }

    account = async () => {
        client.logger.info(client)
        let response = await client.account({ recvWindow: 2000 })
        client.logger.log(response.data)
    }
}
const binance = new Binance


binance.account()