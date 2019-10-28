import React, { Component } from 'react';
import { Container, Col, Row, Button } from 'reactstrap';
import * as tomoActions from 'actions/tomoAction';
import store from 'store';
import firebase from 'config';
import '../../style/App.css';
import '../../style/admin.css';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';

class AdminLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      question: []
    };
  }

  async componentWillMount() {
    var db = await firebase.firestore();
    db.collection('list_question')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            question: [...this.state.question.concat([doc.data()])]
          });
        });
      });
  }

  selectQues = async (ques) => {
    console.log('question ques', ques);
    store.dispatch(tomoActions.setQuestion(ques));
  };

  setSingleBounty = async () => {
    await store.dispatch(tomoActions.shareQuestionBounty());
    console.log('share complite');
  };

  setAllBounty = async () => {
    await store.dispatch(tomoActions.shareBounty());
    console.log('share all bounty complte');
  };

  createGame = async () => {
    // debugger
    await store.dispatch(tomoActions.createAdminGame());
    console.log('admin', store.getState().tomo.account);
  };

  render() {
    let questions = this.props.questions;
    return (
      <div>
        <Container>
          <Col className='set_height'>
            <div className='margin_box'>
              <div>
                <span>Select the next question</span>
              </div>
              <div className='admin_question_box'>
                {questions &&
                  Object.keys(questions).map((id) => {
                    let ques = questions[id];
                    if (ques) {
                      return (
                        <div className='admin_quesbox' key={id}>
                          <Button
                            onClick={() => this.selectQues(ques)}
                            className='answer_box '
                            outline
                            color='primary'
                            dangerouslySetInnerHTML={{ __html: ques.question }}
                          />
                        </div>
                      );
                    }
                    return true;
                  })}
              </div>
              <div className='button_bounty'>
                <Row>
                  <Col xs='12' sm='8' md='4'>
                    <Button onClick={() => this.setSingleBounty()} color='primary'>
                      Question Sharing
                    </Button>
                  </Col>
                  <Col xs='12' sm='8' md='4'>
                    <Button onClick={() => this.setAllBounty()} color='primary'>
                      Bounty Sharing
                    </Button>
                  </Col>
                  <Col xs='12' sm='8' md='4'>
                    <Button onClick={() => this.createGame()} color='primary'>
                      New Game
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Container>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  let questions = state.firestore.ordered.list_question;
  return {
    questions: questions,
    rank: state.rank.ranking,
    wincount: state.tomo.winCount,
    tomo: state.tomo
  };
};

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
    {
      collection: 'list_question'
    }
  ])
)(AdminLayout);
