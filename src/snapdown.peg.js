// Snapdown grammar
// (using a template literal requires `backticks` to be escaped in the grammar)
module.exports = String.raw`
{
  function merge() { return Object.assign({}, ...arguments); }
}

diagram = heap:heap stack:stack $* { return { heap, stack } }

stack = functions:($* it:function { return it })* { return functions }

function = func:funcname _ target:(arrow:arrow _ parent:funcname _ { return parent })? "{" $* defs:defs $* "}" {
  return target ? merge({ func, target }, defs) : merge({ func }, defs)
}
funcname = name:([a-z0-9~$%_+./?()]i+) { return text() }

defs = defs:(deflist)? { return { fields: defs || [] } }
deflist = first:def rest:(comma it:def { return it })* { return [ first, ...rest ] }
def = pointer / value

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

fields = fields:(fieldlist)? { return fields || [] }
fieldlist = first:field rest:(comma it:field { return it })* { return [ first, ...rest ] }
field = pointer / pair / value

pair = key:rhs _ "=" _ val:rhs { return { array: [ key, val ], inside: true } }

array = "[" _ array:elements _ "]" { return { array } }
elements = first:rhs rest:(comma it:rhs { return it })* { return [ first, ...rest ] }
// TODO

string = "\"" [^"]* "\"" { return { val: text() } }

primitive = val:(float / integer / boolean / char / null / phrase) { return { val } }
float = ([0-9]* "." [0-9]+ / [0-9]+ "." [0-9]*) { return text() }
integer = "-"?[0-9]+ { return text() }
boolean = "true" { return true } / "false" { return false }
char = "'" . "'" { return text() }
null = "null" { return null }

blank = "_" { return {} }
ref = ((name)? "#")? name { return { ref: text() } }
name = word / phrase
phrase = "\`" word (_ word)* "\`" { return text().replace(/\`/g, "") }
word = [a-z0-9~$%_+./?\[\]]i+
type = name type_params? { return text() }
type_params = "<" type ("," type)* ">"

comment = "//" [^\n\r]*

_ = [ \t]*
$ = _ comment? [\n\r]+
comma = _ ("," / $) _ $*
`;
