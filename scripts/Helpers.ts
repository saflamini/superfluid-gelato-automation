

import { HardhatRuntimeEnvironment } from "hardhat/types";

export const CloseStreamAddress = "0xCC7FA88DB7df720EA72872ad7C19fd85026047d9";

export const Host = "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9"

export const SuperToken = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00"

export const Ops = "0xc1C6805B857Bef1f412519C4A842522431aFed39" //Grlato automate ops contract

export const GelatoExecutor = "0x683913B3A32ada4F8100458A3E1675425BdAa7DF";

export const receiver = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

export const getDeployer = async (hre:HardhatRuntimeEnvironment) =>{
    const ethers = hre.ethers; 

    let network = hre.hardhatArguments.network;
    console.log(network);
    let deployer; 
    if (network == undefined) {
      network = hre.network.name;
    }


    if (network == 'localhost') {

      const accounts = await ethers.getSigners();
      deployer = accounts[0];
      console.log(deployer.address);
  
    } else {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        console.log(deployer.address);
    //   const deployer_provider = hre.ethers.provider;
    //   const privKeyDEPLOYER = process.env['PRIVATE_KEY'] as BytesLike;
    //   const deployer_wallet = new Wallet(privKeyDEPLOYER);
    //   deployer = await deployer_wallet.connect(deployer_provider);
    }

    return deployer;
}