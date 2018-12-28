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
import PrivateRoute from './PrivateRoute';
import AuthContext from './AuthContext';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history) // as index.js is wrapped, the history object is available to react-router. We pass history so that Auth can interact with react-router
    };
  }

  render() {
    const { auth } = this.state;
    return (
      // Child components can access the auth object by importing AuthContext.Consumer
      <AuthContext.Provider value={auth}>
        {/*<React.Fragment />*/}
        <Nav auth={auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home auth={auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback auth={auth} {...props} />}
          />
          {/*We pass the auth object down to each component on props for now.*/}
          <PrivateRoute path="/profile" component={Profile} auth={auth} />
          <Route path="/public" component={Public} />
          <PrivateRoute path="/private" component={Private} auth={auth} />
          <PrivateRoute
            path="/courses"
            component={Courses}
            // these checks are merely for user experience, not security.
            // It's the server's job to validate the user is authorized when an API call is made
            auth={auth}
            scopes={['read:courses']}
          />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
