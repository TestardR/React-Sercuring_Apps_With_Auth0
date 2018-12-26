import React, { Component } from 'react';

class Callback extends Component {
  // Handle authentication if expected values are in the URL.
  componentDidMount() {
    // Gives us the current URL with at least one of the three expected values
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error('Invalid callback URL');
    }
  }
  render() {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
}

export default Callback;
