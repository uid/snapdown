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
<div style="display: flex; flex-direction: row;">
<span style='border:1px solid black; width: 50%; font-family: monospace; font-size: 12px;'>${examples[
      x
    ].snapdown.replace(/(?:\r\n|\r|\n)/g, "<br />")}</span>
<script type="application/snapdown" id="example2" class="no-markdown">
${examples[x].snapdown}
</script>
</div>
</div>
</div>
`
  )
  .join("<br />");

const sidebarHTML = `
<div id="snapdownHelp" class="hidenav">
<div><a href="#" onclick="Snapdown.hideHelp(); return false;"><b>&gt; hide Snapdown help</b></a></div>
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
