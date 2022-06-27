const { network } = require("hardhat")

module.exports.moveTime = async function (amount) {
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved forward in time ${amount} seconds`);
}

module.exports.moveBlocks = async function (amount) {
    for (let index = 0; index < amount; index++) {
      await network.provider.request({
        method: "evm_mine",
        params: [],
      });
    }

    console.log(`Moved ${amount} blocks`);
}