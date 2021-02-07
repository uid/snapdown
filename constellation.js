let diagram = document.createElement('div');
diagram.id = 'diagram';

let br = document.createElement('br');

let error = document.createElement('font');
error.id = 'error';
error.color = 'red';

[diagram, br, error].forEach(x => {
  document.getElementById('extra').appendChild(x);
});

doc.on('op', () => {
  console.log('test');
  let input = document.getElementById('text').value;
  try {
    Snapdown.renderText(input, 'diagram', (combined) => {
      document.getElementById('diagram').replaceChildren(combined);
    });
  } catch (e) {
    document.getElementById('error').text = e.message;
  }
});

