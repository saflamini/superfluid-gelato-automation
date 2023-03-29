import chai, { expect } from "chai";
import { ethers, network } from "hardhat";
import { chaiEthers } from "chai-ethers";
import TestTokenABI from "@superfluid-finance/ethereum-contracts/build/contracts/TestToken.json";
import {
    Framework,
    SuperToken,
    WrapperSuperToken,
} from "@superfluid-finance/sdk-core";
import { OpsMock } from "../typechain-types/src/mocks/OpsMock";
import { SimpleACLCloseResolver } from "../typechain-types/src/SimpleACLCloseResolver";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Provider } from "@ethersproject/providers";
import { TestToken } from "@superfluid-finance/sdk-core/dist/module/typechain";
import { deployTestFramework } from "@superfluid-finance/ethereum-contracts/dev-scripts/deploy-test-framework";

// use chaiEthers for things like expectRevertedWith/expectRevert
// and .to.emit(ContractObject, "EventName").withArgs(evArg1, evArg2, ...)
chai.use(chaiEthers);

// NOTE: This assumes you are testing with the generic hardhat mnemonic as the deployer:
// test test test test test test test test test test test junk
export const RESOLVER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

describe("VestingAutomation", () => {
    let SuperfluidFramework: Framework;
    let SuperToken: SuperToken;

    let OpsMock: OpsMock;
    let Token: TestToken;
    let SimpleACLCloseResolver: SimpleACLCloseResolver;

    let Sender: SignerWithAddress;
    let Receiver: SignerWithAddress;
    let Misc: SignerWithAddress;

    let EndTime: string;
    let EVMSnapshotId: string;

    const _getCurrentBlockTime = async () => {
        const currentBlockNumber = await ethers.provider.getBlockNumber();
        const currentBlock = await ethers.provider.getBlock(currentBlockNumber);
        return currentBlock.timestamp;
    };

    const _takeSnapshotAndSetId = async () => {
        const snapshotId = await network.provider.send("evm_snapshot");
        EVMSnapshotId = snapshotId;
    };
    const _revertToSnapshot = async (snapshotId: string) => {
        await network.provider.send("evm_revert", [snapshotId]);
    };
    const _useLastEVMSnapshot = async () => {
        await _revertToSnapshot(EVMSnapshotId);
        await _takeSnapshotAndSetId();
    };

    //TODO

  
});
