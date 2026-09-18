/* ==========================================================================
   dsl.js — мова маяка: з мовного пакета (js/lang/*.js) збирається все,
   що стосується самого Python — пролог, список знайомих слів і палітра кнопок.

   Тут навмисне немає жодного звертання до сторінки: цей файл однаково
   працює і в браузері, і в node (tools/check-tasks.mjs бере пролог саме звідси,
   щоб книга й сторож завдань ніколи не розійшлися).
   ========================================================================== */
(function(root){

  /* ---- Python-пролог: команди маяка, банки, захист від зависань ---- */
  function buildPrelude(L){
    const f = L.py.fn, j = L.py.jar, n = L.py.name, v = L.py.val, d = L.py.doc;
    const row = L.py.rowItems.map(s => JSON.stringify(s)).join(', ');
    return `
import sys, json
from js import __lhPush

_STEPS = 0
_LINES = 0
_CAP_STEPS = 120
_CAP_LINES = 40000

_SHOW_NIGHT = bool(_cfg_shownight)

${j.night} = int(_cfg_ticks)
${j.fuel} = int(_cfg_fuel)
${j.cans} = int(_cfg_cans)
${n.wind} = str(_cfg_wind)
_guest = bool(_cfg_guest)

${n.row} = [${row}]

class _StopSafely(Exception):
    """${d.stop}"""

_JARS_MAX = 6
_LAST_JARS = None

def _jars():
    """${d.jars}"""
    g = globals()
    out = {}
    named = ("${j.night}", "${j.fuel}", "${j.cans}") if _SHOW_NIGHT else ("${j.fuel}", "${j.cans}")
    for name in named:
        val = g.get(name)
        if isinstance(val, int) and not isinstance(val, bool):
            out[name] = val
    for name, val in g.items():
        if len(out) >= _JARS_MAX:
            break
        if name.startswith("_") or name in out:
            continue
        if name == "${j.night}" and not _SHOW_NIGHT:
            continue
        if isinstance(val, int) and not isinstance(val, bool):
            out[name] = val
    global _LAST_JARS
    if out == _LAST_JARS:
        return
    _LAST_JARS = dict(out)
    __lhPush("jars", json.dumps(out))

def _tick():
    global _STEPS
    _STEPS += 1
    if _STEPS > _CAP_STEPS:
        raise _StopSafely("too-many-steps")
    _jars()

def ${f.clean}():   _tick(); __lhPush("clean", None)
def ${f.trim}():    _tick(); __lhPush("trim", None)
def ${f.lens}(${n.dir}="${v.north}"): _tick(); __lhPush("lens", str(${n.dir}))
def ${f.ignite}():  _tick(); __lhPush("ignite", None)
def ${f.full}():    _tick(); __lhPush("full", None)
def ${f.dim}():     _tick(); __lhPush("dim", None)
def ${f.rotate}():  _tick(); __lhPush("rotate", None)
def ${f.water}(${n.sunflower}=None): _tick(); __lhPush("water", None)

def ${f.dark}():
    """${d.dark}"""
    return globals().get("${j.night}", 0) > 0

def ${f.guest}():
    return _guest

def ${f.count}(${n.what}):
    try: return len(${n.what})
    except TypeError: return ${n.what}

def _as_word(a):
    """${d.word}"""
    if a is True:  return "${v.yes}"
    if a is False: return "${v.no}"
    if a is None:  return "${v.nothing}"
    return str(a)

def ${f.print}(*args):
    _jars()
    __lhPush("print", " ".join(_as_word(a) for a in args))

def _guard(frame, event, arg):
    global _LINES
    if event == "line":
        _LINES += 1
        if _LINES > _CAP_LINES:
            raise _StopSafely("endless-loop")
    return _guard

sys.settrace(_guard)
`;
  }

  /* ---- слова, які маяк знає: для підказки «може, тут мало бути…» ---- */
  function knownWords(L){
    return Object.values(L.py.fn)
      .concat([L.py.jar.night, L.py.jar.fuel, L.py.jar.cans, L.py.name.wind, L.py.name.row, 'range']);
  }

  /* ---- команди, які без дужок нічого не роблять: на них озивається Цербер ---- */
  function commandWords(L){
    return Object.values(L.py.fn);
  }

  /* ---- імена банок, що вже стоять на підвіконні від початку ---- */
  function builtinJars(L){
    return [L.py.jar.fuel, L.py.jar.cans, L.py.jar.night];
  }

  /* ---- палітра кнопок над пісочницею ---- */
  function buildPalette(L){
    const f = L.py.fn, j = L.py.jar, n = L.py.name, v = L.py.val;
    const call = (name) => ({ l: `${name}()` });
    const jarDown = (name) => ({ l: `${name} = ${name} - 1` });
    const ITEM = {
      clean: call(f.clean), trim: call(f.trim), ignite: call(f.ignite),
      full: call(f.full), dim: call(f.dim), rotate: call(f.rotate),
      lens:  { l: `${f.lens}("${v.north}")` },
      water: { l: `${f.water}(${n.sunflower})` },
      print: { l: `${f.print}(…)`, ins: `${f.print}("")`, back: 2 },

      jarNight: jarDown(j.night), jarFuel: jarDown(j.fuel), jarCans: jarDown(j.cans),

      while: { l: `while ${f.dark}():`, ins: `while ${f.dark}():\n` },
      for:   { l: `for … in ${n.row}:`, ins: `for ${n.sunflower} in ${n.row}:\n` },
      if:    { l: `if ${n.wind} == "${v.strong}":`, ins: `if ${n.wind} == "${v.strong}":\n` },
      else:  { l: `else:`, ins: `else:\n` },
      def:   { l: `def ${n.own}():`, ins: `def ${n.own}():\n`, back: 4 }
    };
    return L.palette.map(g => ({
      grp: g.grp,
      items: g.keys.map(k => ITEM[k]).filter(Boolean)
    }));
  }

  const DSL = { buildPrelude, knownWords, commandWords, builtinJars, buildPalette };

  if(typeof module !== 'undefined' && module.exports) module.exports = DSL;
  root.DSL = DSL;

})(typeof globalThis !== 'undefined' ? globalThis : this);
