
import { Framework } from "@superfluid-finance/sdk-core";
import { CloseStreamAddress, GelatoExecutor, getDeployer, Ops, receiver, SuperToken } from "./Helpers";
import hre, { ethers } from "hardhat";
import { CloseStream__factory } from "../typechain-types/factories/src/CloseStream__factory";
import { CloseStream } from "../typechain-types/src/CloseStream";
import { IOps__factory } from "../typechain-types";
import { utils } from "ethers";

const stopStream = async () => {
    try {
     
        let deployer = await getDeployer(hre);

        let closeStream = CloseStream__factory.connect(CloseStreamAddress, deployer) as CloseStream;

       

        await hre.network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [GelatoExecutor],
          });
      
        let  executor = await hre.ethers.provider.getSigner(GelatoExecutor);
        console.log("Transaction has been mined.");

        let ops = IOps__factory.connect(Ops,executor)

        
  let execData = closeStream.interface.encodeFunctionData("closeStream",[deployer.address, receiver] )
  const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const FEE = utils.parseEther("0.01")
  const timeArgs = utils.defaultAbiCoder.encode(
    ["uint256", "uint256"],
    [1666973389, 300]
  );

  let moduleData = {
    modules: [1,3],
    args: [timeArgs],
  };

  await hre.ethers.provider.send('evm_setNextBlockTimestamp', [1666973389]);

  await ops
  .connect(executor)
  .exec(
    closeStream.address,
    closeStream.address,
    execData,
    moduleData,
    FEE,
    ETH,
    false,
    true
  );    
 
 
        console.log(
            "Execute Authorize Flow Operator with Full Control Operation...",
        );
    


        console.log('Getting Flow ....')    

        
        console.log("Create Superfluid Framework with SDK-Core");
        const sf = await Framework.create({
            chainId: 1337,
            customSubgraphQueriesEndpoint: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
            resolverAddress:'0x3710AB3fDE2B61736B8BB0CE845D6c61F667a78E',
            provider: ethers.provider,
        });


        let flow = await sf.cfaV1.getFlow({sender:deployer.address, receiver, superToken:SuperToken, providerOrSigner:deployer})
        console.log(flow);


    } catch (err) {
        console.error(err);
    }
};

(async () => {
    await stopStream();
})();
