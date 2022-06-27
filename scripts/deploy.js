async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());

    const BikeToken = await ethers.getContractFactory('BikeToken');
    let initialSupply = '1000000';
    const token = await BikeToken.deploy(initialSupply.padEnd(initialSupply.length + 18, '0'));

    console.log('BikeToken address:', token.address);
    console.log('BikeToken supply:', await token.totalSupply());

    const BikeTreasury = await ethers.getContractFactory('BikeTreasury');
    const treasury = await BikeTreasury.deploy(token.address);

    const BikeTimeLock = await ethers.getContractFactory('BikeTimeLock');
    const timeLock = await BikeTimeLock.deploy(3600, [], []);

    const BikeGovernor = await ethers.getContractFactory('BikeGovernor');
    const governor = await BikeGovernor.deploy(token.address, timeLock.address, 4, 45818, 1);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });