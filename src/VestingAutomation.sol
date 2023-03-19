// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "hardhat/console.sol";

import {AutomateTaskCreator} from './gelato/AutomateTaskCreator.sol';
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "./gelato/Types.sol";
import { IVestingScheduler } from "./interface/IVestingScheduler.sol";
import { VestingScheduler } from "./VestingScheduler.sol";

contract VestingAutomation is AutomateTaskCreator {
    /// @dev The SuperToken to be used for vesting
    ISuperToken vestingToken;
    /// @dev The VestingScheduler contract
    VestingScheduler public vestingScheduler;

    //structs for start and end vesting tasks
    struct VestingStartTask {
        ISuperToken token;
        address sender;
        address receiver;
        uint256 startDate;
        uint256 timeScheduled;
    }

    struct VestingEndTask {
        ISuperToken token;
        address sender;
        address receiver;
        uint256 endDate;
        uint256 timeScheduled;
    }

    //mapping of taskID to vesting tasks
    mapping(bytes32 => VestingStartTask) public vestingStartTasks;
    mapping(bytes32 => VestingEndTask) public vestingEndTasks;

    constructor(ISuperToken _vestingSuperToken, address _automate, address _fundsOwner, VestingScheduler _vestingScheduler)
        AutomateTaskCreator(_automate, _fundsOwner){

        vestingScheduler = _vestingScheduler;
        vestingToken = _vestingSuperToken;
    }

    //call this function to set up a vesting task
    function createVestingTask(address sender, address receiver) external returns (bytes32 startTaskId, bytes32 endTaskId){

        require(msg.sender == fundsOwner, "Only funds owner can create tasks");
        //use sender, receiver, and vestingToken to get the vesting schedule programmatically from VestingScheduler contract
        IVestingScheduler.VestingSchedule memory vSchedule = vestingScheduler.getVestingSchedule(address(vestingToken), sender, receiver);

        uint32 _cliffAndFlowDate = vSchedule.cliffAndFlowDate;
        uint32 _endDate = vSchedule.endDate;

        //create the start + end vesting tasks in the same transaction
        startTaskId = _createVestingStartTask(sender, receiver, _cliffAndFlowDate);
        endTaskId = _createEndVestingTask(sender, receiver, _endDate);

        return (startTaskId, endTaskId);
    }

    //this function will create the start vesting task - i.e. executeCliffAndFlow
    function _createVestingStartTask(address sender, address receiver, uint256 startDate) internal returns (bytes32 startTaskId){
    
        bytes memory startTime = abi.encode(startDate);

        bytes memory execData = abi.encodeWithSelector(this.executeStartVesting.selector, vestingToken, sender, receiver);

        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });
        moduleData.modules[0] = Module.TIME;
        moduleData.modules[1] = Module.SINGLE_EXEC;

        moduleData.args[0] = startTime;
        moduleData.args[1] = _singleExecModuleArg();

        //note that ETH here is a placeholder for the native asset on any network you're using
        startTaskId = _createTask(address(this), execData, moduleData, ETH);

        //store the start task in the mapping
        vestingStartTasks[startTaskId] = VestingStartTask({
            token: vestingToken,
            sender: sender,
            receiver: receiver,
            startDate: startDate,
            timeScheduled: block.timestamp
        });

        return startTaskId;
    }

    //this function will create the delete vesting task - i.e. executeEndVesting
    function _createEndVestingTask(address sender, address receiver, uint256 endDate) internal returns(bytes32 endTaskId) {
    
        bytes memory endTime = abi.encode(endDate);

        bytes memory execData = abi.encodeWithSelector(this.executeStartVesting.selector, vestingToken, sender, receiver);

        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });
        moduleData.modules[0] = Module.TIME;
        moduleData.modules[1] = Module.SINGLE_EXEC;

        moduleData.args[0] = endTime;
        moduleData.args[1] = _singleExecModuleArg();

        //note that ETH here is a placeholder for the native asset on any network you're using
        endTaskId = _createTask(address(this), execData, moduleData, ETH);

        //store the end task in the mapping
        vestingEndTasks[endTaskId] = VestingEndTask({
            token: vestingToken,
            sender: sender,
            receiver: receiver,
            endDate: endDate,
            timeScheduled: block.timestamp
        });
        
        return endTaskId;
    }

    //this function will be called by the OpsReady contract to execute the start vesting task on the vesting cliff date
    function executeStartVesting(address sender, address receiver) external {

        //handle fee logic
        (uint256 fee, address feeToken) = _getFeeDetails();
        _transfer(fee, feeToken);

        vestingScheduler.executeCliffAndFlow(vestingToken, sender, receiver);
    }

    //this function will be called by the OpsReady contract to execute the end vesting task on the vesting end date
    function executeStopVesting(address sender, address receiver) external {

        //handle fee logic
        (uint256 fee, address feeToken) = _getFeeDetails();
        _transfer(fee, feeToken);

        vestingScheduler.executeEndVesting(vestingToken, sender, receiver);
    }
  
    receive() external payable {
        console.log("----- receive:", msg.value);
    }

    function changeOwner(address newFundsOwner) external  {
        // only the funds owner can execute this fn
        require(fundsOwner == msg.sender,'NOT_ALLOWED');
        fundsOwner = newFundsOwner;
    }


    function withdraw() external returns (bool) {
        // only the funds owner can withdraw funds - note that fundsOwner is defined in the AutomateTaskCreator contract
        require(fundsOwner == msg.sender,'NOT_ALLOWED');

        (bool result, ) = payable(msg.sender).call{value: address(this).balance}("");
        return result;
    }

}