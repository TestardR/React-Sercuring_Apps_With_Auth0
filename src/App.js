import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Auth from './Auth/Auth';
import Callback from './Callback';
import Public from './Public';
import Private from './Private';
import Courses from './Courses';

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
              this.auth.isAuthenticated() ? (
                <Profile auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route path="/public" component={Public} />
          <Route
            path="/private"
            render={props =>
              this.auth.isAuthenticated() ? (
                <Private auth={this.auth} {...props} />
              ) : (
                this.auth.login()
              )
            }
          />
          <Route
            path="/courses"
            render={props =>
              // these checks are merely for user experience, not security.
              // It's the server's job to validate the user is authorized when an API call is made
              this.auth.isAuthenticated() &&
              this.auth.userHasScopes(['read:courses']) ? (
                <Courses auth={this.auth} {...props} />
              ) : (
                this.auth.login()
              )
            }
          />
        </div>
      </>
    );
  }
}

export default App;
