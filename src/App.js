import React, {Component} from 'react';
//import logo from './logo.svg';
import {
  Layer,
  Rect,
  Stage,
  Group,
  Text,
  Label,
  Image,
} from 'react-konva';
import Konva from 'konva';

class App extends Component {
  constructor() {
    super();
    this.state = {
      width: 200,
      height: 18,
      x: 10,
      y: 10,
    };
    this.savePosition = this.savePosition.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.restorePosition = this.restorePosition.bind(this);
    this.setWidth = this.setWidth.bind(this);
  }

  setCoordinates(event, newX = 10, newY = 10) {
    this.setState({
      x: newX,
      y: newY,
      savedCoordinates: {
        x: newX,
        y: newY,
      },
    });
  }

  restorePosition() {
    this.setState({
      x: this.state.savedCoordinates.x,
      y: this.state.savedCoordinates.y,
    });
  }

  savePosition() {
    const newX = this.groupNode.x();
    const newY = this.groupNode.y();
    console.log(newX, newY);
    console.log(this.groupNode);
    this.setState({
      x: newX,
      y: newY,
      savedCoordinates: {
        x: newX,
        y: newY,
      },
    });
    this.setWidth();
  }
  setWidth() {
    this.setState({
      width: this.textNode.getWidth(),
    });
  }

  componentDidMount() {
    this.setWidth();

    const image = new window.Image();
    //image.src = "http://konvajs.github.io/assets/yoda.jpg";
    image.src = '/empty-canvas.jpg';
    image.onload = () => {
      // setState will redraw layer
      // because "image" property is changed
      this.setState({
        image,
      });
    };
  }

  render() {
    return (
      <div style={{
        display: 'flex'
      }}>
        <div>
          <h1>Something Here</h1>
          <button onClick={this.savePosition}>SavePosition</button>
          <button onClick={this.restorePosition}>restorePosition</button>
          <button onClick={this.setCoordinates}>Toggle X</button>
        </div>
        <div style={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'green',
        }}>
          <Stage
            width={700}
            height={700}
            ref={node => {
              this.stageNode = node;
            }}
          >
          <Layer
            ref={node => {
              this.interactiveLayer = node;
            }}
            moveToBottom={true}
            zIndex={1}
          >
            <Group
              draggable
              x={this.state.x} y={this.state.y}
              ref={node => {
                this.groupNode = node;
              }}
            >
              <Text
                ref={node => {
                  this.textNode = node;
                }}
                //x={10} y={10}
                //padding={16}
                text={`x: ${this.state.x} y: ${this.state.y}`}
                align={'center'}
              />
              <Rect
                  //x={10} y={10}
                  padding={16}
                  width={this.state.width} height={this.state.height}
                  stroke={'black'}
                  strokeWidth={4}
                  dashEnabled
                  dash={[10, 5, 0, 5]}
                  onMouseDown={e => console.log(e)}
              />
            </Group>

          </Layer>
          <Layer
            ref={node => {
              this.backgroundLayer = node;
            }}
          >
            <Image
              // x={10}
              // y={10}
              width={700}
              height={700}
              //image={'postcard-demo/card1.png'}
              image={this.state.image}
              ref={node => {
                this.backgroundImageNode = node;
              }}
            />
          </Layer>
        </Stage>
        </div>
      </div>
    );
  }
}

export default App;
