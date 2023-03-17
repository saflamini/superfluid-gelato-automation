// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "hardhat/console.sol";

import {OpsReady} from './gelato/OpsReady.sol';
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "./gelato/Types.sol";
import {IVestingScheduler} from "@superfluid-finance/ethereum-contracts/automation-contracts/interfaces/IVestingScheduler.sol";

contract VestingAutomation is OpsReady {
    ISuperToken vestingToken;
    IVestingScheduler public vestingScheduler;

    bytes32 public taskId;

    address owner;

//TODO - need to add address of vesting contract as constructor param 
    constructor(ISuperToken _vestingSuperToken, address _ops, IVestingScheduler _vestingScheduler)) 
        OpsReady(_ops, address(this)){
        owner = msg.sender;    

        vestingScheduler = _vestingScheduler;
        vestingToken = _vestingSuperToken;
    }

    //call this function to set up a vesting task
    function createVestingTask(address sender, uint256 receiver) external {

        (uint32 _cliffAndFlowDate, uint32 _endDate) = vestingScheduler.getVestingSchedule(vestingToken, sender, receiver);

        _createVestingStartTask(vestingToken, sender, receiver, _cliffAndFlowDate);
        _createEndVestingTask(vestingToken, sender, receiver, _endDate);
    }

    //this function will create the start vesting task - i.e. executeCliffAndFlow
    function _createVestingStartTask(address sender, address receiver, uint256 startDate) internal {
    
        bytes memory timeArgs = abi.encode(startDate);

        bytes memory execData = abi.encodeWithSelector(this.executeStartVesting.selector, token, sender, receiver);

        Module[] memory modules = new Module[](2);
        modules[0] = Module.TIME;
        modules[1] = Module.SINGLE_EXEC;

        bytes[] memory args = new bytes[](1);
        args[0] = timeArgs;

        ModuleData memory moduleData = ModuleData(modules, args);

        //note that ETH here is a placeholder for the native asset on any network you're using
        taskId = ops.createTask(address(this), execData, moduleData, ETH);
    }

    //this function will create the delete vesting task - i.e. executeEndVesting
    function _createEndVestingTask(address sender, address receiver, uint256 endDate) internal {
    
        bytes memory timeArgs = abi.encode(endDate);

        bytes memory execData = abi.encodeWithSelector(this.executeStopVesting.selector, vestingToken, sender, receiver);

        Module[] memory modules = new Module[](2);

        modules[0] = Module.TIME;
        modules[1] = Module.SINGLE_EXEC;

        bytes[] memory args = new bytes[](1);
        args[0] = timeArgs;

        //note that ETH here is a placeholder for the native asset on any network you're using
        ModuleData memory moduleData = ModuleData(modules, args);

        taskId = ops.createTask(address(this), execData, moduleData, ETH);
    }

    //this function will be called by the OpsReady contract to execute the start vesting task on the vesting cliff date
    function executeStartVesting(address sender, address receiver) external onlyOps {

        //handle fee logic
        (uint256 fee, address feeToken) = ops.getFeeDetails();
        _transfer(fee, feeToken);

        vestingScheduler.executeCliffAndFlow(vestingToken, sender, receiver);
    }

    //this function will be called by the OpsReady contract to execute the end vesting task on the vesting end date
    function executeStopVesting(address sender, address receiver) external onlyOps {

        //handle fee logic
        (uint256 fee, address feeToken) = ops.getFeeDetails();
        _transfer(fee, feeToken);

        vestingScheduler.executeEndVesting(vestingToken, sender, receiver);

        taskId = bytes32(0);
    }

    modifier onlyOps() {
        require(msg.sender == address(ops), "OpsReady: onlyOps");
        _;
    }
  
    receive() external payable {
        console.log("----- receive:", msg.value);
    }

    function withdraw() external returns (bool) {
        require(owner == msg.sender,'NOT_ALLOWED');

        (bool result, ) = payable(msg.sender).call{value: address(this).balance}("");
        return result;
    }

}