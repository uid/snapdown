// Snapdown grammar
// (using a template literal requires `backticks` to be escaped in the grammar)
module.exports = String.raw`
{
  function merge() { return Object.assign({}, ...arguments); }
  function mergeSections() {
    let merged = {};
    for (let sect of arguments) {
      if ( ! sect) continue;
      for (let key in sect) {
        merged[key] = (merged[key] || []).concat(sect[key]);
      }
    }
    return merged;
  }
}

animation = _ $* first:diagram rest:($* frameseparator $* it:diagram { return it })* _ comment? { return [ first, ...rest ] }
frameseparator = "---" "-"*

diagram = $* sections:($* section:(heap / stack) { return section })* $* { return mergeSections(...sections) }

stack = $* functions:($* it:function { return it })+ { return { stack: functions } }

function = func:funcname _ target:(arrow:arrow _ parent:funcname _ { return parent })? "{" $* defs:defs $* "}" {
  return target ? merge({ func, target }, defs) : merge({ func }, defs)
}
funcname = name:([a-z0-9~$%_+./?()]i+) { return text() }

defs = defs:(deflist)? { return { fields: defs || [] } }
deflist = first:def rest:(comma it:def { return it })* { return [ first, ...rest ] }
def = pointer / value

heap = $* vals:($* it:(pointer / value) { return it })+ { return { heap: vals } }

pointer = name:lhs _? add:fieldadd? _? arrow:arrow _? target:rhs? { return merge({ name, target }, add, arrow) }
lhs = blank / ref
fieldadd = "add" _? fieldname:lhs { return { add: true, fieldname } }
arrow = reassignable / assignmentcrossed / crossed / finalcrossed / final / assignment
reassignable = "-"+ ">" { return {} }
final = "="+ ">" { return { immutable: true } }
crossed = "-"+ "x" ">" { return { crossed: true } }
finalcrossed = "="+ "x" ">" { return { immutable: true, crossed: true } }
assignment = "="+ { return { assignment: true } }
assignmentcrossed = "="+ "x" "="+ { return { assignment: true, crossed: true } }

rhs = value / ref
value = object / array / string / primitive

object = mutable / immutable
mutable = "(" internals:internals ")" { return internals }
immutable = "((" internals:internals "))" { return merge({ immutable: true }, internals) }
internals = $* _ object:type _ $* _ fields:fields _ $* { return { object, fields } }

fields = fields:(fieldlist)? { return fields || [] }
fieldlist = first:field rest:(comma it:field { return it })* { return [ first, ...rest ] }
field = pointer / pair / value

pair = key:rhs _ ":" _ val:rhs { return { array: [ key, val ], inside: true } }

array = "[" _ array:elements _ "]" { return { array } }
elements = first:rhs rest:(comma it:rhs { return it })* { return [ first, ...rest ] }
// TODO

string = "\"" [^"]* "\"" { return { val: text() } }

primitive = val:(float / integer / boolean / char / null / phrase) { return { val } }
float = ("-"?[0-9]* "." [0-9]+ / [0-9]+ "." [0-9]*) { return text() }
integer = "-"?[0-9]+ { return text() }
boolean = "true" { return true } / "false" { return false }
char = "'" . "'" { return text() }
null = "null" { return null }

blank = "_" { return {} }
ref = ((name)? "#")? name { return { ref: text().replace(/\`/g, "") } }
name = word / phrase
phrase = "\`" generalword (_ generalword)* "\`" { return text().replace(/\`/g, "") }
word = [a-z0-9~$%_+./?]i+
generalword = [()a-z0-9~$%_+./?\[\]:,]i+
type = name type_params? array_brackets? { return text().replace(/\`/g, "") }
type_params = "<" type ("," type)* ">"
array_brackets = "[]"

comment = "//" [^\n\r]*

_ = [ \t]*
$ = _ comment? [\n\r]+ _
comma = _ ("," / $*) _ $*
`;
