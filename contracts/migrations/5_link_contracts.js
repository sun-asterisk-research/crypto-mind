var Factory = artifacts.require('Factory');

module.exports = async function(deployer) {
  deployer.deploy(Factory).then(async () => {
    var factory = await Factory.deployed();
    await factory.createGame();
  });
};
