import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import QuesArea from './QuesArea';
import RankArea from './RankArea';
import ModalDeposit from '../ModalDeposit';
import store from 'store';
import * as tomoAction from 'actions/tomoAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Animated } from 'react-animated-css';
import '../../style/Sunfetti.css';
import '../../style/App.css';

class PlayerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      balance: ''
    };

    this.startPlay = this.startPlay.bind(this);
  }

  async componentDidMount() {
    this.interval = setInterval(() => {
      if (this.props.tomo.account !== null && this.props.tomo.game !== null) {
        store.dispatch(tomoAction.fetchWinCount());
        store.dispatch(tomoAction.getBalance());
        store.dispatch(tomoAction.getAliasBalance());
        store.dispatch(tomoAction.updateRank());
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.game !== this.props.game && this.props.tomo.web3) {
      store.dispatch(tomoAction.updateNewGame(this.props.game[0].address));
    }
  }

  getMoneyBack() {
    store.dispatch(tomoAction.sendMoneyBack());
  }

  placeABet() {
    store.dispatch(tomoAction.sendMoneyToAlias());
  }

  startPlay() {
    store.dispatch(tomoAction.startPlay());
    // instantiateGame
  }

  withdraw() {
    store.dispatch(tomoAction.sendMoneyBack());
  }

  notifyInfo = (message) => {
    toast.info(message);
  };

  render() {
    // sorting array object
    const { ranking } = this.props;
    const { question, questionCount } = this.props;
    const { wincount } = this.props;
    const { tomo } = this.props;
    return (
      <div>
        <Container>
          {tomo.web3 ? (
            tomo.isPlaying ? (
              wincount === 10 ? (
                <Row className='set_height'>
                  <Col className='box_color' xs='12' md='8'>
                    <div className='margin_box '>
                      <span> The winner is youuuuu</span>
                      <Button
                        color='none'
                        className='withdraw'
                        onClick={(e) => {
                          this.getMoneyBack();
                          this.notifyInfo('Withdrawing...');
                        }}
                      >
                        Withdraw
                      </Button>
                      <ToastContainer position='top-center' autoClose={2000} />
                      <img
                        alt=''
                        src='https://media.giphy.com/media/2A0JSxcE0eQfrQrjAZ/giphy.gif'
                        className='gif-load'
                        width='60%'
                      />
                    </div>
                  </Col>
                  <RankArea ranking={ranking} wincount={wincount} />
                </Row>
              ) : question &&
                questionCount < 10 &&
                (question[0].finished === false || questionCount !== 0) ? (
                <Row className='set_height'>
                  <QuesArea ques={question} acc={this.props.tomo} />
                  <RankArea ranking={ranking} wincount={wincount} />
                </Row>
              ) : (
                <Row className='set_height'>
                  <Col className='box_color' xs='12' md='8'>
                    <div className='margin_box '>
                      <span> Waiting a new game...</span>
                      <img
                        alt=''
                        src='https://media.giphy.com/media/2A0JSxcE0eQfrQrjAZ/giphy.gif'
                        className='gif-load'
                        width='60%'
                      />
                    </div>
                  </Col>
                  <RankArea ranking={ranking} />
                </Row>
              )
            ) : (
              <Row className='set_height'>
                <Col className='box_color' xs='12'>
                  <Animated
                    className='set_full_height'
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                  >
                    <div className='margin_box '>
                      {parseFloat(tomo.aliasBalance) > 3.1 ? (
                        <div>
                          <span>You have {tomo.aliasBalance} Tomo</span>
                          <Button
                            color='success'
                            className='button-start'
                            onClick={(e) => this.startPlay()}
                          >
                            Start
                          </Button>
                          <Button
                            color='none'
                            className='button-withdraw'
                            onClick={(e) => {
                              this.withdraw();
                              this.notifyInfo('Withdrawing...', { autoClose: 1000 });
                            }}
                          >
                            WithDraw
                          </Button>
                          <ToastContainer className='toast-info' />
                        </div>
                      ) : (
                        <ModalDeposit
                          message=' You should send 31 Tomo to answer all question. If you send less than 31 Tomo (minimum 3.5 Tomo), you still can play game.However, during the game, you will can have to send more Tomo.'
                          classNameButton='playgame'
                          nameButton='Play Game'
                          className='modal'
                          colorButton='danger'
                        />
                      )}
                    </div>
                  </Animated>
                </Col>
              </Row>
            )
          ) : (
            <Row className='set_height'>
              <Col xs='12'>
                <div className='Sun_layer'>
                  <span className='Sun_text'>SUN*FETTI</span>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  const question = state.firestore.ordered.current_question;
  const game = state.firestore.ordered.current_game;
  return {
    game: game,
    question: question,
    ranking: state.tomo.ranking,
    wincount: state.tomo.winCount,
    questionCount: state.tomo.questionCount,
    tomo: state.tomo
  };
};

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
    {
      collection: 'current_question'
    },
    {
      collection: 'current_game'
    }
  ])
)(PlayerLayout);
