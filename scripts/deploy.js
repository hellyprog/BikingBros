async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    const BikeToken = await ethers.getContractFactory('BikeToken');
    let initialSupply = '1000000';
    const token = await BikeToken.deploy(initialSupply.padEnd(initialSupply.length + 18, '0'));
    await token.deployed();

    console.log('BikeToken address:', token.address);

    const BikeTreasury = await ethers.getContractFactory('BikeTreasury');
    const treasury = await BikeTreasury.deploy(token.address);
    await treasury.deployed();
    console.log('BikeTreasury address:', treasury.address);

    await token.setTreasuryAddress(treasury.address);

    const BikeTimeLock = await ethers.getContractFactory('BikeTimeLock');
    const timeLock = await BikeTimeLock.deploy(3600, [], []);
    await timeLock.deployed();
    console.log('BikeTimeLock address:', timeLock.address);

    const BikeGovernor = await ethers.getContractFactory('BikeGovernor');
    const governor = await BikeGovernor.deploy(token.address, timeLock.address, 4, 45818, 1);
    await governor.deployed();
    console.log('BikeGovernor address:', governor.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });