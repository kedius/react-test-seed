import React, { Component } from 'react';

export default class NoMatch extends Component {
  render() {
    return (
      <div>
        <h2>404 <small style={{ color: '#777' }}>Page not found!</small></h2>
        <p>Съешь ещё этих мягких французских булок, да выпей же чаю.</p>
      </div>
    );
  }
}
