

import { Framework } from "@superfluid-finance/sdk-core";
import { CloseStreamAddress, Host,Ops, SuperToken } from "./Helpers";
import hre, { ethers } from "hardhat";

export async function verifyContract() {
    try {
        await hre.run("verify:verify", {
            address: CloseStreamAddress,
            constructorArguments: [Host,SuperToken,Ops],
        });
    } catch (err) {
        console.error(err);
    }
}

(async () => {
    await verifyContract();
})();
