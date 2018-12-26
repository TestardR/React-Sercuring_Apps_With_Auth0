import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Auth from './Auth/Auth';
import Callback from './Callback';

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history); // as index.js is wrapped, the history object is available to react-router. We pass history so that Auth can interact with react-router
  }
  render() {
    return (
      <>
        {/*<React.Fragment />*/}
        <Nav auth={this.auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home auth={this.auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback auth={this.auth} {...props} />}
          />
          {/*We pass the auth object down to each component on props for now.*/}
          <Route
            path="/profile"
            render={props =>
              this.props.isAuthenticated ? (
                <Profile auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </div>
      </>
    );
  }
}

export default App;
