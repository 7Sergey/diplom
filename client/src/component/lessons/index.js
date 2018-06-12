import React, { Component } from 'react';
import { Grid, Form, Message, Input, Button, Modal, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

class CreateLesson extends Component {
  state = {
    title: '',
    description: '',
    lesson: '',
    options: [],
    msg: ''
  }

  loadPres = (id) => {
    axios.post('/user-presentation', { _id: id }).then(res => {
      let options = [];
      if(res.data && res.data.length > 0) {
        res.data.map(item => {
          options.push({value: item._id, text: item.title});
        });
        this.setState({...this.state, options})
      }
    });
  }

  onChange = (value, field) => this.setState({ [field]: value });

  createLesson = (e) => {
    e.preventDefault();
    const data = {
      title: this.state.title,
      description: this.state.description,
      userId: this.props.userId,
      users: [this.props.userId],
      lesson: this.state.lesson
    }
    if (data.title && data.lesson) {
      this.setState({ msg: '' });
      axios.post('/new-lesson', data)
        .then(response => { this.setState({ open: false }); this.props.load(this.props.userId) })
        .catch(err => { console.log(err) })
    } else {
      this.setState({ msg: 'Invalid title and select presentation' })
    }
  }

  openModal = (e) => {
    e.preventDefault();
    this.setState({ open: true });
    this.loadPres(this.props.userId);
  }

  closeModal = (e) => {
    e.preventDefault();
    this.setState({ open: false })
  }

  render() {
    const { title, description, msg, open, lesson, options } = this.state;
    const modal = {
      marginTop: '!important',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
    return (
      <Modal style={modal} open={open} onClose={this.closeModal} trigger={<Button onClick={this.openModal}>Create new lesson</Button>}>
        <Modal.Content>
          {
            msg ? <Message color='red'>{msg}</Message> : null
          }
          <Form>
            <Form.Field>
              <label>Lesson title</label>
              <Input
                value={title}
                fluid
                name='title'
                placeholder='title'
                type='text'
                onChange={(e, { value, name }) => this.onChange(value, name)}
              />
            </Form.Field>
            <Form.Field>
              <label>Lesson description</label>
              <Input
                value={description}
                fluid
                name='description'
                placeholder='description'
                type='text'
                onChange={(e, { value, name }) => this.onChange(value, name)}
              />
            </Form.Field>
            <Form.Field>
              <label>Select presentation</label>
              <Dropdown 
                value={lesson} 
                placeholder='Select lesson' 
                name='lesson' 
                search 
                selection 
                options={options} 
                onChange={(e, { value, name }) => this.onChange(value, name)} 
              />
            </Form.Field>
            <Button type='submit' onClick={this.createLesson}>Create</Button>
          </Form>

        </Modal.Content>
      </Modal>
    )
  }
}

class Lessons extends Component {
  state = {}

  componentWillMount() {
    axios.get('/session').then(res => {
      this.setState({ ...this.state, ...res.data });
      this.load(res.data._id);
    });
  }

  load = (id) => {
    axios.post('/user-lesson', { users: { $in: [this.state._id] } }).then(res => {
      this.setState({ mySpectacle: res.data });
    });
  }

  openLesson = (id) => {
    this.props.history.push(`/lessons/${id}`);
  }

  lessons = () => {
    let template = [];
    if(this.state.mySpectacle && this.state.mySpectacle.length > 0) {
      this.state.mySpectacle.map((item, index) => {
        template.push(
          <Grid.Column width={16} key={index}>
            <Message
              // onDismiss={this.handleDismiss}
              header={item.title}
              content={<Grid><Grid.Column floated='left' width={16}>{item.description}</Grid.Column></Grid>}
              onClick={() => this.openLesson(item._id)}
            />
          </Grid.Column>
        );
      });
    }
    return template;
  }

  render() {
    console.log(this.props);
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <CreateLesson load={this.load} userId={this.state._id} />
          </Grid.Column>
        </Grid.Row>
        {this.lessons()}
      </Grid>
    )
  }
}

export default Lessons;