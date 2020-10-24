const examples = {
  primitives: {
    name: "Primitives",
    snapdown: 'i -> 5\ns -> "abc"',
    explanation:
      'In this example, we have two variables: \
                  i points to the value 5, and s points to the value "abc".',
    percentSize: "100",
  },
  objects: {
    name: "Objects",
    snapdown:
      'f -> (MyFloat 5.0)\ns -> (MyString "abc")\nc -> (MyColor `GREEN`)',
    explanation:
      'In this example, f points to a MyFloat object with the value 5.0, \
                  s points to a MyString object with the value "abc", \
                  and c points to a MyColor object with the value GREEN. \
                  (Note the backticks `` used to obtain the "custom" value of GREEN.)',
    percentSize: "80",
  },
  fields: {
    name: "Fields",
    snapdown:
      "lst -> (\nArrayList\n0 -> 1000\n1 -> 2000\n2 -> 3000\nlength -> 3\n)",
    explanation:
      "Here we have a variable lst pointing to an ArrayList with three fields representing the elements, \
                  and a fourth field representing the length. \
                  (Note that Java may not actually represent the List this way -- Snapdown is purely \
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
      "In this example, the variable t is an alias of s, and season2 is an \
                  (immutable) alias of the season field of s.",
    percentSize: "80",
  },
  unnamed: {
    name: "Unnamed references <b>(NEW)</b>",
    snapdown:
      '#sem -> (\nSemester\nseason -> ((String "Fall"))\nyear -> 2020\n)\nc -> (Course number -> "6.031"\nsemester -> #sem)',
    explanation:
      "References are considered unnamed if they start with a hash symbol, #. In this example, \
                  the #sem reference is never actually drawn in the diagram, but is known to be \
                  associated with the Semester object.",
    percentSize: "80",
  },
};

module.exports = { examples };
