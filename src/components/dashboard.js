import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { resetUser } from '../actions/user';

@connect(
  state => ({
    user: state.user
  }),
  {
    logout: resetUser
  }
)
export default class Dashboard extends Component {

  handleLogout = () => {
    this.props.logout();
  };

  render() {
    const { user } = this.props;

    return (
      <div>
        <h2>Dashboard page!</h2>
        <h4>Hello, {user.get('username')}! <button onClick={this.handleLogout}>Logout</button></h4>
        <ul>
          <li><Link to="/page1">First Page</Link></li>
          <li><Link to="/page2">Second Page</Link></li>
        </ul>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
