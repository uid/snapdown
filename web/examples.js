"use strict";

const examples = {
  primitives: {
    name: "Primitives",
    snapdown: 'i -> 5\ns -> "abc"',
    explanation:
      'In this example, we have two variables: \
                  <tt>i</tt> points to the value <tt>5</tt>, and <tt>s</tt> points to the value <tt>"abc"</tt>.',
    percentSize: "100",
  },
  objects: {
    name: "Objects",
    snapdown: 'f -> (MyFloat 5.0)\ns -> (MyString "abc")',
    explanation:
      'In this example, <tt>f</tt> points to a <tt>MyFloat</tt> object with the value <tt>5.0</tt>, \
                  <tt>s</tt> points to a <tt>MyString</tt> object with the value <tt>"abc"</tt>.',
    percentSize: "80",
  },
  fields: {
    name: "Fields",
    snapdown:
      "lst -> (\nArrayList\n0 -> 1000\n1 -> 2000\n2 -> 3000\nlength -> 3\n)",
    explanation:
      "Here we have a variable <tt>lst</tt> pointing to an <tt>ArrayList</tt> with three fields representing the elements, \
                  and a fourth field representing the length. \
                  (Note that Java, or another programming language, may not actually represent the list this way -- \
                  Snapdown is purely a drawing tool that can get us any representation we wish.)",
    percentSize: "80",
  },
  stackframes: {
    name: "Stack frames",
    snapdown:
      'main() {\ns -> (\nSemester\nseason -> (String "Fall")\n)\nseason2 -> season\n}\nt -> s',
    explanation:
      "This example shows a function <tt>main()</tt> with local variables <tt>s</tt> and <tt>season2</tt>.",
    percentSize: "70",
  },
  literals: {
    name: "Literals",
    snapdown:
      "(\nMyLine\nstart -> `(10, 10)`\nend -> `(20, 20)`\nc -> (Color `GREEN`)\n)",
    explanation:
      "In this example, we have a <tt>MyLine</tt> with three fields. The <tt>start</tt> and <tt>end</tt> fields \
                  are best expressed as pairs of numbers. We can use backticks `` to display the text \
                  <tt>(10, 10)</tt> verbatim. We can represent the <tt>GREEN</tt> color in a similar fashion.",
    percentSize: "100",
  },
  mapfields: {
    name: "Map fields",
    snapdown:
      's -> (String "value")\nm -> (\nHashMap\n(String "key") = s\n)\nm2 -> (\nHashMap\n(String "otherKey") = s\n)',
    explanation:
      "In this example, we have two maps, each with a single key, and both with the same single value.",
    percentSize: "80",
  },
  immutable: {
    name: "Immutability",
    snapdown: "a => (\nMyClass\nb -> ((MyImmutableClass))\n)",
    explanation:
      "Note the double-lined arrows and bubbles indicating immutable references and objects.",
    percentSize: "80",
  },
  references: {
    name: "Using names as references",
    snapdown:
      's -> (\nSemester\nseason -> ((String "Fall"))\nyear -> 2020\n)\nt -> s\nseason2 => season',
    explanation:
      "In this example, the variable <tt>t</tt> is an alias of <tt>s</tt>, and <tt>season2</tt> is an \
                  (immutable) alias of the <tt>season</tt> field of <tt>s</tt>.",
    percentSize: "80",
  },
  unnamed: {
    name: "Unnamed references",
    snapdown:
      '#sem -> (\nSemester\nseason -> ((String "Fall"))\nyear -> 2020\n)\nc1 -> (\nCourse\n`...`\nsemester -> #sem\n)\nc2 -> (\nCourse\n`...`\nsemester -> #sem\n)',
    explanation:
      "References are considered unnamed if they start with a hash symbol, <tt>#</tt>. In this example, \
                  the <tt>#sem</tt> name is never actually drawn in the diagram, but we can use it \
                  inside the two <tt>Course</tt> objects to avoid deeper nesting, and to avoid repeating \
                  the same <tt>Semester</tt> object twice.",
    percentSize: "70",
  },
  reassignments: {
    name: "Reassignments",
    snapdown:
      "a -x> (\nMyClass\nb -x> ((MyImmutableClass))\n)\na -> 5\nb => (MyOtherClass)",
    explanation:
      "Use an <tt>x</tt> in the middle of an arrow to indicate that an arrow should be crossed out. \
                  Arrows are typically crossed out to indicate reassignment.",
    percentSize: "70",
  },
};

module.exports = { examples };
