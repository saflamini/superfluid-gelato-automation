
import { Framework } from "@superfluid-finance/sdk-core";
import { CloseStreamAddress, GelatoExecutor, getDeployer, Ops, receiver, SuperToken } from "./Helpers";
import hre, { ethers } from "hardhat";
import { CloseStream__factory } from "../typechain-types/factories/src/CloseStream__factory";
import { CloseStream } from "../typechain-types/src/CloseStream";
import { IOps__factory } from "../typechain-types";

const createTaskStopStream = async () => {
    try {
     
        let deployer = await getDeployer(hre);



        let closeStream = CloseStream__factory.connect(CloseStreamAddress, deployer) as CloseStream;

        

        let txn = await closeStream.createCloseStreamTask(receiver,300);
        console.log("Transaction broadcasted, waiting...");
        await txn.wait()

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
    await createTaskStopStream ();
})();
