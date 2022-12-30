
import { Framework } from "@superfluid-finance/sdk-core";
import { CloseStreamAddress, getDeployer, receiver, SuperToken } from "./Helpers";
import hre, { ethers } from "hardhat";

const startStream = async () => {
    try {
     
        let deployer = await getDeployer(hre);

      

        console.log("Create Superfluid Framework with SDK-Core");
        const sf = await Framework.create({
            chainId: 1337,
            customSubgraphQueriesEndpoint: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
            resolverAddress:'0x3710AB3fDE2B61736B8BB0CE845D6c61F667a78E',
            provider: ethers.provider,
        });

        let flowRate = (ethers.utils.parseEther("100").div(30*24*3600)).toString(); // 100 ethers mont == 38580246913580 per/sec

        // create Flow
        const op = sf.cfaV1.createFlow({
            superToken: SuperToken,
            flowRate:flowRate,
            receiver: receiver
                   
        });

        console.log(
            "Execute Authorize Flow Operator with Full Control Operation...",
        );
        const txn = await op.exec(deployer);

        console.log("Transaction broadcasted, waiting...");
        const receipt = await txn.wait();

        console.log("Transaction has been mined.");

        console.log('Getting Flow ....')    

        let flow = await sf.cfaV1.getFlow({sender:deployer.address, receiver, superToken:SuperToken, providerOrSigner:deployer})
        console.log(flow);


    } catch (err) {
        console.error(err);
    }
};

(async () => {
    await startStream();
})();
