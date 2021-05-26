let diagram = document.createElement('div');
diagram.id = 'diagram';

let br = document.createElement('br');

[diagram, br].forEach(x => {
  document.getElementById('extra').appendChild(x);
});

let typingTimer = {};
const FORM_INTERVAL = 2000, DIAGRAM_INTERVAL = 300;

let redrawDiagram = () => {
  let input = doc.data.text;
  let elt = document.createElement("script");
  elt.type = "application/snapdown";
  elt.innerHTML = input;
  let oldChildren = Array.from(diagram.childNodes);
  replaceChildren(diagram, [elt]);

  try {
    Snapdown.render(elt);
    document.getElementById('snap-error').style.display = 'none';
  } catch (e) {
    replaceChildren(diagram, oldChildren);
    for (let child of oldChildren) {
      if (child.id.includes("svg")) {
        child.style.opacity = "0.5";
      }
    }
    document.getElementById('snap-error').style.display = 'block';
  }
}

function replaceChildren(elt, children) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
  children.forEach(child => elt.appendChild(child));
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

doc.on('load', () => {
  snapdownTextboxOnChange();

  let extra = document.getElementById('extra');
  let errorElt = document.createElement('div');
  errorElt.className = document.getElementById('error').className;
  errorElt.id = 'snap-error';
  errorElt.innerHTML = "<b>Error:</b> Unable to parse Snapdown input.";
  errorElt.style.display = 'none';

  document.body.insertAdjacentHTML("afterbegin", `<div id="snapdownHelpLocation"></div>`);
  extra.insertAdjacentHTML("afterbegin", `<p class="no-markdown"><a href="#" onclick="Snapdown.showHelp(); return false;" id="showSnapdownHelp"><strong>Click to show Snapdown help sidebar</strong></a></p>`);
  extra.insertAdjacentElement("beforeend", errorElt);

  Snapdown.populateHelp("snapdownHelpLocation");
  Snapdown.renderAll();
});

doc.on('op', snapdownTextboxOnChange);

const initialDiagrams = {
  'ic05-git-snapshot': [
    '// Imagine we\'re implementing Git in Java, so we have types like Commit, Tree, etc.',
    '// Just draw the pink commit and the objects it directly points to',
    '',
    '((Commit',
    '  id => (TODO)',
    '  // TODO: more fields',
    '))',
  ].join('\n'),
  'ic15-equality': [
    '// After you\'ve drawn the diagram, answer these questions:',
    '',
    '// How many arrows are in your snapshot diagram? ________',
    '// How many objects are in your snapshot diagram? ________',
    '',
    'seg -> (',
    'Stroke',
    ')',
    '',
    '// you\'ll need these to represent Stroke',
    '// (make sure to also show the rep of Point)',
    '',
    '(Point)',
    '(Color `BLACK`)'
  ].join('\n')
};

doc.on('create', function(local) {
  console.warn('create', local);
  if ( ! local) { return; }
  var text = initialDiagrams[doc.data.project] || '';
  document.getElementById('text').value = text;
  doc.submitOp({ p: [ 'text' ], od: doc.data.text, oi: text });
});
