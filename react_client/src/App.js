import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, Input, Form, Grid, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';


class Auth extends Component {
  state = {
    password: '',
    username: ''
  }
  onChange = (value, field) => {
    this.setState({
      [field]: value
    });
  }
  onClick = (e) => {
    e.preventDefault();
    axios.post('/api/login', this.state)
       .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));

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
        <Button primary onClick={this.onClick} type='submit'>Reg</Button>
      </Form>
    )
  }
}


class App extends Component {
  render() {
    return (
        <Grid stackable centered>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment>
                <Auth/>
              </Segment>
            </Grid.Column>
          </Grid.Row>     
        </Grid>
    );
  }
}

export default App;
