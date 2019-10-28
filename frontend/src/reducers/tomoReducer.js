import * as actions from 'actions/tomoAction';

const initialState = {
  web3: null,
  aliasWeb3: null,
  account: null,
  ceoAddress: null,
  isAdmin: false,
  isLoadDone: false,
  tomo: null,
  adminGame: null,
  game: null,
  factory: null,
  bounty: 0,
  questioning: false,
  questionBounty: 0,
  winCount: 0,
  balance: 0,
  questionCount: 0,
  aliasAccount: {
    address: '',
    privateKey: ''
  },
  aliasBalance: 0,
  isPlaying: false,
  ranking: []
};

const tomoReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.WEB3_CONNECT:
      return {
        ...state,
        web3: action.web3,
        account: action.account,
        balance: action.balance
      };
    case actions.INSTANTIATE_CONTRACT:
      return {
        ...state,
        factory: action.factory
      };
    case actions.LOGIN_ALIAS_ACCOUNT:
      return {
        ...state,
        aliasWeb3: action.aliasWeb3
      };
    case actions.INSTANTIATE_GAME:
      return {
        ...state,
        game: action.game,
        questionCount: action.questionCount
      };
    case actions.SET_BOUNTY:
      return {
        ...state,
        bounty: action.bounty
      };
    case actions.SET_QUESTION:
      return {
        ...state,
        questioning: action.questioning
      };
    case actions.ANSWER:
      return {
        ...state,
        questioning: action.questioning,
        questionBounty: action.questionBounty
      };
    case actions.SHARE_QUESTION_BOUNTY:
      return {
        ...state,
        questionBounty: action.questionBounty
      };
    case actions.SHARE_BOUNTY:
      return {
        ...state,
        bounty: action.bounty
      };
    case actions.FETCH_WIN_COUNT:
      return {
        ...state,
        winCount: action.winCount,
        questionCount: action.questionCount
      };
    case actions.CREATE_ADMIN_GAME:
      return {
        ...state,
        adminGame: action.adminGame,
        questionCount: action.questionCount
      };
    case actions.GET_BALANCE:
      return {
        ...state,
        balance: action.balance
      };
    case actions.GET_CEO_ADDRESS:
      return {
        ...state,
        ceoAddress: action.ceoAddress,
        isAdmin: action.isAdmin,
        isLoadDone: action.isLoadDone
      };
    case actions.GET_ALIAS:
      return {
        ...state,
        aliasAccount: action.aliasAccount
      };
    case actions.GET_ALIAS_BALANCE:
      return {
        ...state,
        aliasBalance: action.aliasBalance
      };
    case actions.INSTANTIATE_ADMIN_GAME:
      return {
        ...state,
        adminGame: action.adminGame
      };
    case actions.CHECK_ISPLAYING:
      return {
        ...state,
        isPlaying: action.isPlaying
      };
    case actions.UPDATE_RANKING:
      return {
        ...state,
        ranking: action.ranking
      };
    default:
      return state;
  }
};

export default tomoReducer;
