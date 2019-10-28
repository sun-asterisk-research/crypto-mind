const Factory = artifacts.require('Factory');
const truffleAssert = require('truffle-assertions');

contract('Factory', ([ceo, notCeo]) => {
  describe('set Ceo', () => {
    let factory;
    before(async () => {
      factory = await Factory.new(ceo, { from: ceo });
    });

    it('should return ceoAddress. ', async () => {
      const ceoAddress = await factory.ceoAddress();
      assert.equal(ceoAddress, ceo);
    });

    it('should fail because new ceo must be different from "0x0". ', async () => {
      await truffleAssert.reverts(
        factory.setCeo('0x0000000000000000000000000000000000000000', {
          from: ceo
        })
      );
    });

    it('should return change Ceo address. ', async () => {
      await factory.setCeo(notCeo, { from: ceo });
      let ceoAddress = await factory.ceoAddress();
      assert.equal(ceoAddress, notCeo);
    });
  });

  describe('Create new game', () => {
    let factory;
    before(async () => {
      factory = await Factory.new(ceo, { from: ceo });
    });

    it('should fail because not Ceo. ', async () => {
      await truffleAssert.reverts(
        factory.createGame({
          from: notCeo
        })
      );
    });

    it('should return games.length = 1 when ceo create a new game. ', async () => {
      await factory.createGame({ from: ceo });
      let games = await factory.getAllGames();
      assert.equal(games.length, 1, 'should return array of AllGame');
    });
  });

  describe('Testing fallback function', () => {
    it('should reject sending ether directly to the contract by using fallback function. ', async () => {
      factory = await Factory.new(ceo, { from: ceo });
      await truffleAssert.reverts(factory.sendTransaction({ value: 1 }));
    });
  });
});
