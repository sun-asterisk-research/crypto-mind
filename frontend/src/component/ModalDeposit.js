import React from 'react';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import * as tomoAction from 'actions/tomoAction';
import store from '../store';
import '../style/App.css';

class ModalDeposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 31,
      modal: false,
      unmountOnClose: true
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeUnmountOnClose = this.changeUnmountOnClose.bind(this);
  }

  handleChange(event) {
    if (event.target.value > 3 || event.target.value <= 31) {
      this.setState({ value: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    store.dispatch(tomoAction.sendMoneyToAlias(this.state.value));
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  changeUnmountOnClose(e) {
    let value = e.target.value;
    this.setState({ unmountOnClose: JSON.parse(value) });
  }

  render() {
    return (
      <div className='modal-container'>
        <Button
          color={this.props.colorButton}
          className={this.props.classNameButton}
          onClick={this.toggle}
        >
          {this.props.nameButton}
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.classNameModal}
          unmountOnClose={this.state.unmountOnClose}
          xs={{ size: 8, offset: 2 }}
        >
          <ModalHeader toggle={this.toggle}>Sun* Fetti</ModalHeader>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <ModalBody>
                <Label>{this.props.message}</Label>
                <Col xs={{ size: 8, offset: 2 }} md={{ size: 4, offset: 4 }}>
                  <Input
                    type='number'
                    name='number'
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                </Col>
              </ModalBody>
            </FormGroup>
            <ModalFooter>
              <Button color='primary' type='submit'>
                Send
              </Button>
              <Button color='secondary' onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ModalDeposit;
