require('dotenv').config();
const superagent = require("superagent");
const schedule = require('node-schedule');
const { ethers, Contract, Wallet, utils } = require('ethers')
const { log } = require('console')


const pancakeRouter = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const MONSTER_PROXY = '0x8a5d7fcd4c90421d21d30fcc4435948ac3618b2f'
const MONSTER = '0xf8e005D6fF6B27Cac5fF18f8418B450Fe5aE4B85'

class Transaction {
    constructor() {
        this.apikey = '9K9TFF9HZCKZ3AG9ZXK9BJAE1RRA9MPZNM'
        this.baseUrl = 'https://api.bscscan.com/api'
        this.httpBaseUrl = 'https://bsc-dataseed1.binance.org'
        // this.httpBaseUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545'
        this.ethersProvider = new ethers.providers.JsonRpcProvider(this.httpBaseUrl)
        this.singer = new Wallet(process.env.PRIVATE_KEY, this.ethersProvider)
        this.contractWithSinger = null
        this._init()
    }
    async _init() {
        // await this.initContractSinger(MONSTER, MONSTER_PROXY)
        await this.initContractSinger(pancakeRouter)
        await this.listenMethods()

        // this.test()


        // this.createWallet()
    }
    test() {
        // console.log(this.ethersProvider);
        this.singer.getBalance('0x02F024e0882B310c6734703AB9066EdD3a10C6e0').then(res => {
            console.log(utils.formatEther(res));
        })
    }

    async createWallet() {
        let randomWallet = Wallet.createRandom()
        console.log(randomWallet);
        let mnemonic = randomWallet._mnemonic()
        let address = randomWallet.address
        let key = randomWallet._signingKey()
        console.log(address);
        console.log(key);
        console.log(mnemonic);
    }

    async initContractSinger(address = pancakeRouter, proxy_address = null) {
        let abi = await this.getContractAbi(address)
        const iface = new utils.Interface(abi);
        // console.log('==============iface======================');
        // console.log(iface);
        // console.log('====================================');
        this.contractWithSinger = new Contract(proxy_address || address, iface, this.singer)
    }

    listenMethods() {
        this.ethersProvider.on("block", (blockNumber) => {
            // Emitted on every block change
            // console.log(blockNumber);
        })

        // this.contractWithSinger.on('Transfer', (author, oldValue, newValue, event) => {
        //     // 在值变化的时候被调用

        //     console.log(author);
        //     // "0x14791697260E4c9A71f18484C9f997B308e59325"

        //     console.log(oldValue);
        //     // "Hello World"

        //     console.log(newValue);
        //     // "Ilike turtles."

        //     // 查看后面的事件触发器  Event Emitter 了解事件对象的属性
        //     console.log(event.blockNumber);
        //     // 4115004
        // })

        // The null field indicates any value matches, this specifies
        // "any Transfer from any to myAddress"
        // let filter = this.contractWithSinger.Transfer();

        console.log(this.contractWithSinger);

        // Listen for our filtered results
        // this.contractWithSinger.on('Approval', (to, amount) => {
        //     // console.log('I received ' + value.toString() + ' tokens from ' + from);
        //     console.log(to);
        //     console.log(amount);

        // });
        // this.contractWithSinger.on('Transfer', (from, to, value) => {
        //     console.log('I received ' + utils.formatEther(value) + ' tokens from ' + from);
        // });

        
        // this.contractWithSinger.on('addLiquidity', (author, oldValue, newValue, event) => {
        //     // 在值变化的时候被调用

        //     console.log(author);
        //     // "0x14791697260E4c9A71f18484C9f997B308e59325"

        //     console.log(oldValue);
        //     // "Hello World"

        //     console.log(newValue);
        //     // "Ilike turtles."

        //     // 查看后面的事件触发器  Event Emitter 了解事件对象的属性
        //     console.log(event.blockNumber);
        //     // 4115004
        // })
    }

    getTransactionStatus(txHash) {
        let url = `${this.baseUrl}?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${this.apikey}`
        superagent.get(url, (err, res) => {
            log('====================================');
            log(res.body);
            log('====================================');
        })
    }

    async getContractAbi(address) {
        let url = `${this.baseUrl}?module=contract&action=getabi&address=${address}&apikey=${this.apikey}`
        let abi = (await superagent.get(url)).body.result
        return abi
        //    , (err, res) => {
        //     if (res.body.status == 1) {
        //         // console.log(res.body);
        //         return res.body.result
        // }
        // }
    }

    async getBnbBalance(account) {
        let url = `${this.baseUrl}?module=account&action=balance&address=${account}&apikey=${this.apikey}`
        // superagent.get(url, (err, res) => {
        //     if (res.body.status == 1) {
        //         log('balance', utils.formatEther(res.body.result));
        //     }
        // })
        let netWork = await this.ethersProvider.getNetwork()
        // this.ethersProvider.getSigner()
        // console.log(netWork);
    }

}

const transaction = new Transaction()

// schedule.scheduleJob('30 * * * * *', async () => {
//     log(transaction.getTransaction());
//     log('====================================');
//     log('====================================');
// })

log('====================================');
// log(utils.formatEther());
log('====================================');
transaction.getBnbBalance('0xE1972f9b83df61aCF0Ff9f329D98FA3Cf2AF6a4B')
// transaction.getContractAbi(pancakeRouter)
