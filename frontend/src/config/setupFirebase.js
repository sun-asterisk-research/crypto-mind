var firebase = require('./index');

var setColumn = async () => {
  var db = firebase.firestore();

  db.collection('current_game')
    .doc('current')
    .set({
      address: '0x0'
    });

  db.collection('current_question')
    .doc('current')
    .set({
      answer: {
        0: '',
        1: '',
        2: '',
        3: ''
      },
      correct: 1,
      id: '',
      quesNumber: 6,
      question: '',
      user_choice: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      }
    });

  db.collection('list_question')
    .doc('curasdasddadsDrent')
    .set({
      answer: {
        0: '6',
        1: '6',
        2: '6',
        3: '6'
      },
      correct: 1,
      id: 'asjkdjaslkdas',
      quesNumber: 7,
      question: ''
    });
};

setColumn();
