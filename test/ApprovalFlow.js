const { expect } = require('chai');
const { moveBlocks, moveTime }=require('./test-helpers');

const { MIN_DELAY, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY, ADDRESS_ZERO }= {
    MIN_DELAY: 3600,
    QUORUM_PERCENTAGE: 90,
    VOTING_PERIOD: 5,
    VOTING_DELAY: 3,
    ADDRESS_ZERO :'0x0000000000000000000000000000000000000000'
}

describe('Test governance contracts, proposals, voting and execution', function () {
    it('Addr1 balance should be 490 after proposal execution', async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
      
        const governanceToken = await ethers.getContractFactory('BikeToken')
        const deployedToken = await governanceToken.deploy('100000000000000000000000000');
        await deployedToken.deployed();

        let transactionResponse = await deployedToken.delegate(owner.address)
        await transactionResponse.wait(1);
        
        const timeLock = await ethers.getContractFactory('BikeTimeLock');
        const deployedTimeLock = await timeLock.deploy(MIN_DELAY, [], []);
        await deployedTimeLock.deployed();
       
        const governor = await ethers.getContractFactory('BikeGovernor');
        const deployedGovernor = await governor.deploy(deployedToken.address, deployedTimeLock.address, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY);
        await deployedGovernor.deployed();

        const treasury = await ethers.getContractFactory('BikeTreasury');
        const deployedTreasury = await treasury.deploy(deployedToken.address);
        await deployedTreasury.deployed();

        /** This is done so as to transfer the ownership to timelock contract so that it can execute the operation */
        const transferTx = await deployedTreasury.transferOwnership(deployedTimeLock.address);
        await transferTx.wait(1);

        const setTreasuryAddressTx = await deployedToken.setTreasuryAddress(deployedTreasury.address);
        await setTreasuryAddressTx.wait(1);
        const transferTokenTx = await deployedToken.transfer(deployedTreasury.address, 10000);
        await transferTokenTx.wait(1);
        /**
        * Granting roles to the relevant parties
        */
        const proposerRole = await deployedTimeLock.PROPOSER_ROLE();
        const executorRole = await deployedTimeLock.EXECUTOR_ROLE();
        const adminRole = await deployedTimeLock.TIMELOCK_ADMIN_ROLE();

        const proposerTx = await deployedTimeLock.grantRole(proposerRole, deployedGovernor.address);
        await proposerTx.wait(1);
        const executorTx = await deployedTimeLock.grantRole(executorRole, ADDRESS_ZERO);
        await executorTx.wait(1);
        const revokeTx = await deployedTimeLock.revokeRole(adminRole, owner.address);
        await revokeTx.wait(1);
      
        const proposalDescription = 'Proposal #1. Grant #1';
        const encodedFunctionCall = treasury.interface.encodeFunctionData('transfer', [addr1.address, 500]);
        transactionResponse = await deployedToken.delegate(owner.address);
        await transactionResponse.wait(1);

        const proposeTx = await deployedGovernor.propose([deployedTreasury.address], [0], [encodedFunctionCall], proposalDescription);

        await moveBlocks(VOTING_DELAY + 1);
        
        const proposeReceipt = await proposeTx.wait(1);
        const proposalId = proposeReceipt.events[0].args.proposalId;
        console.log(`Proposed with proposal ID:\n  ${proposalId}`);

        let proposalState = await deployedGovernor.state(proposalId);
        const proposalSnapshot = await deployedGovernor.proposalSnapshot(proposalId);
        const proposalDeadline = await deployedGovernor.proposalDeadline(proposalId);

        // The state of the proposal. 1 is not passed. 0 is passed.
        console.log(`Current Proposal State: ${proposalState}`);
        // What block # the proposal was snapshot
        console.log(`Current Proposal Snapshot: ${proposalSnapshot}`);
        // The block number the proposal voting expires
        console.log(`Current Proposal Deadline: ${proposalDeadline}`);

        const voteWay = 1;
        const reason = 'I vote yes';
            
        console.log('delegates', await deployedToken.delegates(owner.address))
        
        const voteTx = await deployedGovernor.castVoteWithReason(proposalId, voteWay, reason);
        const voteTxReceipt = await voteTx.wait(1);
        console.log(voteTxReceipt.events[0].args.reason);
        proposalState = await deployedGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);
        
        /**
         * Moving blocks to simulate completion of voting period
         */
        await moveBlocks(VOTING_PERIOD + 1);

        const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposalDescription));

        console.log('Queueing...');
        const votes = await deployedGovernor.getVotes(owner.address, 12);
        console.log('votes', votes);
        console.log(`Checkpoints: ${await deployedToken.numCheckpoints(owner.address)}`);
     
        const quorum = await deployedGovernor.quorum(12);
        console.log('quorum', quorum);
        proposalState = await deployedGovernor.state(proposalId);
        console.log(`Current Proposal State: ${proposalState}`);
        const queueTx = await deployedGovernor.queue([deployedTreasury.address], [0], [encodedFunctionCall], descriptionHash);
        await queueTx.wait(1);

        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);

        console.log('Executing...');
    
        const executeTx = await deployedGovernor.execute([deployedTreasury.address], [0], [encodedFunctionCall], descriptionHash);
        await executeTx.wait(1);
        const value = await deployedToken.balanceOf(addr1.address);
        const feePercentage = await deployedToken.transactionFeePercentage();
        console.log(value);
        expect(value).to.be.equal(500 - 500 * feePercentage / 100);
    });
});