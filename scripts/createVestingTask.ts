
import { Framework } from "@superfluid-finance/sdk-core";
import { getDeployer, receiver  } from "./Helpers";
import hre, { ethers } from "hardhat";
import { VestingAutomation__factory } from "../typechain-types/factories/src/VestingAutomation__factory";
import { VestingAutomation } from "../typechain-types/src/VestingAutomation";

const superfluidVestingAutomatorMumbai = "0x194C9F3F955F48FF38e4e4F7bFc9A2869374Fd0a" 

const createVestingTask = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.MUMBAI_URL
    )
    try {
     
        let deployer = await getDeployer(hre);

        let vestingAutomator = VestingAutomation__factory.connect(superfluidVestingAutomatorMumbai, deployer) as VestingAutomation;

        let txn = await vestingAutomator.createVestingTask(deployer.address, "0x796Cf26eE956f790920D178AAc373c90DA7b8f79");

        console.log("Transaction broadcasted, waiting...");
        await txn.wait().then(console.log)

        // console.log("Creating the task")
     
    

        // console.log('Getting Flow ....')    

        
        // console.log("Create Superfluid Framework with SDK-Core");
        // const sf = await Framework.create({
        //     chainId: 1337,
        //     customSubgraphQueriesEndpoint: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
        //     resolverAddress:'0x3710AB3fDE2B61736B8BB0CE845D6c61F667a78E',
        //     provider: ethers.provider,
        // });


        // let flow = await sf.cfaV1.getFlow({sender:deployer.address, receiver, superToken:SuperToken, providerOrSigner:deployer})
        // console.log(flow);


    } catch (err) {
        console.error(err);
    }
};

(async () => {
    await createVestingTask();
})();
