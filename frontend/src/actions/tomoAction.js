import getWeb3 from '../utils/getWeb3';
import Factory from 'contracts/Factory.json';
import firebase from 'config';
import HDWalletProvider from 'truffle-hdwallet-provider';
import { toast } from 'react-toastify';

const shuffle = (myArr) => {
  let l = myArr.length;
  let temp;
  let index;
  while (l > 0) {
    index = Math.floor(Math.random() * l);
    l--;
    temp = myArr[l];
    myArr[l] = myArr[index];
    myArr[index] = temp;
  }
  return myArr;
};

export const WEB3_CONNECT = 'WEB3_CONNECT';
export const web3Connect = () => async (dispatch) => {
  // const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545');
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    dispatch({
      type: WEB3_CONNECT,
      web3,
      account
    });
  } else {
    console.log('Account not found');
  }
  // call getAliasAcount() funciton to get or create alias accout
  dispatch(getBalance());
  dispatch(instantiateContracts());
  dispatch(getCeoAddress());
  dispatch(getAliasAcount());
};

export const web3TomoWalletConnect = () => async (dispatch) => {
  var Web3 = require('web3');
  const web3 = new Web3(window.web3.currentProvider);
  window.web3.eth.getAccounts((e, accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      dispatch({
        type: WEB3_CONNECT,
        web3,
        account
      });
      dispatch(instantiateContracts());
      dispatch(getCeoAddress());
      dispatch(getAliasAcount());
    } else {
      console.log('Account not found');
    }
  });
};

export const INSTANTIATE_CONTRACT = 'INSTANTIATE_CONTRACT';
export const instantiateContracts = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const networkId = process.env.REACT_APP_TOMO_ID;
  const FactoryArtifact = require('contracts/Factory');
  let factoryAddress = FactoryArtifact.networks[networkId].address;
  const factory = new web3.eth.Contract(Factory.abi, factoryAddress, {
    transactionConfirmationBlocks: 1
  });
  dispatch({
    type: INSTANTIATE_CONTRACT,
    factory
  });
  dispatch(instantiateAdminGame());
};

// adminGame: can be interacted with user, admin through metamask, tomowallet
export const INSTANTIATE_ADMIN_GAME = 'INSTANTIATE_ADMIN_GAME';
export const instantiateAdminGame = () => async (dispatch, getState) => {
  const GameArtifact = require('contracts/Game');
  const state = getState();
  let web3 = state.tomo.web3;
  let factory = state.tomo.factory;
  let from = state.tomo.account;
  let listGame = await factory.methods.getAllGames().call({ from });
  let currentGameAddress = listGame[listGame.length - 1];
  const adminGame = new web3.eth.Contract(GameArtifact.abi, currentGameAddress, {
    transactionConfirmationBlocks: 1
  });
  dispatch({
    type: INSTANTIATE_ADMIN_GAME,
    adminGame
  });
};

export const LOGIN_ALIAS_ACCOUNT = 'LOGIN_ALIAS_ACCOUNT';
export const loginAliasAccount = () => async (dispatch, getState) => {
  const state = getState();
  const privateKey = state.tomo.aliasAccount.privateKey;
  var Web3 = require('web3');

  var provider = new HDWalletProvider(
    privateKey.replace('0x', ''),
    'https://testnet.tomochain.com'
  );
  var aliasWeb3 = new Web3(provider);
  dispatch({
    type: LOGIN_ALIAS_ACCOUNT,
    aliasWeb3
  });
  dispatch(instantiateGame());
};

export const INSTANTIATE_GAME = 'INSTANTIATE_GAME';
export const instantiateGame = () => async (dispatch, getState) => {
  const GameArtifact = require('contracts/Game');
  const state = getState();
  let aliasWeb3 = state.tomo.aliasWeb3;
  let factory = state.tomo.factory;
  let from = state.tomo.aliasAccount.address;
  let listGame = await factory.methods.getAllGames().call({ from });
  let currentGameAddress = listGame[listGame.length - 1];
  const game = new aliasWeb3.eth.Contract(GameArtifact.abi, currentGameAddress, {
    transactionConfirmationBlocks: 1
  });
  let questionCount = await game.methods.currentQuestion().call({ from });
  dispatch({
    type: INSTANTIATE_GAME,
    game,
    questionCount
  });
  dispatch(checkIsPlaying());
};

