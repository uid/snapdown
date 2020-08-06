import React from 'react';
import ReactDOM from "react-dom";

import { TextField, Button } from '@material-ui/core';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false, snapdownText: "", created: [], testMode: false };
  }

  redraw(id, newText) {
    this.state.created.map(x => {
      let element = document.getElementById(x);
      if (element) element.remove();
    });
    let created = [];

    let scriptElement = document.getElementById(id);
    scriptElement.text = newText;

    try {
      created = Snapdown.renderAll();
      this.setState({ error: false, created: created });
    } catch (err) {
      this.setState({ error: true, created: created });
    }
  }

  componentDidMount() {
    if (window.location.hash) {
      let snapdownText = decodeURIComponent(window.location.hash.substring(1));
      this.setState({ snapdownText: snapdownText });
      this.redraw("snapWeb", snapdownText);
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
              window.location.replace( baseUrl + '#' + encodeURIComponent(event.target.value) );
              this.redraw("snapWeb", event.target.value);
            }}
            defaultValue={this.state.snapdownText}
            multiline={true}
          />
          <script type="application/snapdown" id="snapWeb" />
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
