// Snapdown grammar
// defined as a global variable so this file can be included by the development web page
// (using a template literal requires `backticks` to be escaped in the grammar)
snapdown_grammar = String.raw`

{
  function ok(x) { return x !== false; };
}

// a diagram is a sequence of heap values with pointer labels drawn outside of any stack,
//    followed by a sequence of method call stacks that define additional heap values with
//    pointer labels drawn on the stacks
diagram = heap:heap stacks:stacks { return { heap, stacks }; }
// TODO: need first/rest so spaces_lines doesn't eat e.g. the "line" that lets us find "thread" below
heap = items:(pointer / value / spaces_lines)* { return items.filter(ok); }
stacks = first:stack rest:(line thread line stack)* __ { return [ first, ...rest ]; }

// a pointer, written with an arrow of dashes (reassignable) or equal signs (final)
pointer = source:lhs _ arrow:arrow _ target:rhs { return { pointer: Object.assign(arrow, { source, target }) }; }
lhs = blank { return { blank: true }; } / name:reference { return { ref: true, name }; } / type:name " " name:id { return { text: text(), name }; } / name:name { return { text: name, name }; }
arrow = reassignable / final
reassignable = "-"+ label:literal? broken:"x"? "-"* ">" { return { mutable: true, broken, label }; }
final = "="+ label:literal? broken:"x"? "="* ">" { return { mutable: false, broken, label }; }

// pointers can point to value declared inline, to a value declared elsewhere, or to a label declared elsewhere
rhs = value / id / literal
value = object / array / string / primitive

// an object, written surrounded by single (mutable) or double (immutable) parentheses
object = object:(mutable / immutable) { return { object }; }
mutable = "(" internals:internals ")" { return Object.assign(internals, { mutable: true }); }
immutable = "((" internals:internals "))" { return Object.assign(internals, { mutable: false }); }
internals = __ type:type fields:(spaces_lines f:fields { return f; })? __ { return { type, fields: fields || [] }; }

// fields; usually pointers, but a sequence of pairs is used for maps, and a sequence of values is used for sets
fields = f:(pointers / pairs / values) { return [ f.first, ...f.rest ]; }
pointers = first:pointer rest:(comma_or_line p:pointer { return p; })* { return { first, rest }; }
pairs = first:pair rest:(comma_or_line p:pair { return p; })* { return { first, rest }; }
values = first:value rest:(comma_or_line v:value { return v; })* { return { first, rest }; }

// pairs, used to draw key-value maps
pair = left:rhs _ "=" _ right:rhs { return { pair: { left, right } }; }

// arrays, written with square brackets
array = "[" _ elts:elements? _ "]" { return { array: elts || [] }; }
elements = first:rhs rest:(comma_or_line r:rhs { return r; })* { return [ first, ...rest ]; }

// string object shorthand, written with double quotation marks
string = "\"" string:([^"]* { return text(); }) "\"" { return { string: string }; }

// primitive values
primitive = value:(float / integer / boolean / char / null) { return { primitive: value }; }
integer = "-"?[0-9]+ { return parseInt(text()); }
float = ([0-9]* "." [0-9]+ / [0-9]+ "." [0-9]*) { return parseFloat(text()); }
boolean = "true" { return true; } / "false" { return false; }
char = "'" char:(. { return text(); }) "'" { return "'" + char + "'"; }
null = "null" { return "null"; }

// a stack, written top-to-bottom with a sequence of method-declaration-style blocks
stack = method? (line method)*
method = name "()" __ "{" __ pointers? __ "}"

// a thread label, starting a new stack
thread = "thread"i spaces label:id { return { thread: label }; }

blank = "_"
id = reference / name
reference = "#" [0-9]+ { return text(); }
name = [a-z0-9_]i+ { return text(); }
type = name:name "<" params:type_params ">" { return name + "<" + params + ">"; } / name
type_params = first:type rest:(_ "," _ type:type { return type; })* { return [first, ...rest].join(', '); }
literal = "\`" literal:([^\`]* { return text(); }) "\`" { return literal; }

comment = [ \t]* "//" [^\n\r]*

spaces = [ \t]+ { return false; }
lines = (comment? [\n\r])+ { return false; }
spaces_lines = (comment? [ \t\n\r]+)+ { return false; }
_ = spaces? { return false; }
__ = spaces_lines? { return false; }
line = _ lines __ { return false; }
comma_or_line = _ ("," / lines) __ { return false; }

`; // snapdown_grammar
