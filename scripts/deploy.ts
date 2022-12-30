import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { BytesLike, Wallet } from "ethers";
import hre, { ethers } from "hardhat";
import { CloseStream__factory } from "../typechain-types/factories/src/CloseStream__factory";
import { Ops, Host, SuperToken, getDeployer } from "./Helpers";

import { verifyContract } from "./verify";



async function main() {
    try {

      let deployer:SignerWithAddress = await getDeployer(hre);
      let nonce = await deployer.getTransactionCount();

       const closeStream = await new CloseStream__factory(deployer).deploy(Host,SuperToken,Ops,{ nonce: nonce  ,gasLimit: 10000000});

       let initialEth = hre.ethers.utils.parseEther('0.1');

       await deployer.sendTransaction({ to: closeStream.address, value: initialEth, gasLimit: 10000000, nonce: nonce + 1});

        console.log('Close Sream deployed succsessfully at: ',closeStream.address)

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
