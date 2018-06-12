import React, { Component } from 'react';
import { Grid, Card, Modal, Message, Form, Input, Button, Label } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';

class CreatePresentation extends Component {
  state = {
    title: '',
    description: '',
    msg: ''
  }
  onChange = (value, field) => this.setState({ [field]: value })
  createPresentation = (e) => {
    e.preventDefault();
    const data = {
      title: this.state.title,
      description: this.state.description,
      userId: this.props.userId,
    }
    if (data.title) {
      this.setState({ msg: '' })
      axios.post('/new-presentation', data)
        .then(response => { this.setState({ open: false }); this.props.load(this.props.userId) })
        .catch(err => { console.log(err) })
    } else {
      this.setState({ msg: 'Invalid title' })
    }
  }
  openModal = (e) => {
    e.preventDefault();
    this.setState({ open: true })
  }
  closeModal = (e) => {
    e.preventDefault();
    this.setState({ open: false })
  }
  render() {
    const { title, description, msg, open } = this.state;
    const modal = {
      marginTop: '!important',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
    return (
      <Modal style={modal} open={open} onClose={this.closeModal} trigger={<Button onClick={this.openModal}>Create new presentation</Button>}>
        <Modal.Content>
          {
            msg ? <Message color='red'>{msg}</Message> : null
          }
          <Form>
            <Form.Field>
              <label>Presentation title</label>
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
              <label>Presentation description</label>
              <Input
                value={description}
                fluid
                name='description'
                placeholder='description'
                type='text'
                onChange={(e, { value, name }) => this.onChange(value, name)}
              />
            </Form.Field>
            <Button type='submit' onClick={this.createPresentation}>Create</Button>
          </Form>

        </Modal.Content>
      </Modal>
    )
  }
}

class Profile extends Component {
  state = {
    mySpectacle: []
  }

  componentWillMount() {
    axios.get('/session').then(res => {
      this.setState({ ...this.state, ...res.data });
      this.load(res.data._id);
    });
  }

  onClick = (id) => {
    this.props.history.push(`/profile/${id}`);
  }

  load = (id) => {
    axios.post('/user-presentation', { _id: id }).then(res => {
      this.setState({ mySpectacle: res.data });
    });
  }

  removePresentation = (e, id) => {
    e.preventDefault();
    axios.post('/remove-presentation', { _id: id }).then(res => {
      this.load(this.state._id);
    });
  }
  mySpectacle = () => {
    let template = [];
    if (this.state.mySpectacle && this.state.mySpectacle.length > 0) {
      this.state.mySpectacle.map(item => {
        template.push(
          <Card link key={template.length}>
            <Card.Content onClick={(e, data) => this.onClick(item._id)}>
              <Card.Header>{item.title}</Card.Header>
              <Card.Meta>
                <span className='date'>{moment(item.createdAt).format('lll')}</span>
              </Card.Meta>
              <Card.Description>{item.description}</Card.Description>
            </Card.Content>
            <Button size='mini' floated='right' color='red' icon='remove' onClick={(e) => this.removePresentation(e,item._id)}/>
          </Card>
        );
      })
    }
    return template;
  }

  render() {
    return (
      <Grid stackable>
        <Grid.Column width={16}>
          <CreatePresentation load={this.load} userId={this.state._id} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={6}>
            {this.mySpectacle()}
          </Card.Group>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Profile;