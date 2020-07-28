import React from 'react';
import ReactDOM from "react-dom";

import { TextField } from '@material-ui/core';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, created: [] };
  }

  redraw(newText) {
    this.state.created.map(x => {
      let element = document.getElementById(x);
      if (element) element.remove();
    });
    let created = [];

    const scriptSelector = 'script[type="application/snapdown"]';
    let scriptElement = document.querySelector(scriptSelector);
    console.log(scriptElement);
    scriptElement.text = newText;
    console.log(newText);

    try {
      created = Snapdown.renderAll();
      console.log(created);
      this.setState({ error: false, created: created });
    } catch (err) {
      console.log(err);
      this.setState({ error: true, created: created });
    }
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
        {this.state.error && (
          <div>Error occurred.</div>
        )}
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);
