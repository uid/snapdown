let diagram = document.createElement('div');
diagram.id = 'diagram';

let br = document.createElement('br');

[diagram, br].forEach(x => {
  document.getElementById('extra').appendChild(x);
});

let typingTimer = {};
const FORM_INTERVAL = 2000, DIAGRAM_INTERVAL = 300;

// hack: set global variable of snapdown to this random ID...
Snapdown.setRandomId("TODO is this needed?");

let redrawDiagram = () => {
  let input = doc.data.text;
  let elt = document.createElement("script");
  elt.type = "application/snapdown";
  elt.innerHTML = input;
  let oldChildren = Array.from(diagram.childNodes);
  diagram.replaceChildren(elt);
  try {
    Snapdown.render(elt);
    document.getElementById('error').innerHTML = "";
  } catch (e) {
    diagram.replaceChildren(...oldChildren);
    for (let child of oldChildren) {
      if (child.id.includes("svg")) {
        child.style.opacity = "0.5";
      }
    }
    document.getElementById('error').innerHTML = "Unable to parse Snapdown input.";
  }
}

function snapdownTextboxOnChange() {
  var timeouts = {};
  // timeouts['form'] = {interval: FORM_INTERVAL, function: submitTextToForm};
  if (redrawDiagram) {
    timeouts['diagram'] = {interval: DIAGRAM_INTERVAL, func: redrawDiagram};
  }

  for (const [timeoutId, timeoutInfo] of Object.entries(timeouts)) {
    if (typingTimer[timeoutId]) {
      clearTimeout(typingTimer[timeoutId]);
    }
    typingTimer[timeoutId] = setTimeout(() => timeoutInfo.func(), timeoutInfo.interval);
  }
}

doc.on('load', snapdownTextboxOnChange);

doc.on('op', snapdownTextboxOnChange);
