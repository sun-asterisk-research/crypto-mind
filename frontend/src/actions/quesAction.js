export const getQues = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({
      type: 'GET_QUES'
      // correct
    });
  };
};
