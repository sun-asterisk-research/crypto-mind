<h1 align="center">Welcome to Blockchain Confetti 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

![](/image/logo.png)

## Description

This is the game that answers the question. There are a total of 10 questions, each player will have to bet 3 `Tomo` for a question. If true, they will receive some `Tomo` equal to the total number of tomo of all participants answered divided by the number of correct respondents. If the answer is wrong, the player will not get anything back. The players answer all questions correctly will receive a reward from Admin. If no one answers correctly in a question, the bet amount will be transferred to Admin and the game will end.

## Feature

- Build on ReactJS, Firebase .
- Blockchain tech with Tomochain.

## For end user: Play the game

The game participants will have 2 roles

- Admin
- Player

### For Admin

If you are Admin go to /admin

![playGame](/image/admin.png)

If you are the Admin you need to create game first and then select the question. After 10s Admin can publish the answer of the question and divide Tomo for the players who have answered correctly by pressing the `Question Sharing` button. After everyone answers 10 questions , press `Bounty Sharing` button to divide the money for players who have correctly answered 10 questions .

### For Player

Open the app, click `Play Game` Button

![playGame](/image/playGame.png)

After send Tomo to Game Account . Players will wait for Admin to create a new game

![waitingNewGame](/image/waitingNewGame.png)

After the Admin created the game and choose the first question the game will start. Player will have 10 seconds to answer the question. Players can see what other player choose and give own answers.

![answerQuestion](/image/answerQuestion.png)

The game has a scoreboard and a ranking to see who answers the most questions correctly.

![scoreAndRanking](/image/scoreAndRanking.png)

The player who answered correctly all 10 questions will be the final winner.

![winner](/image/winner.png)

In the process of playing, you can withdraw the initial deposit and the interest amount when give correct answer at any time.

## For developer

### General

There are serveral main components in this project:

- Contracts
  - Solidity
  - Tomochain testnet
- Frontend
  - ReactJs
  - Redux
  - Web3.js
- Database
  - Firebase

(we will update latest source code later)

### How to install

**Set up Firebase**

We are using firebase for database , you need to create a project in firebase after that click **`Add Firebase to you web app`** and copy script **firebaseConfig** to `src/config/index.example.js`

```js
var firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

var config = {
  apiKey: '<YOUR_API_KEY>',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECTID',
  storageBucket: 'YOUR_STORAGEBUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID'
};

firebase.initializeApp(config);

module.exports = firebase;
```

After that run script to setup firebase:

```sh
npm run firebase
```

or

```sh
yarn firebase
```

**Set up Contract**

```sh
npm install
```

or

```sh
yarn install
```

Then, adding a new .env file :

```js
MNENOMIC = 'YOUR PRIVATE SEED PHRASE';
```

Migrate contract:

In this application, we are using Tomochain testnet to migrate smart contract and truffle framework to deploy.

You can migrate your contracts by command:

```js
yarn truffle migrate --network tomotestnet
```

Some files will appear in **_build/contracts_** folder, there are contracts code after migrated. You need to move folder **_contracts_** to **_/src_** in frontend folder.

**Set up Frontend**

```sh
npm install
```

or

```sh
yarn install
```

then

```sh
npm start
```

or

```sh
yarn start
```

## Known issues

Due of short duration of development in this hackathon, we've faced many trouble, and some even still exitst in latest build.

- Displays the number of players who choose the answer sometimes wrong.
- 10 seconds for players to answer questions confirmed on the blockchain by counting next 5 block confirmation, sometimes users have less than 10 seconds to answer the question.
- Other minor bugs...

## Next Plan

In future in next versions, we are going to fix all bugs and publish the game in other platforms version, too. And of course, support multichain like Tomochain mainnet, ETH mainnet, Ropsten, Loom, Rinkeby....

## Show your support

Give a ⭐️ if this project helped you!
