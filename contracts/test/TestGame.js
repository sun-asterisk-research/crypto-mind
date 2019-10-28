const Game = artifacts.require('Game');
const truffleAssert = require('truffle-assertions');
const { mined } = require('./helpers/timeBlock');

contract('Game', ([ceo, user1, user2]) => {
  let game;
  before(async () => {
    game = await Game.new(ceo, { from: ceo });
  });

  describe('Contract information', () => {
    it('currentQuestion', async () => {
      let currentQues = await game.currentQuestion();
      assert.equal(currentQues, 0);
    });
  });

  describe('setBounty', () => {
    it('set bounty for game', async () => {
      await game.setBounty({ from: ceo, value: 5 * 10 ** 18 });
      bounty = await game.bounty();
      assert.equal(bounty, 5 * 10 ** 18);
    });

    it('should fail because bounty = 0. ', async () => {
      await truffleAssert.reverts(game.setBounty({ from: ceo, value: 0 }));
    });
  });

  describe('Transfer transactions via contract. ', async () => {
    it('should fail because msg.value = 0', async () => {
      await truffleAssert.reverts(
        game.transferAlias(user2, {
          from: user1,
          value: 0
        })
      );
    });

    it('should fail because input address must be different from "0x0".', async () => {
      await truffleAssert.reverts(
        game.transferAlias('0x0000000000000000000000000000000000000000', {
          from: user1,
          value: 5
        })
      );
    });

    it('check transfer transaction', async () => {
      balanceUser1 = web3.utils.fromWei(await web3.eth.getBalance(user1), 'ether');
      balanceUser2 = web3.utils.fromWei(await web3.eth.getBalance(user2), 'ether');

      await game.transferAlias(user2, {
        from: user1,
        value: web3.utils.toWei('3', 'ether')
      });
      // after sent balance are close
      assert.approximately(
        parseInt(web3.utils.fromWei(await web3.eth.getBalance(user1), 'ether')),
        parseInt(balanceUser1) - 3,
        0.05,
        'numbers are close of user1'
      );
      assert.approximately(
        parseInt(web3.utils.fromWei(await web3.eth.getBalance(user2), 'ether')),
        parseInt(balanceUser2) + 3,
        0.05,
        'numbers are close of user2'
      );
    });
  });

  describe('Set question', () => {
    let game;
    before(async () => {
      game = await Game.new(ceo, { from: ceo });
    });

    it('should fail because is not ceo', async () => {
      await truffleAssert.reverts(
        game.setQuestion(web3.utils.fromAscii('A'), {
          from: user1
        })
      );
    });

    describe('Ceo create new question', async () => {
      let blocknumber;
      before(async () => {
        // store correct answer
        await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
        blocknumber = await web3.eth.getBlockNumber();

        // user choice B
        await game.answer(web3.utils.fromAscii('B'), { from: user1, value: 3 * 10 ** 18 });
        assert.notEqual(
          web3.utils.fromWei(await game.questionBounty()),
          0,
          'questionBounty is not 0'
        );
      });

      it('set Question pass all require', async () => {
        currentQues = await game.currentQuestion();

        assert.equal(await game.asked(currentQues), true, 'expected true');
        assert.equal(
          web3.utils.hexToNumber(await game.deadlineQuestion()),
          blocknumber + 5,
          'expected 5 block'
        );
      });

      it('should fail because can not set question while another question exists', async () => {
        await truffleAssert.reverts(
          game.setQuestion(web3.utils.fromAscii('A'), {
            from: ceo
          })
        );
      });

      it('should fail because can not set question if currentQuestion over 10', async () => {
        await mined(5);
        await game.shareQuestionBounty({
          from: ceo
        });
        await truffleAssert.reverts(
          game.setQuestion(web3.utils.fromAscii('A'), {
            from: ceo
          })
        );
      });
    });
  });

  describe('Answer the question', async () => {
    let game;
    before(async () => {
      game = await Game.new(ceo, { from: ceo });
    });

    it('should fail because can not answer before question created', async () => {
      await truffleAssert.reverts(
        game.answer(web3.utils.fromAscii('A'), {
          from: user1,
          value: 3 * 10 ** 18
        })
      );
    });

    it('should fail because answer after Deadline', async () => {
      await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
      await mined(8);
      await truffleAssert.reverts(
        game.answer(web3.utils.fromAscii('A'), {
          from: user1,
          value: 3 * 10 ** 18
        })
      );
    });

    describe('After question created', async () => {
      before(async () => {
        // store correct answer
        await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
      });

      it('answer pass all require', async () => {
        game.answer(web3.utils.fromAscii('A'), {
          from: user2,
          value: 3 * 10 ** 18
        });

        let questionBounty = web3.utils.fromWei(await game.questionBounty());
        // let answer = web3.utils.hexToBytes(await game.questionAnswer(currentQuestion, user2));

        assert.equal(questionBounty, 3, 'question bounty should be 3');
      });

      it('should fail because admin can not join the game', async () => {
        await truffleAssert.reverts(
          game.answer(web3.utils.asciiToHex('A'), {
            from: ceo,
            value: 3 * 10 ** 18
          })
        );
      });

      it('should fail because fee must > 2', async () => {
        await truffleAssert.reverts(
          game.answer(web3.utils.fromAscii('A'), {
            from: user1,
            value: 2 * 10 ** 18
          })
        );
      });

      it('should fail because player answered the question more than once', async () => {
        game.answer(web3.utils.fromAscii('A'), {
          from: user1,
          value: 3 * 10 ** 18
        });
        await truffleAssert.reverts(
          game.answer(web3.utils.fromAscii('A'), {
            from: user1,
            value: 3 * 10 ** 18
          })
        );
      });
    });
  });

  describe('share Question Bounty', () => {
    let game;
    before(async () => {
      game = await Game.new(ceo, { from: ceo });
    });

    it('should fail because not ceo', async () => {
      await truffleAssert.reverts(
        game.shareQuestionBounty({
          from: user1
        })
      );
    });

    it('should fail because have no question to share bounty', async () => {
      await truffleAssert.reverts(
        game.shareQuestionBounty({
          from: ceo
        })
      );
    });

    describe('after create question', () => {
      before(async () => {
        await game.setQuestion(web3.utils.fromAscii('A'), {
          from: ceo
        });
      });

      it('should fail because sharing before deadline', async () => {
        await game.answer(web3.utils.fromAscii('A'), {
          from: user1,
          value: 3 * 10 ** 18
        });

        await truffleAssert.reverts(
          game.shareQuestionBounty({
            from: ceo
          })
        );
      });
    });
  });

  describe('Question', async () => {
    before(async () => {
      await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
      await game.answer(web3.utils.fromAscii('A'), { from: user1, value: 3 * 10 ** 18 });
      await game.answer(web3.utils.fromAscii('B'), { from: user2, value: 3 * 10 ** 18 });
    });

    it('question was set', async () => {
      let currentQues = await game.currentQuestion();
      let asked = await game.asked(currentQues);
      assert(asked, true);
    });

    it('question bounty', async () => {
      let questionBounty = await game.questionBounty();
      assert.equal(questionBounty.toString(), (6 * 10 ** 18).toString());
    });

    it('answer', async () => {
      await mined(5);
      await game.shareQuestionBounty({ from: ceo });
      user1Wincount = await game.winCount(user1);
      user2Wincount = await game.winCount(user2);

      assert.equal(user1Wincount, 1, 'user1 win');
      assert.equal(user2Wincount, 0, 'user2 lose');
    });
  });

  describe('when no one answers the question correctly.', async () => {
    it('question was set', async () => {
      let game = await Game.new(ceo, { from: ceo });
      await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
      await game.answer(web3.utils.fromAscii('B'), { from: user1, value: 3 * 10 ** 18 });
      await game.answer(web3.utils.fromAscii('B'), { from: user2, value: 3 * 10 ** 18 });
      await mined(5);
      await game.shareQuestionBounty({ from: ceo });
      let currentQues = await game.currentQuestion();

      assert.equal(currentQues, 10, 'if no one correct game over');
    });
  });

  describe('shareBounty', async () => {
    let game;
    before(async () => {
      game = await Game.new(ceo, { from: ceo });
    });

    it('should fail because it not ceo ', async () => {
      await truffleAssert.reverts(
        game.shareBounty({
          from: user1
        })
      );
    });

    it('should fail because dont have bounty', async () => {
      await truffleAssert.reverts(
        game.shareBounty({
          from: ceo
        })
      );
    });

    it('set bounty', async () => {
      await game.setBounty({
        from: ceo,
        value: 3 * 10 ** 18
      });

      let bounty = web3.utils.fromWei(await game.bounty());
      assert.equal(bounty, 3);
    });
  });

  describe('shareBounty success', async () => {
    let game;
    before(async () => {
      game = await Game.new(ceo, { from: ceo });
      await game.setBounty({
        from: ceo,
        value: 4 * 10 ** 18
      });
      for (var i = 0; i < 10; i++) {
        await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
        await game.answer(web3.utils.fromAscii('A'), { from: user1, value: 3 * 10 ** 18 });
        await game.answer(web3.utils.fromAscii('A'), { from: user2, value: 3 * 10 ** 18 });
        await mined(5);
        await game.shareQuestionBounty({
          from: ceo
        });
      }
    });

    it('share bounty for the winner', async () => {
      user1BalanceBefore = web3.utils.fromWei(await web3.eth.getBalance(user1));
      user2BalanceBefore = web3.utils.fromWei(await web3.eth.getBalance(user2));

      await game.shareBounty({
        from: ceo
      });

      bounty = await game.bounty();
      user1BalanceAfter = web3.utils.fromWei(await web3.eth.getBalance(user1));
      user2BalanceAfter = web3.utils.fromWei(await web3.eth.getBalance(user2));

      assert.equal(bounty, 0, 'bounty after share reset to 0');
      assert.approximately(
        parseFloat(user1BalanceAfter),
        parseFloat(user1BalanceBefore) + 2,
        0.0005,
        'balance of player 1 after game'
      );
      assert.approximately(
        parseFloat(user2BalanceAfter),
        parseFloat(user2BalanceBefore) + 2,
        0.0005,
        'balance of player 2 after game'
      );
    });
  });

  describe('shareBounty if have someone win', async () => {
    let game;
    before(async () => {
      game = await Game.new(ceo, { from: ceo });
      await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
      await game.answer(web3.utils.fromAscii('A'), { from: user1, value: 3 * 10 ** 18 });
      await mined(5);
      await game.shareQuestionBounty({
        from: ceo
      });
    });

    it('test wincount', async () => {
      let wincount = await game.winCount(user1);
      assert.equal(wincount, 1, 'wincount of user1 should be 1');
    });

    it('get All player', async () => {
      let playser = await game.getAllPlayers();
      assert.equal(playser[0], user1, 'user 1 is playing');
    });

    it('get all player correct in a Question', async () => {
      let playserInQuestion = await game.getCorrectAddressByQuestion(0);
      assert.equal(playserInQuestion.length, 1);
    });
  });

  describe('shareBounty if no one win', async () => {
    let game;
    before(async () => {
      game = await Game.new(ceo, { from: ceo });
      await game.setBounty({ from: ceo, value: 5 * 10 ** 18 });
      await game.setQuestion(web3.utils.fromAscii('A'), { from: ceo });
      await game.answer(web3.utils.fromAscii('B'), { from: user1, value: 3 * 10 ** 18 });
      await mined(5);
      await game.shareQuestionBounty({
        from: ceo
      });
    });

    it('share bounty for ceo because no one win', async () => {
      let ceoBalanceBefore = web3.utils.fromWei(await web3.eth.getBalance(ceo));
      await game.shareBounty();

      let bounty = await game.bounty();
      let ceoBalanceAfter = web3.utils.fromWei(await web3.eth.getBalance(ceo));
      assert.equal(bounty, 0, 'bounty after share reset to 0');
      assert.approximately(
        parseFloat(ceoBalanceAfter),
        parseFloat(ceoBalanceBefore) + 8,
        0.0005,
        'must be increase 5'
      );
    });
  });
});
