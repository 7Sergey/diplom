import React, { Component } from 'react';
import { Grid, Button, Segment } from 'semantic-ui-react';
import {
  Appear,
  BlockQuote,
  Cite,
  CodePane,
  Code,
  Deck,
  Fill,
  Fit,
  Heading,
  Image,
  Layout,
  ListItem,
  List,
  Quote,
  Slide,
  Text,
  Table,
  TableHeader,
  TableRow,
  TableHeaderItem,
  GoToAction,
  TableBody,
  TableItem
} from 'spectacle';
import styled from 'react-emotion';
import createTheme from "spectacle/lib/themes/default";

class Spectacle extends Component {
  state = {
    activeSlide: 0,
  }

  setState(state, callback) {
    this.state = Object.assign({}, this.state, state);
    if (callback) callback();
  }

  theme = createTheme({
    primary: this.props.data.options.primary,
    secondary: this.props.data.options.secondary,
    tertiary: this.props.data.options.tertiary,
    quartenary: this.props.data.options.quartenary
  }, {});

  componentWillMount() {
    this.props.socket.on('active slide', (active) => this.setState({ activeSlide: active }, () => { this.onClick() }));
  }

  onActive = (activeIndex) => {
    this.setState({ activeSlide: activeIndex }, () => this.props.socket.emit('active slide', { _id: this.props.lessonId }, activeIndex+1));
  }

  onClick = () => {
    document.getElementById("jump").click();
  }

  slides = () => {
    let template = [];
    if (this.props.data.slides && this.props.data.slides.length > 0) {
      this.props.data.slides.sort(function (a, b) {
        return a.number - b.number;
      });
      this.props.data.slides.map(item => {
        let slide = [];
        if (item.data && item.data.length > 0) {
          item.data.map(content => {
            switch (content.type) {
              case 'Heading':
                slide.push(<Heading key={slide.length} textSize={content.textSize} textAlign={content.textAlign}>{content.content}</Heading>);
                break;
              case 'Text':
                slide.push(<Text key={slide.length} textSize={content.textSize} textAlign={content.textAlign}>{content.content}</Text>);
                break;
              case 'Image':
                slide.push(<Image key={slide.length} src={content.src} />);
                break;
            }
          });
        }
        template.push(
          <Slide key={template.length} onActive={this.onActive}>
            {slide}
            <GoToAction render={goToSlide => (<Button style={{ visibility: 'hidden' }} id="jump" onClick={() => goToSlide(this.state.activeSlide)} />)} />
          </Slide>
        )
      });
    }
    return template;
  }

  render() {
    return (
      <Segment>
        <Grid stackable centered>
          <Grid.Column width={16} style={{ width: '100vh', height: '80vh' }}>
            <Deck progress='pacman' transition={['spin', 'slide', 'zoom']} theme={this.theme} onChange={this.onActive}>
              {this.slides()}
            </Deck>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}

export default Spectacle;