export const GET_ALIAS = 'GET_ALIAS';
export const getAliasAcount = () => async (dispatch, getState) => {
  var aliasAccount = {
    address: '',
    privateKey: ''
  };
  if (localStorage.getItem('alias_account') === null) {
    var state = getState();
    let web3 = state.tomo.web3;
    // create Alias account
    var account = await web3.eth.accounts.create();

    aliasAccount.address = account.address;
    aliasAccount.privateKey = account.privateKey;
    localStorage.setItem('alias_account', JSON.stringify(aliasAccount));
  } else {
    aliasAccount = JSON.parse(localStorage.getItem('alias_account'));
  }
  dispatch({
    type: GET_ALIAS,
    aliasAccount: aliasAccount
  });

  dispatch(getAliasBalance());
  dispatch(loginAliasAccount());
};

export const CHECK_ISPLAYING = 'CHECK_ISPLAYING';
export const checkIsPlaying = () => async (dispatch, getState) => {
  const state = getState();
  let game = state.tomo.game;
  let from = state.tomo.aliasAccount.address;
  var getListPlayer = await game.methods.getAllPlayers().call({ from });
  var isPlaying = getListPlayer.includes(from);
  dispatch({
    type: CHECK_ISPLAYING,
    isPlaying
  });
};

// GET_CEO_ADDRESS
export const GET_CEO_ADDRESS = 'GET_CEO_ADDRESS';
export const getCeoAddress = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const from = state.tomo.account;
  const networkId = process.env.REACT_APP_TOMO_ID;

  const FactoryArtifact = require('contracts/Factory');
  let factoryAddress = FactoryArtifact.networks[networkId].address;
  const factory = new web3.eth.Contract(FactoryArtifact.abi, factoryAddress);

  const ceoAddress = await factory.methods.ceoAddress().call({ from });
  if (ceoAddress === from) {
    dispatch({
      type: GET_CEO_ADDRESS,
      ceoAddress,
      isAdmin: true,
      isLoadDone: true
    });
  } else {
    dispatch({
      type: GET_CEO_ADDRESS,
      ceoAddress,
      isAdmin: false,
      isLoadDone: true
    });
  }
};

export const GET_BALANCE = 'GET_BALANCE';
export const getBalance = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const from = state.tomo.account;
  await web3.eth.getBalance(from).then((balance) => {
    balance = web3.utils.fromWei(balance);

    if (balance.includes('.')) {
      let interger = balance.split('.', 2)[0];
      let fractional = balance.split('.', 2)[1].substr(0, 4);
      balance = interger.concat('.', fractional, ' ');
    }

    dispatch({
      type: GET_BALANCE,
      balance: balance
    });
  });
};

export const SET_BOUNTY = 'SET_BOUNTY';
export const setBounty = () => async (dispatch, getState) => {
  const state = getState();
  const from = state.tomo.account;
  const adminGame = state.tomo.adminGame;
  if (adminGame) {
    await adminGame.methods
      .setBounty()
      .send({ from: from, value: 10 ** 19 })
      .then(() => {
        dispatch({
          type: SET_BOUNTY,
          bounty: state.tomo.bounty
        });
      })
      .catch((e) => {
        console.log('Error setBounty', e);
      });
  }
};

export const SET_QUESTION = 'SET_QUESTION';
export const setQuestion = (correctAnswer) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const from = state.tomo.account;
  const adminGame = state.tomo.adminGame;

  adminGame.methods
    .setQuestion(state.tomo.web3.utils.fromAscii(correctAnswer.correct.toString()))
    .send({ from: from }, async (e, r) => {
      if (e) return;
      dispatch({
        type: SET_QUESTION,
        questioning: true
      });
      await firestore
        .collection('current_question')
        .doc('current')
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            await firestore
              .collection('current_question')
              .doc('current')
              .set({
                ...correctAnswer,
                question: correctAnswer.question,
                correct: correctAnswer.correct,
                answer: correctAnswer.answer,
                //add user choice vao database
                user_choice: {
                  0: 0,
                  1: 0,
                  2: 0,
                  3: 0
                },
                finished: false
              })
              .then(() => {
                console.log('done selected question');
                dispatch({
                  type: 'INSERT_QUES'
                });
              })
              .catch((err) => {
                dispatch({ type: 'INSERT_QUES_ERROR' }, err);
              });

            await firestore
              .collection('list_question')
              .doc(correctAnswer.id)
              .delete()
              .then(function() {
                console.log('doc', correctAnswer.id);
                console.log('remove selected document');
              })
              .catch(function(error) {
                console.error('Error removing document: ', error);
              });
          } else {
            console.log('No such document!');
          }
        });
    });
};

