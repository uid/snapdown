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
    snapdown:
      'f -> (MyFloat 5.0)\ns -> (MyString "abc")\nc -> (MyColor `GREEN`)',
    explanation:
      'In this example, <tt>f</tt> points to a <tt>MyFloat</tt> object with the value <tt>5.0</tt>, \
                  <tt>s</tt> points to a <tt>MyString</tt> object with the value <tt>"abc"</tt>, \
                  and <tt>c</tt> points to a <tt>MyColor</tt> object with the value <tt>GREEN</tt>. \
                  (Note the backticks `` used to obtain the "custom" value of <tt>GREEN</tt>.)',
    percentSize: "80",
  },
  fields: {
    name: "Fields",
    snapdown:
      "lst -> (\nArrayList\n0 -> 1000\n1 -> 2000\n2 -> 3000\nlength -> 3\n)",
    explanation:
      "Here we have a variable <tt>lst</tt> pointing to an <tt>ArrayList</tt> with three fields representing the elements, \
                  and a fourth field representing the length. \
                  (Note that Java may not actually represent the list this way -- Snapdown is purely \
                  a drawing tool that can get us any representation we wish.)",
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
    name: "Unnamed references <b>(NEW)</b>",
    snapdown:
      '#sem -> (\nSemester\nseason -> ((String "Fall"))\nyear -> 2020\n)\nc1 -> (\nCourse\n`...`\nsemester -> #sem\n)\nc2 -> (\nCourse\n`...`\nsemester -> #sem\n)',
    explanation:
      "References are considered unnamed if they start with a hash symbol, <tt>#</tt>. In this example, \
                  the <tt>#sem</tt> name is never actually drawn in the diagram, but we can use it \
                  inside the two <tt>Course</tt> objects to avoid deeper nesting, and to avoid repeating \
                  the same <tt>Semester</tt> object twice.",
    percentSize: "70",
  },
};

module.exports = { examples };
