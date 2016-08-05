import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { initUser, setIsLoading } from '../actions/user';

export default (Page, role) => {

  class AccessControl extends Component {

    componentWillMount() {
      const { user } = this.props;
      this.state = { accessIsGranted: false };

      if (!user.get('id') && !user.get('isLoading') && user.get('token')) {
        this.props.setIsLoading();
        this.props.initUser(user.get('token'));
      }

      this.checkAccess(user);
    }

    componentWillReceiveProps(nextProps) {
      const { user } = nextProps;
      this.checkAccess(user);
    }

    checkAccess = user => {
      let accessIsGranted = true;

      if (!user.get('id') && role === '@') {
        if (!user.get('isLoading')) {
          sessionStorage.setItem('next', this.props.location.pathname);
          browserHistory.push('/sign-in');
        }
        accessIsGranted = false;
      }

      if (user.get('id') && role === 'GUEST') {
        browserHistory.push(sessionStorage.getItem('next') || '/');
        sessionStorage.removeItem('next');
        accessIsGranted = false;
      }

      this.setState({ accessIsGranted });
    };

    render() {
      const { user } = this.props;

      if (!user.get('id') && user.get('isLoading')) {
        return <h1>User is loading</h1>;
      }

      if (this.state.accessIsGranted) {
        return <Page {...this.props}/>;
      }

      return null;
    }
  }

  return connect(
    state => ({
      user: state.user
    }),
    { initUser, setIsLoading }
  )(AccessControl);

}
