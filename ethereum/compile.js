const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath,'utf8');

let jsonContractSource = JSON.stringify({
    language: 'Solidity',
    sources: {
      'Campaign': {
          content: source,
       },
    },
    settings: { 
        outputSelection: {
            '*': {
                '*': ['*'],   
             // here point out the output of the compiled result
            },
        },
    },
});


const output = JSON.parse(solc.compile(jsonContractSource));

fs.ensureDirSync(buildPath);

for (let contractName in output.contracts['Campaign']){
    //Do ABI
    fs.outputJsonSync(
        path.resolve(buildPath,contractName + '-abi.json'),
        output.contracts['Campaign'][contractName].abi
    );
    //Do bytecode
    fs.writeFileSync(
        path.resolve(buildPath,contractName + '-bytecode.bin'),
        output.contracts['Campaign'][contractName].evm.bytecode.object,
        {encoding:"utf8"}
    );
}





