// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "hardhat/console.sol";

import {OpsReady} from './gelato/OpsReady.sol';
import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import {ISuperfluid,ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import "./gelato/Types.sol";

contract CloseStream is OpsReady {
    using CFAv1Library for CFAv1Library.InitData;
    CFAv1Library.InitData public _cfaLib;
    ISuperfluid public host; // host
    IConstantFlowAgreementV1 public cfa; // the stored constant flow agreement class address
    ISuperToken superToken;

    bytes32 taskId;

    constructor(ISuperfluid _host, ISuperToken _superToken ,address _ops) 
    OpsReady(_ops, address(this)){
    
    host = _host;

    superToken = _superToken;

    cfa = IConstantFlowAgreementV1(address(host.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1"))));
      
    _cfaLib = CFAv1Library.InitData(host, cfa);
    }


    function createCloseStreamTask(address receiver, uint256 duration) external {
    bytes memory timeArgs = abi.encode(uint128(block.timestamp + duration), duration);

    console.log(block.timestamp);
    console.log(block.timestamp + duration);
    console.log(duration);

    bytes memory execData = abi.encodeWithSelector(this.closeStream.selector, receiver);

    Module[] memory modules = new Module[](2);

    modules[0] = Module.TIME;
    modules[1] = Module.SINGLE_EXEC;

    bytes[] memory args = new bytes[](1);

    args[0] = timeArgs;

    ModuleData memory moduleData = ModuleData(modules, args);

     taskId = ops.createTask(address(this), execData, moduleData, ETH);

     console.logBytes32(taskId);

    }


    function closeStream(address sender, address receiver) external onlyOps {

    (uint256 fee, address feeToken) = ops.getFeeDetails();
    _transfer(fee, feeToken);

    _cfaLib.deleteFlow(sender, receiver, superToken);

    }

    modifier onlyOps() {
        require(msg.sender == address(ops), "OpsReady: onlyOps");
        _;
    }
  
}