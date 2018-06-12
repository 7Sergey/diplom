import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import axios from 'axios';
import Spectacle from './Spectacle';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:7777', { reconnect: true });

class Lesson extends Component {
  state = {
    load: true
  }

  getSession = () => {
    axios.get('/session')
      .then(res=> {
        axios.post('/new-user-lesson', { _id: this.props.match.params.id, userId: res.data._id})
      })
  }

  componentWillMount() {
    axios.post('/get-lesson', { _id: this.props.match.params.id })
      .then(res => {
        this.setState({ ...res.data });
        axios.post('/get-presentation', { _id: res.data.lesson })
          .then(pres => this.setState({ load: false, lesson: pres.data }));
      });
    socket.emit('join lesson', { _id: this.props.match.params.id });
    socket.on('join lesson', (data) => console.log(data));
    this.getSession();
  }

  render() {
    const { load } = this.state;
    const options = {
      primary: "#fffaaa",
      secondary: "green",
      tertiary: "green",
      quartenary: "blue"
    }
    return !load ? (
      <Grid >
        <Grid.Column width={16}>
          Lessons. {this.state.title}. Invite link: http://localhost:3000/lessons/{this.props.match.params.id} 
        </Grid.Column>
        <Grid.Column width={16}>
          <Spectacle lessonId={this.props.match.params.id} socket={socket} data={{...this.state.lesson, options}} />
        </Grid.Column>
      </Grid>
    ) : <Loader active inline='centered' />
  }
}

export default Lesson;