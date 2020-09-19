const { examples } = require("../web/examples");

const examplesHTML = Object.keys(examples)
  .map(
    (x) => `
<div>
<a href="#" onclick="Snapdown.showExample('${x}'); return false;">${
      examples[x].name
    }</a>
<div id="${x}-helptext" style="display: inline-block;">(click to expand)</div>
<div id="${x}-content" style="display: none;">
<div>${examples[x].explanation}</div>
<br />
<table style="width:100%"><tr><td width="50%">
<span style='width: 50%; font-family: monospace; font-size: 12px;'>${examples[
      x
    ].snapdown.replace(/(?:\r\n|\r|\n)/g, "<br />")}</span>
</td><td>
<script type="application/snapdown" id="example2" class="no-markdown" percentSize="${
      examples[x].percentSize
    }">
${examples[x].snapdown}
</script>
</td>
</tr>
</table>
</div>
</div>
`
  )
  .join("<br />");

const sidebarHTML = `
<style>
@keyframes slidein {
  from {
    left: 100%;
    width: 30%; 
  }

  to {
    left: 70%;
    width: 30%;
  }
}

@keyframes slideout {
  from {
    left: 70%;
    width: 30%; 
  }

  to {
    left: 100%;
    width: 30%;
  }
}

.sidenav {
  height: 100%; /* 100% Full-height */
  width: 30%; /* 30% width */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 70%;
  background-color: #EFEFEF;
  overflow-x: hidden; /* Disable horizontal scroll */
  animation-duration: 1s;
  animation-name: slidein;
}

.hidenav {
  height: 100%; /* 100% Full-height */
  width: 30%; /* 30% width */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 100%;
  background-color: #EFEFEF;
  overflow-x: hidden; /* Disable horizontal scroll */
  animation-duration: 1s;
  animation-name: slideout;
}

.hidden {
  display: none;
}
</style>

<div id="snapdownHelp" class="hidden">
<div style="width: 100%; position: fixed; padding: 20px; z-index: 2; background-color: #DFDFDF;">
<a href="#" onclick="Snapdown.hideHelp(); return false;"><b>&gt; hide Snapdown help</b></a>
</div>
<br />
<br />
<div style="padding: 20px;">
<br />
Snapdown is a language for <b>drawing</b> snapshot diagrams.
<br />
<br />
Click on the links below to see examples of Snapdown in action!
<br />
In each example, you'll see a snippet of <b>Snapdown syntax</b> and the <b>corresponding diagram</b> side-by-side.
<br />
<br />
${examplesHTML}
</div>
`;

module.exports = { sidebarHTML };
