import web3 from './web3';
import CampaignFactory from './build/CampaignFactory-abi.json';

const instance = new web3.eth.Contract(
    CampaignFactory,
    'DEPLOYED_ADDRESS_HERE'
);

export default instance;