import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import classes from './App.css';
import Homepage from './containers/Homepage/Homepage';
// import { getLocationInfo, authCheckState } from './store/actions/index';
//
// const asyncCart = asyncComponent(() => import('./containers/Cart/Cart'));
// const asyncAuth =  asyncComponent(() => import('./containers/Auth/Auth'));
// const asyncLogout = asyncComponent(() => import('./containers/Auth/Logout/Logout'));
// const asyncPreorder = asyncComponent(() => import('./containers/Preorder/Preorder'));
// const asyncMyAccount = asyncComponent(() => import('./containers/MyAccount/MyAccount'));

class App extends Component {
  render() {
    const routes = (
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Redirect to="/" />
      </Switch>
    );

    return (
      <div className={classes.App}>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.auth.authKey !== null
});

// const mapDispatchToProps = dispatch => {
//   return {
//     initApp: () => dispatch(getLocationInfo()),
//     onTryAutoSignup: () => dispatch(authCheckState())
//   }
// };

export default withRouter(connect(mapStateToProps)(App));
