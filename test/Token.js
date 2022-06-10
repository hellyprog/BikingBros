const { expect } = require("chai");

describe("BikeToken contract", function () {
  it("Deployment should set initial supply as constructor parameter", async function () {
    const BikeToken = await ethers.getContractFactory("BikeToken");

    const initialSupply = 1000000;
    const token = await BikeToken.deploy(initialSupply);

    expect(await token.totalSupply()).to.equal(initialSupply);
  });
});