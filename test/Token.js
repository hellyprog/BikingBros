const { expect } = require("chai");

describe("BikeToken contract initialization", function () {
  it("Deployment should set initial supply as constructor parameter", async function () {
    const BikeToken = await ethers.getContractFactory("BikeToken");

    const initialSupply = 1000000;
    const token = await BikeToken.deploy(initialSupply);

    expect(await token.totalSupply()).to.equal(initialSupply);
  });

  it("Should return 'BIKE' as symbol", async function () {
    const BikeToken = await ethers.getContractFactory("BikeToken");

    const initialSupply = 1000000;
    const token = await BikeToken.deploy(initialSupply);

    expect(await token.symbol()).to.equal('BIKE');
  });

  it("Should return 'BikingBros' as name", async function () {
    const BikeToken = await ethers.getContractFactory("BikeToken");

    const initialSupply = 1000000;
    const token = await BikeToken.deploy(initialSupply);

    expect(await token.name()).to.equal('BikingBros');
  });

  it("Should have 18 decimals", async function () {
    const BikeToken = await ethers.getContractFactory("BikeToken");

    const initialSupply = 1000000;
    const token = await BikeToken.deploy(initialSupply);

    expect(await token.decimals()).to.equal(18);
  });
});