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

const data = {
  options: {
    primary: "#fffaaa",
    secondary: "green",
    tertiary: "green",
    quartenary: "blue"
  },
  title: 'slide',
  description: 'description',
  slides: [
    {
      name: 'slide 1',
      number: 2,
      data: [
        { type: 'Heading', content: 'my Heading 3', textSize: 28, textAlign: 'left', src: '' },
        { type: 'Image', content: 'my content', textSize: 28, textAlign: 'left', src: 'https://img.gazeta.ru/files3/647/3302647/tj.jpg' },
        { type: 'Text', content: 'my Text', textSize: 12, textAlign: 'left', src: '' },
      ]
    },
    {
      name: 'slide 1',
      number: 0,
      data: [
        { type: 'Heading', content: 'my Heading 1', textSize: 28, textAlign: 'left', src: '' },
        { type: 'Text', content: 'my Text', textSize: 12, textAlign: 'right', src: '' },
        { type: 'Image', content: 'my content', textSize: 28, textAlign: 'left', src: 'https://www.planwallpaper.com/static/images/colorful-nature-wallpaper.jpg' },
      ]
    },
    {
      name: 'slide 1',
      number: 1,
      data: [
        { type: 'Image', content: 'my content ', textSize: 28, textAlign: 'left', src: 'https://img.gazeta.ru/files3/647/3302647/tj.jpg' },
        { type: 'Heading', content: 'my Heading 2', textSize: 28, textAlign: 'center', src: '' },
        { type: 'Text', content: 'my Text', textSize: 28, textAlign: 'left', src: '' },
      ]
    }
  ]
}

class Spectacle extends Component {
  state = {
    activeSlide: 0,
    data: data
  }

  setState(state, callback) {
    this.state = Object.assign({}, this.state, state);
    if (callback) callback();
  }

  theme = createTheme({
    primary: this.state.data.options.primary,
    secondary: this.state.data.options.secondary,
    tertiary: this.state.data.options.tertiary,
    quartenary: this.state.data.options.quartenary
  }, {});

  onActive = (activeIndex) => {
    this.setState({ activeSlide: activeIndex });
  }

  onClick = (e) => {
    e.preventDefault();
    document.getElementById("jump").click();
  }

  slides = () => {
    let template = [];
    if (this.state.data.slides && this.state.data.slides.length > 0) {
      this.state.data.slides.sort(function (a, b) {
        return a.number - b.number;
      });
      this.state.data.slides.map(item => {
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

export default Profile;