import React, { Component, PropTypes } from 'react';
import { login, setErrors } from '../actions/user';

export default class SignIn extends Component {

  // try to pass state without connect function
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.state = {
      email: '',
      password: '',
      error: null
    };

    this.unsubscribe = this.context.store.subscribe(() => {
      const { user } = this.context.store.getState();
      if (this.state.error !== user.get('errors') && user.get('errors') !== null) {
        this.setState({ error: user.get('errors') });
      }
    });
  }

  componentWillUnmount() {
    typeof this.unsubscribe === 'function' && this.unsubscribe();
  }

  handleLogin = e => {
    e.preventDefault();

    const { dispatch } = this.context.store;
    dispatch(login(this.state));
  };

  onChangeField = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { user } = this.context.store.getState();

    return (
      <div>
        <h1>Login Form</h1>
        <form onSubmit={this.handleLogin}>
          <div>
            <span><strong>Email\Password:</strong> user@example.com\123456</span>
          </div>
          <br />
          { this.state.error !== null && <div style={{ color: 'red'}}>{this.state.error}</div> }
          <div>
            <input
              type="email"
              name="email"
              onChange={this.onChangeField}
              placeholder="Email"
              required={true} />
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={this.onChangeField}
              placeholder="Password"
              required={true} />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }
}
