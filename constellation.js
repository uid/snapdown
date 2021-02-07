let diagram = document.createElement('div');
diagram.id = 'diagram';

let br = document.createElement('br');

[diagram, br].forEach(x => {
  document.getElementById('extra').appendChild(x);
});

doc.on('op', () => {
  let input = document.getElementById('text').value;
  let elt = document.createElement("script");
  elt.type = "application/snapdown";
  elt.innerHTML = input;
  diagram.replaceChildren(elt);
  try {
    Snapdown.render(elt);
  } catch (e) {
    document.getElementById('error').innerHTML = "Unable to parse Snapdown input.";
  }
});