export const ANSWER = 'ANSWER';
//khi nguoi dung chon dap an update user_choice tren firebase
export const answer = (answerIndex) => async (dispatch, getState) => {
  var db = firebase.firestore();
  const state = getState();
  const game = state.tomo.game;
  const from = state.tomo.aliasAccount.address;
  let aliasWeb3 = state.tomo.aliasWeb3;

  var answer = aliasWeb3.utils.fromAscii(answerIndex.toString());
  await game.methods
    .answer(answer)
    .send({
      from: from,
      value: 3 * 10 ** 18,
      // TODO tinh gas limit
      gasLimit: aliasWeb3.utils.toHex(2000000),
      gasPrice: aliasWeb3.utils.toHex(aliasWeb3.utils.toWei('0.25', 'gwei'))
    })
    .then(() => {
      dispatch({
        type: ANSWER,
        questioning: false,
        questionBounty: state.tomo.questionBounty + 2
      });
      toast.success('Answer Success', { hideProgressBar: true, autoClose: 1500 });
    })
    .catch((e) => {
      console.log('Error answer', e);
      toast.error('Answer Error', { hideProgressBar: true, autoClose: 1500 });
    })
    .then(() => {
      // tang so sau khi xac nhanj contract
      db.collection('current_question')
        .doc('current')
        .get()
        .then((doc) => {
          if (doc.exists) {
            var data = doc.data();
            data.user_choice[answerIndex] = data.user_choice[answerIndex] + 1;
            console.log('Document data:', data);
            db.collection('current_question')
              .doc('current')
              .set(data);
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
        });
    });
};

export const SHARE_QUESTION_BOUNTY = 'SHARE_QUESTION_BOUNTY';
export const shareQuestionBounty = () => async (dispatch, getState) => {
  const state = getState();
  var db = firebase.firestore();
  const adminGame = state.tomo.adminGame;
  const from = state.tomo.account;
  await adminGame.methods
    .shareQuestionBounty()
    .send({ from: from })
    .then(async () => {
      dispatch({
        type: SHARE_QUESTION_BOUNTY,
        bounty: 0
      });
      await db
        .collection('current_question')
        .doc('current')
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data();
            data.finished = true;
            db.collection('current_question')
              .doc('current')
              .set(data);
          } else {
            console.log('No such a document');
          }
        });
    })
    .catch((e) => {
      console.log('Error bounty question', e);
    });
};

export const SHARE_BOUNTY = 'SHARE_BOUNTY';
export const shareBounty = () => async (dispatch, getState) => {
  const state = getState();
  const adminGame = state.tomo.adminGame;
  const from = state.tomo.account;
  await adminGame.methods
    .shareBounty()
    .send({ from: from })
    .then((result) => {
      dispatch({
        type: SHARE_QUESTION_BOUNTY,
        bounty: 0
      });
    })
    .catch((e) => {
      console.log('Error bounty', e);
    });
};

export const FETCH_WIN_COUNT = 'FETCH_WIN_COUNT';
export const fetchWinCount = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const game = state.tomo.game;
  const from = state.tomo.aliasAccount.address;
  let winCount = await game.methods.winCount(from).call({
    from: from
  });
  let questionCount = await game.methods.currentQuestion().call({ from });
  winCount = web3.utils.hexToNumber(winCount);
  dispatch({
    type: FETCH_WIN_COUNT,
    winCount,
    questionCount
  });
};

export const CREATE_ADMIN_GAME = 'CREATE_ADMIN_GAME';
export const createAdminGame = () => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  let web3 = state.tomo.web3;
  const factory = state.tomo.factory;
  const from = state.tomo.account;
  const GameArtifact = require('contracts/Game');
  factory.methods
    .createGame()
    .send({ from })
    .then(async () => {
      let listGame = await factory.methods.getAllGames().call({ from });
      let currentGameAddress = listGame[listGame.length - 1];
      const adminGame = new web3.eth.Contract(GameArtifact.abi, currentGameAddress);
      let questionCount = await adminGame.methods.currentQuestion().call({ from });
      dispatch({
        type: CREATE_ADMIN_GAME,
        adminGame: adminGame,
        questionCount: questionCount
      });
      await firestore
        .collection('current_game')
        .doc('current')
        .set({
          address: currentGameAddress
        });
      fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple', {
        method: 'GET'
      })
        .then((res) => {
          return res.json();
        })
        .then((jsonRes) => {
          var db = firebase.firestore();
          var list_questions = [];
          jsonRes.results.forEach((e, index) => {
            let object = {};
            object['question'] = e.question;
            e.incorrect_answers.push(e.correct_answer);
            object['answer'] = shuffle(e.incorrect_answers);
            object['quesNumber'] = index;
            object['correct'] = object['answer'].indexOf(e.correct_answer);
            list_questions.push(object);
          });
          db.collection('list_question')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log('doc', doc);
                doc.ref.delete();
              });
            })
            .then(() => {
              list_questions.forEach((e) => {
                let newId = db.collection('list_question').doc().id;
                e['id'] = newId;
                db.collection('list_question')
                  .doc(e['id'])
                  .set(e);
              });
            })
            .then(async () => {
              await db
                .collection('current_question')
                .doc('current')
                .update({ finished: true });
            });
        });
    })
    .catch((e) => {
      console.log('Error create game', e);
    });
};

