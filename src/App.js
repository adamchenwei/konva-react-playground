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
      fontSize: 16,
    };
    this.savePosition = this.savePosition.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.restorePosition = this.restorePosition.bind(this);
    this.changeFontSize = this.changeFontSize.bind(this);
    this.saveToJson = this.saveToJson.bind(this);
    this.setMeasurement = this.setMeasurement.bind(this);
    this.zoomer = this.zoomer.bind(this);
    this.restoreZoom = this.restoreZoom.bind(this);
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

  changeFontSize(newSize) {
    this.setState({
      fontSize: newSize,
    });
    setTimeout(() => this.setMeasurement(), 1000);
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
    //NOTE: necessary evil
    //because width state change wont really be detected until x in state is finished changing!!!!
    setTimeout(() => this.setMeasurement(), 1000)
  }
  setMeasurement() {
    console.log(`new height: ${this.textNode.height()}`);
    console.log(`new width: ${this.textNode.getWidth()}`);
    this.setState({
      width: this.textNode.getWidth(),
      height: this.textNode.height(),
    });
  }

  saveToJson() {
    const stage = this.stageNode.getStage();
    const json = stage.toJSON();
    console.log(json);
  }

  restoreZoom() {
    //TODO: I am not sure how it works!
    this.backgroundLayer.x(0);
    this.backgroundLayer.y(0);
    this.backgroundLayer.scale({
        x : this.state.x,
        y : 1
    });
    this.backgroundLayer.draw();
  }

  zoomer(e) {
    //TODO: I am not sure how it works!
    if (!e.target.getStage().getPointerPosition) return;
    console.log(e.target.getStage().getPointerPosition);
    var pos = e.target.getStage().getPointerPosition();
    console.log(pos);
    this.backgroundLayer.x( - (pos.x));
    this.backgroundLayer.y( - (pos.y));
    this.backgroundLayer.draw();
}
  componentDidMount() {
    this.setMeasurement();

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
    const {
      x,
      y,
      savedCoordinates,
      fontSize,
      width,
      height,
      image,
    } = this.state;
    return (
      <div style={{
        display: 'flex'
      }}>
        <div>
          <h1>Something Here</h1>
          <button onClick={this.savePosition}>SavePosition</button>
          <button onClick={this.restorePosition}>restorePosition</button>
          <button onClick={this.setCoordinates}>setCoordinates (restore)</button>
          <button onClick={this.saveToJson}>saveToJson</button>
          <button onClick={() => this.changeFontSize(32)}>changeFontSize</button>
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
              x={x} y={y}
              ref={node => {
                this.groupNode = node;
              }}
            >
              <Text
                ref={node => {
                  this.textNode = node;
                }}
                fontSize={fontSize}
                // width={width}
                //x={10} y={10}
                //padding={16}
                text={`111 1 1 1 1 1x: ${x} y: ${y}`}
                align={'center'}
              />
              <Rect
                  //x={10} y={10}
                  padding={16}
                  width={width} height={height}
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
            onMouseOver={this.zoomer}
            onMouseOut={this.restoreZoom}
          >
            <Image
              // x={10}
              // y={10}
              width={700}
              height={700}
              //image={'postcard-demo/card1.png'}
              image={image}
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
