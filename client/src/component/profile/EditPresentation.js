import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Button, Loader, Input, Segment, TextArea, Dropdown } from 'semantic-ui-react';

const options = [
  { key: 'Text', value: 'Text', text: 'Text' },
  { key: 'Image', value: 'Image', text: 'Image' },
  { key: 'Heading', value: 'Heading', text: 'Heading' }
];

const optionsAlign = [
  { key: 'left', value: 'left', text: 'left' },
  { key: 'right', value: 'right', text: 'right' },
  { key: 'center', value: 'center', text: 'center' }
];

class EditPresentation extends Component {
  state = {
    load: true,
  }

  componentWillMount() {
    axios.post('/get-presentation', { _id: this.props.match.params.id })
      .then(res => this.setState({ load: false, ...res.data }));
  }

  save = (e) => {
    e.preventDefault();
    console.log('save');
    axios.post('/save-presentation', { _id: this.state._id, slides: this.state.slides }).then(res => console.log(res))
  }

  onChange = (value, field, index) => {
    let slides = this.state.slides;
    slides[index][field] = value;
    this.setState({ ...this.state, slides });
  }

  onChangeElem = (value, field, index, indexSlide) => {
    let slides = this.state.slides;
    slides[indexSlide].data[index][field] = value;
    this.setState({ ...this.state, slides });
  }

  removeElem = (e, index, indexSlide) => {
    e.preventDefault();
    let slides = this.state.slides;
    slides[indexSlide].data.splice(index, 1);
    this.setState({ ...this.state, slides });
  }

  addElem = (e, indexSlide) => {
    e.preventDefault();
    let slides = this.state.slides;
    slides[indexSlide].data.push({
      content: '',
      src: '',
      textAlign: 'center',
      textSize: 18,
      type: 'Text'
    });
    this.setState({ ...this.state, slides });
  }

  elementsSlide = (elements, indexSlide) => {
    let template = [];
    if (elements && elements.length > 0) {
      elements.map((elem, index) => {
        template.push(
          <Grid stackable key={index}>
            <Grid.Row>
              <Grid.Column floated='left' width={3}>
                <Button floated='left' size='mini' content='remove element' icon='remove' fluid color='red' onClick={(e) => this.removeElem(e, index, indexSlide)} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <TextArea value={elem.content} name='content' placeholder='Content slide' onChange={(e, { value, name }) => this.onChangeElem(value, name, index, indexSlide)} />
              </Grid.Column>
              <Grid.Column width={8}>
                <label>Type</label><br />
                <Dropdown value={elem.type} placeholder='Select Country' name='type' search selection options={options} onChange={(e, { value, name }) => this.onChangeElem(value, name, index, indexSlide)} />
              </Grid.Column>
              <Grid.Column width={8}>
                <label>Align</label><br />
                <Dropdown value={elem.textAlign} placeholder='Select align' name='textAlign' search selection options={optionsAlign} onChange={(e, { value, name }) => this.onChangeElem(value, name, index, indexSlide)} />
              </Grid.Column>
              <Grid.Column width={8}>
                <label>Size</label><br />
                <Input type='number' name='textSize' value={elem.textSize} onChange={(e, { value, name }) => this.onChangeElem(value, name, index, indexSlide)} />
              </Grid.Column>
              {elem.type == 'Image' ? <Grid.Column width={16}>
                <label>ImageUrl</label><br />
                <Input fluid type='text' name='src' value={elem.src} onChange={(e, { value, name }) => this.onChangeElem(value, name, index, indexSlide)} />
              </Grid.Column> : null}
              <Grid.Column width={16}>
                <hr />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
      })
    }
    return template;
  }

  removeSlide = (e, index) => {
    e.preventDefault();
    let slides = this.state.slides;
    slides.splice(index, 1);
    this.setState({ ...this.state, slides });
  }

  addSlide = (e) => {
    e.preventDefault();
    let slides = this.state.slides;
    slides.push({
      number: slides.length,
      name: '',
      description: '',
      data: []
    });
    this.setState({ ...this.state, slides });
  }

  slides = () => {
    let template = [];
    if (this.state.slides && this.state.slides.length > 0) {
      this.state.slides.map((item, index) => {
        template.push(
          <Segment key={index}>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={4}>
                  <label>Slide name</label><br />
                  <Input fluid value={item.name} name='name' placeholder='Name slide' onChange={(e, { value, name }) => this.onChange(value, name, index)} />
                </Grid.Column>
                <Grid.Column width={4}>
                  <label>Slide order</label><br />
                  <Input fluid type='number' value={item.number} name='number' placeholder='number slide' onChange={(e, { value, name }) => this.onChange(+value, name, index)} />
                </Grid.Column>
                <Grid.Column floated='right' width={3}>
                  <Button size='mini' icon='remove' content='remove slide' fluid color='red' onClick={(e) => this.removeSlide(e, index)} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={15}>
                  Elements
                </Grid.Column>
                <Grid.Column floated='right' width={3}>
                  <Button content='Add Element' size='mini' icon='add' fluid color='green' onClick={(e) => this.addElem(e, index)} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  {this.elementsSlide(item.data, index)}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        );
      })
    }
    return template;
  }

  render() {
    const { load } = this.state;
    return !load ? (
      <Grid stackable centered>
        <Grid.Row>
          <Grid.Column floated='right' width={3}>
            <Button content='add slide' size='mini' icon='add' fluid color='green' onClick={(e) => this.addSlide(e)} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            Slides
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.slides()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column floated='left' width={3}>
            <Button floated='left' color='green' onClick={this.save} content='Save Presentation' />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : <Loader active inline='centered' />
  }
}

export default EditPresentation;