export const updateNewGame = (newAddress) => async (dispatch, getState) => {
  const state = getState();
  let aliasWeb3 = state.tomo.aliasWeb3;
  const GameArtifact = require('contracts/Game');
  const from = state.tomo.aliasAccount.address;
  const game = new aliasWeb3.eth.Contract(GameArtifact.abi, newAddress, {
    transactionConfirmationBlocks: 1
  });
  let questionCount = await game.methods.currentQuestion().call({ from });
  dispatch({
    type: INSTANTIATE_GAME,
    game,
    questionCount
  });
};

export const SEND_MONEY_TO_ALIAS = 'SEND_MONEY_TO_ALIAS';
export const sendMoneyToAlias = (value) => async (dispatch, getState) => {
  const state = getState();
  const adminGame = state.tomo.adminGame;
  const from = state.tomo.account;
  const aliasAddress = state.tomo.aliasAccount.address;
  await adminGame.methods
    .transferAlias(aliasAddress)
    .send({ from: from, value: value * 10 ** 18 })
    .then(() => {
      dispatch(getAliasBalance());
      dispatch({
        type: CHECK_ISPLAYING,
        isPlaying: true
      });
    })
    .catch((e) => {
      console.log('Error send money to alias', e);
    });
};

export const GET_ALIAS_BALANCE = 'GET_ALIAS_BALANCE';
export const getAliasBalance = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  let aliasBalance = await web3.eth.getBalance(state.tomo.aliasAccount.address);

  aliasBalance = web3.utils.fromWei(aliasBalance);

  if (aliasBalance.includes('.')) {
    let interger = aliasBalance.split('.', 2)[0];
    let fractional = aliasBalance.split('.', 2)[1].substr(0, 4);
    aliasBalance = interger.concat('.', fractional, ' ');
  }

  dispatch({
    type: GET_ALIAS_BALANCE,
    aliasBalance
  });
};

export const SEND_MONEY_BACK = 'SEND_MONEY_BACK';
export const sendMoneyBack = () => async (dispatch, getState) => {
  const state = getState();
  let aliasWeb3 = state.tomo.aliasWeb3;
  dispatch(getAliasBalance());
  await aliasWeb3.eth
    .sendTransaction({
      from: state.tomo.aliasAccount.address,
      to: state.tomo.account,
      // TODO tinh gas
      value: state.tomo.aliasBalance * 10 ** 18 - 6250000000000
    })
    .on('receipt', function(receipt) {
      toast.success('Withdraw Success', { hideProgressBar: true, autoClose: 1500 });
    })
    .on('error', function(error) {
      toast.error('Withdraw Error', { hideProgressBar: true, autoClose: 1500 });
    });
};

export const startPlay = () => async (dispatch) => {
  dispatch({
    type: CHECK_ISPLAYING,
    isPlaying: true
  });
};

export const UPDATE_RANKING = 'UPDATE_RANKING';
export const updateRank = () => async (dispatch, getState) => {
  const state = getState();
  const from = state.tomo.aliasAccount.address;
  const game = state.tomo.game;
  var web3 = state.tomo.aliasWeb3;
  var ranking = [];
  var getListPlayer = await game.methods.getAllPlayers().call({ from });
  for (var i = 0; i < getListPlayer.length; i++) {
    var winCount = await game.methods.winCount(getListPlayer[i]).call({ from });
    var correct = web3.utils.hexToNumber(winCount);
    ranking.push({
      account: getListPlayer[i],
      correct: correct
    });
  }
  ranking = ranking.sort((a, b) => b.correct - a.correct);
  ranking = ranking.slice(0, 10);
  dispatch({
    type: UPDATE_RANKING,
    ranking: ranking
  });
};
