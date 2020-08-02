import React from 'react';
import ReactDOM from "react-dom";

import { TextField, Button } from '@material-ui/core';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, snapdownText: "", created: [] };
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

  componentDidMount() {
    if (window.location.hash) {
      let snapdownText = decodeURIComponent(window.location.hash.substring(1));
      this.setState({ snapdownText: snapdownText });
      this.redraw(snapdownText);
    }
  }

  render() {
    return (
      <div>
        <div style={{ "display": "flex", "flexDirection": "row" }}>
          <TextField
            onChange={event => {
              this.setState({ snapdownText: event.target.value });
              let baseUrl = window.location.href.split('#')[0];
              window.location.replace( baseUrl + '#' + event.target.value );
              this.redraw(event.target.value);
            }}
            defaultValue={this.state.snapdownText}
            multiline={true}
          />
          <script type="application/snapdown" />
          {this.state.error && (
            <div>Error occurred.</div>
          )}
        </div>
        <br />
        <Button variant="contained" onClick={() => {
          navigator.clipboard.writeText(window.location.href);
        }}>
          Copy Direct URL
        </Button>
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);
