async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const BikeToken = await ethers.getContractFactory("BikeToken");
    const token = await BikeToken.deploy(1000000);

    console.log("BikeToken address:", token.address);
    console.log("BikeToken supply:", await token.totalSupply());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });