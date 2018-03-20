import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Aux from '../Aux/Aux';
import classes from './Layout.css';
// import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
// import Spinner from '../../components/UI/Spinner/Spinner';

class Layout extends Component {
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          <main className={classes.Content}>
            {this.props.children}
          </main>
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

const mapStateToProps = state => ({
  isAuth: state.auth.authKey !== null
});

export default connect(mapStateToProps)(Layout);
