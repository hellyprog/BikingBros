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

describe("Deployment", () => {
  it("Should set correct supply", async () => {
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

  it('Should assign the total supply of tokens to the owner', async () => {
    expect(await deployedToken.balanceOf(owner.address)).to.equal(1000000);
  });
});

describe('Transactions', () => {
  it('Should transfer tokens between accounts', async () => {
    expect(await deployedToken.balanceOf(owner.address)).to.equal(1000000);
    await deployedToken.transfer(addr1.address, 50);
    const addr1Balance = await deployedToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(50);
    expect(await deployedToken.balanceOf(owner.address)).to.equal(1000000 - 50);
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    const initialOwnerBalance = await deployedToken.balanceOf(owner.address);
    await expect(
      deployedToken.connect(addr1).transfer(owner.address, 1)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    expect(await deployedToken.balanceOf(owner.address)).to.equal(
      initialOwnerBalance
    );
  });
});