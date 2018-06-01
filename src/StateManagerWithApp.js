
import React, {Component} from 'react';
import App from './App-bkup';

class StateManagerWithApp extends Component {
  constructor() {
    super();
    this.state = {
      savedCoordinates: null,
      width: 200,
      height: 18,
      x: 10,
      y: 10,
      fontSize: 16,
      storedJson: null,
    }
    this.changeFontSize = this.changeFontSize.bind(this);
  }


  changeFontSize(newSize) {
    this.setState({
      fontSize: newSize,
    });
    setTimeout(() => this.setMeasurement(), 1000);
  }

  render() {
    const {
      x,
      y,
      savedCoordinates,
      fontSize,
      width,
      height,
    } = this.state;
    return (
      <App
        x={x}
        y={y}
        savedCoordinates={savedCoordinates}
        fontSize={fontSize}
        width={width}
        height={height}
        changeFontSize={this.changeFontSize}
      />
    )
  }
}
export default StateManagerWithApp;