import web3 from './web3';
import Campaign from './build/Campaign-abi.json';

export default (address) => {
    return new web3.eth.Contract(
        Campaign,
        address
    );

};