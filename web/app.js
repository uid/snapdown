import React from 'react';
import ReactDOM from "react-dom";

import { TextField } from '@material-ui/core';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  redraw(newText) {
    const scriptSelector = 'script[type="application/snapdown"]';
    let scriptElement = document.querySelector(scriptSelector);
    console.log(scriptElement);
    scriptElement.text = newText;
    console.log(newText);

    Snapdown.renderAll();
  }

  render() {
    return (
      <div style={{ "display": "flex", "flexDirection": "row" }}>
        <TextField
          onChange={event => {
            this.redraw(event.target.value);
          }}
          multiline={true}
        />
        <script type="application/snapdown" />
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);