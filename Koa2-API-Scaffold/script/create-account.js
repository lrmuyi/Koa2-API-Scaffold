const { Wallet, ethers } = require('ethers')
const httpBaseUrl = 'https://bsc-dataseed1.binance.org'

const provider =  new ethers.providers.JsonRpcProvider(httpBaseUrl);

// const wallet = new Wallet
Wallet.createRandom().then(res=>{
    console.log('====================================');
    console.log(res);
    console.log('====================================');
})
