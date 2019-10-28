import React, { Component } from 'react';
import { Col, Button, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ReactCountdownClock from 'react-countdown-clock';
import * as tomoAction from 'actions/tomoAction';
import ModalDeposit from '../ModalDeposit';
import * as Scroll from 'react-scroll';
import store from '../../store';
import { firestoreConnect } from 'react-redux-firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Animated } from 'react-animated-css';
import '../../style/button.css';
import '../../style/App.css';

class QuesArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: this.props.question[0].finished ? true : false,
      isAliasAccount: true,
      time: this.props.question[0].finished ? 0 : 10
    };
    this.click = this.click.bind(this);
    this.changeDisabled = this.changeDisabled.bind(this);
    this.countDown = this.countDown.bind(this);
    this.percent = this.percent.bind(this);
    this.getMoneyBack = this.getMoneyBack.bind(this);
  }

  // auto scroll name='fixedScrol' when loading page
  componentDidMount() {
    Scroll.scroller.scrollTo('fixedScroll');
  }

  shouldComponentUpdate(nextProps) {
    // so sanh 2 last element cua object props.question
    if (this.props.question[0].question === nextProps.question[0].question) {
      return true;
    } else {
      this.setState({
        disabled: false,
        time: this.state.time - 0.00000000001
      });
      return false;
    }
  }

  click(answer) {
    store.dispatch(tomoAction.answer(answer));
  }

  changeDisabled() {
    this.setState({ disabled: true });
  }

  countDown() {
    // this.changeDisabled();
    return (
      <ReactCountdownClock
        seconds={this.state.time}
        color='#624490'
        alpha={0.9}
        size={120}
        onComplete={(e) => this.changeDisabled()}
      />
    );
  }

  getMoneyBack() {
    store.dispatch(tomoAction.sendMoneyBack());
  }

  // Total calculation function
  sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b);

  percent(user_number) {
    if (this.sumValues(this.props.question[0].user_choice) !== 0) {
      return (user_number * 100) / this.sumValues(this.props.question[0].user_choice);
    } else {
      return 0;
    }
  }

  notifyInfo = (message) => {
    toast.info(message);
  };

  notifySuccess = (message) => {
    toast.success(message);
  };

  notifyError = (message) => {
    toast.error(message);
  };

  render() {
    let acc = this.props.acc;
    let qes = this.props.question;
    return (
      <Col className='box_color' xs={{ size: 12 }} md={{ size: 8, offset: 0 }}>
        <Animated className='set_full_height' animationIn='fadeInLeft'>
          <div className='margin_box'>
            <div className='question'>
              <Col className='user_account'>
                {this.state.isAliasAccount ? (
                  <div>
                    <p>
                      <strong>Game account: </strong>
                      {`${this.props.aliasAddress.substr(0, 6)}...${this.props.aliasAddress.substr(
                        -4
                      )}`}
                    </p>
                    <p>
                      <strong>Game Balance: </strong>
                      {`${this.props.aliasBalance} `}
                      <img width='35' src='https://i.imgur.com/VZgib3M.png' alt='tomoCoin' />
                    </p>
                  </div>
                ) : (
                  <div>
                    <p>
                      <strong>Your account: </strong>
                      {`${acc.account.substr(0, 6)}...${acc.account.substr(-4)}`}
                    </p>

                    <p>
                      <strong>Balance: </strong>
                      {`${this.props.balance} `}
                      <img width='35' src='https://i.imgur.com/VZgib3M.png' alt='tomoCoin' />
                    </p>
                  </div>
                )}
                <div className='group-button' name='fixedScroll'>
                  <label className='switchSmall m5'>
                    <input
                      type='checkbox'
                      onClick={(e) => {
                        this.setState({ isAliasAccount: !this.state.isAliasAccount });
                      }}
                    />
                    <small />
                  </label>

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

                  <ModalDeposit
                    message='If your alias account is not enough tomo to play, send more tomo to
                            answer the next questions.'
                    classNameButton='deposit'
                    nameButton='Deposit'
                    className='modal'
                    colorButton='success'
                  />
                  <ToastContainer position='top-center' autoClose={2000} />
                </div>
              </Col>
              <Col className='set_full_height'>
                <div className='font-number-question'>
                  Question {this.props.questionCount + 1} :
                </div>
                <div
                  className='question_position'
                  dangerouslySetInnerHTML={{ __html: qes[0].question }}
                />
                <div className='question center'>{this.countDown()}</div>
              </Col>
            </div>
            <Col className='question'>
              <div className='answer_position'>
                {qes[0].answer.map((item, key) => (
                  <Col key={key}>
                    <Button
                      onClick={(e) => {
                        this.click(key);
                      }}
                      className='answer_box'
                      outline
                      color='primary'
                      disabled={this.state.disabled}
                    >
                      {qes[0].finished ? (
                        qes[0].correct === key ? (
                          <Progress value={this.percent(qes[0].user_choice[key])}>
                            <div
                              className='text_in_button'
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                            <div className='text_in_button user_number'>
                              {qes[0].user_choice[key]}
                            </div>
                          </Progress>
                        ) : (
                          <Progress
                            className='wrong-answer'
                            value={this.percent(qes[0].user_choice[key])}
                          >
                            <div
                              className='text_in_button'
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                            <div className='text_in_button user_number'>
                              {qes[0].user_choice[key]}
                            </div>
                          </Progress>
                        )
                      ) : (
                        <Progress value={this.percent(qes[0].user_choice[key])}>
                          <div
                            className='text_in_button'
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                          <div className='text_in_button user_number'>
                            {qes[0].user_choice[key]}
                          </div>
                        </Progress>
                      )}
                    </Button>
                  </Col>
                ))}
              </div>
            </Col>
          </div>
        </Animated>
      </Col>
    );
  }
}

const mapStatetoProps = (state) => {
  const question = state.firestore.ordered.current_question;
  return {
    question: question,
    balance: state.tomo.balance,
    aliasBalance: state.tomo.aliasBalance,
    aliasAddress: state.tomo.aliasAccount.address,
    account: state.tomo.account,
    questionCount: state.tomo.questionCount
  };
};

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
    {
      collection: 'current_question'
    }
  ])
)(QuesArea);
