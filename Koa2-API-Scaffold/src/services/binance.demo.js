const { Spot } = require('@binance/connector')
const fetch = require('node-fetch')
const fs = require('fs')
const { Console } = require('console')

class Binance {
    constructor() {
        this.testBaseURL = 'https://api.github.com/users/github'
        this.baseURL = 'https://api1.binance.com'
        this.apiKey = 'H2hr7bWmqfTbWNGkOF74lv4nmFP9XMAcwOziSFoTlI9HSiWmzs0V7u5lWBBjT6Rr'
        this.apiSecret = 'BNncYdRzykX8G0HbCaL3FaymVGIEtv3nMqKUU5FkWSoqOcUsRfm760VUVZjmIFDV'
        // make sure the logs/ folder is created beforehand
        this.output = fs.createWriteStream('./logs/stdout.log')
        this.errorOutput = fs.createWriteStream('./logs/stderr.log')

        this.logger = new Console({ stdout: this.output, stderr: this.errorOutput })
        // this.client = new Spot(this.apiKey, this.apiSecret, { logger: this.logger })
        this.client = new Spot(this.apiKey, this.apiSecret)
    }
    _log(info) {
        this.client.logger.info(info)
    }

    async testFetch() {
        const response = await fetch(this.testBaseURL);
        const data = await response.json();
        this._log(data)
    }

    test() {
        this._log(this.client)
    }


    /**
     * @description 获取账号信息
     */
    async account() {
        let response = await this.client.account()
        this._log(response.data)
    }

    async exchangeInfo() {
        this.client.exchangeInfo().then(response => this._log(response.data))
    }
    /**
     * @description 挂单
     */
    creatOrder(symbolPair, side, type = "LIMIT", price, amount, options = {}) {
        this.client.newOrder(symbolPair, side, type, {
            price: price,
            quantity: amount,
            timeInForce: 'GTC'
        }).then(response => this._log(response.data))
            .catch(error => this._log(error))
    }
    /**
     * @description 取消挂单
     */
    cancelOrder(symbolPair, options = {}) {
        this.client.cancelOrder(symbolPair, options).then(response => this._log(response.data))
            .catch(error => this._log(error))
    }

    /**
     * @description 取消挂单
     */
     allOrders(symbolPair, options = {}) {
        this.client.allOrders(symbolPair, options).then(response => this._log(response.data))
            .catch(error => this._log(error))
    }

    /**
     * @description 
     */

}
const binance = new Binance


// binance.account()
// binance.creatOrder('FTMUSDT', 'SELL', 'LIMIT', '4.4', 10)
binance.allOrders('FTMUSDT')

// binance.test()
