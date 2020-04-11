import React, { Component } from 'react';
import './App.css';
import DrawingForm from './DrawingForm';
import DrawingList from './DrawingList';
import Drawing from './Drawing';

class App extends Component {
  state = {};

  selectDrawing = (drawing) => {
    this.setState({
      selectedDrawing: drawing,
    });
  };

  render() {
    let ctrl = (
      <div>
        <DrawingForm />
        <DrawingList selectDrawing={this.selectDrawing} />
      </div>
    );

    if (this.state.selectedDrawing) {
      ctrl = (
        <Drawing
          drawing={this.state.selectedDrawing}
          key={this.state.selectedDrawing.id}
        ></Drawing>
      );
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>Our awesome drawing app</h2>
          {ctrl}
        </div>
      </div>
    );
  }
}

export default App;
