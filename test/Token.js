const { expect } = require("chai");

const initialSupply = 1000000;

let BikeToken;
let deployedToken;
let owner, addr1, addr2, addrs;

beforeEach(async () => {
  BikeToken = await ethers.getContractFactory("BikeToken");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  deployedToken = await BikeToken.deploy(initialSupply);
});

describe("BikeToken contract initialization", () => {
  it("Deployment should set initial supply as constructor parameter", async () => {
    expect(await deployedToken.totalSupply()).to.equal(initialSupply);
  });

  it("Should return 'BIKE' as symbol", async () => {
    expect(await deployedToken.symbol()).to.equal('BIKE');
  });

  it("Should return 'BikingBros' as name", async () => {
    expect(await deployedToken.name()).to.equal('BikingBros');
  });

  it("Should have 18 decimals", async () => {
    expect(await deployedToken.decimals()).to.equal(18);
  });
});

describe('BikingBros accounts', () => {
  it('Owner balance should be 1000000', async () => {
    expect(await deployedToken.balanceOf(owner.address)).to.equal(1000000);
  });
});