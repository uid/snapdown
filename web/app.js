import React from "react";
import ReactDOM from "react-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Drawer,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Divider,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { examples } from "./examples";

const drawerWidth = 360;

const styles = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      snapdownText: "",
      created: [],
      testMode: false,
      drawerOpen: true,
    };
  }

  setSnapdownText(newText) {
    this.setState({ snapdownText: newText });
    let baseUrl = window.location.href.split("#")[0];
    window.location.replace(baseUrl + "#" + encodeURIComponent(newText));
    this.redraw("snapWeb", newText);
  }

  redraw(id, newText) {
    this.state.created.map((x) => {
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

  handleDrawerOpen() {
    this.setState({ drawerOpen: true });
  }

  handleDrawerClose() {
    this.setState({ drawerOpen: false });
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
        <AppBar position="static" style={{ marginBottom: "20px" }}>
          <Toolbar>
            <Typography variant="h5" style={{ margin: "10px", flex: 1 }}>
              Snapdown
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => this.handleDrawerOpen()}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ marginLeft: "2%" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              onChange={(event) => {
                this.setSnapdownText(event.target.value);
              }}
              defaultValue={this.state.snapdownText}
              multiline={true}
              variant="outlined"
              style={{ width: "20%" }}
            />
            <div style={{ marginLeft: "2%" }}>
              <script type="application/snapdown" id="snapWeb" />
              {this.state.error && <div>Error occurred.</div>}
            </div>
          </div>
          <br />
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Copy Direct URL
          </Button>
        </div>
        <Drawer
          variant="persistent"
          anchor="right"
          open={this.state.drawerOpen}
        >
          <div style={{ width: drawerWidth }}>
            <div>
              <IconButton onClick={() => this.handleDrawerClose()}>
                <ChevronRightIcon />
              </IconButton>
              <Divider />
            </div>
            <div style={{ margin: "5%" }}>
              Snapdown is a language for <b>drawing</b> snapshot diagrams. Type
              in the text box to start drawing diagrams.
              <br />
              <br />
              Click on the links below to see examples of Snapdown in action!
              <br />
              <br />
              {Object.keys(examples).map((x) => (
                <div>
                  <a
                    href="#"
                    onClick={(e) => {
                      console.log("hi!");
                      this.setSnapdownText(examples[x].snapdown);
                      this.setState({ currentExample: x });
                      e.preventDefault();
                    }}
                  >
                    {examples[x].name}
                  </a>
                  <br />
                  <div
                    style={{
                      marginLeft: "5%",
                      display:
                        x == this.state.currentExample ? "block" : "none",
                    }}
                  >
                    {examples[x].explanation}
                  </div>
                  <Divider />
                  <br />
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<App />, domContainer);
