const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider()); 
const fs = require('fs');

const compiledFactoryAbi  = require('../ethereum/build/CampaignFactory-abi.json','utf8');
const compiledCampaignAbi  = require('../ethereum/build/Campaign-abi.json');


const compiledCampaignFactoryByteCode = fs.readFileSync('./ethereum/build/CampaignFactory-bytecode.bin','utf8');



let accounts, factory, campaignAddress, campaign;

//testing begins now 
beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use one of those accounts to deploy the contract
     factory = await new web3.eth.Contract(compiledFactoryAbi)
    .deploy({ data: compiledCampaignFactoryByteCode})
    .send({from: accounts[0], gas:'3000000'});

    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaignAbi,
        campaignAddress
    );

});
  
describe('Campaigns', () => {  
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () =>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () =>{
        await campaign.methods.contribute().send({
            value:'200',
            from:accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () =>{
        try {
            await campaign.methods.contribute().send({
                value:'5',
                from:accounts[1]
             });
             assert(false);
        } catch (err){
            assert(err);
        }
    });

    it('allows a manger to make a payment request', async () =>{
        await campaign.methods.createRequest(
            'Buy Batteries',
            '1000',
            accounts[1]    
        ).send({
            gas:'3000000',
            from:accounts[0]
        });

        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy Batteries', request.description);
        

    });

    it('process requests', async () =>{
        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10','ether'),
            from:accounts[0]
        });

        await campaign.methods.createRequest(
            'A',
            web3.utils.toWei('5','ether'),
            accounts[1]    
        ).send({
            gas:'3000000',
            from:accounts[0]
        });

        await campaign.methods.approveRequest(0).send({
            gas:'3000000',
            from:accounts[0]
        });

        await campaign.methods.finalizeRequest(0).send({
            gas:'3000000',
            from:accounts[0]
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
        
    });

});

