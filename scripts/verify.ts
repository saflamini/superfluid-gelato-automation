import { HardhatRuntimeEnvironment } from "hardhat/types";
import hre, { ethers } from "hardhat";
import { CloseStreamAddress, Host, Ops, SuperToken } from "./Helpers";

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
