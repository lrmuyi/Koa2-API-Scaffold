const { log } = require('console');
const BinanceConnector = require('node-binance-api');
const schedule = require('node-schedule');

const client = new BinanceConnector().options({
    APIKEY: 'H2hr7bWmqfTbWNGkOF74lv4nmFP9XMAcwOziSFoTlI9HSiWmzs0V7u5lWBBjT6Rr',
    APISECRET: 'BNncYdRzykX8G0HbCaL3FaymVGIEtv3nMqKUU5FkWSoqOcUsRfm760VUVZjmIFDV'
});
class Binance {
    constructor() {
        this.apiKey = 'H2hr7bWmqfTbWNGkOF74lv4nmFP9XMAcwOziSFoTlI9HSiWmzs0V7u5lWBBjT6Rr'
        this.apiSecret = 'BNncYdRzykX8G0HbCaL3FaymVGIEtv3nMqKUU5FkWSoqOcUsRfm760VUVZjmIFDV'
        // make sure the logs/ folder is created beforehand
        // this.output = fs.createWriteStream(path.resolve(__dirname, './logs/stdout.log'))
        // this.errorOutput = fs.createWriteStream(path.resolve(__dirname, './logs/stderr.log'))

        // this.logger = new Console({ stdout: this.output, stderr: this.errorOutput })
        // this.client = new Spot(this.apiKey, this.apiSecret, { logger: this.logger })
        this.client = new BinanceConnector().options({
            APIKEY: this.apiKey,
            APISECRET: this.apiSecret
        });

    }


    test() {
        log(this.client)
    }
    /**
    * @description current balance
    */
    async balance() {
        try {
            let response = await this.client.balance();
            return response
        } catch (error) {
            log(error.body);
        }
    }
    /**
   * @description current prices
   */
    async prices() {
        try {
            let response = await this.client.prices();
            // log(response)
            return response
        } catch (error) {
            log(error.body);
        }
    }




    /**
     * @description 挂单(限价单)
     */
    async marketBuy(symbol, quantity = 1) {
        try {
            let response = await this.client.marketBuy(symbol, quantity);
            log(response)
        } catch (error) {
            log(error.body);
        }
    }

    /**
    * @description 挂单(限价单)
    */
    async marketSell(symbol, quantity = 1) {
        try {
            let response = await this.client.marketSell(symbol, quantity);
            log(response)
        } catch (error) {
            log(error.body);
        }
    }
    /**
       * @description 取消挂单
       */

    async cancelOrder(symbol, orderId = null) {
        try {
            let response = await this.client.cancel(symbol, orderId);
            log(response)
        } catch (error) {
            log(error.body);
        }
    }
    /**
      * @description 取消全部挂单
      */

    async cancelOrder(symbol) {
        try {
            let response = await this.client.cancelAll(symbol);
            log(response)
        } catch (error) {
            log(error.body);
        }
    }

    /**
     * @description 获取全部挂单
     */
    async openAllOrder(symbol = false) {
        try {
            let response = await this.client.futuresAllOrders(symbol);
            log(response)
        } catch (error) {
            log(error.body);
        }
    }
    /**
    * @description 获取全部交易对
    */
    async futuresExchangeInfo() {
        try {
            let response = await this.client.futuresExchangeInfo();
            log(response)
        } catch (error) {
            log(error.body);
        }
    }
}
const binance = new Binance


// console.time('buy order test')
// console.timeEnd('buy order test')


// binance.marketBuy('FTMUSDT', 1)
// binance.marketSell('FTMUSDT', 5)

// binance.openAllOrder('BNBUSDT')

const filterBalance = async () => {
    log('===================');
    log(new Date);
    log('===================');
    const assets = await binance.balance()
    const prices = await binance.prices()
    for (const key in assets) {
        if (Object.hasOwnProperty.call(assets, key)) {
            const element = assets[key];
            if (element.available > 0) {
                log(Object.assign({ symbol: `${key}USDT`, price: prices[`${key}USDT`] }, element));
            }
        }
    }
}


_logSecond = () => {
    schedule.scheduleJob({ second: [0, 10, 20, 30, 40, 50] }, () => {
        log('====================================');
        log(new Date().getSeconds());
        log('====================================');
    })
}
// _logSecond()
// schedule.scheduleJob('10 * * * * *', () => {
//     filterBalance()
// });
// filterBalance()
// binance.prices()
// client.futuresTrades('BNBUSDT').then(res => log(res))
client.futuresLeverage( 'BNBUSDT', 6 )
// client.futuresMarketBuy('BNBUSDT', 5).then(res => log(res))
// client.futuresSell('BNBUSDT', 0.5).then(res => log(res))

