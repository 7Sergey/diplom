import React, { Component } from 'react';
import { Button, Input, Form, Grid, Segment, Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Profile from './component/profile';
import EditPresentation from './component/profile/EditPresentation';

class Auth extends Component {
  state = {
    password: '',
    username: ''
  }

  login = () => {
    axios.post('/api/login', this.state)
      .then(res => {
        this.props.onChange(res.data);
      })
      .catch(err => console.log(err));
  }

  componentWillMount() {
    axios.get('/session').then(res => this.props.onChange(res.data))
  }

  onChange = (value, field) => {
    this.setState({
      [field]: value
    });
  }

  onClick = (e) => {
    e.preventDefault();
    this.login();
  }

  render() {
    const { username, password } = this.state;
    return (
      <Form>
        <Form.Field>
          <label> Name</label>
          <Input type='text' onChange={(e, { name, value }) => this.onChange(value, name)} name='username' value={username} placeholder='Name' />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <Input type='password' name='password' value={password} onChange={(e, { name, value }) => this.onChange(value, name)} placeholder='Password' />
        </Form.Field>

        <Button primary onClick={this.onClick} type='submit'>Submit</Button>
      </Form>
    )
  }
}


class DashBoard extends Component {
  state = { activeItem: 'profile' }

  handleItemClick = (e, { name }) => { this.setState({ activeItem: name }); this.props.history.push(`/${name}`); }

  render() {
    const { activeItem } = this.state;
    return (
      <Grid stackable centered>
        <Grid.Row>
          <Grid.Column width={16}>
            <Menu>
              <Menu.Item
                name='profile'
                active={activeItem === 'profile'}
                onClick={this.handleItemClick}
              >
                Profile
              </Menu.Item>
              <Menu.Item name='chats' active={activeItem === 'chats'} onClick={this.handleItemClick}>
                Lessons
              </Menu.Item>
              <Menu.Menu position='right'>
                <Menu.Item name='Logout' active={activeItem === 'Logout'} onClick={this.props.signOut} />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.props.children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const Chats = () => (
  <div>
    Chats
  </div>
)

const Chat = () => (
  <div>
    Chats + id
  </div>
)

const AppRoute = (props) => (
  <div>
    <Route exact path="/" component={Profile} {...props} />
    <Route exact path="/profile" component={Profile} {...props} />
    <Route path="/profile/:id" component={EditPresentation} {...props} />
    <Route exact path="/chats" component={Chats} {...props} />
    <Route exact path="/chats:id" component={Chat} {...props} />
  </div>
)

class App extends Component {
  state = { auth: false };

  onChange = (res) => this.setState({ ...res });
  signOut = () => axios.get('/logout').then(res => this.setState({...res.data}))
  render() {
    const { auth } = this.state;
    return (
      <Grid stackable centered>
        <Grid.Row>
          <Grid.Column width={14}>
            {!auth
              ? <Auth onChange={this.onChange} />
              : <Route path="/" render={
                (props) => <DashBoard signOut={this.signOut} {...props} {...this.state}><AppRoute {...this.state} /></DashBoard>
              } />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
