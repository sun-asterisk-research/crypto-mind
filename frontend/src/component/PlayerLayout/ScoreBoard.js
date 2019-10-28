import React from 'react';

import '../../style/App.css';
//import { bold } from 'ansi-colors';

const ScoreBoard = ({ wincount }) => {
  return (
    <div className='score_board'>
      <p>Your Score</p>
      <p>{wincount}/10</p>
    </div>
  );
};

export default ScoreBoard;
