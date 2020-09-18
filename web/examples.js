const examples = {
  primitives: {
    name: "Primitives",
    snapdown: 'i -> 5\ns -> "abc"',
    explanation:
      'In this example, we have two variables, `i` and `s`. \
                  `i` points to the value 5, and `s` points to the value "abc".',
  },
  objects: {
    name: "Objects",
    snapdown: 'i -> (MyInteger 5)\ns -> (MyString "abc")',
    explanation:
      'In this example, `i` points to a `MyInteger` object with the value 5, \
                  and `s` points to a `MyString` object with the value "abc". \
                  Parentheses are used to indicate that these values are objects.',
  },
  fields: {
    name: "Fields",
    snapdown:
      "lst -> (\nArrayList<Integer>\n0 -> 1000\n1 -> 2000\n2 -> 3000\nlength -> 3\n)",
    explanation:
      "Here we have a variable `lst` pointing to an `ArrayList` with three fields representing the elements, \
                  and a fourth field representing the length. \
                  (Note that Java may not actually represent the List this way -- Snapdown is purely \
                  a _drawing_ tool that can get us any representation we wish.)",
  },
  immutable: {
    name: "Immutability",
    snapdown: "a => (\nMyClass\nb -> ((MyImmutableClass))\n)",
    explanation:
      "Note the double-lined arrows and bubbles indicating immutable references and objects.",
  },
  references: {
    name: "Using names as references",
    snapdown:
      's -> (\nSemester\nseason -> ((String "Fall"))\nyear -> 2020\n)\nt -> s\nseason2 => season',
    explanation:
      "In this example, the variable `t` is an alias of `s`, and `season2` is an \
                  (immutable) alias of the `season` field of `s`.",
  },
  maps: {
    name: "Map fields",
    snapdown:
      's -> (String "value")\nm -> (\nHashMap\n(String "key") = s\n)\nm2 -> (\nHashMap\n(String "otherKey") = s\n)',
    explanation:
      "In this example, we have two maps, each with a single key, and both with the same single value.",
  },
};

export { examples };