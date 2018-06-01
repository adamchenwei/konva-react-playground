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

// function from https://stackoverflow.com/a/15832662/512042
function downloadURI(uri, name) {
  var link = window.document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  //delete link;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      width: 200,
      height: 18,
      x: 10,
      y: 10,
      fontSize: 16,
      storedJson: null,
    };
    this.savePosition = this.savePosition.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.restorePosition = this.restorePosition.bind(this);
    this.changeFontSize = this.changeFontSize.bind(this);
    this.saveToJson = this.saveToJson.bind(this);
    this.restoreFormJson = this.restoreFormJson.bind(this);
    this.setMeasurement = this.setMeasurement.bind(this);
    this.zoomer = this.zoomer.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.restoreZoom = this.restoreZoom.bind(this);
    this.downloadURI = this.downloadURI.bind(this);
  }

  downloadURI(uri, name) {
    console.log(uri);
    this.downloadLinkNode.download = name;
    this.downloadLinkNode.href = uri;
    this.downloadLinkNode.click();
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
    console.log('setMeasurement ...')
    console.log(`new height: ${this.textNode.getHeight()}`);
    console.log(`new width: ${this.textNode.getWidth()}`);
    this.setState({
      width: this.textNode.getWidth(),
      height: this.textNode.height(),
    });
  }

  saveToJson() {
    const stage = this.stageNode.getStage();
    const json = stage.toJSON();
    this.setState({
      storedJson: json,
    })
    console.log(json);
  }

  restoreFormJson() {
    console.log(this.state.storedJson);
  }

  restoreZoom() {
    //TODO: I am not sure how it works!
    this.backgroundLayer.x(0);
    this.backgroundLayer.y(0);
    this.backgroundLayer.scale({
        x : 1,
        y : 1
    });
    this.backgroundLayer.draw();

    this.interactiveLayer.x(0);
    this.interactiveLayer.y(0);
    this.interactiveLayer.scale({
        x : 1,
        y : 1
    });
    this.interactiveLayer.draw();
  }

  zoomIn() {
    this.backgroundLayer.scale({
        x : 2,
        y : 2
    });
    this.backgroundLayer.draw();

    this.interactiveLayer.scale({
      x : 2,
      y : 2
  });
  this.interactiveLayer.draw();
  }

  zoomer(e) {
    //console.log('zoomer running')
    //TODO: I am not sure how it works!
    if (!e.target.getStage().getPointerPosition) return;

    const pos = e.target.getStage().getPointerPosition();
    console.log(pos);
    //console.log(pos);
    this.backgroundLayer.x( - (pos.x));
    this.backgroundLayer.y( - (pos.y));
    this.backgroundLayer.draw();

    this.interactiveLayer.x( - (pos.x));
    this.interactiveLayer.y( - (pos.y));
    this.interactiveLayer.draw();
  }

  componentDidMount() {
    this.setMeasurement();

    const image = new window.Image();
    image.setAttribute('crossOrigin', 'anonymous');

    //this will fail if we try to do setAttribute crossOrigin, because the service forced no cross origin
    //but it will show in page if we do not add it, however, the saving of image will FAIL!!!
    image.src = "http://konvajs.github.io/assets/yoda.jpg";

    //interesting that, a relative partial will fail
    //image.src = '/empty-canvas.jpg';

    //this will work
    image.src = 'https://cdn.filestackcontent.com/2VRyfRkCRemINefwVAfs';
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
          <button onClick={this.restoreFormJson}>restoreFormJson</button>
          <button onClick={() => this.changeFontSize(32)}>changeFontSize</button>
          <button onClick={() => {

            const dataURL = this.stageNode.getStage().toDataURL();
            downloadURI(dataURL, 'stage1.png');
          }}>Download Image</button>
          <a ref={node => {
              this.downloadLinkNode = node;
            }} />
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
                fill="rgb(233,12,12)"
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
            // TODO: disable zoom for now
            // onMouseMove={this.zoomer}
            // onMouseOut={this.restoreZoom}
            // onMouseEnter={this.zoomIn}
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
