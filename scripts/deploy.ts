import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


import hre, { ethers } from "hardhat";
import { CloseStream__factory } from "../typechain-types/factories/src/CloseStream__factory";
import { Ops, Host, SuperToken, getDeployer } from "./Helpers";

import { verifyContract } from "./verify";

const gelatoAutomateMumbai = "0xB3f5503f93d5Ef84b06993a1975B9D21B962892F";

async function main() {
    try {

      let deployer:SignerWithAddress = await getDeployer(hre);
      let nonce = await deployer.getTransactionCount();

       const closeStream = await new CloseStream__factory(deployer).deploy(Host,SuperToken,Ops,{ nonce: nonce  ,gasLimit: 10000000});

       let initialEth = hre.ethers.utils.parseEther('0.1');

       await deployer.sendTransaction({ to: closeStream.address, value: initialEth, gasLimit: 10000000, nonce: nonce + 1});

        console.log('Close Stream deployed succsessfully at: ',closeStream.address)

    } catch (err) {
        console.error(err);
    }
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
