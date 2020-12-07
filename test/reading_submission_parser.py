import csv
import datetime
import re

preamble = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" href="../docs/snapdown.css">
<script src="https://unpkg.com/js-yaml@3.10.0/dist/js-yaml.js"></script>
<script src="https://unpkg.com/yaml-front-matter@4.0.0/dist/yamlFront.js"></script>
<script src="https://unpkg.com/elkjs@0.6.2/lib/elk-api.js"></script>
<script src="https://github.com/pegjs/pegjs/releases/download/v0.10.0/peg-0.10.0.min.js"></script>
<script src="../web/development.js"></script>
<script src="../src/snapdown.peg.js"></script> <script>Grammar = module.exports</script>
<script src="../src/transformer.js"></script>  <script>Transformer = module.exports</script>
<script src="../src/renderer.js"></script>     <script>Renderer = module.exports</script>
<script src="../web/examples.js"></script>     <script>Examples = module.exports;</script>
<script src="../src/sidebar.js"></script>     <script>Sidebar = module.exports</script>
<script src="../src/index.js"></script>        <script>Snapdown = module.exports</script>
<script>ELK_WORKER_URL = "https://unpkg.com/elkjs@0.6.2/lib/elk-worker.js";</script>
</head>
<body>
"""

conclusion = """<script>
Snapdown.renderAll(false);
</script>
</body>
</html>
"""

regexes = {
    "row": r"(?=(.|\r|\n)*row\s*-+>\s*\(\(?\s*Concat)(?=(.|\r|\n)*first\s*-+>)(?=(.|\r|\n)*\(\(?\s*Rest(.|\r|\n)*-+>\s*0*(\.0*)?(.|\r|\n)*\)\)?)(?=(.|\r|\n)*second\s*-+>\s*(#note|\(\(?\s*Note))(.|\r|\n)*",
    "twoNotes": r"(?=(.|\r|\n)*second\s*-+>(.|\r|\n)*second\s*-+>)(?=(.|\r|\n)*first\s*-+>(.|\r|\n)*first\s*-+>)(?=(.|\r|\n)*\(\(?\s*Concat(.|\r|\n)*\(\(?\s*Concat)(?=(.|\r|\n)*\(\(?\s*Note(.|\r|\n)*\(\(?\s*Note)(?=(.|\r|\n)*\(\(?\s*Rest)(.|\r|\n)*"
}

exact_solutions = {
    "row": "row -> (\nConcat\nfirst -> (Rest duration -> 0)\nsecond -> #note\n)\n\n#note -> (\nNote\nduration -> 1.0\npitch -> (Pitch value -> 0) // middle C\ninstrument -> (Instrument `PIANO`)\n)",
    "twoNotes": "twoNotes -> (\nConcat\nfirst -> #firstNote\nsecond -> (Note \"D\")\n)\n#firstNote -> (\nConcat\nfirst -> (Rest)\nsecond -> (Note \"C\")\n)"
}

html = preamble

omni_data = list(csv.reader(open("omni.csv")))
sheet_data = list(csv.reader(open("sheet.csv")))

by_id = {}
by_id_help = {}

exercise_col = 1
id_col = 2
text_col = 3
feedback_col = 4

recent_text = ""
recent_id = ""
for row in sheet_data:
    if row[0] == "Timestamp":
        continue
    if not row[text_col]:
        by_id_help[row[id_col]] = by_id_help.get(row[id_col], 0) + 1
        continue
    by_id[row[id_col]] = by_id.get(row[id_col], [])
    if row[text_col] == recent_text and row[id_col] == recent_id and len(by_id[row[id_col]]):
        by_id[row[id_col]].pop()
    by_id[row[id_col]].append({"exercise": row[exercise_col], "text": row[text_col], "feedback": row[feedback_col]})

    recent_text = row[text_col]
    recent_id = row[id_col]

asdf = []

for key in by_id:
    asdf.append(by_id_help.get(key, 0))
    html += f"<h2>{key}</h2>\n<table><tr>"
    for item in by_id[key]:
        color = "#DFFFFF" if re.fullmatch(regexes[item['exercise']], item['text']) else "#FFDFFF"
        html += f"<td style=\"background-color: {color};\">{item['exercise']}</td>"
    html += "</tr><tr>"
    for item in by_id[key]:
        html += f"<td style=\"min-width: 200px;\">{item['feedback']}</td>"
    html += "</tr><tr>"
    html += f"<b>{by_id_help.get(key, 0)} help sidebar sections opened</b>"
    html += "</tr></table>\n"

html += conclusion

with open("reading-27-submissions.html", "w") as f:
    f.write(f"<b>on average: {sum(asdf)/len(asdf)} sidebar help sections opened</b><br /><br />" + html)
    f.close()

