require("@nomiclabs/hardhat-waffle");

const ALCHEMY_API_KEY = "HDEJz1gdWe353VJfn8tiDXnkT9jZV7QY";
const MUMBAI_PRIVATE_KEY = "447228a6122cd20ece3dcd7d815cd90edd3531d6f9d3650e6a27d16328f94428";

module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${MUMBAI_PRIVATE_KEY}`]
    }
  }
};
