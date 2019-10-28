var firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

var config = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECTID',
  storageBucket: 'YOUR_STORAGEBUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID'
};

firebase.initializeApp(config);

module.exports = firebase;
