import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PlayerLayout from './component/PlayerLayout/PlayerLayout';
import AdminLayout from './component/AdminLayout/AdminLayout';
import Particles from './component/Particles';
import store from 'store';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as tomoAction from './actions/tomoAction';
import Site404 from './component/NotFound404';

class App extends Component {
  componentDidMount = async () => {
    try {
      window.addEventListener('load', () => {
        if (window.web3) {
          if (window.web3.currentProvider.isMetaMask) {
            store.dispatch(tomoAction.web3Connect());
          } else if (window.web3.currentProvider.isTomoWallet) {
            store.dispatch(tomoAction.web3TomoWalletConnect());
          }
        }
      });
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  render() {
    if (this.props.tomo.isLoadDone) {
      return (
        <BrowserRouter>
          <Particles />
          <div className='App'>
            {this.props.tomo.isAdmin ? (
              <Switch>
                <Route exact path='/' component={PlayerLayout} />
                <Route path='/admin' component={AdminLayout} />
                <Route path='*' exact={true} component={Site404} />
              </Switch>
            ) : (
              <Switch>
                <Route exact path='/' component={PlayerLayout} />
                <Route path='/admin' component={Site404} />
                <Route path='*' exact={true} component={Site404} />
              </Switch>
            )}
          </div>
        </BrowserRouter>
      );
    } else {
      return (
        <BrowserRouter>
          <Particles />
          <div className='App'>
            <Switch>
              <Route exact path='/' component={PlayerLayout} />
              <Route path='/admin' component={PlayerLayout} />
              <Route path='*' exact={true} component={Site404} />
            </Switch>
          </div>
        </BrowserRouter>
      );
    }
  }
}

const mapStatetoProps = (state) => {
  return {
    tomo: state.tomo
  };
};

export default compose(connect(mapStatetoProps))(App);
