const initState = {
  questionID: [
    '9VjqRPa9EzCARyXCB0EA',
    'B0V9KVe5UzoD9z4GgWhC',
    'HDPNq6jadapxJ9K0uGCp',
    'Hxj9Qt1Ak4zWc5RcS1P4',
    'alu8LGj3o6qVdxHmlowY',
    'cjWj9HcfUcknRAE6wyuW',
    'kzbzrsJkhnQ0tbU46PKL',
    'wTNdMEShNGVpz8Umhilq',
    'z5ce3Npiw5Rk2j2us6Vp'
  ],
  correct: null
};

const quesReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_QUES':
      return {
        ...state
      };
    case 'INSERT_QUES':
      console.log('insert success');
      return state;
    case 'INSERT_QUES_ERROR':
      console.log('insert error');
      return state;
    default:
      return state;
  }
};

export default quesReducer;
