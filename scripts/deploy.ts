import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { BytesLike, Wallet } from "ethers";
import hre, { ethers } from "hardhat";
import { CloseStream__factory } from "../typechain-types/factories/src/CloseStream__factory";
import { Ops, Host, SuperToken, getDeployer } from "./Helpers";

import { verifyContract } from "./verify";



async function main() {
    try {

      let deployer:SignerWithAddress = await getDeployer(hre);

       const closeStream = await new CloseStream__factory(deployer).deploy(Host,SuperToken,Ops,{ gasLimit: 10000000});

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
