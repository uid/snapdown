// Snapdown grammar
// (using a template literal requires `backticks` to be escaped in the grammar)
module.exports = String.raw`
{
  function merge() { return Object.assign({}, ...arguments); }
}

diagram = heap:heap $* { return { heap } }

heap = vals:($* it:(pointer / value) { return it })* { return vals }

pointer = name:lhs _? arrow:arrow _? target:rhs { return merge({ name, target }, arrow) }
lhs = blank / ref
arrow = reassignable / final / crossed / finalcrossed
reassignable = "-"+ ">" { return {} }
final = "="+ ">" { return { immutable: true } }
crossed = "-"+ "x" ">" { return { crossed: true } }
finalcrossed = "="+ "x" ">" { return { immutable: true, crossed: true } }

rhs = value / ref
value = object / array / string / primitive

object = mutable / immutable
mutable = "(" internals:internals ")" { return internals }
immutable = "((" internals:internals "))" { return merge({ immutable: true }, internals) }
internals = $* object:type _ $* _ fields:fields _ $* { return { object, fields } }

// TODO if they all use first/rest, put that logic in fields production?
fields = fields:(pointers / values)? { return fields || [] }
pointers = first:pointer rest:(comma it:pointer { return it })* { return [ first, ...rest ] }
values = first:value rest:(comma it:value { return it })* { return [ first, ...rest ] }

array = "[" _ array:elements _ "]" { return { array } }
elements = first:rhs rest:(comma it:rhs { return it })* { return [ first, ...rest ] }
// TODO

string = "\"" [^"]* "\"" { return { val: text() } }

primitive = val:(float / integer / boolean / char / null) { return { val } }
float = ([0-9]* "." [0-9]+ / [0-9]+ "." [0-9]*) { return parseFloat(text()) }
integer = "-"?[0-9]+ { return parseInt(text()) }
boolean = "true" { return true } / "false" { return false }
char = "'" . "'" { return text() }
null = "null" { return null }

blank = "_" { return {} }
ref = "#"? name { return { ref: text() } }
name = [a-z0-9~$%_+./?]i+
type = name type_params? { return text() }
type_params = "<" type ("," type)* ">"

comment = "//" [^\n\r]*

_ = [ \t]*
$ = _ comment? [\n\r]+
comma = _ ("," / $) _ $*
`;
