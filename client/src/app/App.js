import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import Home from '../pages/Home';
import SchoolList from '../pages/SchoolList';
import Coach from '../pages/Coach';
import Ranking from '../pages/Ranking';
import Login from '../user/login/Login';
import Player from "../pages/types/Player";
import School from "../pages/School";
import Team from "../pages/Team";
import Signup from '../user/signup/Signup';
import AppHeader from '../common/AppHeader';
import AppFooter from '../common/AppFooter';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';

import { Layout, notification } from 'antd';
import Subscriptions_Page from "../user/subscriptions/subscriptions_page";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      clickedSchool: null
    };

    this.setSchool = this.setSchool.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Athletic Storm',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Athletic Storm',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/schoollist");
  }

  setSchool(school){
    this.setState({ clickedSchool: school});
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
            onLogout={this.handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                <Route path="/ranking" render={(props) => <Ranking isAuthenticated={this.state.isAuthenticated}  {...props} />}/>
                <Route path="/schoollist" render={(props) => <SchoolList isAuthenticated={this.state.isAuthenticated} {...props} />}/>
                <Route path="/school/:schoolName" render={(props) => <School isAuthenticated={this.state.isAuthenticated}  {...props} />}/>
                <Route path="/coach/:coachName" render={(props) => <Coach isAuthenticated={this.state.isAuthenticated} {...props} />}/>
                <Route path="/player/:id" render={(props) => <Player isAuthenticated={this.state.isAuthenticated} {...props} />}/>
                <Route path="/team" component={Team}/>
                <Route component={NotFound}/>
              </Switch>
            </div>
          </Content>

          <AppFooter/>
        </Layout>
    );
  }
}

export default withRouter(App);
