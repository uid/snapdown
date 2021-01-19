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
import FileCopyIcon from "@material-ui/icons/FileCopy";

import ReactHtmlParser from "react-html-parser";
import { svgAsPngUri } from "save-svg-as-png";

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
      created: {},
      testMode: false,
      drawerOpen: true,
      label: "Type Snapdown here",
      fileName: "diagram.svg",
    };
    this.timeout = 0;
  }

  getSVGElement() {
    let elem = document.querySelector('[id^="snapWeb-json-"][id*="-svg-"]');
    if (elem) {
      ["xmlns", "xmlns:svg", "xmlns:se"].forEach((x) => {
        elem.setAttribute(x, "http://www.w3.org/2000/svg");
      });
    }
    return elem;
  }

  downloadSVG() {
    const element = document.createElement("a");
    const html = this.getSVGElement().outerHTML;
    const file = new Blob([html], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = this.state.fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  setSnapdownText(field, newText) {
    let snapdownText = Object.assign({}, this.state.snapdownText);
    snapdownText[field] = newText;
    this.setState({ snapdownText: snapdownText, rendered: false }, () =>
      this.redraw(field, newText)
    );

    if (field == "snapWeb") {
      let baseUrl = window.location.href.split("#")[0];
      window.location.replace(baseUrl + "#" + encodeURIComponent(newText));
    }
  }

  getHTMLElement(field) {
    return `<script type="application/snapdown">\n${this.state.snapdownText[field]}\n</script>`;
  }

  redraw(id, newText) {
    let toRemove = [];
    Object.keys(this.state.created).map((x) => {
      if (x == id) {
        this.state.created[x].map((y) => {
          let element = document.getElementById(y);
          if (element) toRemove.push(element);
        });
      }
    });

    let scriptElement = document.getElementById(id);
    scriptElement.text = newText;

    let error = Object.assign({}, this.state.error);
    let created = Object.assign({}, this.state.created);

    try {
      for (var x of toRemove) x.remove();
      created[id] = Snapdown.render(scriptElement, () =>
        this.setState({ rendered: true })
      );
      error[id] = false;
      this.setState({ error: error, created: created });
    } catch (err) {
      error[id] = true;
      this.setState({ error: error, created: created });
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
      this.setState(
        { snapdownText: { snapWeb: snapdownText }, rendered: false },
        () => this.redraw("snapWeb", snapdownText)
      );
    }
  }

  render() {
    let boxes = {
      snapWeb: {
        color: "transparent",
        display: "block",
        margin: "0px",
        disabled: false,
        label: this.state.label,
      },
      snapExample: {
        color: "#DFDFDF",
        display: "block",
        margin: "10px",
        disabled: true,
        label: "",
      },
    };
    if (!this.state.currentExample) {
      boxes.snapExample.display = "none";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const instructorMode = urlParams.get("mode") === "instructor";
    const png = urlParams.get("png") === "";

    let textFieldStyle = { width: instructorMode ? "40%" : "20%" };
    if (instructorMode) {
      textFieldStyle["height"] = "100%";
    }

    if (png) {
      let svgElement = this.getSVGElement();
      if (svgElement) {
        svgAsPngUri(svgElement).then((uri) => {
          this.setState({ uri: uri });
        });
      }
    }

    if (this.state.uri) {
      return <img src={this.state.uri} />;
    } else if (png) {
      return (
        <div style={{ marginLeft: "2%" }}>
          <script type="application/snapdown" id={"snapWeb"} />
        </div>
      );
    }

    return (
      <div>
        {!instructorMode && (
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
        )}
        <div
          style={Object.assign(
            { marginLeft: "2%" },
            instructorMode ? { marginTop: "2%" } : {}
          )}
        >
          {Object.keys(boxes).map((x) => (
            <div
              style={{
                display: boxes[x].display,
                backgroundColor: boxes[x].color,
                margin: boxes[x].margin,
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  onChange={(event) => {
                    let snapdownText = event.target.value;
                    if (this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                      this.setSnapdownText(x, snapdownText);
                    }, 300);
                    this.setState({ label: null });
                  }}
                  defaultValue={this.state.snapdownText[x]}
                  multiline={true}
                  variant="outlined"
                  style={Object.assign(textFieldStyle, {
                    margin: boxes[x].margin,
                  })}
                  disabled={boxes[x].disabled}
                  InputProps={{ style: { color: "black" } }}
                  label={boxes[x].label}
                  error={this.state.error[x]}
                  helperText={
                    this.state.error[x] ? "Unable to parse Snapdown input." : ""
                  }
                />
                <IconButton
                  color="primary"
                  style={{ height: "100%" }}
                  onClick={() => {
                    navigator.clipboard.writeText(this.state.snapdownText[x]);
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
                <div style={{ marginLeft: "2%" }}>
                  <script type="application/snapdown" id={x} />
                </div>
              </div>
              <br />
            </div>
          ))}
          {!instructorMode && (
            <div>
              <Button
                variant="contained"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                Copy Direct URL
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  navigator.clipboard.writeText(this.getHTMLElement("snapWeb"));
                }}
              >
                Copy HTML Element
              </Button>
              <br />
              <br />
              <Button variant="contained" onClick={this.downloadSVG.bind(this)}>
                Export to SVG
              </Button>
              <TextField
                onChange={(event) =>
                  this.setState({ fileName: event.target.value })
                }
                defaultValue={"diagram.svg"}
                variant="outlined"
                label={"File Name"}
                style={{ marginLeft: "20px" }}
              />
            </div>
          )}
        </div>
        {!instructorMode && (
          <Drawer
            variant="persistent"
            anchor="right"
            open={this.state.drawerOpen}
          >
            <div style={{ width: drawerWidth }}>
              <div>
                <IconButton onClick={() => this.handleDrawerClose()}>
                  <ChevronRightIcon />
                  <small>hide</small>
                </IconButton>
                <Divider />
              </div>
              <div style={{ margin: "5%" }}>
                Snapdown is a language for <b>drawing</b> snapshot diagrams.
                Type in the text box to start drawing diagrams.
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
                        if (x == this.state.currentExample) {
                          this.setState({ currentExample: null });
                        } else {
                          this.setSnapdownText(
                            "snapExample",
                            examples[x].snapdown
                          );
                          this.setState({ currentExample: x });
                        }
                        e.preventDefault();
                      }}
                    >
                      {ReactHtmlParser(examples[x].name)}
                    </a>
                    {x == this.state.currentExample && (
                      <font color="gray">&nbsp;(click again to hide)</font>
                    )}
                    <br />
                    <div
                      style={{
                        marginLeft: "5%",
                        display:
                          x == this.state.currentExample ? "block" : "none",
                      }}
                    >
                      {ReactHtmlParser(examples[x].explanation)}
                    </div>
                    <Divider />
                    <br />
                  </div>
                ))}
              </div>
            </div>
          </Drawer>
        )}
      </div>
    );
  }
}

const domContainer = document.querySelector("#app");
ReactDOM.render(<App />, domContainer);
