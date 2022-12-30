
import { Framework } from "@superfluid-finance/sdk-core";
import { CloseStreamAddress, getDeployer, SuperToken } from "./Helpers";
import hre, { ethers } from "hardhat";

const authorizeControl = async () => {
    try {
     
        let deployer = await getDeployer(hre);

        console.log("Create Superfluid Framework with SDK-Core");
        const sf = await Framework.create({
            chainId: 1337,
            customSubgraphQueriesEndpoint: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
            resolverAddress:'0x3710AB3fDE2B61736B8BB0CE845D6c61F667a78E',
            provider: ethers.provider,
        });

        // create updateFlowOperatorPermissions for delete operation
        const op = sf.cfaV1.updateFlowOperatorPermissions({
            superToken: SuperToken,

            // this is the Gelato Ops address for the network you deploy this on:
            // see https://docs.gelato.network/resources/contract-addresses for a list of addresses
            flowOperator: CloseStreamAddress,
            permissions: 4, // delete only
            flowRateAllowance: "0",
        });

        console.log(
            "Execute Authorize Flow Operator with Full Control Operation...",
        );
        const txn = await op.exec(deployer);

        console.log("Transaction broadcasted, waiting...");
        const receipt = await txn.wait();

        console.log("Transaction has been mined.");
        console.log("Transaction Receipt:", receipt);
    } catch (err) {
        console.error(err);
    }
};

(async () => {
    await authorizeControl();
})();
