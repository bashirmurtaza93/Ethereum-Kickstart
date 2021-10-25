const HDWallerProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs');


const compiledFactoryAbi  = require('../ethereum/build/CampaignFactory-abi.json','utf8');
// const compiledCampaignAbi  = require('../ethereum/build/Campaign-abi.json');


const compiledCampaignFactoryByteCode = fs.readFileSync('./build/CampaignFactory-bytecode.bin','utf8');


const provider = new HDWallerProvider(
   'ADDRESS_CODES_HERE',
   'https://rinkeby.infura.io/v3/d81b9a058e0e40fe903293259fe11dd5'
);

const web3 = new Web3(provider);

const deploy = async () => {
    
    let contractAdd;
    const accounts = await web3.eth.getAccounts()
    console.log('Attempting to deply from account', accounts[0]);

    await new web3.eth.Contract(compiledFactoryAbi)
    .deploy({ data: compiledCampaignFactoryByteCode})
    .send({from: accounts[0], gas:'3000000'})
    .on('receipt', (receipt) => {
        contractAdd = receipt.contractAddress;
    });
    console.log('Contract Deployed to', contractAdd);

}


deploy();

