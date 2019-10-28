import React from 'react';
import { Col } from 'reactstrap';
import ScoreBoard from './ScoreBoard';

import { Animated } from 'react-animated-css';
import '../../style/App.css';

const RankArea = ({ ranking, wincount }) => {
  return (
    <Col className='box_color' xs={{ size: 12 }} md={{ size: 4, offset: 0 }}>
      <Animated className='set_full_height' animationIn='fadeInRight'>
        <ScoreBoard wincount={wincount} />
        <div className='blank_space' />
        <div className='rank'>
          <div className='ranking_title'>
            <span>Ranking</span>
          </div>
          <div className='person_rank_box'>
            {ranking.map((rank) => (
              <div key={rank.account} className='person_rank'>
                <p className='user_account'>
                  <span className='ellipsis'>
                    {rank.account.substr(0, 6)}...{rank.account.substr(-4)}
                  </span>
                </p>
                <p>{rank.correct}/10</p>
              </div>
            ))}
          </div>
        </div>
      </Animated>
    </Col>
  );
};

export default RankArea;
