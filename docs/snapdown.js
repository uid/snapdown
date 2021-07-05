/*!
 * Snapdown 0.2.0
 * http://maxg.github.io/snapdown/
 */
var Snapdown = (function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var i = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  return (
    (n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var i in e)
          n.d(
            r,
            i,
            function (t) {
              return e[t];
            }.bind(null, i)
          );
      return r;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 10))
  );
})([
  function (e, t, n) {
    "use strict";
    e.exports = {
      Always: 1,
      Never: 2,
      IfAtMostOneObstacle: 3,
      OnlyWhenNoObstacles: 4,
    };
  },
  function (e, t, n) {
    "use strict";
    function r(e) {
      for (var t = [[e.x, e.y]]; e.parent; ) (e = e.parent), t.push([e.x, e.y]);
      return t.reverse();
    }
    function i(e, t, n, r) {
      var i,
        o,
        a,
        s,
        u,
        l,
        c = Math.abs,
        f = [];
      for (
        i = e < n ? 1 : -1,
          o = t < r ? 1 : -1,
          u = (a = c(n - e)) - (s = c(r - t));
        f.push([e, t]), e !== n || t !== r;

      )
        (l = 2 * u) > -s && ((u -= s), (e += i)), l < a && ((u += a), (t += o));
      return f;
    }
    (t.backtrace = r),
      (t.biBacktrace = function (e, t) {
        var n = r(e),
          i = r(t);
        return n.concat(i.reverse());
      }),
      (t.pathLength = function (e) {
        var t,
          n,
          r,
          i,
          o,
          a = 0;
        for (t = 1; t < e.length; ++t)
          (n = e[t - 1]),
            (r = e[t]),
            (i = n[0] - r[0]),
            (o = n[1] - r[1]),
            (a += Math.sqrt(i * i + o * o));
        return a;
      }),
      (t.interpolate = i),
      (t.expandPath = function (e) {
        var t,
          n,
          r,
          o,
          a,
          s,
          u = [],
          l = e.length;
        if (l < 2) return u;
        for (a = 0; a < l - 1; ++a)
          for (
            t = e[a],
              n = e[a + 1],
              o = (r = i(t[0], t[1], n[0], n[1])).length,
              s = 0;
            s < o - 1;
            ++s
          )
            u.push(r[s]);
        return u.push(e[l - 1]), u;
      }),
      (t.smoothenPath = function (e, t) {
        var n,
          r,
          o,
          a,
          s,
          u,
          l,
          c,
          f,
          p,
          d = t.length,
          h = t[0][0],
          g = t[0][1],
          m = t[d - 1][0],
          y = t[d - 1][1];
        for (o = [[(n = h), (r = g)]], a = 2; a < d; ++a) {
          for (
            l = i(n, r, (u = t[a])[0], u[1]), f = !1, s = 1;
            s < l.length;
            ++s
          )
            if (((c = l[s]), !e.isWalkableAt(c[0], c[1]))) {
              f = !0;
              break;
            }
          f && ((p = t[a - 1]), o.push(p), (n = p[0]), (r = p[1]));
        }
        return o.push([m, y]), o;
      }),
      (t.compressPath = function (e) {
        if (e.length < 3) return e;
        var t,
          n,
          r,
          i,
          o,
          a,
          s = [],
          u = e[0][0],
          l = e[0][1],
          c = e[1][0],
          f = e[1][1],
          p = c - u,
          d = f - l;
        for (
          p /= o = Math.sqrt(p * p + d * d), d /= o, s.push([u, l]), a = 2;
          a < e.length;
          a++
        )
          (t = c),
            (n = f),
            (r = p),
            (i = d),
            (p = (c = e[a][0]) - t),
            (d = (f = e[a][1]) - n),
            (d /= o = Math.sqrt(p * p + d * d)),
            ((p /= o) === r && d === i) || s.push([t, n]);
        return s.push([c, f]), s;
      });
  },
  function (e, t, n) {
    "use strict";
    e.exports = {
      manhattan: function (e, t) {
        return e + t;
      },
      euclidean: function (e, t) {
        return Math.sqrt(e * e + t * t);
      },
      octile: function (e, t) {
        var n = Math.SQRT2 - 1;
        return e < t ? n * e + t : n * t + e;
      },
      chebyshev: function (e, t) {
        return Math.max(e, t);
      },
    };
  },
  function (e, t, n) {
    e.exports = n(22);
  },
  function (e, t, n) {
    "use strict";
    var r = n(3),
      i = n(1),
      o = n(2);
    n(0);
    function a(e) {
      (e = e || {}),
        (this.heuristic = e.heuristic || o.manhattan),
        (this.trackJumpRecursion = e.trackJumpRecursion || !1);
    }
    (a.prototype.findPath = function (e, t, n, o, a) {
      var s,
        u = (this.openList = new r(function (e, t) {
          return e.f - t.f;
        })),
        l = (this.startNode = a.getNodeAt(e, t)),
        c = (this.endNode = a.getNodeAt(n, o));
      for (
        this.grid = a, l.g = 0, l.f = 0, u.push(l), l.opened = !0;
        !u.empty();

      ) {
        if ((((s = u.pop()).closed = !0), s === c))
          return i.expandPath(i.backtrace(c));
        this._identifySuccessors(s);
      }
      return [];
    }),
      (a.prototype._identifySuccessors = function (e) {
        var t,
          n,
          r,
          i,
          a,
          s,
          u,
          l,
          c,
          f,
          p = this.grid,
          d = this.heuristic,
          h = this.openList,
          g = this.endNode.x,
          m = this.endNode.y,
          y = e.x,
          v = e.y,
          b = Math.abs;
        Math.max;
        for (i = 0, a = (t = this._findNeighbors(e)).length; i < a; ++i)
          if (((n = t[i]), (r = this._jump(n[0], n[1], y, v)))) {
            if (((s = r[0]), (u = r[1]), (f = p.getNodeAt(s, u)).closed))
              continue;
            (l = o.octile(b(s - y), b(u - v))),
              (c = e.g + l),
              (!f.opened || c < f.g) &&
                ((f.g = c),
                (f.h = f.h || d(b(s - g), b(u - m))),
                (f.f = f.g + f.h),
                (f.parent = e),
                f.opened ? h.updateItem(f) : (h.push(f), (f.opened = !0)));
          }
      }),
      (e.exports = a);
  },
  function (e, t, n) {
    var r;
    /*!
     * jQuery JavaScript Library v3.5.1
     * https://jquery.com/
     *
     * Includes Sizzle.js
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2020-05-04T22:49Z
     */ !(function (t, n) {
      "use strict";
      "object" == typeof e.exports
        ? (e.exports = t.document
            ? n(t, !0)
            : function (e) {
                if (!e.document)
                  throw new Error("jQuery requires a window with a document");
                return n(e);
              })
        : n(t);
    })("undefined" != typeof window ? window : this, function (n, i) {
      "use strict";
      var o = [],
        a = Object.getPrototypeOf,
        s = o.slice,
        u = o.flat
          ? function (e) {
              return o.flat.call(e);
            }
          : function (e) {
              return o.concat.apply([], e);
            },
        l = o.push,
        c = o.indexOf,
        f = {},
        p = f.toString,
        d = f.hasOwnProperty,
        h = d.toString,
        g = h.call(Object),
        m = {},
        y = function (e) {
          return "function" == typeof e && "number" != typeof e.nodeType;
        },
        v = function (e) {
          return null != e && e === e.window;
        },
        b = n.document,
        x = { type: !0, src: !0, nonce: !0, noModule: !0 };
      function w(e, t, n) {
        var r,
          i,
          o = (n = n || b).createElement("script");
        if (((o.text = e), t))
          for (r in x)
            (i = t[r] || (t.getAttribute && t.getAttribute(r))) &&
              o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o);
      }
      function A(e) {
        return null == e
          ? e + ""
          : "object" == typeof e || "function" == typeof e
          ? f[p.call(e)] || "object"
          : typeof e;
      }
      var k = function (e, t) {
        return new k.fn.init(e, t);
      };
      function C(e) {
        var t = !!e && "length" in e && e.length,
          n = A(e);
        return (
          !y(e) &&
          !v(e) &&
          ("array" === n ||
            0 === t ||
            ("number" == typeof t && t > 0 && t - 1 in e))
        );
      }
      (k.fn = k.prototype = {
        jquery: "3.5.1",
        constructor: k,
        length: 0,
        toArray: function () {
          return s.call(this);
        },
        get: function (e) {
          return null == e
            ? s.call(this)
            : e < 0
            ? this[e + this.length]
            : this[e];
        },
        pushStack: function (e) {
          var t = k.merge(this.constructor(), e);
          return (t.prevObject = this), t;
        },
        each: function (e) {
          return k.each(this, e);
        },
        map: function (e) {
          return this.pushStack(
            k.map(this, function (t, n) {
              return e.call(t, n, t);
            })
          );
        },
        slice: function () {
          return this.pushStack(s.apply(this, arguments));
        },
        first: function () {
          return this.eq(0);
        },
        last: function () {
          return this.eq(-1);
        },
        even: function () {
          return this.pushStack(
            k.grep(this, function (e, t) {
              return (t + 1) % 2;
            })
          );
        },
        odd: function () {
          return this.pushStack(
            k.grep(this, function (e, t) {
              return t % 2;
            })
          );
        },
        eq: function (e) {
          var t = this.length,
            n = +e + (e < 0 ? t : 0);
          return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
        },
        end: function () {
          return this.prevObject || this.constructor();
        },
        push: l,
        sort: o.sort,
        splice: o.splice,
      }),
        (k.extend = k.fn.extend = function () {
          var e,
            t,
            n,
            r,
            i,
            o,
            a = arguments[0] || {},
            s = 1,
            u = arguments.length,
            l = !1;
          for (
            "boolean" == typeof a && ((l = a), (a = arguments[s] || {}), s++),
              "object" == typeof a || y(a) || (a = {}),
              s === u && ((a = this), s--);
            s < u;
            s++
          )
            if (null != (e = arguments[s]))
              for (t in e)
                (r = e[t]),
                  "__proto__" !== t &&
                    a !== r &&
                    (l && r && (k.isPlainObject(r) || (i = Array.isArray(r)))
                      ? ((n = a[t]),
                        (o =
                          i && !Array.isArray(n)
                            ? []
                            : i || k.isPlainObject(n)
                            ? n
                            : {}),
                        (i = !1),
                        (a[t] = k.extend(l, o, r)))
                      : void 0 !== r && (a[t] = r));
          return a;
        }),
        k.extend({
          expando: "jQuery" + ("3.5.1" + Math.random()).replace(/\D/g, ""),
          isReady: !0,
          error: function (e) {
            throw new Error(e);
          },
          noop: function () {},
          isPlainObject: function (e) {
            var t, n;
            return (
              !(!e || "[object Object]" !== p.call(e)) &&
              (!(t = a(e)) ||
                ("function" ==
                  typeof (n = d.call(t, "constructor") && t.constructor) &&
                  h.call(n) === g))
            );
          },
          isEmptyObject: function (e) {
            var t;
            for (t in e) return !1;
            return !0;
          },
          globalEval: function (e, t, n) {
            w(e, { nonce: t && t.nonce }, n);
          },
          each: function (e, t) {
            var n,
              r = 0;
            if (C(e))
              for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++);
            else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
            return e;
          },
          makeArray: function (e, t) {
            var n = t || [];
            return (
              null != e &&
                (C(Object(e))
                  ? k.merge(n, "string" == typeof e ? [e] : e)
                  : l.call(n, e)),
              n
            );
          },
          inArray: function (e, t, n) {
            return null == t ? -1 : c.call(t, e, n);
          },
          merge: function (e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
              e[i++] = t[r];
            return (e.length = i), e;
          },
          grep: function (e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
              !t(e[i], i) !== a && r.push(e[i]);
            return r;
          },
          map: function (e, t, n) {
            var r,
              i,
              o = 0,
              a = [];
            if (C(e))
              for (r = e.length; o < r; o++)
                null != (i = t(e[o], o, n)) && a.push(i);
            else for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
            return u(a);
          },
          guid: 1,
          support: m,
        }),
        "function" == typeof Symbol &&
          (k.fn[Symbol.iterator] = o[Symbol.iterator]),
        k.each(
          "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
            " "
          ),
          function (e, t) {
            f["[object " + t + "]"] = t.toLowerCase();
          }
        );
      var S =
        /*!
         * Sizzle CSS Selector Engine v2.3.5
         * https://sizzlejs.com/
         *
         * Copyright JS Foundation and other contributors
         * Released under the MIT license
         * https://js.foundation/
         *
         * Date: 2020-03-14
         */
        (function (e) {
          var t,
            n,
            r,
            i,
            o,
            a,
            s,
            u,
            l,
            c,
            f,
            p,
            d,
            h,
            g,
            m,
            y,
            v,
            b,
            x = "sizzle" + 1 * new Date(),
            w = e.document,
            A = 0,
            k = 0,
            C = ue(),
            S = ue(),
            j = ue(),
            E = ue(),
            T = function (e, t) {
              return e === t && (f = !0), 0;
            },
            N = {}.hasOwnProperty,
            O = [],
            M = O.pop,
            L = O.push,
            I = O.push,
            D = O.slice,
            W = function (e, t) {
              for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t) return n;
              return -1;
            },
            F =
              "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            _ = "[\\x20\\t\\r\\n\\f]",
            P =
              "(?:\\\\[\\da-fA-F]{1,6}" +
              _ +
              "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
            q =
              "\\[" +
              _ +
              "*(" +
              P +
              ")(?:" +
              _ +
              "*([*^$|!~]?=)" +
              _ +
              "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
              P +
              "))|)" +
              _ +
              "*\\]",
            H =
              ":(" +
              P +
              ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
              q +
              ")*)|.*)\\)|)",
            R = new RegExp(_ + "+", "g"),
            B = new RegExp(
              "^" + _ + "+|((?:^|[^\\\\])(?:\\\\.)*)" + _ + "+$",
              "g"
            ),
            z = new RegExp("^" + _ + "*," + _ + "*"),
            U = new RegExp("^" + _ + "*([>+~]|" + _ + ")" + _ + "*"),
            $ = new RegExp(_ + "|>"),
            Y = new RegExp(H),
            G = new RegExp("^" + P + "$"),
            V = {
              ID: new RegExp("^#(" + P + ")"),
              CLASS: new RegExp("^\\.(" + P + ")"),
              TAG: new RegExp("^(" + P + "|[*])"),
              ATTR: new RegExp("^" + q),
              PSEUDO: new RegExp("^" + H),
              CHILD: new RegExp(
                "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                  _ +
                  "*(even|odd|(([+-]|)(\\d*)n|)" +
                  _ +
                  "*(?:([+-]|)" +
                  _ +
                  "*(\\d+)|))" +
                  _ +
                  "*\\)|)",
                "i"
              ),
              bool: new RegExp("^(?:" + F + ")$", "i"),
              needsContext: new RegExp(
                "^" +
                  _ +
                  "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                  _ +
                  "*((?:-\\d)?\\d*)" +
                  _ +
                  "*\\)|)(?=[^-]|$)",
                "i"
              ),
            },
            X = /HTML$/i,
            J = /^(?:input|select|textarea|button)$/i,
            K = /^h\d$/i,
            Q = /^[^{]+\{\s*\[native \w/,
            Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ee = /[+~]/,
            te = new RegExp(
              "\\\\[\\da-fA-F]{1,6}" + _ + "?|\\\\([^\\r\\n\\f])",
              "g"
            ),
            ne = function (e, t) {
              var n = "0x" + e.slice(1) - 65536;
              return (
                t ||
                (n < 0
                  ? String.fromCharCode(n + 65536)
                  : String.fromCharCode((n >> 10) | 55296, (1023 & n) | 56320))
              );
            },
            re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            ie = function (e, t) {
              return t
                ? "\0" === e
                  ? "�"
                  : e.slice(0, -1) +
                    "\\" +
                    e.charCodeAt(e.length - 1).toString(16) +
                    " "
                : "\\" + e;
            },
            oe = function () {
              p();
            },
            ae = xe(
              function (e) {
                return (
                  !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
                );
              },
              { dir: "parentNode", next: "legend" }
            );
          try {
            I.apply((O = D.call(w.childNodes)), w.childNodes),
              O[w.childNodes.length].nodeType;
          } catch (e) {
            I = {
              apply: O.length
                ? function (e, t) {
                    L.apply(e, D.call(t));
                  }
                : function (e, t) {
                    for (var n = e.length, r = 0; (e[n++] = t[r++]); );
                    e.length = n - 1;
                  },
            };
          }
          function se(e, t, r, i) {
            var o,
              s,
              l,
              c,
              f,
              h,
              y,
              v = t && t.ownerDocument,
              w = t ? t.nodeType : 9;
            if (
              ((r = r || []),
              "string" != typeof e || !e || (1 !== w && 9 !== w && 11 !== w))
            )
              return r;
            if (!i && (p(t), (t = t || d), g)) {
              if (11 !== w && (f = Z.exec(e)))
                if ((o = f[1])) {
                  if (9 === w) {
                    if (!(l = t.getElementById(o))) return r;
                    if (l.id === o) return r.push(l), r;
                  } else if (
                    v &&
                    (l = v.getElementById(o)) &&
                    b(t, l) &&
                    l.id === o
                  )
                    return r.push(l), r;
                } else {
                  if (f[2]) return I.apply(r, t.getElementsByTagName(e)), r;
                  if (
                    (o = f[3]) &&
                    n.getElementsByClassName &&
                    t.getElementsByClassName
                  )
                    return I.apply(r, t.getElementsByClassName(o)), r;
                }
              if (
                n.qsa &&
                !E[e + " "] &&
                (!m || !m.test(e)) &&
                (1 !== w || "object" !== t.nodeName.toLowerCase())
              ) {
                if (((y = e), (v = t), 1 === w && ($.test(e) || U.test(e)))) {
                  for (
                    ((v = (ee.test(e) && ye(t.parentNode)) || t) === t &&
                      n.scope) ||
                      ((c = t.getAttribute("id"))
                        ? (c = c.replace(re, ie))
                        : t.setAttribute("id", (c = x))),
                      s = (h = a(e)).length;
                    s--;

                  )
                    h[s] = (c ? "#" + c : ":scope") + " " + be(h[s]);
                  y = h.join(",");
                }
                try {
                  return I.apply(r, v.querySelectorAll(y)), r;
                } catch (t) {
                  E(e, !0);
                } finally {
                  c === x && t.removeAttribute("id");
                }
              }
            }
            return u(e.replace(B, "$1"), t, r, i);
          }
          function ue() {
            var e = [];
            return function t(n, i) {
              return (
                e.push(n + " ") > r.cacheLength && delete t[e.shift()],
                (t[n + " "] = i)
              );
            };
          }
          function le(e) {
            return (e[x] = !0), e;
          }
          function ce(e) {
            var t = d.createElement("fieldset");
            try {
              return !!e(t);
            } catch (e) {
              return !1;
            } finally {
              t.parentNode && t.parentNode.removeChild(t), (t = null);
            }
          }
          function fe(e, t) {
            for (var n = e.split("|"), i = n.length; i--; )
              r.attrHandle[n[i]] = t;
          }
          function pe(e, t) {
            var n = t && e,
              r =
                n &&
                1 === e.nodeType &&
                1 === t.nodeType &&
                e.sourceIndex - t.sourceIndex;
            if (r) return r;
            if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
            return e ? 1 : -1;
          }
          function de(e) {
            return function (t) {
              return "input" === t.nodeName.toLowerCase() && t.type === e;
            };
          }
          function he(e) {
            return function (t) {
              var n = t.nodeName.toLowerCase();
              return ("input" === n || "button" === n) && t.type === e;
            };
          }
          function ge(e) {
            return function (t) {
              return "form" in t
                ? t.parentNode && !1 === t.disabled
                  ? "label" in t
                    ? "label" in t.parentNode
                      ? t.parentNode.disabled === e
                      : t.disabled === e
                    : t.isDisabled === e || (t.isDisabled !== !e && ae(t) === e)
                  : t.disabled === e
                : "label" in t && t.disabled === e;
            };
          }
          function me(e) {
            return le(function (t) {
              return (
                (t = +t),
                le(function (n, r) {
                  for (var i, o = e([], n.length, t), a = o.length; a--; )
                    n[(i = o[a])] && (n[i] = !(r[i] = n[i]));
                })
              );
            });
          }
          function ye(e) {
            return e && void 0 !== e.getElementsByTagName && e;
          }
          for (t in ((n = se.support = {}),
          (o = se.isXML = function (e) {
            var t = e.namespaceURI,
              n = (e.ownerDocument || e).documentElement;
            return !X.test(t || (n && n.nodeName) || "HTML");
          }),
          (p = se.setDocument = function (e) {
            var t,
              i,
              a = e ? e.ownerDocument || e : w;
            return a != d && 9 === a.nodeType && a.documentElement
              ? ((h = (d = a).documentElement),
                (g = !o(d)),
                w != d &&
                  (i = d.defaultView) &&
                  i.top !== i &&
                  (i.addEventListener
                    ? i.addEventListener("unload", oe, !1)
                    : i.attachEvent && i.attachEvent("onunload", oe)),
                (n.scope = ce(function (e) {
                  return (
                    h.appendChild(e).appendChild(d.createElement("div")),
                    void 0 !== e.querySelectorAll &&
                      !e.querySelectorAll(":scope fieldset div").length
                  );
                })),
                (n.attributes = ce(function (e) {
                  return (e.className = "i"), !e.getAttribute("className");
                })),
                (n.getElementsByTagName = ce(function (e) {
                  return (
                    e.appendChild(d.createComment("")),
                    !e.getElementsByTagName("*").length
                  );
                })),
                (n.getElementsByClassName = Q.test(d.getElementsByClassName)),
                (n.getById = ce(function (e) {
                  return (
                    (h.appendChild(e).id = x),
                    !d.getElementsByName || !d.getElementsByName(x).length
                  );
                })),
                n.getById
                  ? ((r.filter.ID = function (e) {
                      var t = e.replace(te, ne);
                      return function (e) {
                        return e.getAttribute("id") === t;
                      };
                    }),
                    (r.find.ID = function (e, t) {
                      if (void 0 !== t.getElementById && g) {
                        var n = t.getElementById(e);
                        return n ? [n] : [];
                      }
                    }))
                  : ((r.filter.ID = function (e) {
                      var t = e.replace(te, ne);
                      return function (e) {
                        var n =
                          void 0 !== e.getAttributeNode &&
                          e.getAttributeNode("id");
                        return n && n.value === t;
                      };
                    }),
                    (r.find.ID = function (e, t) {
                      if (void 0 !== t.getElementById && g) {
                        var n,
                          r,
                          i,
                          o = t.getElementById(e);
                        if (o) {
                          if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                          for (
                            i = t.getElementsByName(e), r = 0;
                            (o = i[r++]);

                          )
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                              return [o];
                        }
                        return [];
                      }
                    })),
                (r.find.TAG = n.getElementsByTagName
                  ? function (e, t) {
                      return void 0 !== t.getElementsByTagName
                        ? t.getElementsByTagName(e)
                        : n.qsa
                        ? t.querySelectorAll(e)
                        : void 0;
                    }
                  : function (e, t) {
                      var n,
                        r = [],
                        i = 0,
                        o = t.getElementsByTagName(e);
                      if ("*" === e) {
                        for (; (n = o[i++]); ) 1 === n.nodeType && r.push(n);
                        return r;
                      }
                      return o;
                    }),
                (r.find.CLASS =
                  n.getElementsByClassName &&
                  function (e, t) {
                    if (void 0 !== t.getElementsByClassName && g)
                      return t.getElementsByClassName(e);
                  }),
                (y = []),
                (m = []),
                (n.qsa = Q.test(d.querySelectorAll)) &&
                  (ce(function (e) {
                    var t;
                    (h.appendChild(e).innerHTML =
                      "<a id='" +
                      x +
                      "'></a><select id='" +
                      x +
                      "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                      e.querySelectorAll("[msallowcapture^='']").length &&
                        m.push("[*^$]=" + _ + "*(?:''|\"\")"),
                      e.querySelectorAll("[selected]").length ||
                        m.push("\\[" + _ + "*(?:value|" + F + ")"),
                      e.querySelectorAll("[id~=" + x + "-]").length ||
                        m.push("~="),
                      (t = d.createElement("input")).setAttribute("name", ""),
                      e.appendChild(t),
                      e.querySelectorAll("[name='']").length ||
                        m.push(
                          "\\[" + _ + "*name" + _ + "*=" + _ + "*(?:''|\"\")"
                        ),
                      e.querySelectorAll(":checked").length ||
                        m.push(":checked"),
                      e.querySelectorAll("a#" + x + "+*").length ||
                        m.push(".#.+[+~]"),
                      e.querySelectorAll("\\\f"),
                      m.push("[\\r\\n\\f]");
                  }),
                  ce(function (e) {
                    e.innerHTML =
                      "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = d.createElement("input");
                    t.setAttribute("type", "hidden"),
                      e.appendChild(t).setAttribute("name", "D"),
                      e.querySelectorAll("[name=d]").length &&
                        m.push("name" + _ + "*[*^$|!~]?="),
                      2 !== e.querySelectorAll(":enabled").length &&
                        m.push(":enabled", ":disabled"),
                      (h.appendChild(e).disabled = !0),
                      2 !== e.querySelectorAll(":disabled").length &&
                        m.push(":enabled", ":disabled"),
                      e.querySelectorAll("*,:x"),
                      m.push(",.*:");
                  })),
                (n.matchesSelector = Q.test(
                  (v =
                    h.matches ||
                    h.webkitMatchesSelector ||
                    h.mozMatchesSelector ||
                    h.oMatchesSelector ||
                    h.msMatchesSelector)
                )) &&
                  ce(function (e) {
                    (n.disconnectedMatch = v.call(e, "*")),
                      v.call(e, "[s!='']:x"),
                      y.push("!=", H);
                  }),
                (m = m.length && new RegExp(m.join("|"))),
                (y = y.length && new RegExp(y.join("|"))),
                (t = Q.test(h.compareDocumentPosition)),
                (b =
                  t || Q.test(h.contains)
                    ? function (e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                          r = t && t.parentNode;
                        return (
                          e === r ||
                          !(
                            !r ||
                            1 !== r.nodeType ||
                            !(n.contains
                              ? n.contains(r)
                              : e.compareDocumentPosition &&
                                16 & e.compareDocumentPosition(r))
                          )
                        );
                      }
                    : function (e, t) {
                        if (t)
                          for (; (t = t.parentNode); ) if (t === e) return !0;
                        return !1;
                      }),
                (T = t
                  ? function (e, t) {
                      if (e === t) return (f = !0), 0;
                      var r =
                        !e.compareDocumentPosition - !t.compareDocumentPosition;
                      return (
                        r ||
                        (1 &
                          (r =
                            (e.ownerDocument || e) == (t.ownerDocument || t)
                              ? e.compareDocumentPosition(t)
                              : 1) ||
                        (!n.sortDetached && t.compareDocumentPosition(e) === r)
                          ? e == d || (e.ownerDocument == w && b(w, e))
                            ? -1
                            : t == d || (t.ownerDocument == w && b(w, t))
                            ? 1
                            : c
                            ? W(c, e) - W(c, t)
                            : 0
                          : 4 & r
                          ? -1
                          : 1)
                      );
                    }
                  : function (e, t) {
                      if (e === t) return (f = !0), 0;
                      var n,
                        r = 0,
                        i = e.parentNode,
                        o = t.parentNode,
                        a = [e],
                        s = [t];
                      if (!i || !o)
                        return e == d
                          ? -1
                          : t == d
                          ? 1
                          : i
                          ? -1
                          : o
                          ? 1
                          : c
                          ? W(c, e) - W(c, t)
                          : 0;
                      if (i === o) return pe(e, t);
                      for (n = e; (n = n.parentNode); ) a.unshift(n);
                      for (n = t; (n = n.parentNode); ) s.unshift(n);
                      for (; a[r] === s[r]; ) r++;
                      return r
                        ? pe(a[r], s[r])
                        : a[r] == w
                        ? -1
                        : s[r] == w
                        ? 1
                        : 0;
                    }),
                d)
              : d;
          }),
          (se.matches = function (e, t) {
            return se(e, null, null, t);
          }),
          (se.matchesSelector = function (e, t) {
            if (
              (p(e),
              n.matchesSelector &&
                g &&
                !E[t + " "] &&
                (!y || !y.test(t)) &&
                (!m || !m.test(t)))
            )
              try {
                var r = v.call(e, t);
                if (
                  r ||
                  n.disconnectedMatch ||
                  (e.document && 11 !== e.document.nodeType)
                )
                  return r;
              } catch (e) {
                E(t, !0);
              }
            return se(t, d, null, [e]).length > 0;
          }),
          (se.contains = function (e, t) {
            return (e.ownerDocument || e) != d && p(e), b(e, t);
          }),
          (se.attr = function (e, t) {
            (e.ownerDocument || e) != d && p(e);
            var i = r.attrHandle[t.toLowerCase()],
              o =
                i && N.call(r.attrHandle, t.toLowerCase())
                  ? i(e, t, !g)
                  : void 0;
            return void 0 !== o
              ? o
              : n.attributes || !g
              ? e.getAttribute(t)
              : (o = e.getAttributeNode(t)) && o.specified
              ? o.value
              : null;
          }),
          (se.escape = function (e) {
            return (e + "").replace(re, ie);
          }),
          (se.error = function (e) {
            throw new Error("Syntax error, unrecognized expression: " + e);
          }),
          (se.uniqueSort = function (e) {
            var t,
              r = [],
              i = 0,
              o = 0;
            if (
              ((f = !n.detectDuplicates),
              (c = !n.sortStable && e.slice(0)),
              e.sort(T),
              f)
            ) {
              for (; (t = e[o++]); ) t === e[o] && (i = r.push(o));
              for (; i--; ) e.splice(r[i], 1);
            }
            return (c = null), e;
          }),
          (i = se.getText = function (e) {
            var t,
              n = "",
              r = 0,
              o = e.nodeType;
            if (o) {
              if (1 === o || 9 === o || 11 === o) {
                if ("string" == typeof e.textContent) return e.textContent;
                for (e = e.firstChild; e; e = e.nextSibling) n += i(e);
              } else if (3 === o || 4 === o) return e.nodeValue;
            } else for (; (t = e[r++]); ) n += i(t);
            return n;
          }),
          ((r = se.selectors = {
            cacheLength: 50,
            createPseudo: le,
            match: V,
            attrHandle: {},
            find: {},
            relative: {
              ">": { dir: "parentNode", first: !0 },
              " ": { dir: "parentNode" },
              "+": { dir: "previousSibling", first: !0 },
              "~": { dir: "previousSibling" },
            },
            preFilter: {
              ATTR: function (e) {
                return (
                  (e[1] = e[1].replace(te, ne)),
                  (e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne)),
                  "~=" === e[2] && (e[3] = " " + e[3] + " "),
                  e.slice(0, 4)
                );
              },
              CHILD: function (e) {
                return (
                  (e[1] = e[1].toLowerCase()),
                  "nth" === e[1].slice(0, 3)
                    ? (e[3] || se.error(e[0]),
                      (e[4] = +(e[4]
                        ? e[5] + (e[6] || 1)
                        : 2 * ("even" === e[3] || "odd" === e[3]))),
                      (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                    : e[3] && se.error(e[0]),
                  e
                );
              },
              PSEUDO: function (e) {
                var t,
                  n = !e[6] && e[2];
                return V.CHILD.test(e[0])
                  ? null
                  : (e[3]
                      ? (e[2] = e[4] || e[5] || "")
                      : n &&
                        Y.test(n) &&
                        (t = a(n, !0)) &&
                        (t = n.indexOf(")", n.length - t) - n.length) &&
                        ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                    e.slice(0, 3));
              },
            },
            filter: {
              TAG: function (e) {
                var t = e.replace(te, ne).toLowerCase();
                return "*" === e
                  ? function () {
                      return !0;
                    }
                  : function (e) {
                      return e.nodeName && e.nodeName.toLowerCase() === t;
                    };
              },
              CLASS: function (e) {
                var t = C[e + " "];
                return (
                  t ||
                  ((t = new RegExp("(^|" + _ + ")" + e + "(" + _ + "|$)")) &&
                    C(e, function (e) {
                      return t.test(
                        ("string" == typeof e.className && e.className) ||
                          (void 0 !== e.getAttribute &&
                            e.getAttribute("class")) ||
                          ""
                      );
                    }))
                );
              },
              ATTR: function (e, t, n) {
                return function (r) {
                  var i = se.attr(r, e);
                  return null == i
                    ? "!=" === t
                    : !t ||
                        ((i += ""),
                        "=" === t
                          ? i === n
                          : "!=" === t
                          ? i !== n
                          : "^=" === t
                          ? n && 0 === i.indexOf(n)
                          : "*=" === t
                          ? n && i.indexOf(n) > -1
                          : "$=" === t
                          ? n && i.slice(-n.length) === n
                          : "~=" === t
                          ? (" " + i.replace(R, " ") + " ").indexOf(n) > -1
                          : "|=" === t &&
                            (i === n || i.slice(0, n.length + 1) === n + "-"));
                };
              },
              CHILD: function (e, t, n, r, i) {
                var o = "nth" !== e.slice(0, 3),
                  a = "last" !== e.slice(-4),
                  s = "of-type" === t;
                return 1 === r && 0 === i
                  ? function (e) {
                      return !!e.parentNode;
                    }
                  : function (t, n, u) {
                      var l,
                        c,
                        f,
                        p,
                        d,
                        h,
                        g = o !== a ? "nextSibling" : "previousSibling",
                        m = t.parentNode,
                        y = s && t.nodeName.toLowerCase(),
                        v = !u && !s,
                        b = !1;
                      if (m) {
                        if (o) {
                          for (; g; ) {
                            for (p = t; (p = p[g]); )
                              if (
                                s
                                  ? p.nodeName.toLowerCase() === y
                                  : 1 === p.nodeType
                              )
                                return !1;
                            h = g = "only" === e && !h && "nextSibling";
                          }
                          return !0;
                        }
                        if (((h = [a ? m.firstChild : m.lastChild]), a && v)) {
                          for (
                            b =
                              (d =
                                (l =
                                  (c =
                                    (f = (p = m)[x] || (p[x] = {}))[
                                      p.uniqueID
                                    ] || (f[p.uniqueID] = {}))[e] || [])[0] ===
                                  A && l[1]) && l[2],
                              p = d && m.childNodes[d];
                            (p = (++d && p && p[g]) || (b = d = 0) || h.pop());

                          )
                            if (1 === p.nodeType && ++b && p === t) {
                              c[e] = [A, d, b];
                              break;
                            }
                        } else if (
                          (v &&
                            (b = d =
                              (l =
                                (c =
                                  (f = (p = t)[x] || (p[x] = {}))[p.uniqueID] ||
                                  (f[p.uniqueID] = {}))[e] || [])[0] === A &&
                              l[1]),
                          !1 === b)
                        )
                          for (
                            ;
                            (p =
                              (++d && p && p[g]) || (b = d = 0) || h.pop()) &&
                            ((s
                              ? p.nodeName.toLowerCase() !== y
                              : 1 !== p.nodeType) ||
                              !++b ||
                              (v &&
                                ((c =
                                  (f = p[x] || (p[x] = {}))[p.uniqueID] ||
                                  (f[p.uniqueID] = {}))[e] = [A, b]),
                              p !== t));

                          );
                        return (b -= i) === r || (b % r == 0 && b / r >= 0);
                      }
                    };
              },
              PSEUDO: function (e, t) {
                var n,
                  i =
                    r.pseudos[e] ||
                    r.setFilters[e.toLowerCase()] ||
                    se.error("unsupported pseudo: " + e);
                return i[x]
                  ? i(t)
                  : i.length > 1
                  ? ((n = [e, e, "", t]),
                    r.setFilters.hasOwnProperty(e.toLowerCase())
                      ? le(function (e, n) {
                          for (var r, o = i(e, t), a = o.length; a--; )
                            e[(r = W(e, o[a]))] = !(n[r] = o[a]);
                        })
                      : function (e) {
                          return i(e, 0, n);
                        })
                  : i;
              },
            },
            pseudos: {
              not: le(function (e) {
                var t = [],
                  n = [],
                  r = s(e.replace(B, "$1"));
                return r[x]
                  ? le(function (e, t, n, i) {
                      for (var o, a = r(e, null, i, []), s = e.length; s--; )
                        (o = a[s]) && (e[s] = !(t[s] = o));
                    })
                  : function (e, i, o) {
                      return (
                        (t[0] = e), r(t, null, o, n), (t[0] = null), !n.pop()
                      );
                    };
              }),
              has: le(function (e) {
                return function (t) {
                  return se(e, t).length > 0;
                };
              }),
              contains: le(function (e) {
                return (
                  (e = e.replace(te, ne)),
                  function (t) {
                    return (t.textContent || i(t)).indexOf(e) > -1;
                  }
                );
              }),
              lang: le(function (e) {
                return (
                  G.test(e || "") || se.error("unsupported lang: " + e),
                  (e = e.replace(te, ne).toLowerCase()),
                  function (t) {
                    var n;
                    do {
                      if (
                        (n = g
                          ? t.lang
                          : t.getAttribute("xml:lang") ||
                            t.getAttribute("lang"))
                      )
                        return (
                          (n = n.toLowerCase()) === e ||
                          0 === n.indexOf(e + "-")
                        );
                    } while ((t = t.parentNode) && 1 === t.nodeType);
                    return !1;
                  }
                );
              }),
              target: function (t) {
                var n = e.location && e.location.hash;
                return n && n.slice(1) === t.id;
              },
              root: function (e) {
                return e === h;
              },
              focus: function (e) {
                return (
                  e === d.activeElement &&
                  (!d.hasFocus || d.hasFocus()) &&
                  !!(e.type || e.href || ~e.tabIndex)
                );
              },
              enabled: ge(!1),
              disabled: ge(!0),
              checked: function (e) {
                var t = e.nodeName.toLowerCase();
                return (
                  ("input" === t && !!e.checked) ||
                  ("option" === t && !!e.selected)
                );
              },
              selected: function (e) {
                return (
                  e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                );
              },
              empty: function (e) {
                for (e = e.firstChild; e; e = e.nextSibling)
                  if (e.nodeType < 6) return !1;
                return !0;
              },
              parent: function (e) {
                return !r.pseudos.empty(e);
              },
              header: function (e) {
                return K.test(e.nodeName);
              },
              input: function (e) {
                return J.test(e.nodeName);
              },
              button: function (e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t && "button" === e.type) || "button" === t;
              },
              text: function (e) {
                var t;
                return (
                  "input" === e.nodeName.toLowerCase() &&
                  "text" === e.type &&
                  (null == (t = e.getAttribute("type")) ||
                    "text" === t.toLowerCase())
                );
              },
              first: me(function () {
                return [0];
              }),
              last: me(function (e, t) {
                return [t - 1];
              }),
              eq: me(function (e, t, n) {
                return [n < 0 ? n + t : n];
              }),
              even: me(function (e, t) {
                for (var n = 0; n < t; n += 2) e.push(n);
                return e;
              }),
              odd: me(function (e, t) {
                for (var n = 1; n < t; n += 2) e.push(n);
                return e;
              }),
              lt: me(function (e, t, n) {
                for (var r = n < 0 ? n + t : n > t ? t : n; --r >= 0; )
                  e.push(r);
                return e;
              }),
              gt: me(function (e, t, n) {
                for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
                return e;
              }),
            },
          }).pseudos.nth = r.pseudos.eq),
          { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
            r.pseudos[t] = de(t);
          for (t in { submit: !0, reset: !0 }) r.pseudos[t] = he(t);
          function ve() {}
          function be(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
            return r;
          }
          function xe(e, t, n) {
            var r = t.dir,
              i = t.next,
              o = i || r,
              a = n && "parentNode" === o,
              s = k++;
            return t.first
              ? function (t, n, i) {
                  for (; (t = t[r]); )
                    if (1 === t.nodeType || a) return e(t, n, i);
                  return !1;
                }
              : function (t, n, u) {
                  var l,
                    c,
                    f,
                    p = [A, s];
                  if (u) {
                    for (; (t = t[r]); )
                      if ((1 === t.nodeType || a) && e(t, n, u)) return !0;
                  } else
                    for (; (t = t[r]); )
                      if (1 === t.nodeType || a)
                        if (
                          ((c =
                            (f = t[x] || (t[x] = {}))[t.uniqueID] ||
                            (f[t.uniqueID] = {})),
                          i && i === t.nodeName.toLowerCase())
                        )
                          t = t[r] || t;
                        else {
                          if ((l = c[o]) && l[0] === A && l[1] === s)
                            return (p[2] = l[2]);
                          if (((c[o] = p), (p[2] = e(t, n, u)))) return !0;
                        }
                  return !1;
                };
          }
          function we(e) {
            return e.length > 1
              ? function (t, n, r) {
                  for (var i = e.length; i--; ) if (!e[i](t, n, r)) return !1;
                  return !0;
                }
              : e[0];
          }
          function Ae(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
              (o = e[s]) && ((n && !n(o, r, i)) || (a.push(o), l && t.push(s)));
            return a;
          }
          function ke(e, t, n, r, i, o) {
            return (
              r && !r[x] && (r = ke(r)),
              i && !i[x] && (i = ke(i, o)),
              le(function (o, a, s, u) {
                var l,
                  c,
                  f,
                  p = [],
                  d = [],
                  h = a.length,
                  g =
                    o ||
                    (function (e, t, n) {
                      for (var r = 0, i = t.length; r < i; r++) se(e, t[r], n);
                      return n;
                    })(t || "*", s.nodeType ? [s] : s, []),
                  m = !e || (!o && t) ? g : Ae(g, p, e, s, u),
                  y = n ? (i || (o ? e : h || r) ? [] : a) : m;
                if ((n && n(m, y, s, u), r))
                  for (l = Ae(y, d), r(l, [], s, u), c = l.length; c--; )
                    (f = l[c]) && (y[d[c]] = !(m[d[c]] = f));
                if (o) {
                  if (i || e) {
                    if (i) {
                      for (l = [], c = y.length; c--; )
                        (f = y[c]) && l.push((m[c] = f));
                      i(null, (y = []), l, u);
                    }
                    for (c = y.length; c--; )
                      (f = y[c]) &&
                        (l = i ? W(o, f) : p[c]) > -1 &&
                        (o[l] = !(a[l] = f));
                  }
                } else (y = Ae(y === a ? y.splice(h, y.length) : y)), i ? i(null, a, y, u) : I.apply(a, y);
              })
            );
          }
          function Ce(e) {
            for (
              var t,
                n,
                i,
                o = e.length,
                a = r.relative[e[0].type],
                s = a || r.relative[" "],
                u = a ? 1 : 0,
                c = xe(
                  function (e) {
                    return e === t;
                  },
                  s,
                  !0
                ),
                f = xe(
                  function (e) {
                    return W(t, e) > -1;
                  },
                  s,
                  !0
                ),
                p = [
                  function (e, n, r) {
                    var i =
                      (!a && (r || n !== l)) ||
                      ((t = n).nodeType ? c(e, n, r) : f(e, n, r));
                    return (t = null), i;
                  },
                ];
              u < o;
              u++
            )
              if ((n = r.relative[e[u].type])) p = [xe(we(p), n)];
              else {
                if ((n = r.filter[e[u].type].apply(null, e[u].matches))[x]) {
                  for (i = ++u; i < o && !r.relative[e[i].type]; i++);
                  return ke(
                    u > 1 && we(p),
                    u > 1 &&
                      be(
                        e
                          .slice(0, u - 1)
                          .concat({ value: " " === e[u - 2].type ? "*" : "" })
                      ).replace(B, "$1"),
                    n,
                    u < i && Ce(e.slice(u, i)),
                    i < o && Ce((e = e.slice(i))),
                    i < o && be(e)
                  );
                }
                p.push(n);
              }
            return we(p);
          }
          return (
            (ve.prototype = r.filters = r.pseudos),
            (r.setFilters = new ve()),
            (a = se.tokenize = function (e, t) {
              var n,
                i,
                o,
                a,
                s,
                u,
                l,
                c = S[e + " "];
              if (c) return t ? 0 : c.slice(0);
              for (s = e, u = [], l = r.preFilter; s; ) {
                for (a in ((n && !(i = z.exec(s))) ||
                  (i && (s = s.slice(i[0].length) || s), u.push((o = []))),
                (n = !1),
                (i = U.exec(s)) &&
                  ((n = i.shift()),
                  o.push({ value: n, type: i[0].replace(B, " ") }),
                  (s = s.slice(n.length))),
                r.filter))
                  !(i = V[a].exec(s)) ||
                    (l[a] && !(i = l[a](i))) ||
                    ((n = i.shift()),
                    o.push({ value: n, type: a, matches: i }),
                    (s = s.slice(n.length)));
                if (!n) break;
              }
              return t ? s.length : s ? se.error(e) : S(e, u).slice(0);
            }),
            (s = se.compile = function (e, t) {
              var n,
                i = [],
                o = [],
                s = j[e + " "];
              if (!s) {
                for (t || (t = a(e)), n = t.length; n--; )
                  (s = Ce(t[n]))[x] ? i.push(s) : o.push(s);
                (s = j(
                  e,
                  (function (e, t) {
                    var n = t.length > 0,
                      i = e.length > 0,
                      o = function (o, a, s, u, c) {
                        var f,
                          h,
                          m,
                          y = 0,
                          v = "0",
                          b = o && [],
                          x = [],
                          w = l,
                          k = o || (i && r.find.TAG("*", c)),
                          C = (A += null == w ? 1 : Math.random() || 0.1),
                          S = k.length;
                        for (
                          c && (l = a == d || a || c);
                          v !== S && null != (f = k[v]);
                          v++
                        ) {
                          if (i && f) {
                            for (
                              h = 0,
                                a || f.ownerDocument == d || (p(f), (s = !g));
                              (m = e[h++]);

                            )
                              if (m(f, a || d, s)) {
                                u.push(f);
                                break;
                              }
                            c && (A = C);
                          }
                          n && ((f = !m && f) && y--, o && b.push(f));
                        }
                        if (((y += v), n && v !== y)) {
                          for (h = 0; (m = t[h++]); ) m(b, x, a, s);
                          if (o) {
                            if (y > 0)
                              for (; v--; ) b[v] || x[v] || (x[v] = M.call(u));
                            x = Ae(x);
                          }
                          I.apply(u, x),
                            c &&
                              !o &&
                              x.length > 0 &&
                              y + t.length > 1 &&
                              se.uniqueSort(u);
                        }
                        return c && ((A = C), (l = w)), b;
                      };
                    return n ? le(o) : o;
                  })(o, i)
                )).selector = e;
              }
              return s;
            }),
            (u = se.select = function (e, t, n, i) {
              var o,
                u,
                l,
                c,
                f,
                p = "function" == typeof e && e,
                d = !i && a((e = p.selector || e));
              if (((n = n || []), 1 === d.length)) {
                if (
                  (u = d[0] = d[0].slice(0)).length > 2 &&
                  "ID" === (l = u[0]).type &&
                  9 === t.nodeType &&
                  g &&
                  r.relative[u[1].type]
                ) {
                  if (
                    !(t = (r.find.ID(l.matches[0].replace(te, ne), t) || [])[0])
                  )
                    return n;
                  p && (t = t.parentNode),
                    (e = e.slice(u.shift().value.length));
                }
                for (
                  o = V.needsContext.test(e) ? 0 : u.length;
                  o-- && ((l = u[o]), !r.relative[(c = l.type)]);

                )
                  if (
                    (f = r.find[c]) &&
                    (i = f(
                      l.matches[0].replace(te, ne),
                      (ee.test(u[0].type) && ye(t.parentNode)) || t
                    ))
                  ) {
                    if ((u.splice(o, 1), !(e = i.length && be(u))))
                      return I.apply(n, i), n;
                    break;
                  }
              }
              return (
                (p || s(e, d))(
                  i,
                  t,
                  !g,
                  n,
                  !t || (ee.test(e) && ye(t.parentNode)) || t
                ),
                n
              );
            }),
            (n.sortStable = x.split("").sort(T).join("") === x),
            (n.detectDuplicates = !!f),
            p(),
            (n.sortDetached = ce(function (e) {
              return 1 & e.compareDocumentPosition(d.createElement("fieldset"));
            })),
            ce(function (e) {
              return (
                (e.innerHTML = "<a href='#'></a>"),
                "#" === e.firstChild.getAttribute("href")
              );
            }) ||
              fe("type|href|height|width", function (e, t, n) {
                if (!n)
                  return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
              }),
            (n.attributes &&
              ce(function (e) {
                return (
                  (e.innerHTML = "<input/>"),
                  e.firstChild.setAttribute("value", ""),
                  "" === e.firstChild.getAttribute("value")
                );
              })) ||
              fe("value", function (e, t, n) {
                if (!n && "input" === e.nodeName.toLowerCase())
                  return e.defaultValue;
              }),
            ce(function (e) {
              return null == e.getAttribute("disabled");
            }) ||
              fe(F, function (e, t, n) {
                var r;
                if (!n)
                  return !0 === e[t]
                    ? t.toLowerCase()
                    : (r = e.getAttributeNode(t)) && r.specified
                    ? r.value
                    : null;
              }),
            se
          );
        })(n);
      (k.find = S),
        (k.expr = S.selectors),
        (k.expr[":"] = k.expr.pseudos),
        (k.uniqueSort = k.unique = S.uniqueSort),
        (k.text = S.getText),
        (k.isXMLDoc = S.isXML),
        (k.contains = S.contains),
        (k.escapeSelector = S.escape);
      var j = function (e, t, n) {
          for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
              if (i && k(e).is(n)) break;
              r.push(e);
            }
          return r;
        },
        E = function (e, t) {
          for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
          return n;
        },
        T = k.expr.match.needsContext;
      function N(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
      }
      var O = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function M(e, t, n) {
        return y(t)
          ? k.grep(e, function (e, r) {
              return !!t.call(e, r, e) !== n;
            })
          : t.nodeType
          ? k.grep(e, function (e) {
              return (e === t) !== n;
            })
          : "string" != typeof t
          ? k.grep(e, function (e) {
              return c.call(t, e) > -1 !== n;
            })
          : k.filter(t, e, n);
      }
      (k.filter = function (e, t, n) {
        var r = t[0];
        return (
          n && (e = ":not(" + e + ")"),
          1 === t.length && 1 === r.nodeType
            ? k.find.matchesSelector(r, e)
              ? [r]
              : []
            : k.find.matches(
                e,
                k.grep(t, function (e) {
                  return 1 === e.nodeType;
                })
              )
        );
      }),
        k.fn.extend({
          find: function (e) {
            var t,
              n,
              r = this.length,
              i = this;
            if ("string" != typeof e)
              return this.pushStack(
                k(e).filter(function () {
                  for (t = 0; t < r; t++) if (k.contains(i[t], this)) return !0;
                })
              );
            for (n = this.pushStack([]), t = 0; t < r; t++) k.find(e, i[t], n);
            return r > 1 ? k.uniqueSort(n) : n;
          },
          filter: function (e) {
            return this.pushStack(M(this, e || [], !1));
          },
          not: function (e) {
            return this.pushStack(M(this, e || [], !0));
          },
          is: function (e) {
            return !!M(
              this,
              "string" == typeof e && T.test(e) ? k(e) : e || [],
              !1
            ).length;
          },
        });
      var L,
        I = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
      ((k.fn.init = function (e, t, n) {
        var r, i;
        if (!e) return this;
        if (((n = n || L), "string" == typeof e)) {
          if (
            !(r =
              "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3
                ? [null, e, null]
                : I.exec(e)) ||
            (!r[1] && t)
          )
            return !t || t.jquery
              ? (t || n).find(e)
              : this.constructor(t).find(e);
          if (r[1]) {
            if (
              ((t = t instanceof k ? t[0] : t),
              k.merge(
                this,
                k.parseHTML(
                  r[1],
                  t && t.nodeType ? t.ownerDocument || t : b,
                  !0
                )
              ),
              O.test(r[1]) && k.isPlainObject(t))
            )
              for (r in t) y(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
            return this;
          }
          return (
            (i = b.getElementById(r[2])) && ((this[0] = i), (this.length = 1)),
            this
          );
        }
        return e.nodeType
          ? ((this[0] = e), (this.length = 1), this)
          : y(e)
          ? void 0 !== n.ready
            ? n.ready(e)
            : e(k)
          : k.makeArray(e, this);
      }).prototype = k.fn),
        (L = k(b));
      var D = /^(?:parents|prev(?:Until|All))/,
        W = { children: !0, contents: !0, next: !0, prev: !0 };
      function F(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; );
        return e;
      }
      k.fn.extend({
        has: function (e) {
          var t = k(e, this),
            n = t.length;
          return this.filter(function () {
            for (var e = 0; e < n; e++) if (k.contains(this, t[e])) return !0;
          });
        },
        closest: function (e, t) {
          var n,
            r = 0,
            i = this.length,
            o = [],
            a = "string" != typeof e && k(e);
          if (!T.test(e))
            for (; r < i; r++)
              for (n = this[r]; n && n !== t; n = n.parentNode)
                if (
                  n.nodeType < 11 &&
                  (a
                    ? a.index(n) > -1
                    : 1 === n.nodeType && k.find.matchesSelector(n, e))
                ) {
                  o.push(n);
                  break;
                }
          return this.pushStack(o.length > 1 ? k.uniqueSort(o) : o);
        },
        index: function (e) {
          return e
            ? "string" == typeof e
              ? c.call(k(e), this[0])
              : c.call(this, e.jquery ? e[0] : e)
            : this[0] && this[0].parentNode
            ? this.first().prevAll().length
            : -1;
        },
        add: function (e, t) {
          return this.pushStack(k.uniqueSort(k.merge(this.get(), k(e, t))));
        },
        addBack: function (e) {
          return this.add(
            null == e ? this.prevObject : this.prevObject.filter(e)
          );
        },
      }),
        k.each(
          {
            parent: function (e) {
              var t = e.parentNode;
              return t && 11 !== t.nodeType ? t : null;
            },
            parents: function (e) {
              return j(e, "parentNode");
            },
            parentsUntil: function (e, t, n) {
              return j(e, "parentNode", n);
            },
            next: function (e) {
              return F(e, "nextSibling");
            },
            prev: function (e) {
              return F(e, "previousSibling");
            },
            nextAll: function (e) {
              return j(e, "nextSibling");
            },
            prevAll: function (e) {
              return j(e, "previousSibling");
            },
            nextUntil: function (e, t, n) {
              return j(e, "nextSibling", n);
            },
            prevUntil: function (e, t, n) {
              return j(e, "previousSibling", n);
            },
            siblings: function (e) {
              return E((e.parentNode || {}).firstChild, e);
            },
            children: function (e) {
              return E(e.firstChild);
            },
            contents: function (e) {
              return null != e.contentDocument && a(e.contentDocument)
                ? e.contentDocument
                : (N(e, "template") && (e = e.content || e),
                  k.merge([], e.childNodes));
            },
          },
          function (e, t) {
            k.fn[e] = function (n, r) {
              var i = k.map(this, t, n);
              return (
                "Until" !== e.slice(-5) && (r = n),
                r && "string" == typeof r && (i = k.filter(r, i)),
                this.length > 1 &&
                  (W[e] || k.uniqueSort(i), D.test(e) && i.reverse()),
                this.pushStack(i)
              );
            };
          }
        );
      var _ = /[^\x20\t\r\n\f]+/g;
      function P(e) {
        return e;
      }
      function q(e) {
        throw e;
      }
      function H(e, t, n, r) {
        var i;
        try {
          e && y((i = e.promise))
            ? i.call(e).done(t).fail(n)
            : e && y((i = e.then))
            ? i.call(e, t, n)
            : t.apply(void 0, [e].slice(r));
        } catch (e) {
          n.apply(void 0, [e]);
        }
      }
      (k.Callbacks = function (e) {
        e =
          "string" == typeof e
            ? (function (e) {
                var t = {};
                return (
                  k.each(e.match(_) || [], function (e, n) {
                    t[n] = !0;
                  }),
                  t
                );
              })(e)
            : k.extend({}, e);
        var t,
          n,
          r,
          i,
          o = [],
          a = [],
          s = -1,
          u = function () {
            for (i = i || e.once, r = t = !0; a.length; s = -1)
              for (n = a.shift(); ++s < o.length; )
                !1 === o[s].apply(n[0], n[1]) &&
                  e.stopOnFalse &&
                  ((s = o.length), (n = !1));
            e.memory || (n = !1), (t = !1), i && (o = n ? [] : "");
          },
          l = {
            add: function () {
              return (
                o &&
                  (n && !t && ((s = o.length - 1), a.push(n)),
                  (function t(n) {
                    k.each(n, function (n, r) {
                      y(r)
                        ? (e.unique && l.has(r)) || o.push(r)
                        : r && r.length && "string" !== A(r) && t(r);
                    });
                  })(arguments),
                  n && !t && u()),
                this
              );
            },
            remove: function () {
              return (
                k.each(arguments, function (e, t) {
                  for (var n; (n = k.inArray(t, o, n)) > -1; )
                    o.splice(n, 1), n <= s && s--;
                }),
                this
              );
            },
            has: function (e) {
              return e ? k.inArray(e, o) > -1 : o.length > 0;
            },
            empty: function () {
              return o && (o = []), this;
            },
            disable: function () {
              return (i = a = []), (o = n = ""), this;
            },
            disabled: function () {
              return !o;
            },
            lock: function () {
              return (i = a = []), n || t || (o = n = ""), this;
            },
            locked: function () {
              return !!i;
            },
            fireWith: function (e, n) {
              return (
                i ||
                  ((n = [e, (n = n || []).slice ? n.slice() : n]),
                  a.push(n),
                  t || u()),
                this
              );
            },
            fire: function () {
              return l.fireWith(this, arguments), this;
            },
            fired: function () {
              return !!r;
            },
          };
        return l;
      }),
        k.extend({
          Deferred: function (e) {
            var t = [
                [
                  "notify",
                  "progress",
                  k.Callbacks("memory"),
                  k.Callbacks("memory"),
                  2,
                ],
                [
                  "resolve",
                  "done",
                  k.Callbacks("once memory"),
                  k.Callbacks("once memory"),
                  0,
                  "resolved",
                ],
                [
                  "reject",
                  "fail",
                  k.Callbacks("once memory"),
                  k.Callbacks("once memory"),
                  1,
                  "rejected",
                ],
              ],
              r = "pending",
              i = {
                state: function () {
                  return r;
                },
                always: function () {
                  return o.done(arguments).fail(arguments), this;
                },
                catch: function (e) {
                  return i.then(null, e);
                },
                pipe: function () {
                  var e = arguments;
                  return k
                    .Deferred(function (n) {
                      k.each(t, function (t, r) {
                        var i = y(e[r[4]]) && e[r[4]];
                        o[r[1]](function () {
                          var e = i && i.apply(this, arguments);
                          e && y(e.promise)
                            ? e
                                .promise()
                                .progress(n.notify)
                                .done(n.resolve)
                                .fail(n.reject)
                            : n[r[0] + "With"](this, i ? [e] : arguments);
                        });
                      }),
                        (e = null);
                    })
                    .promise();
                },
                then: function (e, r, i) {
                  var o = 0;
                  function a(e, t, r, i) {
                    return function () {
                      var s = this,
                        u = arguments,
                        l = function () {
                          var n, l;
                          if (!(e < o)) {
                            if ((n = r.apply(s, u)) === t.promise())
                              throw new TypeError("Thenable self-resolution");
                            (l =
                              n &&
                              ("object" == typeof n ||
                                "function" == typeof n) &&
                              n.then),
                              y(l)
                                ? i
                                  ? l.call(n, a(o, t, P, i), a(o, t, q, i))
                                  : (o++,
                                    l.call(
                                      n,
                                      a(o, t, P, i),
                                      a(o, t, q, i),
                                      a(o, t, P, t.notifyWith)
                                    ))
                                : (r !== P && ((s = void 0), (u = [n])),
                                  (i || t.resolveWith)(s, u));
                          }
                        },
                        c = i
                          ? l
                          : function () {
                              try {
                                l();
                              } catch (n) {
                                k.Deferred.exceptionHook &&
                                  k.Deferred.exceptionHook(n, c.stackTrace),
                                  e + 1 >= o &&
                                    (r !== q && ((s = void 0), (u = [n])),
                                    t.rejectWith(s, u));
                              }
                            };
                      e
                        ? c()
                        : (k.Deferred.getStackHook &&
                            (c.stackTrace = k.Deferred.getStackHook()),
                          n.setTimeout(c));
                    };
                  }
                  return k
                    .Deferred(function (n) {
                      t[0][3].add(a(0, n, y(i) ? i : P, n.notifyWith)),
                        t[1][3].add(a(0, n, y(e) ? e : P)),
                        t[2][3].add(a(0, n, y(r) ? r : q));
                    })
                    .promise();
                },
                promise: function (e) {
                  return null != e ? k.extend(e, i) : i;
                },
              },
              o = {};
            return (
              k.each(t, function (e, n) {
                var a = n[2],
                  s = n[5];
                (i[n[1]] = a.add),
                  s &&
                    a.add(
                      function () {
                        r = s;
                      },
                      t[3 - e][2].disable,
                      t[3 - e][3].disable,
                      t[0][2].lock,
                      t[0][3].lock
                    ),
                  a.add(n[3].fire),
                  (o[n[0]] = function () {
                    return (
                      o[n[0] + "With"](this === o ? void 0 : this, arguments),
                      this
                    );
                  }),
                  (o[n[0] + "With"] = a.fireWith);
              }),
              i.promise(o),
              e && e.call(o, o),
              o
            );
          },
          when: function (e) {
            var t = arguments.length,
              n = t,
              r = Array(n),
              i = s.call(arguments),
              o = k.Deferred(),
              a = function (e) {
                return function (n) {
                  (r[e] = this),
                    (i[e] = arguments.length > 1 ? s.call(arguments) : n),
                    --t || o.resolveWith(r, i);
                };
              };
            if (
              t <= 1 &&
              (H(e, o.done(a(n)).resolve, o.reject, !t),
              "pending" === o.state() || y(i[n] && i[n].then))
            )
              return o.then();
            for (; n--; ) H(i[n], a(n), o.reject);
            return o.promise();
          },
        });
      var R = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      (k.Deferred.exceptionHook = function (e, t) {
        n.console &&
          n.console.warn &&
          e &&
          R.test(e.name) &&
          n.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
      }),
        (k.readyException = function (e) {
          n.setTimeout(function () {
            throw e;
          });
        });
      var B = k.Deferred();
      function z() {
        b.removeEventListener("DOMContentLoaded", z),
          n.removeEventListener("load", z),
          k.ready();
      }
      (k.fn.ready = function (e) {
        return (
          B.then(e).catch(function (e) {
            k.readyException(e);
          }),
          this
        );
      }),
        k.extend({
          isReady: !1,
          readyWait: 1,
          ready: function (e) {
            (!0 === e ? --k.readyWait : k.isReady) ||
              ((k.isReady = !0),
              (!0 !== e && --k.readyWait > 0) || B.resolveWith(b, [k]));
          },
        }),
        (k.ready.then = B.then),
        "complete" === b.readyState ||
        ("loading" !== b.readyState && !b.documentElement.doScroll)
          ? n.setTimeout(k.ready)
          : (b.addEventListener("DOMContentLoaded", z),
            n.addEventListener("load", z));
      var U = function (e, t, n, r, i, o, a) {
          var s = 0,
            u = e.length,
            l = null == n;
          if ("object" === A(n))
            for (s in ((i = !0), n)) U(e, t, s, n[s], !0, o, a);
          else if (
            void 0 !== r &&
            ((i = !0),
            y(r) || (a = !0),
            l &&
              (a
                ? (t.call(e, r), (t = null))
                : ((l = t),
                  (t = function (e, t, n) {
                    return l.call(k(e), n);
                  }))),
            t)
          )
            for (; s < u; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
          return i ? e : l ? t.call(e) : u ? t(e[0], n) : o;
        },
        $ = /^-ms-/,
        Y = /-([a-z])/g;
      function G(e, t) {
        return t.toUpperCase();
      }
      function V(e) {
        return e.replace($, "ms-").replace(Y, G);
      }
      var X = function (e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
      };
      function J() {
        this.expando = k.expando + J.uid++;
      }
      (J.uid = 1),
        (J.prototype = {
          cache: function (e) {
            var t = e[this.expando];
            return (
              t ||
                ((t = {}),
                X(e) &&
                  (e.nodeType
                    ? (e[this.expando] = t)
                    : Object.defineProperty(e, this.expando, {
                        value: t,
                        configurable: !0,
                      }))),
              t
            );
          },
          set: function (e, t, n) {
            var r,
              i = this.cache(e);
            if ("string" == typeof t) i[V(t)] = n;
            else for (r in t) i[V(r)] = t[r];
            return i;
          },
          get: function (e, t) {
            return void 0 === t
              ? this.cache(e)
              : e[this.expando] && e[this.expando][V(t)];
          },
          access: function (e, t, n) {
            return void 0 === t || (t && "string" == typeof t && void 0 === n)
              ? this.get(e, t)
              : (this.set(e, t, n), void 0 !== n ? n : t);
          },
          remove: function (e, t) {
            var n,
              r = e[this.expando];
            if (void 0 !== r) {
              if (void 0 !== t) {
                n = (t = Array.isArray(t)
                  ? t.map(V)
                  : (t = V(t)) in r
                  ? [t]
                  : t.match(_) || []).length;
                for (; n--; ) delete r[t[n]];
              }
              (void 0 === t || k.isEmptyObject(r)) &&
                (e.nodeType
                  ? (e[this.expando] = void 0)
                  : delete e[this.expando]);
            }
          },
          hasData: function (e) {
            var t = e[this.expando];
            return void 0 !== t && !k.isEmptyObject(t);
          },
        });
      var K = new J(),
        Q = new J(),
        Z = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        ee = /[A-Z]/g;
      function te(e, t, n) {
        var r;
        if (void 0 === n && 1 === e.nodeType)
          if (
            ((r = "data-" + t.replace(ee, "-$&").toLowerCase()),
            "string" == typeof (n = e.getAttribute(r)))
          ) {
            try {
              n = (function (e) {
                return (
                  "true" === e ||
                  ("false" !== e &&
                    ("null" === e
                      ? null
                      : e === +e + ""
                      ? +e
                      : Z.test(e)
                      ? JSON.parse(e)
                      : e))
                );
              })(n);
            } catch (e) {}
            Q.set(e, t, n);
          } else n = void 0;
        return n;
      }
      k.extend({
        hasData: function (e) {
          return Q.hasData(e) || K.hasData(e);
        },
        data: function (e, t, n) {
          return Q.access(e, t, n);
        },
        removeData: function (e, t) {
          Q.remove(e, t);
        },
        _data: function (e, t, n) {
          return K.access(e, t, n);
        },
        _removeData: function (e, t) {
          K.remove(e, t);
        },
      }),
        k.fn.extend({
          data: function (e, t) {
            var n,
              r,
              i,
              o = this[0],
              a = o && o.attributes;
            if (void 0 === e) {
              if (
                this.length &&
                ((i = Q.get(o)), 1 === o.nodeType && !K.get(o, "hasDataAttrs"))
              ) {
                for (n = a.length; n--; )
                  a[n] &&
                    0 === (r = a[n].name).indexOf("data-") &&
                    ((r = V(r.slice(5))), te(o, r, i[r]));
                K.set(o, "hasDataAttrs", !0);
              }
              return i;
            }
            return "object" == typeof e
              ? this.each(function () {
                  Q.set(this, e);
                })
              : U(
                  this,
                  function (t) {
                    var n;
                    if (o && void 0 === t)
                      return void 0 !== (n = Q.get(o, e)) ||
                        void 0 !== (n = te(o, e))
                        ? n
                        : void 0;
                    this.each(function () {
                      Q.set(this, e, t);
                    });
                  },
                  null,
                  t,
                  arguments.length > 1,
                  null,
                  !0
                );
          },
          removeData: function (e) {
            return this.each(function () {
              Q.remove(this, e);
            });
          },
        }),
        k.extend({
          queue: function (e, t, n) {
            var r;
            if (e)
              return (
                (t = (t || "fx") + "queue"),
                (r = K.get(e, t)),
                n &&
                  (!r || Array.isArray(n)
                    ? (r = K.access(e, t, k.makeArray(n)))
                    : r.push(n)),
                r || []
              );
          },
          dequeue: function (e, t) {
            t = t || "fx";
            var n = k.queue(e, t),
              r = n.length,
              i = n.shift(),
              o = k._queueHooks(e, t);
            "inprogress" === i && ((i = n.shift()), r--),
              i &&
                ("fx" === t && n.unshift("inprogress"),
                delete o.stop,
                i.call(
                  e,
                  function () {
                    k.dequeue(e, t);
                  },
                  o
                )),
              !r && o && o.empty.fire();
          },
          _queueHooks: function (e, t) {
            var n = t + "queueHooks";
            return (
              K.get(e, n) ||
              K.access(e, n, {
                empty: k.Callbacks("once memory").add(function () {
                  K.remove(e, [t + "queue", n]);
                }),
              })
            );
          },
        }),
        k.fn.extend({
          queue: function (e, t) {
            var n = 2;
            return (
              "string" != typeof e && ((t = e), (e = "fx"), n--),
              arguments.length < n
                ? k.queue(this[0], e)
                : void 0 === t
                ? this
                : this.each(function () {
                    var n = k.queue(this, e, t);
                    k._queueHooks(this, e),
                      "fx" === e && "inprogress" !== n[0] && k.dequeue(this, e);
                  })
            );
          },
          dequeue: function (e) {
            return this.each(function () {
              k.dequeue(this, e);
            });
          },
          clearQueue: function (e) {
            return this.queue(e || "fx", []);
          },
          promise: function (e, t) {
            var n,
              r = 1,
              i = k.Deferred(),
              o = this,
              a = this.length,
              s = function () {
                --r || i.resolveWith(o, [o]);
              };
            for (
              "string" != typeof e && ((t = e), (e = void 0)), e = e || "fx";
              a--;

            )
              (n = K.get(o[a], e + "queueHooks")) &&
                n.empty &&
                (r++, n.empty.add(s));
            return s(), i.promise(t);
          },
        });
      var ne = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        re = new RegExp("^(?:([+-])=|)(" + ne + ")([a-z%]*)$", "i"),
        ie = ["Top", "Right", "Bottom", "Left"],
        oe = b.documentElement,
        ae = function (e) {
          return k.contains(e.ownerDocument, e);
        },
        se = { composed: !0 };
      oe.getRootNode &&
        (ae = function (e) {
          return (
            k.contains(e.ownerDocument, e) ||
            e.getRootNode(se) === e.ownerDocument
          );
        });
      var ue = function (e, t) {
        return (
          "none" === (e = t || e).style.display ||
          ("" === e.style.display && ae(e) && "none" === k.css(e, "display"))
        );
      };
      function le(e, t, n, r) {
        var i,
          o,
          a = 20,
          s = r
            ? function () {
                return r.cur();
              }
            : function () {
                return k.css(e, t, "");
              },
          u = s(),
          l = (n && n[3]) || (k.cssNumber[t] ? "" : "px"),
          c =
            e.nodeType &&
            (k.cssNumber[t] || ("px" !== l && +u)) &&
            re.exec(k.css(e, t));
        if (c && c[3] !== l) {
          for (u /= 2, l = l || c[3], c = +u || 1; a--; )
            k.style(e, t, c + l),
              (1 - o) * (1 - (o = s() / u || 0.5)) <= 0 && (a = 0),
              (c /= o);
          (c *= 2), k.style(e, t, c + l), (n = n || []);
        }
        return (
          n &&
            ((c = +c || +u || 0),
            (i = n[1] ? c + (n[1] + 1) * n[2] : +n[2]),
            r && ((r.unit = l), (r.start = c), (r.end = i))),
          i
        );
      }
      var ce = {};
      function fe(e) {
        var t,
          n = e.ownerDocument,
          r = e.nodeName,
          i = ce[r];
        return (
          i ||
          ((t = n.body.appendChild(n.createElement(r))),
          (i = k.css(t, "display")),
          t.parentNode.removeChild(t),
          "none" === i && (i = "block"),
          (ce[r] = i),
          i)
        );
      }
      function pe(e, t) {
        for (var n, r, i = [], o = 0, a = e.length; o < a; o++)
          (r = e[o]).style &&
            ((n = r.style.display),
            t
              ? ("none" === n &&
                  ((i[o] = K.get(r, "display") || null),
                  i[o] || (r.style.display = "")),
                "" === r.style.display && ue(r) && (i[o] = fe(r)))
              : "none" !== n && ((i[o] = "none"), K.set(r, "display", n)));
        for (o = 0; o < a; o++) null != i[o] && (e[o].style.display = i[o]);
        return e;
      }
      k.fn.extend({
        show: function () {
          return pe(this, !0);
        },
        hide: function () {
          return pe(this);
        },
        toggle: function (e) {
          return "boolean" == typeof e
            ? e
              ? this.show()
              : this.hide()
            : this.each(function () {
                ue(this) ? k(this).show() : k(this).hide();
              });
        },
      });
      var de,
        he,
        ge = /^(?:checkbox|radio)$/i,
        me = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
        ye = /^$|^module$|\/(?:java|ecma)script/i;
      (de = b.createDocumentFragment().appendChild(b.createElement("div"))),
        (he = b.createElement("input")).setAttribute("type", "radio"),
        he.setAttribute("checked", "checked"),
        he.setAttribute("name", "t"),
        de.appendChild(he),
        (m.checkClone = de.cloneNode(!0).cloneNode(!0).lastChild.checked),
        (de.innerHTML = "<textarea>x</textarea>"),
        (m.noCloneChecked = !!de.cloneNode(!0).lastChild.defaultValue),
        (de.innerHTML = "<option></option>"),
        (m.option = !!de.lastChild);
      var ve = {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""],
      };
      function be(e, t) {
        var n;
        return (
          (n =
            void 0 !== e.getElementsByTagName
              ? e.getElementsByTagName(t || "*")
              : void 0 !== e.querySelectorAll
              ? e.querySelectorAll(t || "*")
              : []),
          void 0 === t || (t && N(e, t)) ? k.merge([e], n) : n
        );
      }
      function xe(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
          K.set(e[n], "globalEval", !t || K.get(t[n], "globalEval"));
      }
      (ve.tbody = ve.tfoot = ve.colgroup = ve.caption = ve.thead),
        (ve.th = ve.td),
        m.option ||
          (ve.optgroup = ve.option = [
            1,
            "<select multiple='multiple'>",
            "</select>",
          ]);
      var we = /<|&#?\w+;/;
      function Ae(e, t, n, r, i) {
        for (
          var o,
            a,
            s,
            u,
            l,
            c,
            f = t.createDocumentFragment(),
            p = [],
            d = 0,
            h = e.length;
          d < h;
          d++
        )
          if ((o = e[d]) || 0 === o)
            if ("object" === A(o)) k.merge(p, o.nodeType ? [o] : o);
            else if (we.test(o)) {
              for (
                a = a || f.appendChild(t.createElement("div")),
                  s = (me.exec(o) || ["", ""])[1].toLowerCase(),
                  u = ve[s] || ve._default,
                  a.innerHTML = u[1] + k.htmlPrefilter(o) + u[2],
                  c = u[0];
                c--;

              )
                a = a.lastChild;
              k.merge(p, a.childNodes), ((a = f.firstChild).textContent = "");
            } else p.push(t.createTextNode(o));
        for (f.textContent = "", d = 0; (o = p[d++]); )
          if (r && k.inArray(o, r) > -1) i && i.push(o);
          else if (
            ((l = ae(o)), (a = be(f.appendChild(o), "script")), l && xe(a), n)
          )
            for (c = 0; (o = a[c++]); ) ye.test(o.type || "") && n.push(o);
        return f;
      }
      var ke = /^key/,
        Ce = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        Se = /^([^.]*)(?:\.(.+)|)/;
      function je() {
        return !0;
      }
      function Ee() {
        return !1;
      }
      function Te(e, t) {
        return (
          (e ===
            (function () {
              try {
                return b.activeElement;
              } catch (e) {}
            })()) ==
          ("focus" === t)
        );
      }
      function Ne(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
          for (s in ("string" != typeof n && ((r = r || n), (n = void 0)), t))
            Ne(e, s, n, r, t[s], o);
          return e;
        }
        if (
          (null == r && null == i
            ? ((i = n), (r = n = void 0))
            : null == i &&
              ("string" == typeof n
                ? ((i = r), (r = void 0))
                : ((i = r), (r = n), (n = void 0))),
          !1 === i)
        )
          i = Ee;
        else if (!i) return e;
        return (
          1 === o &&
            ((a = i),
            ((i = function (e) {
              return k().off(e), a.apply(this, arguments);
            }).guid = a.guid || (a.guid = k.guid++))),
          e.each(function () {
            k.event.add(this, t, i, r, n);
          })
        );
      }
      function Oe(e, t, n) {
        n
          ? (K.set(e, t, !1),
            k.event.add(e, t, {
              namespace: !1,
              handler: function (e) {
                var r,
                  i,
                  o = K.get(this, t);
                if (1 & e.isTrigger && this[t]) {
                  if (o.length)
                    (k.event.special[t] || {}).delegateType &&
                      e.stopPropagation();
                  else if (
                    ((o = s.call(arguments)),
                    K.set(this, t, o),
                    (r = n(this, t)),
                    this[t](),
                    o !== (i = K.get(this, t)) || r
                      ? K.set(this, t, !1)
                      : (i = {}),
                    o !== i)
                  )
                    return (
                      e.stopImmediatePropagation(), e.preventDefault(), i.value
                    );
                } else
                  o.length &&
                    (K.set(this, t, {
                      value: k.event.trigger(
                        k.extend(o[0], k.Event.prototype),
                        o.slice(1),
                        this
                      ),
                    }),
                    e.stopImmediatePropagation());
              },
            }))
          : void 0 === K.get(e, t) && k.event.add(e, t, je);
      }
      (k.event = {
        global: {},
        add: function (e, t, n, r, i) {
          var o,
            a,
            s,
            u,
            l,
            c,
            f,
            p,
            d,
            h,
            g,
            m = K.get(e);
          if (X(e))
            for (
              n.handler && ((n = (o = n).handler), (i = o.selector)),
                i && k.find.matchesSelector(oe, i),
                n.guid || (n.guid = k.guid++),
                (u = m.events) || (u = m.events = Object.create(null)),
                (a = m.handle) ||
                  (a = m.handle = function (t) {
                    return void 0 !== k && k.event.triggered !== t.type
                      ? k.event.dispatch.apply(e, arguments)
                      : void 0;
                  }),
                l = (t = (t || "").match(_) || [""]).length;
              l--;

            )
              (d = g = (s = Se.exec(t[l]) || [])[1]),
                (h = (s[2] || "").split(".").sort()),
                d &&
                  ((f = k.event.special[d] || {}),
                  (d = (i ? f.delegateType : f.bindType) || d),
                  (f = k.event.special[d] || {}),
                  (c = k.extend(
                    {
                      type: d,
                      origType: g,
                      data: r,
                      handler: n,
                      guid: n.guid,
                      selector: i,
                      needsContext: i && k.expr.match.needsContext.test(i),
                      namespace: h.join("."),
                    },
                    o
                  )),
                  (p = u[d]) ||
                    (((p = u[d] = []).delegateCount = 0),
                    (f.setup && !1 !== f.setup.call(e, r, h, a)) ||
                      (e.addEventListener && e.addEventListener(d, a))),
                  f.add &&
                    (f.add.call(e, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                  i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                  (k.event.global[d] = !0));
        },
        remove: function (e, t, n, r, i) {
          var o,
            a,
            s,
            u,
            l,
            c,
            f,
            p,
            d,
            h,
            g,
            m = K.hasData(e) && K.get(e);
          if (m && (u = m.events)) {
            for (l = (t = (t || "").match(_) || [""]).length; l--; )
              if (
                ((d = g = (s = Se.exec(t[l]) || [])[1]),
                (h = (s[2] || "").split(".").sort()),
                d)
              ) {
                for (
                  f = k.event.special[d] || {},
                    p = u[(d = (r ? f.delegateType : f.bindType) || d)] || [],
                    s =
                      s[2] &&
                      new RegExp(
                        "(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"
                      ),
                    a = o = p.length;
                  o--;

                )
                  (c = p[o]),
                    (!i && g !== c.origType) ||
                      (n && n.guid !== c.guid) ||
                      (s && !s.test(c.namespace)) ||
                      (r && r !== c.selector && ("**" !== r || !c.selector)) ||
                      (p.splice(o, 1),
                      c.selector && p.delegateCount--,
                      f.remove && f.remove.call(e, c));
                a &&
                  !p.length &&
                  ((f.teardown && !1 !== f.teardown.call(e, h, m.handle)) ||
                    k.removeEvent(e, d, m.handle),
                  delete u[d]);
              } else for (d in u) k.event.remove(e, d + t[l], n, r, !0);
            k.isEmptyObject(u) && K.remove(e, "handle events");
          }
        },
        dispatch: function (e) {
          var t,
            n,
            r,
            i,
            o,
            a,
            s = new Array(arguments.length),
            u = k.event.fix(e),
            l = (K.get(this, "events") || Object.create(null))[u.type] || [],
            c = k.event.special[u.type] || {};
          for (s[0] = u, t = 1; t < arguments.length; t++) s[t] = arguments[t];
          if (
            ((u.delegateTarget = this),
            !c.preDispatch || !1 !== c.preDispatch.call(this, u))
          ) {
            for (
              a = k.event.handlers.call(this, u, l), t = 0;
              (i = a[t++]) && !u.isPropagationStopped();

            )
              for (
                u.currentTarget = i.elem, n = 0;
                (o = i.handlers[n++]) && !u.isImmediatePropagationStopped();

              )
                (u.rnamespace &&
                  !1 !== o.namespace &&
                  !u.rnamespace.test(o.namespace)) ||
                  ((u.handleObj = o),
                  (u.data = o.data),
                  void 0 !==
                    (r = (
                      (k.event.special[o.origType] || {}).handle || o.handler
                    ).apply(i.elem, s)) &&
                    !1 === (u.result = r) &&
                    (u.preventDefault(), u.stopPropagation()));
            return c.postDispatch && c.postDispatch.call(this, u), u.result;
          }
        },
        handlers: function (e, t) {
          var n,
            r,
            i,
            o,
            a,
            s = [],
            u = t.delegateCount,
            l = e.target;
          if (u && l.nodeType && !("click" === e.type && e.button >= 1))
            for (; l !== this; l = l.parentNode || this)
              if (
                1 === l.nodeType &&
                ("click" !== e.type || !0 !== l.disabled)
              ) {
                for (o = [], a = {}, n = 0; n < u; n++)
                  void 0 === a[(i = (r = t[n]).selector + " ")] &&
                    (a[i] = r.needsContext
                      ? k(i, this).index(l) > -1
                      : k.find(i, this, null, [l]).length),
                    a[i] && o.push(r);
                o.length && s.push({ elem: l, handlers: o });
              }
          return (
            (l = this),
            u < t.length && s.push({ elem: l, handlers: t.slice(u) }),
            s
          );
        },
        addProp: function (e, t) {
          Object.defineProperty(k.Event.prototype, e, {
            enumerable: !0,
            configurable: !0,
            get: y(t)
              ? function () {
                  if (this.originalEvent) return t(this.originalEvent);
                }
              : function () {
                  if (this.originalEvent) return this.originalEvent[e];
                },
            set: function (t) {
              Object.defineProperty(this, e, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: t,
              });
            },
          });
        },
        fix: function (e) {
          return e[k.expando] ? e : new k.Event(e);
        },
        special: {
          load: { noBubble: !0 },
          click: {
            setup: function (e) {
              var t = this || e;
              return (
                ge.test(t.type) &&
                  t.click &&
                  N(t, "input") &&
                  Oe(t, "click", je),
                !1
              );
            },
            trigger: function (e) {
              var t = this || e;
              return (
                ge.test(t.type) && t.click && N(t, "input") && Oe(t, "click"),
                !0
              );
            },
            _default: function (e) {
              var t = e.target;
              return (
                (ge.test(t.type) &&
                  t.click &&
                  N(t, "input") &&
                  K.get(t, "click")) ||
                N(t, "a")
              );
            },
          },
          beforeunload: {
            postDispatch: function (e) {
              void 0 !== e.result &&
                e.originalEvent &&
                (e.originalEvent.returnValue = e.result);
            },
          },
        },
      }),
        (k.removeEvent = function (e, t, n) {
          e.removeEventListener && e.removeEventListener(t, n);
        }),
        (k.Event = function (e, t) {
          if (!(this instanceof k.Event)) return new k.Event(e, t);
          e && e.type
            ? ((this.originalEvent = e),
              (this.type = e.type),
              (this.isDefaultPrevented =
                e.defaultPrevented ||
                (void 0 === e.defaultPrevented && !1 === e.returnValue)
                  ? je
                  : Ee),
              (this.target =
                e.target && 3 === e.target.nodeType
                  ? e.target.parentNode
                  : e.target),
              (this.currentTarget = e.currentTarget),
              (this.relatedTarget = e.relatedTarget))
            : (this.type = e),
            t && k.extend(this, t),
            (this.timeStamp = (e && e.timeStamp) || Date.now()),
            (this[k.expando] = !0);
        }),
        (k.Event.prototype = {
          constructor: k.Event,
          isDefaultPrevented: Ee,
          isPropagationStopped: Ee,
          isImmediatePropagationStopped: Ee,
          isSimulated: !1,
          preventDefault: function () {
            var e = this.originalEvent;
            (this.isDefaultPrevented = je),
              e && !this.isSimulated && e.preventDefault();
          },
          stopPropagation: function () {
            var e = this.originalEvent;
            (this.isPropagationStopped = je),
              e && !this.isSimulated && e.stopPropagation();
          },
          stopImmediatePropagation: function () {
            var e = this.originalEvent;
            (this.isImmediatePropagationStopped = je),
              e && !this.isSimulated && e.stopImmediatePropagation(),
              this.stopPropagation();
          },
        }),
        k.each(
          {
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            code: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function (e) {
              var t = e.button;
              return null == e.which && ke.test(e.type)
                ? null != e.charCode
                  ? e.charCode
                  : e.keyCode
                : !e.which && void 0 !== t && Ce.test(e.type)
                ? 1 & t
                  ? 1
                  : 2 & t
                  ? 3
                  : 4 & t
                  ? 2
                  : 0
                : e.which;
            },
          },
          k.event.addProp
        ),
        k.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
          k.event.special[e] = {
            setup: function () {
              return Oe(this, e, Te), !1;
            },
            trigger: function () {
              return Oe(this, e), !0;
            },
            delegateType: t,
          };
        }),
        k.each(
          {
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout",
          },
          function (e, t) {
            k.event.special[e] = {
              delegateType: t,
              bindType: t,
              handle: function (e) {
                var n,
                  r = this,
                  i = e.relatedTarget,
                  o = e.handleObj;
                return (
                  (i && (i === r || k.contains(r, i))) ||
                    ((e.type = o.origType),
                    (n = o.handler.apply(this, arguments)),
                    (e.type = t)),
                  n
                );
              },
            };
          }
        ),
        k.fn.extend({
          on: function (e, t, n, r) {
            return Ne(this, e, t, n, r);
          },
          one: function (e, t, n, r) {
            return Ne(this, e, t, n, r, 1);
          },
          off: function (e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
              return (
                (r = e.handleObj),
                k(e.delegateTarget).off(
                  r.namespace ? r.origType + "." + r.namespace : r.origType,
                  r.selector,
                  r.handler
                ),
                this
              );
            if ("object" == typeof e) {
              for (i in e) this.off(i, t, e[i]);
              return this;
            }
            return (
              (!1 !== t && "function" != typeof t) || ((n = t), (t = void 0)),
              !1 === n && (n = Ee),
              this.each(function () {
                k.event.remove(this, e, n, t);
              })
            );
          },
        });
      var Me = /<script|<style|<link/i,
        Le = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Ie = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
      function De(e, t) {
        return (
          (N(e, "table") &&
            N(11 !== t.nodeType ? t : t.firstChild, "tr") &&
            k(e).children("tbody")[0]) ||
          e
        );
      }
      function We(e) {
        return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
      }
      function Fe(e) {
        return (
          "true/" === (e.type || "").slice(0, 5)
            ? (e.type = e.type.slice(5))
            : e.removeAttribute("type"),
          e
        );
      }
      function _e(e, t) {
        var n, r, i, o, a, s;
        if (1 === t.nodeType) {
          if (K.hasData(e) && (s = K.get(e).events))
            for (i in (K.remove(t, "handle events"), s))
              for (n = 0, r = s[i].length; n < r; n++)
                k.event.add(t, i, s[i][n]);
          Q.hasData(e) &&
            ((o = Q.access(e)), (a = k.extend({}, o)), Q.set(t, a));
        }
      }
      function Pe(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && ge.test(e.type)
          ? (t.checked = e.checked)
          : ("input" !== n && "textarea" !== n) ||
            (t.defaultValue = e.defaultValue);
      }
      function qe(e, t, n, r) {
        t = u(t);
        var i,
          o,
          a,
          s,
          l,
          c,
          f = 0,
          p = e.length,
          d = p - 1,
          h = t[0],
          g = y(h);
        if (g || (p > 1 && "string" == typeof h && !m.checkClone && Le.test(h)))
          return e.each(function (i) {
            var o = e.eq(i);
            g && (t[0] = h.call(this, i, o.html())), qe(o, t, n, r);
          });
        if (
          p &&
          ((o = (i = Ae(t, e[0].ownerDocument, !1, e, r)).firstChild),
          1 === i.childNodes.length && (i = o),
          o || r)
        ) {
          for (s = (a = k.map(be(i, "script"), We)).length; f < p; f++)
            (l = i),
              f !== d &&
                ((l = k.clone(l, !0, !0)), s && k.merge(a, be(l, "script"))),
              n.call(e[f], l, f);
          if (s)
            for (
              c = a[a.length - 1].ownerDocument, k.map(a, Fe), f = 0;
              f < s;
              f++
            )
              (l = a[f]),
                ye.test(l.type || "") &&
                  !K.access(l, "globalEval") &&
                  k.contains(c, l) &&
                  (l.src && "module" !== (l.type || "").toLowerCase()
                    ? k._evalUrl &&
                      !l.noModule &&
                      k._evalUrl(
                        l.src,
                        { nonce: l.nonce || l.getAttribute("nonce") },
                        c
                      )
                    : w(l.textContent.replace(Ie, ""), l, c));
        }
        return e;
      }
      function He(e, t, n) {
        for (var r, i = t ? k.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
          n || 1 !== r.nodeType || k.cleanData(be(r)),
            r.parentNode &&
              (n && ae(r) && xe(be(r, "script")), r.parentNode.removeChild(r));
        return e;
      }
      k.extend({
        htmlPrefilter: function (e) {
          return e;
        },
        clone: function (e, t, n) {
          var r,
            i,
            o,
            a,
            s = e.cloneNode(!0),
            u = ae(e);
          if (
            !(
              m.noCloneChecked ||
              (1 !== e.nodeType && 11 !== e.nodeType) ||
              k.isXMLDoc(e)
            )
          )
            for (a = be(s), r = 0, i = (o = be(e)).length; r < i; r++)
              Pe(o[r], a[r]);
          if (t)
            if (n)
              for (
                o = o || be(e), a = a || be(s), r = 0, i = o.length;
                r < i;
                r++
              )
                _e(o[r], a[r]);
            else _e(e, s);
          return (
            (a = be(s, "script")).length > 0 && xe(a, !u && be(e, "script")), s
          );
        },
        cleanData: function (e) {
          for (
            var t, n, r, i = k.event.special, o = 0;
            void 0 !== (n = e[o]);
            o++
          )
            if (X(n)) {
              if ((t = n[K.expando])) {
                if (t.events)
                  for (r in t.events)
                    i[r] ? k.event.remove(n, r) : k.removeEvent(n, r, t.handle);
                n[K.expando] = void 0;
              }
              n[Q.expando] && (n[Q.expando] = void 0);
            }
        },
      }),
        k.fn.extend({
          detach: function (e) {
            return He(this, e, !0);
          },
          remove: function (e) {
            return He(this, e);
          },
          text: function (e) {
            return U(
              this,
              function (e) {
                return void 0 === e
                  ? k.text(this)
                  : this.empty().each(function () {
                      (1 !== this.nodeType &&
                        11 !== this.nodeType &&
                        9 !== this.nodeType) ||
                        (this.textContent = e);
                    });
              },
              null,
              e,
              arguments.length
            );
          },
          append: function () {
            return qe(this, arguments, function (e) {
              (1 !== this.nodeType &&
                11 !== this.nodeType &&
                9 !== this.nodeType) ||
                De(this, e).appendChild(e);
            });
          },
          prepend: function () {
            return qe(this, arguments, function (e) {
              if (
                1 === this.nodeType ||
                11 === this.nodeType ||
                9 === this.nodeType
              ) {
                var t = De(this, e);
                t.insertBefore(e, t.firstChild);
              }
            });
          },
          before: function () {
            return qe(this, arguments, function (e) {
              this.parentNode && this.parentNode.insertBefore(e, this);
            });
          },
          after: function () {
            return qe(this, arguments, function (e) {
              this.parentNode &&
                this.parentNode.insertBefore(e, this.nextSibling);
            });
          },
          empty: function () {
            for (var e, t = 0; null != (e = this[t]); t++)
              1 === e.nodeType &&
                (k.cleanData(be(e, !1)), (e.textContent = ""));
            return this;
          },
          clone: function (e, t) {
            return (
              (e = null != e && e),
              (t = null == t ? e : t),
              this.map(function () {
                return k.clone(this, e, t);
              })
            );
          },
          html: function (e) {
            return U(
              this,
              function (e) {
                var t = this[0] || {},
                  n = 0,
                  r = this.length;
                if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                if (
                  "string" == typeof e &&
                  !Me.test(e) &&
                  !ve[(me.exec(e) || ["", ""])[1].toLowerCase()]
                ) {
                  e = k.htmlPrefilter(e);
                  try {
                    for (; n < r; n++)
                      1 === (t = this[n] || {}).nodeType &&
                        (k.cleanData(be(t, !1)), (t.innerHTML = e));
                    t = 0;
                  } catch (e) {}
                }
                t && this.empty().append(e);
              },
              null,
              e,
              arguments.length
            );
          },
          replaceWith: function () {
            var e = [];
            return qe(
              this,
              arguments,
              function (t) {
                var n = this.parentNode;
                k.inArray(this, e) < 0 &&
                  (k.cleanData(be(this)), n && n.replaceChild(t, this));
              },
              e
            );
          },
        }),
        k.each(
          {
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith",
          },
          function (e, t) {
            k.fn[e] = function (e) {
              for (
                var n, r = [], i = k(e), o = i.length - 1, a = 0;
                a <= o;
                a++
              )
                (n = a === o ? this : this.clone(!0)),
                  k(i[a])[t](n),
                  l.apply(r, n.get());
              return this.pushStack(r);
            };
          }
        );
      var Re = new RegExp("^(" + ne + ")(?!px)[a-z%]+$", "i"),
        Be = function (e) {
          var t = e.ownerDocument.defaultView;
          return (t && t.opener) || (t = n), t.getComputedStyle(e);
        },
        ze = function (e, t, n) {
          var r,
            i,
            o = {};
          for (i in t) (o[i] = e.style[i]), (e.style[i] = t[i]);
          for (i in ((r = n.call(e)), t)) e.style[i] = o[i];
          return r;
        },
        Ue = new RegExp(ie.join("|"), "i");
      function $e(e, t, n) {
        var r,
          i,
          o,
          a,
          s = e.style;
        return (
          (n = n || Be(e)) &&
            ("" !== (a = n.getPropertyValue(t) || n[t]) ||
              ae(e) ||
              (a = k.style(e, t)),
            !m.pixelBoxStyles() &&
              Re.test(a) &&
              Ue.test(t) &&
              ((r = s.width),
              (i = s.minWidth),
              (o = s.maxWidth),
              (s.minWidth = s.maxWidth = s.width = a),
              (a = n.width),
              (s.width = r),
              (s.minWidth = i),
              (s.maxWidth = o))),
          void 0 !== a ? a + "" : a
        );
      }
      function Ye(e, t) {
        return {
          get: function () {
            if (!e()) return (this.get = t).apply(this, arguments);
            delete this.get;
          },
        };
      }
      !(function () {
        function e() {
          if (c) {
            (l.style.cssText =
              "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0"),
              (c.style.cssText =
                "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%"),
              oe.appendChild(l).appendChild(c);
            var e = n.getComputedStyle(c);
            (r = "1%" !== e.top),
              (u = 12 === t(e.marginLeft)),
              (c.style.right = "60%"),
              (a = 36 === t(e.right)),
              (i = 36 === t(e.width)),
              (c.style.position = "absolute"),
              (o = 12 === t(c.offsetWidth / 3)),
              oe.removeChild(l),
              (c = null);
          }
        }
        function t(e) {
          return Math.round(parseFloat(e));
        }
        var r,
          i,
          o,
          a,
          s,
          u,
          l = b.createElement("div"),
          c = b.createElement("div");
        c.style &&
          ((c.style.backgroundClip = "content-box"),
          (c.cloneNode(!0).style.backgroundClip = ""),
          (m.clearCloneStyle = "content-box" === c.style.backgroundClip),
          k.extend(m, {
            boxSizingReliable: function () {
              return e(), i;
            },
            pixelBoxStyles: function () {
              return e(), a;
            },
            pixelPosition: function () {
              return e(), r;
            },
            reliableMarginLeft: function () {
              return e(), u;
            },
            scrollboxSize: function () {
              return e(), o;
            },
            reliableTrDimensions: function () {
              var e, t, r, i;
              return (
                null == s &&
                  ((e = b.createElement("table")),
                  (t = b.createElement("tr")),
                  (r = b.createElement("div")),
                  (e.style.cssText = "position:absolute;left:-11111px"),
                  (t.style.height = "1px"),
                  (r.style.height = "9px"),
                  oe.appendChild(e).appendChild(t).appendChild(r),
                  (i = n.getComputedStyle(t)),
                  (s = parseInt(i.height) > 3),
                  oe.removeChild(e)),
                s
              );
            },
          }));
      })();
      var Ge = ["Webkit", "Moz", "ms"],
        Ve = b.createElement("div").style,
        Xe = {};
      function Je(e) {
        var t = k.cssProps[e] || Xe[e];
        return (
          t ||
          (e in Ve
            ? e
            : (Xe[e] =
                (function (e) {
                  for (
                    var t = e[0].toUpperCase() + e.slice(1), n = Ge.length;
                    n--;

                  )
                    if ((e = Ge[n] + t) in Ve) return e;
                })(e) || e))
        );
      }
      var Ke = /^(none|table(?!-c[ea]).+)/,
        Qe = /^--/,
        Ze = { position: "absolute", visibility: "hidden", display: "block" },
        et = { letterSpacing: "0", fontWeight: "400" };
      function tt(e, t, n) {
        var r = re.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
      }
      function nt(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0,
          s = 0,
          u = 0;
        if (n === (r ? "border" : "content")) return 0;
        for (; a < 4; a += 2)
          "margin" === n && (u += k.css(e, n + ie[a], !0, i)),
            r
              ? ("content" === n && (u -= k.css(e, "padding" + ie[a], !0, i)),
                "margin" !== n &&
                  (u -= k.css(e, "border" + ie[a] + "Width", !0, i)))
              : ((u += k.css(e, "padding" + ie[a], !0, i)),
                "padding" !== n
                  ? (u += k.css(e, "border" + ie[a] + "Width", !0, i))
                  : (s += k.css(e, "border" + ie[a] + "Width", !0, i)));
        return (
          !r &&
            o >= 0 &&
            (u +=
              Math.max(
                0,
                Math.ceil(
                  e["offset" + t[0].toUpperCase() + t.slice(1)] -
                    o -
                    u -
                    s -
                    0.5
                )
              ) || 0),
          u
        );
      }
      function rt(e, t, n) {
        var r = Be(e),
          i =
            (!m.boxSizingReliable() || n) &&
            "border-box" === k.css(e, "boxSizing", !1, r),
          o = i,
          a = $e(e, t, r),
          s = "offset" + t[0].toUpperCase() + t.slice(1);
        if (Re.test(a)) {
          if (!n) return a;
          a = "auto";
        }
        return (
          ((!m.boxSizingReliable() && i) ||
            (!m.reliableTrDimensions() && N(e, "tr")) ||
            "auto" === a ||
            (!parseFloat(a) && "inline" === k.css(e, "display", !1, r))) &&
            e.getClientRects().length &&
            ((i = "border-box" === k.css(e, "boxSizing", !1, r)),
            (o = s in e) && (a = e[s])),
          (a = parseFloat(a) || 0) +
            nt(e, t, n || (i ? "border" : "content"), o, r, a) +
            "px"
        );
      }
      function it(e, t, n, r, i) {
        return new it.prototype.init(e, t, n, r, i);
      }
      k.extend({
        cssHooks: {
          opacity: {
            get: function (e, t) {
              if (t) {
                var n = $e(e, "opacity");
                return "" === n ? "1" : n;
              }
            },
          },
        },
        cssNumber: {
          animationIterationCount: !0,
          columnCount: !0,
          fillOpacity: !0,
          flexGrow: !0,
          flexShrink: !0,
          fontWeight: !0,
          gridArea: !0,
          gridColumn: !0,
          gridColumnEnd: !0,
          gridColumnStart: !0,
          gridRow: !0,
          gridRowEnd: !0,
          gridRowStart: !0,
          lineHeight: !0,
          opacity: !0,
          order: !0,
          orphans: !0,
          widows: !0,
          zIndex: !0,
          zoom: !0,
        },
        cssProps: {},
        style: function (e, t, n, r) {
          if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
            var i,
              o,
              a,
              s = V(t),
              u = Qe.test(t),
              l = e.style;
            if (
              (u || (t = Je(s)),
              (a = k.cssHooks[t] || k.cssHooks[s]),
              void 0 === n)
            )
              return a && "get" in a && void 0 !== (i = a.get(e, !1, r))
                ? i
                : l[t];
            "string" === (o = typeof n) &&
              (i = re.exec(n)) &&
              i[1] &&
              ((n = le(e, t, i)), (o = "number")),
              null != n &&
                n == n &&
                ("number" !== o ||
                  u ||
                  (n += (i && i[3]) || (k.cssNumber[s] ? "" : "px")),
                m.clearCloneStyle ||
                  "" !== n ||
                  0 !== t.indexOf("background") ||
                  (l[t] = "inherit"),
                (a && "set" in a && void 0 === (n = a.set(e, n, r))) ||
                  (u ? l.setProperty(t, n) : (l[t] = n)));
          }
        },
        css: function (e, t, n, r) {
          var i,
            o,
            a,
            s = V(t);
          return (
            Qe.test(t) || (t = Je(s)),
            (a = k.cssHooks[t] || k.cssHooks[s]) &&
              "get" in a &&
              (i = a.get(e, !0, n)),
            void 0 === i && (i = $e(e, t, r)),
            "normal" === i && t in et && (i = et[t]),
            "" === n || n
              ? ((o = parseFloat(i)), !0 === n || isFinite(o) ? o || 0 : i)
              : i
          );
        },
      }),
        k.each(["height", "width"], function (e, t) {
          k.cssHooks[t] = {
            get: function (e, n, r) {
              if (n)
                return !Ke.test(k.css(e, "display")) ||
                  (e.getClientRects().length && e.getBoundingClientRect().width)
                  ? rt(e, t, r)
                  : ze(e, Ze, function () {
                      return rt(e, t, r);
                    });
            },
            set: function (e, n, r) {
              var i,
                o = Be(e),
                a = !m.scrollboxSize() && "absolute" === o.position,
                s = (a || r) && "border-box" === k.css(e, "boxSizing", !1, o),
                u = r ? nt(e, t, r, s, o) : 0;
              return (
                s &&
                  a &&
                  (u -= Math.ceil(
                    e["offset" + t[0].toUpperCase() + t.slice(1)] -
                      parseFloat(o[t]) -
                      nt(e, t, "border", !1, o) -
                      0.5
                  )),
                u &&
                  (i = re.exec(n)) &&
                  "px" !== (i[3] || "px") &&
                  ((e.style[t] = n), (n = k.css(e, t))),
                tt(0, n, u)
              );
            },
          };
        }),
        (k.cssHooks.marginLeft = Ye(m.reliableMarginLeft, function (e, t) {
          if (t)
            return (
              (parseFloat($e(e, "marginLeft")) ||
                e.getBoundingClientRect().left -
                  ze(e, { marginLeft: 0 }, function () {
                    return e.getBoundingClientRect().left;
                  })) + "px"
            );
        })),
        k.each({ margin: "", padding: "", border: "Width" }, function (e, t) {
          (k.cssHooks[e + t] = {
            expand: function (n) {
              for (
                var r = 0,
                  i = {},
                  o = "string" == typeof n ? n.split(" ") : [n];
                r < 4;
                r++
              )
                i[e + ie[r] + t] = o[r] || o[r - 2] || o[0];
              return i;
            },
          }),
            "margin" !== e && (k.cssHooks[e + t].set = tt);
        }),
        k.fn.extend({
          css: function (e, t) {
            return U(
              this,
              function (e, t, n) {
                var r,
                  i,
                  o = {},
                  a = 0;
                if (Array.isArray(t)) {
                  for (r = Be(e), i = t.length; a < i; a++)
                    o[t[a]] = k.css(e, t[a], !1, r);
                  return o;
                }
                return void 0 !== n ? k.style(e, t, n) : k.css(e, t);
              },
              e,
              t,
              arguments.length > 1
            );
          },
        }),
        (k.Tween = it),
        (it.prototype = {
          constructor: it,
          init: function (e, t, n, r, i, o) {
            (this.elem = e),
              (this.prop = n),
              (this.easing = i || k.easing._default),
              (this.options = t),
              (this.start = this.now = this.cur()),
              (this.end = r),
              (this.unit = o || (k.cssNumber[n] ? "" : "px"));
          },
          cur: function () {
            var e = it.propHooks[this.prop];
            return e && e.get ? e.get(this) : it.propHooks._default.get(this);
          },
          run: function (e) {
            var t,
              n = it.propHooks[this.prop];
            return (
              this.options.duration
                ? (this.pos = t = k.easing[this.easing](
                    e,
                    this.options.duration * e,
                    0,
                    1,
                    this.options.duration
                  ))
                : (this.pos = t = e),
              (this.now = (this.end - this.start) * t + this.start),
              this.options.step &&
                this.options.step.call(this.elem, this.now, this),
              n && n.set ? n.set(this) : it.propHooks._default.set(this),
              this
            );
          },
        }),
        (it.prototype.init.prototype = it.prototype),
        (it.propHooks = {
          _default: {
            get: function (e) {
              var t;
              return 1 !== e.elem.nodeType ||
                (null != e.elem[e.prop] && null == e.elem.style[e.prop])
                ? e.elem[e.prop]
                : (t = k.css(e.elem, e.prop, "")) && "auto" !== t
                ? t
                : 0;
            },
            set: function (e) {
              k.fx.step[e.prop]
                ? k.fx.step[e.prop](e)
                : 1 !== e.elem.nodeType ||
                  (!k.cssHooks[e.prop] && null == e.elem.style[Je(e.prop)])
                ? (e.elem[e.prop] = e.now)
                : k.style(e.elem, e.prop, e.now + e.unit);
            },
          },
        }),
        (it.propHooks.scrollTop = it.propHooks.scrollLeft = {
          set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
          },
        }),
        (k.easing = {
          linear: function (e) {
            return e;
          },
          swing: function (e) {
            return 0.5 - Math.cos(e * Math.PI) / 2;
          },
          _default: "swing",
        }),
        (k.fx = it.prototype.init),
        (k.fx.step = {});
      var ot,
        at,
        st = /^(?:toggle|show|hide)$/,
        ut = /queueHooks$/;
      function lt() {
        at &&
          (!1 === b.hidden && n.requestAnimationFrame
            ? n.requestAnimationFrame(lt)
            : n.setTimeout(lt, k.fx.interval),
          k.fx.tick());
      }
      function ct() {
        return (
          n.setTimeout(function () {
            ot = void 0;
          }),
          (ot = Date.now())
        );
      }
      function ft(e, t) {
        var n,
          r = 0,
          i = { height: e };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
          i["margin" + (n = ie[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i;
      }
      function pt(e, t, n) {
        for (
          var r,
            i = (dt.tweeners[t] || []).concat(dt.tweeners["*"]),
            o = 0,
            a = i.length;
          o < a;
          o++
        )
          if ((r = i[o].call(n, t, e))) return r;
      }
      function dt(e, t, n) {
        var r,
          i,
          o = 0,
          a = dt.prefilters.length,
          s = k.Deferred().always(function () {
            delete u.elem;
          }),
          u = function () {
            if (i) return !1;
            for (
              var t = ot || ct(),
                n = Math.max(0, l.startTime + l.duration - t),
                r = 1 - (n / l.duration || 0),
                o = 0,
                a = l.tweens.length;
              o < a;
              o++
            )
              l.tweens[o].run(r);
            return (
              s.notifyWith(e, [l, r, n]),
              r < 1 && a
                ? n
                : (a || s.notifyWith(e, [l, 1, 0]), s.resolveWith(e, [l]), !1)
            );
          },
          l = s.promise({
            elem: e,
            props: k.extend({}, t),
            opts: k.extend(
              !0,
              { specialEasing: {}, easing: k.easing._default },
              n
            ),
            originalProperties: t,
            originalOptions: n,
            startTime: ot || ct(),
            duration: n.duration,
            tweens: [],
            createTween: function (t, n) {
              var r = k.Tween(
                e,
                l.opts,
                t,
                n,
                l.opts.specialEasing[t] || l.opts.easing
              );
              return l.tweens.push(r), r;
            },
            stop: function (t) {
              var n = 0,
                r = t ? l.tweens.length : 0;
              if (i) return this;
              for (i = !0; n < r; n++) l.tweens[n].run(1);
              return (
                t
                  ? (s.notifyWith(e, [l, 1, 0]), s.resolveWith(e, [l, t]))
                  : s.rejectWith(e, [l, t]),
                this
              );
            },
          }),
          c = l.props;
        for (
          !(function (e, t) {
            var n, r, i, o, a;
            for (n in e)
              if (
                ((i = t[(r = V(n))]),
                (o = e[n]),
                Array.isArray(o) && ((i = o[1]), (o = e[n] = o[0])),
                n !== r && ((e[r] = o), delete e[n]),
                (a = k.cssHooks[r]) && ("expand" in a))
              )
                for (n in ((o = a.expand(o)), delete e[r], o))
                  (n in e) || ((e[n] = o[n]), (t[n] = i));
              else t[r] = i;
          })(c, l.opts.specialEasing);
          o < a;
          o++
        )
          if ((r = dt.prefilters[o].call(l, e, c, l.opts)))
            return (
              y(r.stop) &&
                (k._queueHooks(l.elem, l.opts.queue).stop = r.stop.bind(r)),
              r
            );
        return (
          k.map(c, pt, l),
          y(l.opts.start) && l.opts.start.call(e, l),
          l
            .progress(l.opts.progress)
            .done(l.opts.done, l.opts.complete)
            .fail(l.opts.fail)
            .always(l.opts.always),
          k.fx.timer(k.extend(u, { elem: e, anim: l, queue: l.opts.queue })),
          l
        );
      }
      (k.Animation = k.extend(dt, {
        tweeners: {
          "*": [
            function (e, t) {
              var n = this.createTween(e, t);
              return le(n.elem, e, re.exec(t), n), n;
            },
          ],
        },
        tweener: function (e, t) {
          y(e) ? ((t = e), (e = ["*"])) : (e = e.match(_));
          for (var n, r = 0, i = e.length; r < i; r++)
            (n = e[r]),
              (dt.tweeners[n] = dt.tweeners[n] || []),
              dt.tweeners[n].unshift(t);
        },
        prefilters: [
          function (e, t, n) {
            var r,
              i,
              o,
              a,
              s,
              u,
              l,
              c,
              f = "width" in t || "height" in t,
              p = this,
              d = {},
              h = e.style,
              g = e.nodeType && ue(e),
              m = K.get(e, "fxshow");
            for (r in (n.queue ||
              (null == (a = k._queueHooks(e, "fx")).unqueued &&
                ((a.unqueued = 0),
                (s = a.empty.fire),
                (a.empty.fire = function () {
                  a.unqueued || s();
                })),
              a.unqueued++,
              p.always(function () {
                p.always(function () {
                  a.unqueued--, k.queue(e, "fx").length || a.empty.fire();
                });
              })),
            t))
              if (((i = t[r]), st.test(i))) {
                if (
                  (delete t[r],
                  (o = o || "toggle" === i),
                  i === (g ? "hide" : "show"))
                ) {
                  if ("show" !== i || !m || void 0 === m[r]) continue;
                  g = !0;
                }
                d[r] = (m && m[r]) || k.style(e, r);
              }
            if ((u = !k.isEmptyObject(t)) || !k.isEmptyObject(d))
              for (r in (f &&
                1 === e.nodeType &&
                ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
                null == (l = m && m.display) && (l = K.get(e, "display")),
                "none" === (c = k.css(e, "display")) &&
                  (l
                    ? (c = l)
                    : (pe([e], !0),
                      (l = e.style.display || l),
                      (c = k.css(e, "display")),
                      pe([e]))),
                ("inline" === c || ("inline-block" === c && null != l)) &&
                  "none" === k.css(e, "float") &&
                  (u ||
                    (p.done(function () {
                      h.display = l;
                    }),
                    null == l &&
                      ((c = h.display), (l = "none" === c ? "" : c))),
                  (h.display = "inline-block"))),
              n.overflow &&
                ((h.overflow = "hidden"),
                p.always(function () {
                  (h.overflow = n.overflow[0]),
                    (h.overflowX = n.overflow[1]),
                    (h.overflowY = n.overflow[2]);
                })),
              (u = !1),
              d))
                u ||
                  (m
                    ? "hidden" in m && (g = m.hidden)
                    : (m = K.access(e, "fxshow", { display: l })),
                  o && (m.hidden = !g),
                  g && pe([e], !0),
                  p.done(function () {
                    for (r in (g || pe([e]), K.remove(e, "fxshow"), d))
                      k.style(e, r, d[r]);
                  })),
                  (u = pt(g ? m[r] : 0, r, p)),
                  r in m ||
                    ((m[r] = u.start), g && ((u.end = u.start), (u.start = 0)));
          },
        ],
        prefilter: function (e, t) {
          t ? dt.prefilters.unshift(e) : dt.prefilters.push(e);
        },
      })),
        (k.speed = function (e, t, n) {
          var r =
            e && "object" == typeof e
              ? k.extend({}, e)
              : {
                  complete: n || (!n && t) || (y(e) && e),
                  duration: e,
                  easing: (n && t) || (t && !y(t) && t),
                };
          return (
            k.fx.off
              ? (r.duration = 0)
              : "number" != typeof r.duration &&
                (r.duration in k.fx.speeds
                  ? (r.duration = k.fx.speeds[r.duration])
                  : (r.duration = k.fx.speeds._default)),
            (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
            (r.old = r.complete),
            (r.complete = function () {
              y(r.old) && r.old.call(this), r.queue && k.dequeue(this, r.queue);
            }),
            r
          );
        }),
        k.fn.extend({
          fadeTo: function (e, t, n, r) {
            return this.filter(ue)
              .css("opacity", 0)
              .show()
              .end()
              .animate({ opacity: t }, e, n, r);
          },
          animate: function (e, t, n, r) {
            var i = k.isEmptyObject(e),
              o = k.speed(t, n, r),
              a = function () {
                var t = dt(this, k.extend({}, e), o);
                (i || K.get(this, "finish")) && t.stop(!0);
              };
            return (
              (a.finish = a),
              i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
            );
          },
          stop: function (e, t, n) {
            var r = function (e) {
              var t = e.stop;
              delete e.stop, t(n);
            };
            return (
              "string" != typeof e && ((n = t), (t = e), (e = void 0)),
              t && this.queue(e || "fx", []),
              this.each(function () {
                var t = !0,
                  i = null != e && e + "queueHooks",
                  o = k.timers,
                  a = K.get(this);
                if (i) a[i] && a[i].stop && r(a[i]);
                else for (i in a) a[i] && a[i].stop && ut.test(i) && r(a[i]);
                for (i = o.length; i--; )
                  o[i].elem !== this ||
                    (null != e && o[i].queue !== e) ||
                    (o[i].anim.stop(n), (t = !1), o.splice(i, 1));
                (!t && n) || k.dequeue(this, e);
              })
            );
          },
          finish: function (e) {
            return (
              !1 !== e && (e = e || "fx"),
              this.each(function () {
                var t,
                  n = K.get(this),
                  r = n[e + "queue"],
                  i = n[e + "queueHooks"],
                  o = k.timers,
                  a = r ? r.length : 0;
                for (
                  n.finish = !0,
                    k.queue(this, e, []),
                    i && i.stop && i.stop.call(this, !0),
                    t = o.length;
                  t--;

                )
                  o[t].elem === this &&
                    o[t].queue === e &&
                    (o[t].anim.stop(!0), o.splice(t, 1));
                for (t = 0; t < a; t++)
                  r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish;
              })
            );
          },
        }),
        k.each(["toggle", "show", "hide"], function (e, t) {
          var n = k.fn[t];
          k.fn[t] = function (e, r, i) {
            return null == e || "boolean" == typeof e
              ? n.apply(this, arguments)
              : this.animate(ft(t, !0), e, r, i);
          };
        }),
        k.each(
          {
            slideDown: ft("show"),
            slideUp: ft("hide"),
            slideToggle: ft("toggle"),
            fadeIn: { opacity: "show" },
            fadeOut: { opacity: "hide" },
            fadeToggle: { opacity: "toggle" },
          },
          function (e, t) {
            k.fn[e] = function (e, n, r) {
              return this.animate(t, e, n, r);
            };
          }
        ),
        (k.timers = []),
        (k.fx.tick = function () {
          var e,
            t = 0,
            n = k.timers;
          for (ot = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
          n.length || k.fx.stop(), (ot = void 0);
        }),
        (k.fx.timer = function (e) {
          k.timers.push(e), k.fx.start();
        }),
        (k.fx.interval = 13),
        (k.fx.start = function () {
          at || ((at = !0), lt());
        }),
        (k.fx.stop = function () {
          at = null;
        }),
        (k.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
        (k.fn.delay = function (e, t) {
          return (
            (e = (k.fx && k.fx.speeds[e]) || e),
            (t = t || "fx"),
            this.queue(t, function (t, r) {
              var i = n.setTimeout(t, e);
              r.stop = function () {
                n.clearTimeout(i);
              };
            })
          );
        }),
        (function () {
          var e = b.createElement("input"),
            t = b
              .createElement("select")
              .appendChild(b.createElement("option"));
          (e.type = "checkbox"),
            (m.checkOn = "" !== e.value),
            (m.optSelected = t.selected),
            ((e = b.createElement("input")).value = "t"),
            (e.type = "radio"),
            (m.radioValue = "t" === e.value);
        })();
      var ht,
        gt = k.expr.attrHandle;
      k.fn.extend({
        attr: function (e, t) {
          return U(this, k.attr, e, t, arguments.length > 1);
        },
        removeAttr: function (e) {
          return this.each(function () {
            k.removeAttr(this, e);
          });
        },
      }),
        k.extend({
          attr: function (e, t, n) {
            var r,
              i,
              o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
              return void 0 === e.getAttribute
                ? k.prop(e, t, n)
                : ((1 === o && k.isXMLDoc(e)) ||
                    (i =
                      k.attrHooks[t.toLowerCase()] ||
                      (k.expr.match.bool.test(t) ? ht : void 0)),
                  void 0 !== n
                    ? null === n
                      ? void k.removeAttr(e, t)
                      : i && "set" in i && void 0 !== (r = i.set(e, n, t))
                      ? r
                      : (e.setAttribute(t, n + ""), n)
                    : i && "get" in i && null !== (r = i.get(e, t))
                    ? r
                    : null == (r = k.find.attr(e, t))
                    ? void 0
                    : r);
          },
          attrHooks: {
            type: {
              set: function (e, t) {
                if (!m.radioValue && "radio" === t && N(e, "input")) {
                  var n = e.value;
                  return e.setAttribute("type", t), n && (e.value = n), t;
                }
              },
            },
          },
          removeAttr: function (e, t) {
            var n,
              r = 0,
              i = t && t.match(_);
            if (i && 1 === e.nodeType)
              for (; (n = i[r++]); ) e.removeAttribute(n);
          },
        }),
        (ht = {
          set: function (e, t, n) {
            return !1 === t ? k.removeAttr(e, n) : e.setAttribute(n, n), n;
          },
        }),
        k.each(k.expr.match.bool.source.match(/\w+/g), function (e, t) {
          var n = gt[t] || k.find.attr;
          gt[t] = function (e, t, r) {
            var i,
              o,
              a = t.toLowerCase();
            return (
              r ||
                ((o = gt[a]),
                (gt[a] = i),
                (i = null != n(e, t, r) ? a : null),
                (gt[a] = o)),
              i
            );
          };
        });
      var mt = /^(?:input|select|textarea|button)$/i,
        yt = /^(?:a|area)$/i;
      function vt(e) {
        return (e.match(_) || []).join(" ");
      }
      function bt(e) {
        return (e.getAttribute && e.getAttribute("class")) || "";
      }
      function xt(e) {
        return Array.isArray(e)
          ? e
          : ("string" == typeof e && e.match(_)) || [];
      }
      k.fn.extend({
        prop: function (e, t) {
          return U(this, k.prop, e, t, arguments.length > 1);
        },
        removeProp: function (e) {
          return this.each(function () {
            delete this[k.propFix[e] || e];
          });
        },
      }),
        k.extend({
          prop: function (e, t, n) {
            var r,
              i,
              o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
              return (
                (1 === o && k.isXMLDoc(e)) ||
                  ((t = k.propFix[t] || t), (i = k.propHooks[t])),
                void 0 !== n
                  ? i && "set" in i && void 0 !== (r = i.set(e, n, t))
                    ? r
                    : (e[t] = n)
                  : i && "get" in i && null !== (r = i.get(e, t))
                  ? r
                  : e[t]
              );
          },
          propHooks: {
            tabIndex: {
              get: function (e) {
                var t = k.find.attr(e, "tabindex");
                return t
                  ? parseInt(t, 10)
                  : mt.test(e.nodeName) || (yt.test(e.nodeName) && e.href)
                  ? 0
                  : -1;
              },
            },
          },
          propFix: { for: "htmlFor", class: "className" },
        }),
        m.optSelected ||
          (k.propHooks.selected = {
            get: function (e) {
              var t = e.parentNode;
              return t && t.parentNode && t.parentNode.selectedIndex, null;
            },
            set: function (e) {
              var t = e.parentNode;
              t &&
                (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
            },
          }),
        k.each(
          [
            "tabIndex",
            "readOnly",
            "maxLength",
            "cellSpacing",
            "cellPadding",
            "rowSpan",
            "colSpan",
            "useMap",
            "frameBorder",
            "contentEditable",
          ],
          function () {
            k.propFix[this.toLowerCase()] = this;
          }
        ),
        k.fn.extend({
          addClass: function (e) {
            var t,
              n,
              r,
              i,
              o,
              a,
              s,
              u = 0;
            if (y(e))
              return this.each(function (t) {
                k(this).addClass(e.call(this, t, bt(this)));
              });
            if ((t = xt(e)).length)
              for (; (n = this[u++]); )
                if (
                  ((i = bt(n)), (r = 1 === n.nodeType && " " + vt(i) + " "))
                ) {
                  for (a = 0; (o = t[a++]); )
                    r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                  i !== (s = vt(r)) && n.setAttribute("class", s);
                }
            return this;
          },
          removeClass: function (e) {
            var t,
              n,
              r,
              i,
              o,
              a,
              s,
              u = 0;
            if (y(e))
              return this.each(function (t) {
                k(this).removeClass(e.call(this, t, bt(this)));
              });
            if (!arguments.length) return this.attr("class", "");
            if ((t = xt(e)).length)
              for (; (n = this[u++]); )
                if (
                  ((i = bt(n)), (r = 1 === n.nodeType && " " + vt(i) + " "))
                ) {
                  for (a = 0; (o = t[a++]); )
                    for (; r.indexOf(" " + o + " ") > -1; )
                      r = r.replace(" " + o + " ", " ");
                  i !== (s = vt(r)) && n.setAttribute("class", s);
                }
            return this;
          },
          toggleClass: function (e, t) {
            var n = typeof e,
              r = "string" === n || Array.isArray(e);
            return "boolean" == typeof t && r
              ? t
                ? this.addClass(e)
                : this.removeClass(e)
              : y(e)
              ? this.each(function (n) {
                  k(this).toggleClass(e.call(this, n, bt(this), t), t);
                })
              : this.each(function () {
                  var t, i, o, a;
                  if (r)
                    for (i = 0, o = k(this), a = xt(e); (t = a[i++]); )
                      o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                  else
                    (void 0 !== e && "boolean" !== n) ||
                      ((t = bt(this)) && K.set(this, "__className__", t),
                      this.setAttribute &&
                        this.setAttribute(
                          "class",
                          t || !1 === e
                            ? ""
                            : K.get(this, "__className__") || ""
                        ));
                });
          },
          hasClass: function (e) {
            var t,
              n,
              r = 0;
            for (t = " " + e + " "; (n = this[r++]); )
              if (1 === n.nodeType && (" " + vt(bt(n)) + " ").indexOf(t) > -1)
                return !0;
            return !1;
          },
        });
      var wt = /\r/g;
      k.fn.extend({
        val: function (e) {
          var t,
            n,
            r,
            i = this[0];
          return arguments.length
            ? ((r = y(e)),
              this.each(function (n) {
                var i;
                1 === this.nodeType &&
                  (null == (i = r ? e.call(this, n, k(this).val()) : e)
                    ? (i = "")
                    : "number" == typeof i
                    ? (i += "")
                    : Array.isArray(i) &&
                      (i = k.map(i, function (e) {
                        return null == e ? "" : e + "";
                      })),
                  ((t =
                    k.valHooks[this.type] ||
                    k.valHooks[this.nodeName.toLowerCase()]) &&
                    "set" in t &&
                    void 0 !== t.set(this, i, "value")) ||
                    (this.value = i));
              }))
            : i
            ? (t =
                k.valHooks[i.type] || k.valHooks[i.nodeName.toLowerCase()]) &&
              "get" in t &&
              void 0 !== (n = t.get(i, "value"))
              ? n
              : "string" == typeof (n = i.value)
              ? n.replace(wt, "")
              : null == n
              ? ""
              : n
            : void 0;
        },
      }),
        k.extend({
          valHooks: {
            option: {
              get: function (e) {
                var t = k.find.attr(e, "value");
                return null != t ? t : vt(k.text(e));
              },
            },
            select: {
              get: function (e) {
                var t,
                  n,
                  r,
                  i = e.options,
                  o = e.selectedIndex,
                  a = "select-one" === e.type,
                  s = a ? null : [],
                  u = a ? o + 1 : i.length;
                for (r = o < 0 ? u : a ? o : 0; r < u; r++)
                  if (
                    ((n = i[r]).selected || r === o) &&
                    !n.disabled &&
                    (!n.parentNode.disabled || !N(n.parentNode, "optgroup"))
                  ) {
                    if (((t = k(n).val()), a)) return t;
                    s.push(t);
                  }
                return s;
              },
              set: function (e, t) {
                for (
                  var n, r, i = e.options, o = k.makeArray(t), a = i.length;
                  a--;

                )
                  ((r = i[a]).selected =
                    k.inArray(k.valHooks.option.get(r), o) > -1) && (n = !0);
                return n || (e.selectedIndex = -1), o;
              },
            },
          },
        }),
        k.each(["radio", "checkbox"], function () {
          (k.valHooks[this] = {
            set: function (e, t) {
              if (Array.isArray(t))
                return (e.checked = k.inArray(k(e).val(), t) > -1);
            },
          }),
            m.checkOn ||
              (k.valHooks[this].get = function (e) {
                return null === e.getAttribute("value") ? "on" : e.value;
              });
        }),
        (m.focusin = "onfocusin" in n);
      var At = /^(?:focusinfocus|focusoutblur)$/,
        kt = function (e) {
          e.stopPropagation();
        };
      k.extend(k.event, {
        trigger: function (e, t, r, i) {
          var o,
            a,
            s,
            u,
            l,
            c,
            f,
            p,
            h = [r || b],
            g = d.call(e, "type") ? e.type : e,
            m = d.call(e, "namespace") ? e.namespace.split(".") : [];
          if (
            ((a = p = s = r = r || b),
            3 !== r.nodeType &&
              8 !== r.nodeType &&
              !At.test(g + k.event.triggered) &&
              (g.indexOf(".") > -1 &&
                ((m = g.split(".")), (g = m.shift()), m.sort()),
              (l = g.indexOf(":") < 0 && "on" + g),
              ((e = e[k.expando]
                ? e
                : new k.Event(g, "object" == typeof e && e)).isTrigger = i
                ? 2
                : 3),
              (e.namespace = m.join(".")),
              (e.rnamespace = e.namespace
                ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)")
                : null),
              (e.result = void 0),
              e.target || (e.target = r),
              (t = null == t ? [e] : k.makeArray(t, [e])),
              (f = k.event.special[g] || {}),
              i || !f.trigger || !1 !== f.trigger.apply(r, t)))
          ) {
            if (!i && !f.noBubble && !v(r)) {
              for (
                u = f.delegateType || g, At.test(u + g) || (a = a.parentNode);
                a;
                a = a.parentNode
              )
                h.push(a), (s = a);
              s === (r.ownerDocument || b) &&
                h.push(s.defaultView || s.parentWindow || n);
            }
            for (o = 0; (a = h[o++]) && !e.isPropagationStopped(); )
              (p = a),
                (e.type = o > 1 ? u : f.bindType || g),
                (c =
                  (K.get(a, "events") || Object.create(null))[e.type] &&
                  K.get(a, "handle")) && c.apply(a, t),
                (c = l && a[l]) &&
                  c.apply &&
                  X(a) &&
                  ((e.result = c.apply(a, t)),
                  !1 === e.result && e.preventDefault());
            return (
              (e.type = g),
              i ||
                e.isDefaultPrevented() ||
                (f._default && !1 !== f._default.apply(h.pop(), t)) ||
                !X(r) ||
                (l &&
                  y(r[g]) &&
                  !v(r) &&
                  ((s = r[l]) && (r[l] = null),
                  (k.event.triggered = g),
                  e.isPropagationStopped() && p.addEventListener(g, kt),
                  r[g](),
                  e.isPropagationStopped() && p.removeEventListener(g, kt),
                  (k.event.triggered = void 0),
                  s && (r[l] = s))),
              e.result
            );
          }
        },
        simulate: function (e, t, n) {
          var r = k.extend(new k.Event(), n, { type: e, isSimulated: !0 });
          k.event.trigger(r, null, t);
        },
      }),
        k.fn.extend({
          trigger: function (e, t) {
            return this.each(function () {
              k.event.trigger(e, t, this);
            });
          },
          triggerHandler: function (e, t) {
            var n = this[0];
            if (n) return k.event.trigger(e, t, n, !0);
          },
        }),
        m.focusin ||
          k.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
            var n = function (e) {
              k.event.simulate(t, e.target, k.event.fix(e));
            };
            k.event.special[t] = {
              setup: function () {
                var r = this.ownerDocument || this.document || this,
                  i = K.access(r, t);
                i || r.addEventListener(e, n, !0), K.access(r, t, (i || 0) + 1);
              },
              teardown: function () {
                var r = this.ownerDocument || this.document || this,
                  i = K.access(r, t) - 1;
                i
                  ? K.access(r, t, i)
                  : (r.removeEventListener(e, n, !0), K.remove(r, t));
              },
            };
          });
      var Ct = n.location,
        St = { guid: Date.now() },
        jt = /\?/;
      k.parseXML = function (e) {
        var t;
        if (!e || "string" != typeof e) return null;
        try {
          t = new n.DOMParser().parseFromString(e, "text/xml");
        } catch (e) {
          t = void 0;
        }
        return (
          (t && !t.getElementsByTagName("parsererror").length) ||
            k.error("Invalid XML: " + e),
          t
        );
      };
      var Et = /\[\]$/,
        Tt = /\r?\n/g,
        Nt = /^(?:submit|button|image|reset|file)$/i,
        Ot = /^(?:input|select|textarea|keygen)/i;
      function Mt(e, t, n, r) {
        var i;
        if (Array.isArray(t))
          k.each(t, function (t, i) {
            n || Et.test(e)
              ? r(e, i)
              : Mt(
                  e + "[" + ("object" == typeof i && null != i ? t : "") + "]",
                  i,
                  n,
                  r
                );
          });
        else if (n || "object" !== A(t)) r(e, t);
        else for (i in t) Mt(e + "[" + i + "]", t[i], n, r);
      }
      (k.param = function (e, t) {
        var n,
          r = [],
          i = function (e, t) {
            var n = y(t) ? t() : t;
            r[r.length] =
              encodeURIComponent(e) +
              "=" +
              encodeURIComponent(null == n ? "" : n);
          };
        if (null == e) return "";
        if (Array.isArray(e) || (e.jquery && !k.isPlainObject(e)))
          k.each(e, function () {
            i(this.name, this.value);
          });
        else for (n in e) Mt(n, e[n], t, i);
        return r.join("&");
      }),
        k.fn.extend({
          serialize: function () {
            return k.param(this.serializeArray());
          },
          serializeArray: function () {
            return this.map(function () {
              var e = k.prop(this, "elements");
              return e ? k.makeArray(e) : this;
            })
              .filter(function () {
                var e = this.type;
                return (
                  this.name &&
                  !k(this).is(":disabled") &&
                  Ot.test(this.nodeName) &&
                  !Nt.test(e) &&
                  (this.checked || !ge.test(e))
                );
              })
              .map(function (e, t) {
                var n = k(this).val();
                return null == n
                  ? null
                  : Array.isArray(n)
                  ? k.map(n, function (e) {
                      return { name: t.name, value: e.replace(Tt, "\r\n") };
                    })
                  : { name: t.name, value: n.replace(Tt, "\r\n") };
              })
              .get();
          },
        });
      var Lt = /%20/g,
        It = /#.*$/,
        Dt = /([?&])_=[^&]*/,
        Wt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Ft = /^(?:GET|HEAD)$/,
        _t = /^\/\//,
        Pt = {},
        qt = {},
        Ht = "*/".concat("*"),
        Rt = b.createElement("a");
      function Bt(e) {
        return function (t, n) {
          "string" != typeof t && ((n = t), (t = "*"));
          var r,
            i = 0,
            o = t.toLowerCase().match(_) || [];
          if (y(n))
            for (; (r = o[i++]); )
              "+" === r[0]
                ? ((r = r.slice(1) || "*"), (e[r] = e[r] || []).unshift(n))
                : (e[r] = e[r] || []).push(n);
        };
      }
      function zt(e, t, n, r) {
        var i = {},
          o = e === qt;
        function a(s) {
          var u;
          return (
            (i[s] = !0),
            k.each(e[s] || [], function (e, s) {
              var l = s(t, n, r);
              return "string" != typeof l || o || i[l]
                ? o
                  ? !(u = l)
                  : void 0
                : (t.dataTypes.unshift(l), a(l), !1);
            }),
            u
          );
        }
        return a(t.dataTypes[0]) || (!i["*"] && a("*"));
      }
      function Ut(e, t) {
        var n,
          r,
          i = k.ajaxSettings.flatOptions || {};
        for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && k.extend(!0, e, r), e;
      }
      (Rt.href = Ct.href),
        k.extend({
          active: 0,
          lastModified: {},
          etag: {},
          ajaxSettings: {
            url: Ct.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
              Ct.protocol
            ),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
              "*": Ht,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript",
            },
            contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
            responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON",
            },
            converters: {
              "* text": String,
              "text html": !0,
              "text json": JSON.parse,
              "text xml": k.parseXML,
            },
            flatOptions: { url: !0, context: !0 },
          },
          ajaxSetup: function (e, t) {
            return t ? Ut(Ut(e, k.ajaxSettings), t) : Ut(k.ajaxSettings, e);
          },
          ajaxPrefilter: Bt(Pt),
          ajaxTransport: Bt(qt),
          ajax: function (e, t) {
            "object" == typeof e && ((t = e), (e = void 0)), (t = t || {});
            var r,
              i,
              o,
              a,
              s,
              u,
              l,
              c,
              f,
              p,
              d = k.ajaxSetup({}, t),
              h = d.context || d,
              g = d.context && (h.nodeType || h.jquery) ? k(h) : k.event,
              m = k.Deferred(),
              y = k.Callbacks("once memory"),
              v = d.statusCode || {},
              x = {},
              w = {},
              A = "canceled",
              C = {
                readyState: 0,
                getResponseHeader: function (e) {
                  var t;
                  if (l) {
                    if (!a)
                      for (a = {}; (t = Wt.exec(o)); )
                        a[t[1].toLowerCase() + " "] = (
                          a[t[1].toLowerCase() + " "] || []
                        ).concat(t[2]);
                    t = a[e.toLowerCase() + " "];
                  }
                  return null == t ? null : t.join(", ");
                },
                getAllResponseHeaders: function () {
                  return l ? o : null;
                },
                setRequestHeader: function (e, t) {
                  return (
                    null == l &&
                      ((e = w[e.toLowerCase()] = w[e.toLowerCase()] || e),
                      (x[e] = t)),
                    this
                  );
                },
                overrideMimeType: function (e) {
                  return null == l && (d.mimeType = e), this;
                },
                statusCode: function (e) {
                  var t;
                  if (e)
                    if (l) C.always(e[C.status]);
                    else for (t in e) v[t] = [v[t], e[t]];
                  return this;
                },
                abort: function (e) {
                  var t = e || A;
                  return r && r.abort(t), S(0, t), this;
                },
              };
            if (
              (m.promise(C),
              (d.url = ((e || d.url || Ct.href) + "").replace(
                _t,
                Ct.protocol + "//"
              )),
              (d.type = t.method || t.type || d.method || d.type),
              (d.dataTypes = (d.dataType || "*").toLowerCase().match(_) || [
                "",
              ]),
              null == d.crossDomain)
            ) {
              u = b.createElement("a");
              try {
                (u.href = d.url),
                  (u.href = u.href),
                  (d.crossDomain =
                    Rt.protocol + "//" + Rt.host != u.protocol + "//" + u.host);
              } catch (e) {
                d.crossDomain = !0;
              }
            }
            if (
              (d.data &&
                d.processData &&
                "string" != typeof d.data &&
                (d.data = k.param(d.data, d.traditional)),
              zt(Pt, d, t, C),
              l)
            )
              return C;
            for (f in ((c = k.event && d.global) &&
              0 == k.active++ &&
              k.event.trigger("ajaxStart"),
            (d.type = d.type.toUpperCase()),
            (d.hasContent = !Ft.test(d.type)),
            (i = d.url.replace(It, "")),
            d.hasContent
              ? d.data &&
                d.processData &&
                0 ===
                  (d.contentType || "").indexOf(
                    "application/x-www-form-urlencoded"
                  ) &&
                (d.data = d.data.replace(Lt, "+"))
              : ((p = d.url.slice(i.length)),
                d.data &&
                  (d.processData || "string" == typeof d.data) &&
                  ((i += (jt.test(i) ? "&" : "?") + d.data), delete d.data),
                !1 === d.cache &&
                  ((i = i.replace(Dt, "$1")),
                  (p = (jt.test(i) ? "&" : "?") + "_=" + St.guid++ + p)),
                (d.url = i + p)),
            d.ifModified &&
              (k.lastModified[i] &&
                C.setRequestHeader("If-Modified-Since", k.lastModified[i]),
              k.etag[i] && C.setRequestHeader("If-None-Match", k.etag[i])),
            ((d.data && d.hasContent && !1 !== d.contentType) ||
              t.contentType) &&
              C.setRequestHeader("Content-Type", d.contentType),
            C.setRequestHeader(
              "Accept",
              d.dataTypes[0] && d.accepts[d.dataTypes[0]]
                ? d.accepts[d.dataTypes[0]] +
                    ("*" !== d.dataTypes[0] ? ", " + Ht + "; q=0.01" : "")
                : d.accepts["*"]
            ),
            d.headers))
              C.setRequestHeader(f, d.headers[f]);
            if (d.beforeSend && (!1 === d.beforeSend.call(h, C, d) || l))
              return C.abort();
            if (
              ((A = "abort"),
              y.add(d.complete),
              C.done(d.success),
              C.fail(d.error),
              (r = zt(qt, d, t, C)))
            ) {
              if (((C.readyState = 1), c && g.trigger("ajaxSend", [C, d]), l))
                return C;
              d.async &&
                d.timeout > 0 &&
                (s = n.setTimeout(function () {
                  C.abort("timeout");
                }, d.timeout));
              try {
                (l = !1), r.send(x, S);
              } catch (e) {
                if (l) throw e;
                S(-1, e);
              }
            } else S(-1, "No Transport");
            function S(e, t, a, u) {
              var f,
                p,
                b,
                x,
                w,
                A = t;
              l ||
                ((l = !0),
                s && n.clearTimeout(s),
                (r = void 0),
                (o = u || ""),
                (C.readyState = e > 0 ? 4 : 0),
                (f = (e >= 200 && e < 300) || 304 === e),
                a &&
                  (x = (function (e, t, n) {
                    for (
                      var r, i, o, a, s = e.contents, u = e.dataTypes;
                      "*" === u[0];

                    )
                      u.shift(),
                        void 0 === r &&
                          (r =
                            e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                      for (i in s)
                        if (s[i] && s[i].test(r)) {
                          u.unshift(i);
                          break;
                        }
                    if (u[0] in n) o = u[0];
                    else {
                      for (i in n) {
                        if (!u[0] || e.converters[i + " " + u[0]]) {
                          o = i;
                          break;
                        }
                        a || (a = i);
                      }
                      o = o || a;
                    }
                    if (o) return o !== u[0] && u.unshift(o), n[o];
                  })(d, C, a)),
                !f &&
                  k.inArray("script", d.dataTypes) > -1 &&
                  (d.converters["text script"] = function () {}),
                (x = (function (e, t, n, r) {
                  var i,
                    o,
                    a,
                    s,
                    u,
                    l = {},
                    c = e.dataTypes.slice();
                  if (c[1])
                    for (a in e.converters)
                      l[a.toLowerCase()] = e.converters[a];
                  for (o = c.shift(); o; )
                    if (
                      (e.responseFields[o] && (n[e.responseFields[o]] = t),
                      !u &&
                        r &&
                        e.dataFilter &&
                        (t = e.dataFilter(t, e.dataType)),
                      (u = o),
                      (o = c.shift()))
                    )
                      if ("*" === o) o = u;
                      else if ("*" !== u && u !== o) {
                        if (!(a = l[u + " " + o] || l["* " + o]))
                          for (i in l)
                            if (
                              (s = i.split(" "))[1] === o &&
                              (a = l[u + " " + s[0]] || l["* " + s[0]])
                            ) {
                              !0 === a
                                ? (a = l[i])
                                : !0 !== l[i] && ((o = s[0]), c.unshift(s[1]));
                              break;
                            }
                        if (!0 !== a)
                          if (a && e.throws) t = a(t);
                          else
                            try {
                              t = a(t);
                            } catch (e) {
                              return {
                                state: "parsererror",
                                error: a
                                  ? e
                                  : "No conversion from " + u + " to " + o,
                              };
                            }
                      }
                  return { state: "success", data: t };
                })(d, x, C, f)),
                f
                  ? (d.ifModified &&
                      ((w = C.getResponseHeader("Last-Modified")) &&
                        (k.lastModified[i] = w),
                      (w = C.getResponseHeader("etag")) && (k.etag[i] = w)),
                    204 === e || "HEAD" === d.type
                      ? (A = "nocontent")
                      : 304 === e
                      ? (A = "notmodified")
                      : ((A = x.state), (p = x.data), (f = !(b = x.error))))
                  : ((b = A), (!e && A) || ((A = "error"), e < 0 && (e = 0))),
                (C.status = e),
                (C.statusText = (t || A) + ""),
                f ? m.resolveWith(h, [p, A, C]) : m.rejectWith(h, [C, A, b]),
                C.statusCode(v),
                (v = void 0),
                c &&
                  g.trigger(f ? "ajaxSuccess" : "ajaxError", [C, d, f ? p : b]),
                y.fireWith(h, [C, A]),
                c &&
                  (g.trigger("ajaxComplete", [C, d]),
                  --k.active || k.event.trigger("ajaxStop")));
            }
            return C;
          },
          getJSON: function (e, t, n) {
            return k.get(e, t, n, "json");
          },
          getScript: function (e, t) {
            return k.get(e, void 0, t, "script");
          },
        }),
        k.each(["get", "post"], function (e, t) {
          k[t] = function (e, n, r, i) {
            return (
              y(n) && ((i = i || r), (r = n), (n = void 0)),
              k.ajax(
                k.extend(
                  { url: e, type: t, dataType: i, data: n, success: r },
                  k.isPlainObject(e) && e
                )
              )
            );
          };
        }),
        k.ajaxPrefilter(function (e) {
          var t;
          for (t in e.headers)
            "content-type" === t.toLowerCase() &&
              (e.contentType = e.headers[t] || "");
        }),
        (k._evalUrl = function (e, t, n) {
          return k.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: { "text script": function () {} },
            dataFilter: function (e) {
              k.globalEval(e, t, n);
            },
          });
        }),
        k.fn.extend({
          wrapAll: function (e) {
            var t;
            return (
              this[0] &&
                (y(e) && (e = e.call(this[0])),
                (t = k(e, this[0].ownerDocument).eq(0).clone(!0)),
                this[0].parentNode && t.insertBefore(this[0]),
                t
                  .map(function () {
                    for (var e = this; e.firstElementChild; )
                      e = e.firstElementChild;
                    return e;
                  })
                  .append(this)),
              this
            );
          },
          wrapInner: function (e) {
            return y(e)
              ? this.each(function (t) {
                  k(this).wrapInner(e.call(this, t));
                })
              : this.each(function () {
                  var t = k(this),
                    n = t.contents();
                  n.length ? n.wrapAll(e) : t.append(e);
                });
          },
          wrap: function (e) {
            var t = y(e);
            return this.each(function (n) {
              k(this).wrapAll(t ? e.call(this, n) : e);
            });
          },
          unwrap: function (e) {
            return (
              this.parent(e)
                .not("body")
                .each(function () {
                  k(this).replaceWith(this.childNodes);
                }),
              this
            );
          },
        }),
        (k.expr.pseudos.hidden = function (e) {
          return !k.expr.pseudos.visible(e);
        }),
        (k.expr.pseudos.visible = function (e) {
          return !!(
            e.offsetWidth ||
            e.offsetHeight ||
            e.getClientRects().length
          );
        }),
        (k.ajaxSettings.xhr = function () {
          try {
            return new n.XMLHttpRequest();
          } catch (e) {}
        });
      var $t = { 0: 200, 1223: 204 },
        Yt = k.ajaxSettings.xhr();
      (m.cors = !!Yt && "withCredentials" in Yt),
        (m.ajax = Yt = !!Yt),
        k.ajaxTransport(function (e) {
          var t, r;
          if (m.cors || (Yt && !e.crossDomain))
            return {
              send: function (i, o) {
                var a,
                  s = e.xhr();
                if (
                  (s.open(e.type, e.url, e.async, e.username, e.password),
                  e.xhrFields)
                )
                  for (a in e.xhrFields) s[a] = e.xhrFields[a];
                for (a in (e.mimeType &&
                  s.overrideMimeType &&
                  s.overrideMimeType(e.mimeType),
                e.crossDomain ||
                  i["X-Requested-With"] ||
                  (i["X-Requested-With"] = "XMLHttpRequest"),
                i))
                  s.setRequestHeader(a, i[a]);
                (t = function (e) {
                  return function () {
                    t &&
                      ((t = r = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null),
                      "abort" === e
                        ? s.abort()
                        : "error" === e
                        ? "number" != typeof s.status
                          ? o(0, "error")
                          : o(s.status, s.statusText)
                        : o(
                            $t[s.status] || s.status,
                            s.statusText,
                            "text" !== (s.responseType || "text") ||
                              "string" != typeof s.responseText
                              ? { binary: s.response }
                              : { text: s.responseText },
                            s.getAllResponseHeaders()
                          ));
                  };
                }),
                  (s.onload = t()),
                  (r = s.onerror = s.ontimeout = t("error")),
                  void 0 !== s.onabort
                    ? (s.onabort = r)
                    : (s.onreadystatechange = function () {
                        4 === s.readyState &&
                          n.setTimeout(function () {
                            t && r();
                          });
                      }),
                  (t = t("abort"));
                try {
                  s.send((e.hasContent && e.data) || null);
                } catch (e) {
                  if (t) throw e;
                }
              },
              abort: function () {
                t && t();
              },
            };
        }),
        k.ajaxPrefilter(function (e) {
          e.crossDomain && (e.contents.script = !1);
        }),
        k.ajaxSetup({
          accepts: {
            script:
              "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
          },
          contents: { script: /\b(?:java|ecma)script\b/ },
          converters: {
            "text script": function (e) {
              return k.globalEval(e), e;
            },
          },
        }),
        k.ajaxPrefilter("script", function (e) {
          void 0 === e.cache && (e.cache = !1),
            e.crossDomain && (e.type = "GET");
        }),
        k.ajaxTransport("script", function (e) {
          var t, n;
          if (e.crossDomain || e.scriptAttrs)
            return {
              send: function (r, i) {
                (t = k("<script>")
                  .attr(e.scriptAttrs || {})
                  .prop({ charset: e.scriptCharset, src: e.url })
                  .on(
                    "load error",
                    (n = function (e) {
                      t.remove(),
                        (n = null),
                        e && i("error" === e.type ? 404 : 200, e.type);
                    })
                  )),
                  b.head.appendChild(t[0]);
              },
              abort: function () {
                n && n();
              },
            };
        });
      var Gt,
        Vt = [],
        Xt = /(=)\?(?=&|$)|\?\?/;
      k.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
          var e = Vt.pop() || k.expando + "_" + St.guid++;
          return (this[e] = !0), e;
        },
      }),
        k.ajaxPrefilter("json jsonp", function (e, t, r) {
          var i,
            o,
            a,
            s =
              !1 !== e.jsonp &&
              (Xt.test(e.url)
                ? "url"
                : "string" == typeof e.data &&
                  0 ===
                    (e.contentType || "").indexOf(
                      "application/x-www-form-urlencoded"
                    ) &&
                  Xt.test(e.data) &&
                  "data");
          if (s || "jsonp" === e.dataTypes[0])
            return (
              (i = e.jsonpCallback = y(e.jsonpCallback)
                ? e.jsonpCallback()
                : e.jsonpCallback),
              s
                ? (e[s] = e[s].replace(Xt, "$1" + i))
                : !1 !== e.jsonp &&
                  (e.url += (jt.test(e.url) ? "&" : "?") + e.jsonp + "=" + i),
              (e.converters["script json"] = function () {
                return a || k.error(i + " was not called"), a[0];
              }),
              (e.dataTypes[0] = "json"),
              (o = n[i]),
              (n[i] = function () {
                a = arguments;
              }),
              r.always(function () {
                void 0 === o ? k(n).removeProp(i) : (n[i] = o),
                  e[i] && ((e.jsonpCallback = t.jsonpCallback), Vt.push(i)),
                  a && y(o) && o(a[0]),
                  (a = o = void 0);
              }),
              "script"
            );
        }),
        (m.createHTMLDocument =
          (((Gt = b.implementation.createHTMLDocument("").body).innerHTML =
            "<form></form><form></form>"),
          2 === Gt.childNodes.length)),
        (k.parseHTML = function (e, t, n) {
          return "string" != typeof e
            ? []
            : ("boolean" == typeof t && ((n = t), (t = !1)),
              t ||
                (m.createHTMLDocument
                  ? (((r = (t = b.implementation.createHTMLDocument(
                      ""
                    )).createElement("base")).href = b.location.href),
                    t.head.appendChild(r))
                  : (t = b)),
              (o = !n && []),
              (i = O.exec(e))
                ? [t.createElement(i[1])]
                : ((i = Ae([e], t, o)),
                  o && o.length && k(o).remove(),
                  k.merge([], i.childNodes)));
          var r, i, o;
        }),
        (k.fn.load = function (e, t, n) {
          var r,
            i,
            o,
            a = this,
            s = e.indexOf(" ");
          return (
            s > -1 && ((r = vt(e.slice(s))), (e = e.slice(0, s))),
            y(t)
              ? ((n = t), (t = void 0))
              : t && "object" == typeof t && (i = "POST"),
            a.length > 0 &&
              k
                .ajax({ url: e, type: i || "GET", dataType: "html", data: t })
                .done(function (e) {
                  (o = arguments),
                    a.html(r ? k("<div>").append(k.parseHTML(e)).find(r) : e);
                })
                .always(
                  n &&
                    function (e, t) {
                      a.each(function () {
                        n.apply(this, o || [e.responseText, t, e]);
                      });
                    }
                ),
            this
          );
        }),
        (k.expr.pseudos.animated = function (e) {
          return k.grep(k.timers, function (t) {
            return e === t.elem;
          }).length;
        }),
        (k.offset = {
          setOffset: function (e, t, n) {
            var r,
              i,
              o,
              a,
              s,
              u,
              l = k.css(e, "position"),
              c = k(e),
              f = {};
            "static" === l && (e.style.position = "relative"),
              (s = c.offset()),
              (o = k.css(e, "top")),
              (u = k.css(e, "left")),
              ("absolute" === l || "fixed" === l) &&
              (o + u).indexOf("auto") > -1
                ? ((a = (r = c.position()).top), (i = r.left))
                : ((a = parseFloat(o) || 0), (i = parseFloat(u) || 0)),
              y(t) && (t = t.call(e, n, k.extend({}, s))),
              null != t.top && (f.top = t.top - s.top + a),
              null != t.left && (f.left = t.left - s.left + i),
              "using" in t
                ? t.using.call(e, f)
                : ("number" == typeof f.top && (f.top += "px"),
                  "number" == typeof f.left && (f.left += "px"),
                  c.css(f));
          },
        }),
        k.fn.extend({
          offset: function (e) {
            if (arguments.length)
              return void 0 === e
                ? this
                : this.each(function (t) {
                    k.offset.setOffset(this, e, t);
                  });
            var t,
              n,
              r = this[0];
            return r
              ? r.getClientRects().length
                ? ((t = r.getBoundingClientRect()),
                  (n = r.ownerDocument.defaultView),
                  { top: t.top + n.pageYOffset, left: t.left + n.pageXOffset })
                : { top: 0, left: 0 }
              : void 0;
          },
          position: function () {
            if (this[0]) {
              var e,
                t,
                n,
                r = this[0],
                i = { top: 0, left: 0 };
              if ("fixed" === k.css(r, "position"))
                t = r.getBoundingClientRect();
              else {
                for (
                  t = this.offset(),
                    n = r.ownerDocument,
                    e = r.offsetParent || n.documentElement;
                  e &&
                  (e === n.body || e === n.documentElement) &&
                  "static" === k.css(e, "position");

                )
                  e = e.parentNode;
                e &&
                  e !== r &&
                  1 === e.nodeType &&
                  (((i = k(e).offset()).top += k.css(e, "borderTopWidth", !0)),
                  (i.left += k.css(e, "borderLeftWidth", !0)));
              }
              return {
                top: t.top - i.top - k.css(r, "marginTop", !0),
                left: t.left - i.left - k.css(r, "marginLeft", !0),
              };
            }
          },
          offsetParent: function () {
            return this.map(function () {
              for (
                var e = this.offsetParent;
                e && "static" === k.css(e, "position");

              )
                e = e.offsetParent;
              return e || oe;
            });
          },
        }),
        k.each(
          { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
          function (e, t) {
            var n = "pageYOffset" === t;
            k.fn[e] = function (r) {
              return U(
                this,
                function (e, r, i) {
                  var o;
                  if (
                    (v(e) ? (o = e) : 9 === e.nodeType && (o = e.defaultView),
                    void 0 === i)
                  )
                    return o ? o[t] : e[r];
                  o
                    ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset)
                    : (e[r] = i);
                },
                e,
                r,
                arguments.length
              );
            };
          }
        ),
        k.each(["top", "left"], function (e, t) {
          k.cssHooks[t] = Ye(m.pixelPosition, function (e, n) {
            if (n)
              return (n = $e(e, t)), Re.test(n) ? k(e).position()[t] + "px" : n;
          });
        }),
        k.each({ Height: "height", Width: "width" }, function (e, t) {
          k.each(
            { padding: "inner" + e, content: t, "": "outer" + e },
            function (n, r) {
              k.fn[r] = function (i, o) {
                var a = arguments.length && (n || "boolean" != typeof i),
                  s = n || (!0 === i || !0 === o ? "margin" : "border");
                return U(
                  this,
                  function (t, n, i) {
                    var o;
                    return v(t)
                      ? 0 === r.indexOf("outer")
                        ? t["inner" + e]
                        : t.document.documentElement["client" + e]
                      : 9 === t.nodeType
                      ? ((o = t.documentElement),
                        Math.max(
                          t.body["scroll" + e],
                          o["scroll" + e],
                          t.body["offset" + e],
                          o["offset" + e],
                          o["client" + e]
                        ))
                      : void 0 === i
                      ? k.css(t, n, s)
                      : k.style(t, n, i, s);
                  },
                  t,
                  a ? i : void 0,
                  a
                );
              };
            }
          );
        }),
        k.each(
          [
            "ajaxStart",
            "ajaxStop",
            "ajaxComplete",
            "ajaxError",
            "ajaxSuccess",
            "ajaxSend",
          ],
          function (e, t) {
            k.fn[t] = function (e) {
              return this.on(t, e);
            };
          }
        ),
        k.fn.extend({
          bind: function (e, t, n) {
            return this.on(e, null, t, n);
          },
          unbind: function (e, t) {
            return this.off(e, null, t);
          },
          delegate: function (e, t, n, r) {
            return this.on(t, e, n, r);
          },
          undelegate: function (e, t, n) {
            return 1 === arguments.length
              ? this.off(e, "**")
              : this.off(t, e || "**", n);
          },
          hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e);
          },
        }),
        k.each(
          "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
            " "
          ),
          function (e, t) {
            k.fn[t] = function (e, n) {
              return arguments.length > 0
                ? this.on(t, null, e, n)
                : this.trigger(t);
            };
          }
        );
      var Jt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      (k.proxy = function (e, t) {
        var n, r, i;
        if (("string" == typeof t && ((n = e[t]), (t = e), (e = n)), y(e)))
          return (
            (r = s.call(arguments, 2)),
            ((i = function () {
              return e.apply(t || this, r.concat(s.call(arguments)));
            }).guid = e.guid = e.guid || k.guid++),
            i
          );
      }),
        (k.holdReady = function (e) {
          e ? k.readyWait++ : k.ready(!0);
        }),
        (k.isArray = Array.isArray),
        (k.parseJSON = JSON.parse),
        (k.nodeName = N),
        (k.isFunction = y),
        (k.isWindow = v),
        (k.camelCase = V),
        (k.type = A),
        (k.now = Date.now),
        (k.isNumeric = function (e) {
          var t = k.type(e);
          return (
            ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
          );
        }),
        (k.trim = function (e) {
          return null == e ? "" : (e + "").replace(Jt, "");
        }),
        void 0 ===
          (r = function () {
            return k;
          }.apply(t, [])) || (e.exports = r);
      var Kt = n.jQuery,
        Qt = n.$;
      return (
        (k.noConflict = function (e) {
          return (
            n.$ === k && (n.$ = Qt), e && n.jQuery === k && (n.jQuery = Kt), k
          );
        }),
        void 0 === i && (n.jQuery = n.$ = k),
        k
      );
    });
  },
  function (e, t, n) {
    "use strict";
    e.exports = function (e, t, n) {
      (this.x = e), (this.y = t), (this.walkable = void 0 === n || n);
    };
  },
  function (e, t, n) {
    "use strict";
    var r = n(3),
      i = n(1),
      o = n(2),
      a = n(0);
    function s(e) {
      (e = e || {}),
        (this.allowDiagonal = e.allowDiagonal),
        (this.dontCrossCorners = e.dontCrossCorners),
        (this.heuristic = e.heuristic || o.manhattan),
        (this.weight = e.weight || 1),
        (this.diagonalMovement = e.diagonalMovement),
        this.diagonalMovement ||
          (this.allowDiagonal
            ? this.dontCrossCorners
              ? (this.diagonalMovement = a.OnlyWhenNoObstacles)
              : (this.diagonalMovement = a.IfAtMostOneObstacle)
            : (this.diagonalMovement = a.Never)),
        this.diagonalMovement === a.Never
          ? (this.heuristic = e.heuristic || o.manhattan)
          : (this.heuristic = e.heuristic || o.octile);
    }
    (s.prototype.findPath = function (e, t, n, o, a) {
      var s,
        u,
        l,
        c,
        f,
        p,
        d,
        h,
        g = new r(function (e, t) {
          return e.f - t.f;
        }),
        m = a.getNodeAt(e, t),
        y = a.getNodeAt(n, o),
        v = this.heuristic,
        b = this.diagonalMovement,
        x = this.weight,
        w = Math.abs,
        A = Math.SQRT2;
      for (m.g = 0, m.f = 0, g.push(m), m.opened = !0; !g.empty(); ) {
        if ((((s = g.pop()).closed = !0), s === y)) return i.backtrace(y);
        for (c = 0, f = (u = a.getNeighbors(s, b)).length; c < f; ++c)
          (l = u[c]).closed ||
            ((p = l.x),
            (d = l.y),
            (h = s.g + (p - s.x == 0 || d - s.y == 0 ? 1 : A)),
            (!l.opened || h < l.g) &&
              ((l.g = h),
              (l.h = l.h || x * v(w(p - n), w(d - o))),
              (l.f = l.g + l.h),
              (l.parent = s),
              l.opened ? g.updateItem(l) : (g.push(l), (l.opened = !0))));
      }
      return [];
    }),
      (e.exports = s);
  },
  function (e, t, n) {
    "use strict";
    var r = n(3),
      i = n(1),
      o = n(2),
      a = n(0);
    function s(e) {
      (e = e || {}),
        (this.allowDiagonal = e.allowDiagonal),
        (this.dontCrossCorners = e.dontCrossCorners),
        (this.diagonalMovement = e.diagonalMovement),
        (this.heuristic = e.heuristic || o.manhattan),
        (this.weight = e.weight || 1),
        this.diagonalMovement ||
          (this.allowDiagonal
            ? this.dontCrossCorners
              ? (this.diagonalMovement = a.OnlyWhenNoObstacles)
              : (this.diagonalMovement = a.IfAtMostOneObstacle)
            : (this.diagonalMovement = a.Never)),
        this.diagonalMovement === a.Never
          ? (this.heuristic = e.heuristic || o.manhattan)
          : (this.heuristic = e.heuristic || o.octile);
    }
    (s.prototype.findPath = function (e, t, n, o, a) {
      var s,
        u,
        l,
        c,
        f,
        p,
        d,
        h,
        g = function (e, t) {
          return e.f - t.f;
        },
        m = new r(g),
        y = new r(g),
        v = a.getNodeAt(e, t),
        b = a.getNodeAt(n, o),
        x = this.heuristic,
        w = this.diagonalMovement,
        A = this.weight,
        k = Math.abs,
        C = Math.SQRT2;
      for (
        v.g = 0,
          v.f = 0,
          m.push(v),
          v.opened = 1,
          b.g = 0,
          b.f = 0,
          y.push(b),
          b.opened = 2;
        !m.empty() && !y.empty();

      ) {
        for (
          (s = m.pop()).closed = !0,
            c = 0,
            f = (u = a.getNeighbors(s, w)).length;
          c < f;
          ++c
        )
          if (!(l = u[c]).closed) {
            if (2 === l.opened) return i.biBacktrace(s, l);
            (p = l.x),
              (d = l.y),
              (h = s.g + (p - s.x == 0 || d - s.y == 0 ? 1 : C)),
              (!l.opened || h < l.g) &&
                ((l.g = h),
                (l.h = l.h || A * x(k(p - n), k(d - o))),
                (l.f = l.g + l.h),
                (l.parent = s),
                l.opened ? m.updateItem(l) : (m.push(l), (l.opened = 1)));
          }
        for (
          (s = y.pop()).closed = !0,
            c = 0,
            f = (u = a.getNeighbors(s, w)).length;
          c < f;
          ++c
        )
          if (!(l = u[c]).closed) {
            if (1 === l.opened) return i.biBacktrace(l, s);
            (p = l.x),
              (d = l.y),
              (h = s.g + (p - s.x == 0 || d - s.y == 0 ? 1 : C)),
              (!l.opened || h < l.g) &&
                ((l.g = h),
                (l.h = l.h || A * x(k(p - e), k(d - t))),
                (l.f = l.g + l.h),
                (l.parent = s),
                l.opened ? y.updateItem(l) : (y.push(l), (l.opened = 2)));
          }
      }
      return [];
    }),
      (e.exports = s);
  },
  function (e, t, n) {
    "use strict";
    function r(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    var i = n(15),
      o = (n(5), 0),
      a = function (e) {
        return e.id || (e.id = ++o);
      };
    var s = {},
      u = {},
      l = 0,
      c = function (e) {
        var t = e.id || (e.id = "ptr" + ++l);
        return e.crossed || e.hyper
          ? e.name.ref in s
            ? s[e.name.ref]
            : e.name.ref in u
            ? u[e.name.ref]
            : ((e.independent = !0), (u[e.name.ref] = t))
          : e.name.ref in s
          ? ((e.independent = !0), t)
          : e.name.ref in u
          ? ((s[e.name.ref] = u[e.name.ref]),
            delete u[e.name.ref],
            s[e.name.ref])
          : ((e.independent = !0), (s[e.name.ref] = t));
      };
    function f(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
        n = p(e, t || []);
      return n;
    }
    function p(e, t) {
      return e.reduce(function (n, i) {
        var o = (function e(t, n) {
          if (t.name) {
            if ((t.erased, t.target && t.target.to))
              return [
                Object.assign({}, t, {
                  source: c(t),
                  target: { to: t.target.to },
                }),
              ];
            if (!t.target || t.target.ref) {
              t.target || (t.target = { ref: t.name.ref });
              var i = d(t.target.ref, n, []).ids,
                o = i;
              return (
                t.target.ref.startsWith("#") ||
                  (!(o = i.filter(function (e) {
                    return !e.options.crossed && !e.options.erased;
                  })).length &&
                    i.length &&
                    (o = i.filter(function (e) {
                      return !e.options.erased;
                    })),
                  !o.length && i.length && (o = i),
                  delete (o = [o[0]])[0].options.crossed,
                  delete o[0].options.erased,
                  (t.target.to = o)),
                [Object.assign({}, t, { source: c(t), target: { to: o } })]
              );
            }
            return t.assignment
              ? [
                  Object.assign({}, t, {
                    source: c(t),
                    val: t.target.val,
                    target: { to: [] },
                  }),
                ]
              : [
                  Object.assign({}, t, {
                    source: c(t),
                    target: { to: [{ id: a(t.target) }] },
                  }),
                ].concat(r(e(t.target, n)));
          }
          if (t.object || t.func) {
            var s = p(
              t.fields.map(function (e) {
                return e.inside || e.name || (!e.object && !e.array)
                  ? !e.val || e.object || e.array
                    ? e
                    : (a(e), Object.assign({}, e, { inside: !0 }))
                  : { name: {}, target: e };
              }),
              n
            );
            return [
              Object.assign({}, t, {
                fields: s.filter(function (e) {
                  return e.name || e.inside;
                }),
              }),
            ].concat(
              r(
                s.filter(function (e) {
                  return !e.name && !e.inside;
                })
              )
            );
          }
          if (t.array) {
            var u = p(
              t.array.map(function (e) {
                return e.name ? e : { name: {}, target: e };
              }),
              n
            );
            return [
              Object.assign({}, t, {
                array: u.filter(function (e) {
                  return e.name;
                }),
              }),
            ].concat(
              r(
                u.filter(function (e) {
                  return !e.name;
                })
              )
            );
          }
          if (void 0 !== t.val) return [t];
          throw new Error("Snapdown cannot flatten: " + Object.keys(t));
        })(i, [].concat(r(e), r(t)));
        return n ? n.concat(o) : [o];
      }, []);
    }
    function d(e, t, n) {
      var i = [],
        o = !0,
        s = !1,
        u = void 0;
      try {
        for (
          var l, c = t[Symbol.iterator]();
          !(o = (l = c.next()).done);
          o = !0
        ) {
          var f = l.value;
          f.name && f.name.ref === e && i.push(f);
          var p = f.fields || (f.target && f.target.fields) || [],
            h = !0,
            g = !1,
            m = void 0;
          try {
            for (
              var y, v = p[Symbol.iterator]();
              !(h = (y = v.next()).done);
              h = !0
            ) {
              var b = y.value;
              b.name && b.name.ref === e && i.push(b);
            }
          } catch (e) {
            (g = !0), (m = e);
          } finally {
            try {
              !h && v.return && v.return();
            } finally {
              if (g) throw m;
            }
          }
        }
      } catch (e) {
        (s = !0), (u = e);
      } finally {
        try {
          !o && c.return && c.return();
        } finally {
          if (s) throw u;
        }
      }
      if (!i.length) throw new Error("Snapdown cannot lookup: " + e);
      var x = [],
        w = [],
        A = function () {
          var e = {
            crossed: T.crossed,
            hyper: T.hyper,
            group: T.group,
            erased: T.erased,
          };
          if (T.assignment) return w.push({ id: a(T), options: e }), "continue";
          var i = a(T.target);
          !T.crossed && T.hyper;
          if (T.target.ref && !n.includes(i)) {
            var o = d(T.target.ref, t, [i].concat(r(n)));
            o.loop
              ? (x = o.ids)
              : w.push.apply(
                  w,
                  r(
                    o.ids.map(function (t) {
                      return Object.assign(t, { options: e });
                    })
                  )
                );
          } else
            n.includes(i)
              ? (x = [{ id: a(T), options: e }])
              : w.push({ id: i, options: e });
        },
        k = !0,
        C = !1,
        S = void 0;
      try {
        for (
          var j, E = i[Symbol.iterator]();
          !(k = (j = E.next()).done);
          k = !0
        ) {
          var T = j.value;
          A();
        }
      } catch (e) {
        (C = !0), (S = e);
      } finally {
        try {
          !k && E.return && E.return();
        } finally {
          if (C) throw S;
        }
      }
      return w.length ? { ids: w, loop: !1 } : { ids: x, loop: !0 };
    }
    e.exports = {
      parse: function (e) {
        try {
          return i.parse(e);
        } catch (t) {
          throw (
            (t.location &&
              (t.message +=
                " (line " +
                t.location.start.line +
                " col " +
                t.location.start.column +
                ")"),
            (t.input = e),
            t)
          );
        }
      },
      transform: function (e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        t && ((s = {}), (u = {}), (l = 0), (o = 0));
        for (
          var n = (e.stack || []).map(function (e) {
              return Object.assign({}, e, { id: a(e) });
            }),
            r = e.heap,
            i = {
              stack: f(n, r),
              heap: f(
                (e.heap || []).map(function (e) {
                  return Object.assign({}, e, { id: a(e) });
                }),
                n
              ),
            },
            c = [],
            p = 0;
          p < i.stack.length;
          p++
        )
          i.stack[p].func ? c.push(i.stack[p]) : i.heap.push(i.stack[p]);
        return (i.stack = c), i;
      },
      identify: a,
      identifyPtrSource: c,
      lookupRef: d,
    };
  },
  function (e, t, n) {
    e.exports = n(11);
  },
  function (e, t, n) {
    "use strict";
    var r = n(12),
      i = n(13),
      o = n(9),
      a = n(16),
      s = n(17),
      u = n(19),
      l = n(37),
      c = 'script[type="application/snapdown"]',
      f = 'script[type="application/snapdown+json"]',
      p = n(5),
      d = "Unknown",
      h = {
        get instance() {
          return (
            delete this.instance,
            (this.instance = new r({
              workerUrl: URL.createObjectURL(
                new Blob(
                  [
                    "importScripts('https://unpkg.com/elkjs@0.6.2/lib/elk-worker.min.js');",
                  ],
                  { type: "application/javascript" }
                )
              ),
            }))
          );
        },
      };
    function g() {
      return (Math.random() + 1).toString(36).substring(7);
    }
    function m(e) {
      if (!e.matches(c))
        throw new Error("Snapdown.parseText: expected input to be a " + c);
      var t = i.safeLoadFront(e.text).__content,
        n = o.parse(t),
        r = l.specToDiagrams(n, !0);
      return { master: r[r.length - 1], individual: l.specToDiagrams(n, !1) };
    }
    function y(e, t) {
      var n = o.transform(t),
        r = document.createElement("script");
      return (
        (r.text = JSON.stringify(n)),
        (r.type = "application/snapdown+json"),
        (r.className = "no-markdown"),
        (r.id = e.id + "-json-" + g()),
        r.setAttribute("percentSize", e.getAttribute("percentSize") || 100),
        e.parentNode.insertBefore(r, e),
        r
      );
    }
    function v(e, t, n) {
      var r = [],
        i = u.layoutRoughEdges(n);
      n.forEach(function (n) {
        r.push(a.draw(t, n, e));
      });
      var o = void 0,
        s = a.createSVGRoot(function (e) {
          o = e;
        });
      s.setAttribute(
        "width",
        r
          .map(function (e) {
            return parseInt(e.getAttribute("width"));
          })
          .reduce(function (e, t) {
            return e + t;
          }, 0)
      ),
        s.setAttribute(
          "height",
          Math.max.apply(
            Math,
            (function (e) {
              if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++)
                  n[t] = e[t];
                return n;
              }
              return Array.from(e);
            })(
              r.map(function (e) {
                return parseInt(e.getAttribute("height"));
              })
            )
          )
        );
      for (
        var l = 0,
          c = function (e) {
            ["defs", "style"].forEach(function (t) {
              var n = r[e].getElementsByTagName(t)[0].cloneNode(!0);
              s.appendChild(n);
            });
            var t = r[e].getElementsByTagName("g")[0].cloneNode(!0);
            t.setAttribute(
              "transform",
              "translate(" + (n[e].x + l) + "," + n[e].y + ")"
            ),
              (l += n[e].width),
              s.appendChild(t);
          },
          f = r.length - 1;
        f >= 0;
        f--
      )
        c(f);
      return (
        r.forEach(function (e) {
          return e.remove();
        }),
        (s.id = e),
        i.forEach(function (e) {
          for (
            var t = e.path,
              n = e.crossed,
              r = a.createSVG("path", "snap-arrow-" + o),
              i = [],
              u = 0;
            u < t.length;
            u++
          )
            0 == u
              ? i.push("M " + t[u][0] + " " + t[u][1])
              : i.push("L " + t[u][0] + " " + t[u][1]);
          r.setAttribute("d", i.join(" ")), s.append(r), n && a.addCross(s, r);
        }),
        s.setAttribute(
          "viewBox",
          "0 0 " + s.getAttribute("width") + " " + s.getAttribute("height")
        ),
        ["width", "height"].map(function (e) {
          s.setAttribute(
            e,
            (parseInt(s.getAttribute(e)) *
              parseInt(t.getAttribute("percentSize"))) /
              100
          );
        }),
        s
      );
    }
    function b(e, t, n) {
      var r =
          arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
        i = [],
        o = [];
      if (
        (e.forEach(function (e) {
          var r = e.combined;
          t.parentNode.insertBefore(r, t.nextSibling),
            o.push(r.getBBox().width),
            (r.style.display = "none"),
            n.push(r),
            i.push(r);
        }),
        r > e.length && (r = e.length),
        e.length > 1)
      ) {
        var a = document.createElement("br");
        (a.id = "br" + g()),
          t.parentNode.insertBefore(a, t.nextSibling),
          n.push(a);
        var s = document.createElement("div");
        s.id = t.id + "-sliderContent";
        var u = t.id + "-slider",
          l = t.id + "-text";
        (s.innerHTML =
          "<b id=" +
          l +
          ">Step " +
          r +
          "</b><br /><input id=" +
          u +
          ' type="range" min="1" max="' +
          e.length +
          '" value="' +
          r +
          '">'),
          t.parentNode.insertBefore(s, t.nextSibling),
          (document.getElementById(u).onchange = function () {
            var t = document.getElementById(u),
              n = document.getElementById(l),
              r = t.value;
            i.forEach(function (e) {
              e.style.display = "none";
            }),
              (i[r - 1].style.display = "block"),
              (n.innerHTML = "Step " + r);
            var a = (o[0] - t.width) / 3;
            t.style.marginLeft = a + "px";
            var s = t.getBoundingClientRect().width,
              c = n.getBoundingClientRect().width;
            n.style.marginLeft =
              a + ((r - 1) * s) / (e.length - 1) - c / 2 + "px";
          }),
          n.push(s),
          document.getElementById(u).onchange();
      }
      i[r - 1].style.display = "block";
    }
    function x(e, t, n) {
      return new Promise(function (r, i) {
        if (!e.matches(f))
          throw new Error("Snapdown.renderJSON: expected input to be a " + f);
        var o = JSON.parse(e.text),
          s = a.drawable(o);
        if (n) {
          var u = n.map(function (e) {
            return p.extend(!0, {}, e);
          });
          u[0] = l.modifyMaster(u[0], s[0]);
          var c = v(t, e, u);
          r({ combined: c, graphsAfterLayout: u });
        } else {
          var d = [],
            g = [];
          s.forEach(function (e) {
            g.push(
              h.instance.layout(e).then(function (e) {
                d.push(e);
              })
            );
          }),
            Promise.all(g).then(function () {
              r({ combined: null, graphsAfterLayout: d });
            });
        }
      });
    }
    e.exports = {
      render: function (e, t) {
        var n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
          r = [],
          i = [],
          o = [];
        if (e.matches(c)) {
          var a = m(e),
            s = a.individual,
            u = a.master,
            l = y(e, u);
          r.push(l.id);
          var f = l.id + "-svg-" + g();
          r.push(f),
            o.push(l),
            i.push(
              x(l, f)
                .then(function (t) {
                  t.combined;
                  var n = t.graphsAfterLayout;
                  return Promise.all(
                    s.map(function (t) {
                      var r = y(e, t);
                      return o.push(r), x(r, f + g(), n);
                    })
                  );
                })
                .then(function (e) {
                  return b(e, l, o, n);
                })
            );
        }
        return (
          Promise.all(i).then(function () {
            t && t(o);
          }),
          r
        );
      },
      renderAll: function () {
        var e =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],
          t = arguments[1],
          n = Array.from(document.querySelectorAll(c)),
          r = [],
          i = [],
          o = [];
        return (
          n.map(function (t) {
            try {
              var n = m(t),
                a = n.individual,
                s = n.master,
                u = y(t, s);
              r.push(u.id);
              var l = u.id + "-svg-" + g();
              r.push(l),
                i.push(
                  x(u, l)
                    .then(function (e) {
                      e.combined;
                      var n = e.graphsAfterLayout;
                      return Promise.all(
                        a.map(function (e) {
                          return x(y(t, e), l + g(), n);
                        })
                      );
                    })
                    .then(function (e) {
                      return b(e, u, o);
                    })
                );
            } catch (t) {
              if (e) throw t;
            }
          }),
          Promise.all(i).then(function () {
            t && t(o);
          }),
          r
        );
      },
      populateHelp: function (e) {
        var t = document.createElement("div");
        (t.innerHTML = s.sidebarHTML),
          e
            ? document.body.insertBefore(t, document.getElementById(e))
            : document.body.appendChild(t);
      },
      showHelp: function () {
        document.getElementById("snapdownHelp").className = "sidenav";
      },
      hideHelp: function () {
        document.getElementById("snapdownHelp").className = "hidenav";
      },
      showExample: function (e) {
        var t = document.getElementById(e + "-helptext"),
          n = ["(click to expand)", "(click to hide)"],
          r = t.innerHTML;
        t.innerHTML = n[1 - n.indexOf(r)];
        var i = document.getElementById(e + "-content"),
          o = ["none", "block"],
          a = i.style.display,
          s =
            "https://docs.google.com/forms/d/e/1FAIpQLScrnC_kfr9p8-ePZ2im9Ok62WbjMZEpILP_mzRyEQMv-qnYSA/formResponse?usp=pp_url&entry.1879725271=" +
            encodeURIComponent(d) +
            "&entry.1376962994=" +
            e +
            "-" +
            a +
            "&submit=Submit";
        try {
          fetch(s, { method: "POST", mode: "no-cors" });
        } catch (e) {
          console && console.error && console.error(e);
        }
        i.style.display = o[1 - o.indexOf(a)];
      },
      setRandomId: function (e) {
        d = e;
      },
    };
  },
  function (e, t, n) {
    e.exports = (function e(t, n, r) {
      function i(a, s) {
        if (!n[a]) {
          if (!t[a]) {
            if (o) return o(a, !0);
            var u = new Error("Cannot find module '" + a + "'");
            throw ((u.code = "MODULE_NOT_FOUND"), u);
          }
          var l = (n[a] = { exports: {} });
          t[a][0].call(
            l.exports,
            function (e) {
              return i(t[a][1][e] || e);
            },
            l,
            l.exports,
            e,
            t,
            n,
            r
          );
        }
        return n[a].exports;
      }
      for (var o = !1, a = 0; a < r.length; a++) i(r[a]);
      return i;
    })(
      {
        1: [
          function (e, t, n) {
            "use strict";
            Object.defineProperty(n, "__esModule", { value: !0 });
            var r = (function () {
              function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                  var r = t[n];
                  (r.enumerable = r.enumerable || !1),
                    (r.configurable = !0),
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r);
                }
              }
              return function (t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t;
              };
            })();
            function i(e, t) {
              if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function");
            }
            var o = (function () {
              function e() {
                var t = this,
                  n =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : {},
                  r = n.defaultLayoutOptions,
                  o = void 0 === r ? {} : r,
                  s = n.algorithms,
                  u =
                    void 0 === s
                      ? [
                          "layered",
                          "stress",
                          "mrtree",
                          "radial",
                          "force",
                          "disco",
                          "sporeOverlap",
                          "sporeCompaction",
                          "rectPacking",
                        ]
                      : s,
                  l = n.workerFactory,
                  c = n.workerUrl;
                if (
                  (i(this, e),
                  (this.defaultLayoutOptions = o),
                  (this.initialized = !1),
                  void 0 === c && void 0 === l)
                )
                  throw new Error(
                    "Cannot construct an ELK without both 'workerUrl' and 'workerFactory'."
                  );
                var f = l;
                void 0 !== c &&
                  void 0 === l &&
                  (f = function (e) {
                    return new Worker(e);
                  });
                var p = f(c);
                if ("function" != typeof p.postMessage)
                  throw new TypeError(
                    "Created worker does not provide the required 'postMessage' function."
                  );
                (this.worker = new a(p)),
                  this.worker
                    .postMessage({ cmd: "register", algorithms: u })
                    .then(function (e) {
                      return (t.initialized = !0);
                    })
                    .catch(console.err);
              }
              return (
                r(e, [
                  {
                    key: "layout",
                    value: function (e) {
                      var t =
                          arguments.length > 1 && void 0 !== arguments[1]
                            ? arguments[1]
                            : {},
                        n = t.layoutOptions,
                        r = void 0 === n ? this.defaultLayoutOptions : n,
                        i = t.logging,
                        o = void 0 !== i && i,
                        a = t.measureExecutionTime,
                        s = void 0 !== a && a;
                      return e
                        ? this.worker.postMessage({
                            cmd: "layout",
                            graph: e,
                            layoutOptions: r,
                            options: { logging: o, measureExecutionTime: s },
                          })
                        : Promise.reject(
                            new Error("Missing mandatory parameter 'graph'.")
                          );
                    },
                  },
                  {
                    key: "knownLayoutAlgorithms",
                    value: function () {
                      return this.worker.postMessage({ cmd: "algorithms" });
                    },
                  },
                  {
                    key: "knownLayoutOptions",
                    value: function () {
                      return this.worker.postMessage({ cmd: "options" });
                    },
                  },
                  {
                    key: "knownLayoutCategories",
                    value: function () {
                      return this.worker.postMessage({ cmd: "categories" });
                    },
                  },
                  {
                    key: "terminateWorker",
                    value: function () {
                      this.worker.terminate();
                    },
                  },
                ]),
                e
              );
            })();
            n.default = o;
            var a = (function () {
              function e(t) {
                var n = this;
                if ((i(this, e), void 0 === t))
                  throw new Error("Missing mandatory parameter 'worker'.");
                (this.resolvers = {}),
                  (this.worker = t),
                  (this.worker.onmessage = function (e) {
                    setTimeout(function () {
                      n.receive(n, e);
                    }, 0);
                  });
              }
              return (
                r(e, [
                  {
                    key: "postMessage",
                    value: function (e) {
                      var t = this.id || 0;
                      (this.id = t + 1), (e.id = t);
                      var n = this;
                      return new Promise(function (r, i) {
                        (n.resolvers[t] = function (e, t) {
                          e ? (n.convertGwtStyleError(e), i(e)) : r(t);
                        }),
                          n.worker.postMessage(e);
                      });
                    },
                  },
                  {
                    key: "receive",
                    value: function (e, t) {
                      var n = t.data,
                        r = e.resolvers[n.id];
                      r &&
                        (delete e.resolvers[n.id],
                        n.error ? r(n.error) : r(null, n.data));
                    },
                  },
                  {
                    key: "terminate",
                    value: function () {
                      this.worker.terminate && this.worker.terminate();
                    },
                  },
                  {
                    key: "convertGwtStyleError",
                    value: function (e) {
                      if (e) {
                        var t = e.__java$exception;
                        t &&
                          (t.cause &&
                            t.cause.backingJsObject &&
                            ((e.cause = t.cause.backingJsObject),
                            this.convertGwtStyleError(e.cause)),
                          delete e.__java$exception);
                      }
                    },
                  },
                ]),
                e
              );
            })();
          },
          {},
        ],
        2: [
          function (e, t, n) {
            "use strict";
            var r = e("./elk-api.js").default;
            Object.defineProperty(t.exports, "__esModule", { value: !0 }),
              (t.exports = r),
              (r.default = r);
          },
          { "./elk-api.js": 1 },
        ],
      },
      {},
      [2]
    )(2);
  },
  function (e, t, n) {
    var r;
    e.exports =
      ((r = n(14)),
      (function (e) {
        var t = {};
        function n(r) {
          if (t[r]) return t[r].exports;
          var i = (t[r] = { i: r, l: !1, exports: {} });
          return e[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
        }
        return (
          (n.m = e),
          (n.c = t),
          (n.d = function (e, t, r) {
            n.o(e, t) ||
              Object.defineProperty(e, t, { enumerable: !0, get: r });
          }),
          (n.r = function (e) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (n.t = function (e, t) {
            if ((1 & t && (e = n(e)), 8 & t)) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (
              (n.r(r),
              Object.defineProperty(r, "default", { enumerable: !0, value: e }),
              2 & t && "string" != typeof e)
            )
              for (var i in e)
                n.d(
                  r,
                  i,
                  function (t) {
                    return e[t];
                  }.bind(null, i)
                );
            return r;
          }),
          (n.n = function (e) {
            var t =
              e && e.__esModule
                ? function () {
                    return e.default;
                  }
                : function () {
                    return e;
                  };
            return n.d(t, "a", t), t;
          }),
          (n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }),
          (n.p = ""),
          n((n.s = 0))
        );
      })([
        function (e, t, n) {
          "use strict";
          function r(e) {
            return (r =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  })(e);
          }
          n.r(t),
            n.d(t, "loadFront", function () {
              return a;
            }),
            n.d(t, "safeLoadFront", function () {
              return s;
            });
          var i = n(1);
          function o(e, t, n) {
            var o,
              a =
                t && "string" == typeof t
                  ? t
                  : t && t.contentKeyName
                  ? t.contentKeyName
                  : "__content",
              s = t && "object" === r(t) ? t : void 0,
              u = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/.exec(e),
              l = {};
            return (
              (o = u[2]) &&
                (l =
                  "{" === o.charAt(0)
                    ? JSON.parse(o)
                    : n
                    ? i.safeLoad(o, s)
                    : i.load(o, s)),
              (l[a] = u[3] || ""),
              l
            );
          }
          function a(e, t) {
            return o(e, t, !1);
          }
          function s(e, t) {
            return o(e, t, !0);
          }
        },
        function (e, t) {
          e.exports = r;
        },
      ]));
  },
  function (e, t, n) {
    e.exports = (function e(t, n, r) {
      function i(a, s) {
        if (!n[a]) {
          if (!t[a]) {
            if (o) return o(a, !0);
            var u = new Error("Cannot find module '" + a + "'");
            throw ((u.code = "MODULE_NOT_FOUND"), u);
          }
          var l = (n[a] = { exports: {} });
          t[a][0].call(
            l.exports,
            function (e) {
              return i(t[a][1][e] || e);
            },
            l,
            l.exports,
            e,
            t,
            n,
            r
          );
        }
        return n[a].exports;
      }
      for (var o = !1, a = 0; a < r.length; a++) i(r[a]);
      return i;
    })(
      {
        1: [
          function (e, t, n) {
            "use strict";
            var r = e("./js-yaml/loader"),
              i = e("./js-yaml/dumper");
            function o(e) {
              return function () {
                throw new Error(
                  "Function " + e + " is deprecated and cannot be used."
                );
              };
            }
            (t.exports.Type = e("./js-yaml/type")),
              (t.exports.Schema = e("./js-yaml/schema")),
              (t.exports.FAILSAFE_SCHEMA = e("./js-yaml/schema/failsafe")),
              (t.exports.JSON_SCHEMA = e("./js-yaml/schema/json")),
              (t.exports.CORE_SCHEMA = e("./js-yaml/schema/core")),
              (t.exports.DEFAULT_SAFE_SCHEMA = e(
                "./js-yaml/schema/default_safe"
              )),
              (t.exports.DEFAULT_FULL_SCHEMA = e(
                "./js-yaml/schema/default_full"
              )),
              (t.exports.load = r.load),
              (t.exports.loadAll = r.loadAll),
              (t.exports.safeLoad = r.safeLoad),
              (t.exports.safeLoadAll = r.safeLoadAll),
              (t.exports.dump = i.dump),
              (t.exports.safeDump = i.safeDump),
              (t.exports.YAMLException = e("./js-yaml/exception")),
              (t.exports.MINIMAL_SCHEMA = e("./js-yaml/schema/failsafe")),
              (t.exports.SAFE_SCHEMA = e("./js-yaml/schema/default_safe")),
              (t.exports.DEFAULT_SCHEMA = e("./js-yaml/schema/default_full")),
              (t.exports.scan = o("scan")),
              (t.exports.parse = o("parse")),
              (t.exports.compose = o("compose")),
              (t.exports.addConstructor = o("addConstructor"));
          },
          {
            "./js-yaml/dumper": 3,
            "./js-yaml/exception": 4,
            "./js-yaml/loader": 5,
            "./js-yaml/schema": 7,
            "./js-yaml/schema/core": 8,
            "./js-yaml/schema/default_full": 9,
            "./js-yaml/schema/default_safe": 10,
            "./js-yaml/schema/failsafe": 11,
            "./js-yaml/schema/json": 12,
            "./js-yaml/type": 13,
          },
        ],
        2: [
          function (e, t, n) {
            "use strict";
            function r(e) {
              return null == e;
            }
            (t.exports.isNothing = r),
              (t.exports.isObject = function (e) {
                return "object" == typeof e && null !== e;
              }),
              (t.exports.toArray = function (e) {
                return Array.isArray(e) ? e : r(e) ? [] : [e];
              }),
              (t.exports.repeat = function (e, t) {
                var n,
                  r = "";
                for (n = 0; n < t; n += 1) r += e;
                return r;
              }),
              (t.exports.isNegativeZero = function (e) {
                return 0 === e && Number.NEGATIVE_INFINITY === 1 / e;
              }),
              (t.exports.extend = function (e, t) {
                var n, r, i, o;
                if (t)
                  for (n = 0, r = (o = Object.keys(t)).length; n < r; n += 1)
                    e[(i = o[n])] = t[i];
                return e;
              });
          },
          {},
        ],
        3: [
          function (e, t, n) {
            "use strict";
            var r = e("./common"),
              i = e("./exception"),
              o = e("./schema/default_full"),
              a = e("./schema/default_safe"),
              s = Object.prototype.toString,
              u = Object.prototype.hasOwnProperty,
              l = {
                0: "\\0",
                7: "\\a",
                8: "\\b",
                9: "\\t",
                10: "\\n",
                11: "\\v",
                12: "\\f",
                13: "\\r",
                27: "\\e",
                34: '\\"',
                92: "\\\\",
                133: "\\N",
                160: "\\_",
                8232: "\\L",
                8233: "\\P",
              },
              c = [
                "y",
                "Y",
                "yes",
                "Yes",
                "YES",
                "on",
                "On",
                "ON",
                "n",
                "N",
                "no",
                "No",
                "NO",
                "off",
                "Off",
                "OFF",
              ];
            function f(e) {
              var t, n, o;
              if (((t = e.toString(16).toUpperCase()), e <= 255))
                (n = "x"), (o = 2);
              else if (e <= 65535) (n = "u"), (o = 4);
              else {
                if (!(e <= 4294967295))
                  throw new i(
                    "code point within a string may not be greater than 0xFFFFFFFF"
                  );
                (n = "U"), (o = 8);
              }
              return "\\" + n + r.repeat("0", o - t.length) + t;
            }
            function p(e) {
              (this.schema = e.schema || o),
                (this.indent = Math.max(1, e.indent || 2)),
                (this.noArrayIndent = e.noArrayIndent || !1),
                (this.skipInvalid = e.skipInvalid || !1),
                (this.flowLevel = r.isNothing(e.flowLevel) ? -1 : e.flowLevel),
                (this.styleMap = (function (e, t) {
                  var n, r, i, o, a, s, l;
                  if (null === t) return {};
                  for (
                    n = {}, i = 0, o = (r = Object.keys(t)).length;
                    i < o;
                    i += 1
                  )
                    (a = r[i]),
                      (s = String(t[a])),
                      "!!" === a.slice(0, 2) &&
                        (a = "tag:yaml.org,2002:" + a.slice(2)),
                      (l = e.compiledTypeMap.fallback[a]) &&
                        u.call(l.styleAliases, s) &&
                        (s = l.styleAliases[s]),
                      (n[a] = s);
                  return n;
                })(this.schema, e.styles || null)),
                (this.sortKeys = e.sortKeys || !1),
                (this.lineWidth = e.lineWidth || 80),
                (this.noRefs = e.noRefs || !1),
                (this.noCompatMode = e.noCompatMode || !1),
                (this.condenseFlow = e.condenseFlow || !1),
                (this.implicitTypes = this.schema.compiledImplicit),
                (this.explicitTypes = this.schema.compiledExplicit),
                (this.tag = null),
                (this.result = ""),
                (this.duplicates = []),
                (this.usedDuplicates = null);
            }
            function d(e, t) {
              for (
                var n,
                  i = r.repeat(" ", t),
                  o = 0,
                  a = -1,
                  s = "",
                  u = e.length;
                o < u;

              )
                -1 === (a = e.indexOf("\n", o))
                  ? ((n = e.slice(o)), (o = u))
                  : ((n = e.slice(o, a + 1)), (o = a + 1)),
                  n.length && "\n" !== n && (s += i),
                  (s += n);
              return s;
            }
            function h(e, t) {
              return "\n" + r.repeat(" ", e.indent * t);
            }
            function g(e) {
              return 32 === e || 9 === e;
            }
            function m(e) {
              return (
                (32 <= e && e <= 126) ||
                (161 <= e && e <= 55295 && 8232 !== e && 8233 !== e) ||
                (57344 <= e && e <= 65533 && 65279 !== e) ||
                (65536 <= e && e <= 1114111)
              );
            }
            function y(e) {
              return (
                m(e) &&
                65279 !== e &&
                44 !== e &&
                91 !== e &&
                93 !== e &&
                123 !== e &&
                125 !== e &&
                58 !== e &&
                35 !== e
              );
            }
            function v(e) {
              return /^\n* /.test(e);
            }
            function b(e, t, n, r, i) {
              var o,
                a,
                s,
                u = !1,
                l = !1,
                c = -1 !== r,
                f = -1,
                p =
                  m((s = e.charCodeAt(0))) &&
                  65279 !== s &&
                  !g(s) &&
                  45 !== s &&
                  63 !== s &&
                  58 !== s &&
                  44 !== s &&
                  91 !== s &&
                  93 !== s &&
                  123 !== s &&
                  125 !== s &&
                  35 !== s &&
                  38 !== s &&
                  42 !== s &&
                  33 !== s &&
                  124 !== s &&
                  62 !== s &&
                  39 !== s &&
                  34 !== s &&
                  37 !== s &&
                  64 !== s &&
                  96 !== s &&
                  !g(e.charCodeAt(e.length - 1));
              if (t)
                for (o = 0; o < e.length; o++) {
                  if (!m((a = e.charCodeAt(o)))) return 5;
                  p = p && y(a);
                }
              else {
                for (o = 0; o < e.length; o++) {
                  if (10 === (a = e.charCodeAt(o)))
                    (u = !0),
                      c &&
                        ((l = l || (o - f - 1 > r && " " !== e[f + 1])),
                        (f = o));
                  else if (!m(a)) return 5;
                  p = p && y(a);
                }
                l = l || (c && o - f - 1 > r && " " !== e[f + 1]);
              }
              return u || l
                ? n > 9 && v(e)
                  ? 5
                  : l
                  ? 4
                  : 3
                : p && !i(e)
                ? 1
                : 2;
            }
            function x(e, t, n, r) {
              e.dump = (function () {
                if (0 === t.length) return "''";
                if (!e.noCompatMode && -1 !== c.indexOf(t))
                  return "'" + t + "'";
                var o = e.indent * Math.max(1, n),
                  a =
                    -1 === e.lineWidth
                      ? -1
                      : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o),
                  s = r || (e.flowLevel > -1 && n >= e.flowLevel);
                switch (
                  b(t, s, e.indent, a, function (t) {
                    return (function (e, t) {
                      var n, r;
                      for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
                        if (e.implicitTypes[n].resolve(t)) return !0;
                      return !1;
                    })(e, t);
                  })
                ) {
                  case 1:
                    return t;
                  case 2:
                    return "'" + t.replace(/'/g, "''") + "'";
                  case 3:
                    return "|" + w(t, e.indent) + A(d(t, o));
                  case 4:
                    return (
                      ">" +
                      w(t, e.indent) +
                      A(
                        d(
                          (function (e, t) {
                            for (
                              var n,
                                r,
                                i,
                                o = /(\n+)([^\n]*)/g,
                                a =
                                  ((i =
                                    -1 !== (i = e.indexOf("\n"))
                                      ? i
                                      : e.length),
                                  (o.lastIndex = i),
                                  k(e.slice(0, i), t)),
                                s = "\n" === e[0] || " " === e[0];
                              (r = o.exec(e));

                            ) {
                              var u = r[1],
                                l = r[2];
                              (n = " " === l[0]),
                                (a +=
                                  u +
                                  (s || n || "" === l ? "" : "\n") +
                                  k(l, t)),
                                (s = n);
                            }
                            return a;
                          })(t, a),
                          o
                        )
                      )
                    );
                  case 5:
                    return (
                      '"' +
                      (function (e) {
                        for (var t, n, r, i = "", o = 0; o < e.length; o++)
                          (t = e.charCodeAt(o)) >= 55296 &&
                          t <= 56319 &&
                          (n = e.charCodeAt(o + 1)) >= 56320 &&
                          n <= 57343
                            ? ((i += f(1024 * (t - 55296) + n - 56320 + 65536)),
                              o++)
                            : ((r = l[t]),
                              (i += !r && m(t) ? e[o] : r || f(t)));
                        return i;
                      })(t) +
                      '"'
                    );
                  default:
                    throw new i("impossible error: invalid scalar style");
                }
              })();
            }
            function w(e, t) {
              var n = v(e) ? String(t) : "",
                r = "\n" === e[e.length - 1];
              return (
                n +
                (!r || ("\n" !== e[e.length - 2] && "\n" !== e)
                  ? r
                    ? ""
                    : "-"
                  : "+") +
                "\n"
              );
            }
            function A(e) {
              return "\n" === e[e.length - 1] ? e.slice(0, -1) : e;
            }
            function k(e, t) {
              if ("" === e || " " === e[0]) return e;
              for (
                var n, r, i = / [^ ]/g, o = 0, a = 0, s = 0, u = "";
                (n = i.exec(e));

              )
                (s = n.index) - o > t &&
                  ((r = a > o ? a : s),
                  (u += "\n" + e.slice(o, r)),
                  (o = r + 1)),
                  (a = s);
              return (
                (u += "\n"),
                e.length - o > t && a > o
                  ? (u += e.slice(o, a) + "\n" + e.slice(a + 1))
                  : (u += e.slice(o)),
                u.slice(1)
              );
            }
            function C(e, t, n) {
              var r, o, a, l, c, f;
              for (
                a = 0, l = (o = n ? e.explicitTypes : e.implicitTypes).length;
                a < l;
                a += 1
              )
                if (
                  ((c = o[a]).instanceOf || c.predicate) &&
                  (!c.instanceOf ||
                    ("object" == typeof t && t instanceof c.instanceOf)) &&
                  (!c.predicate || c.predicate(t))
                ) {
                  if (((e.tag = n ? c.tag : "?"), c.represent)) {
                    if (
                      ((f = e.styleMap[c.tag] || c.defaultStyle),
                      "[object Function]" === s.call(c.represent))
                    )
                      r = c.represent(t, f);
                    else {
                      if (!u.call(c.represent, f))
                        throw new i(
                          "!<" +
                            c.tag +
                            '> tag resolver accepts not "' +
                            f +
                            '" style'
                        );
                      r = c.represent[f](t, f);
                    }
                    e.dump = r;
                  }
                  return !0;
                }
              return !1;
            }
            function S(e, t, n, r, o, a) {
              (e.tag = null), (e.dump = n), C(e, n, !1) || C(e, n, !0);
              var u = s.call(e.dump);
              r && (r = e.flowLevel < 0 || e.flowLevel > t);
              var l,
                c,
                f = "[object Object]" === u || "[object Array]" === u;
              if (
                (f && (c = -1 !== (l = e.duplicates.indexOf(n))),
                ((null !== e.tag && "?" !== e.tag) ||
                  c ||
                  (2 !== e.indent && t > 0)) &&
                  (o = !1),
                c && e.usedDuplicates[l])
              )
                e.dump = "*ref_" + l;
              else {
                if (
                  (f && c && !e.usedDuplicates[l] && (e.usedDuplicates[l] = !0),
                  "[object Object]" === u)
                )
                  r && 0 !== Object.keys(e.dump).length
                    ? ((function (e, t, n, r) {
                        var o,
                          a,
                          s,
                          u,
                          l,
                          c,
                          f = "",
                          p = e.tag,
                          d = Object.keys(n);
                        if (!0 === e.sortKeys) d.sort();
                        else if ("function" == typeof e.sortKeys)
                          d.sort(e.sortKeys);
                        else if (e.sortKeys)
                          throw new i(
                            "sortKeys must be a boolean or a function"
                          );
                        for (o = 0, a = d.length; o < a; o += 1)
                          (c = ""),
                            (r && 0 === o) || (c += h(e, t)),
                            (u = n[(s = d[o])]),
                            S(e, t + 1, s, !0, !0, !0) &&
                              ((l =
                                (null !== e.tag && "?" !== e.tag) ||
                                (e.dump && e.dump.length > 1024)) &&
                                (e.dump && 10 === e.dump.charCodeAt(0)
                                  ? (c += "?")
                                  : (c += "? ")),
                              (c += e.dump),
                              l && (c += h(e, t)),
                              S(e, t + 1, u, !0, l) &&
                                (e.dump && 10 === e.dump.charCodeAt(0)
                                  ? (c += ":")
                                  : (c += ": "),
                                (f += c += e.dump)));
                        (e.tag = p), (e.dump = f || "{}");
                      })(e, t, e.dump, o),
                      c && (e.dump = "&ref_" + l + e.dump))
                    : ((function (e, t, n) {
                        var r,
                          i,
                          o,
                          a,
                          s,
                          u = "",
                          l = e.tag,
                          c = Object.keys(n);
                        for (r = 0, i = c.length; r < i; r += 1)
                          (s = e.condenseFlow ? '"' : ""),
                            0 !== r && (s += ", "),
                            (a = n[(o = c[r])]),
                            S(e, t, o, !1, !1) &&
                              (e.dump.length > 1024 && (s += "? "),
                              (s +=
                                e.dump +
                                (e.condenseFlow ? '"' : "") +
                                ":" +
                                (e.condenseFlow ? "" : " ")),
                              S(e, t, a, !1, !1) && (u += s += e.dump));
                        (e.tag = l), (e.dump = "{" + u + "}");
                      })(e, t, e.dump),
                      c && (e.dump = "&ref_" + l + " " + e.dump));
                else if ("[object Array]" === u) {
                  var p = e.noArrayIndent && t > 0 ? t - 1 : t;
                  r && 0 !== e.dump.length
                    ? ((function (e, t, n, r) {
                        var i,
                          o,
                          a = "",
                          s = e.tag;
                        for (i = 0, o = n.length; i < o; i += 1)
                          S(e, t + 1, n[i], !0, !0) &&
                            ((r && 0 === i) || (a += h(e, t)),
                            e.dump && 10 === e.dump.charCodeAt(0)
                              ? (a += "-")
                              : (a += "- "),
                            (a += e.dump));
                        (e.tag = s), (e.dump = a || "[]");
                      })(e, p, e.dump, o),
                      c && (e.dump = "&ref_" + l + e.dump))
                    : ((function (e, t, n) {
                        var r,
                          i,
                          o = "",
                          a = e.tag;
                        for (r = 0, i = n.length; r < i; r += 1)
                          S(e, t, n[r], !1, !1) &&
                            (0 !== r &&
                              (o += "," + (e.condenseFlow ? "" : " ")),
                            (o += e.dump));
                        (e.tag = a), (e.dump = "[" + o + "]");
                      })(e, p, e.dump),
                      c && (e.dump = "&ref_" + l + " " + e.dump));
                } else {
                  if ("[object String]" !== u) {
                    if (e.skipInvalid) return !1;
                    throw new i("unacceptable kind of an object to dump " + u);
                  }
                  "?" !== e.tag && x(e, e.dump, t, a);
                }
                null !== e.tag &&
                  "?" !== e.tag &&
                  (e.dump = "!<" + e.tag + "> " + e.dump);
              }
              return !0;
            }
            function j(e, t) {
              var n,
                r,
                i = [],
                o = [];
              for (
                (function e(t, n, r) {
                  var i, o, a;
                  if (null !== t && "object" == typeof t)
                    if (-1 !== (o = n.indexOf(t)))
                      -1 === r.indexOf(o) && r.push(o);
                    else if ((n.push(t), Array.isArray(t)))
                      for (o = 0, a = t.length; o < a; o += 1) e(t[o], n, r);
                    else
                      for (
                        i = Object.keys(t), o = 0, a = i.length;
                        o < a;
                        o += 1
                      )
                        e(t[i[o]], n, r);
                })(e, i, o),
                  n = 0,
                  r = o.length;
                n < r;
                n += 1
              )
                t.duplicates.push(i[o[n]]);
              t.usedDuplicates = new Array(r);
            }
            function E(e, t) {
              var n = new p((t = t || {}));
              return (
                n.noRefs || j(e, n), S(n, 0, e, !0, !0) ? n.dump + "\n" : ""
              );
            }
            (t.exports.dump = E),
              (t.exports.safeDump = function (e, t) {
                return E(e, r.extend({ schema: a }, t));
              });
          },
          {
            "./common": 2,
            "./exception": 4,
            "./schema/default_full": 9,
            "./schema/default_safe": 10,
          },
        ],
        4: [
          function (e, t, n) {
            "use strict";
            function r(e, t) {
              Error.call(this),
                (this.name = "YAMLException"),
                (this.reason = e),
                (this.mark = t),
                (this.message =
                  (this.reason || "(unknown reason)") +
                  (this.mark ? " " + this.mark.toString() : "")),
                Error.captureStackTrace
                  ? Error.captureStackTrace(this, this.constructor)
                  : (this.stack = new Error().stack || "");
            }
            (r.prototype = Object.create(Error.prototype)),
              (r.prototype.constructor = r),
              (r.prototype.toString = function (e) {
                var t = this.name + ": ";
                return (
                  (t += this.reason || "(unknown reason)"),
                  !e && this.mark && (t += " " + this.mark.toString()),
                  t
                );
              }),
              (t.exports = r);
          },
          {},
        ],
        5: [
          function (e, t, n) {
            "use strict";
            var r = e("./common"),
              i = e("./exception"),
              o = e("./mark"),
              a = e("./schema/default_safe"),
              s = e("./schema/default_full"),
              u = Object.prototype.hasOwnProperty,
              l = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,
              c = /[\x85\u2028\u2029]/,
              f = /[,\[\]\{\}]/,
              p = /^(?:!|!!|![a-z\-]+!)$/i,
              d = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
            function h(e) {
              return Object.prototype.toString.call(e);
            }
            function g(e) {
              return 10 === e || 13 === e;
            }
            function m(e) {
              return 9 === e || 32 === e;
            }
            function y(e) {
              return 9 === e || 32 === e || 10 === e || 13 === e;
            }
            function v(e) {
              return 44 === e || 91 === e || 93 === e || 123 === e || 125 === e;
            }
            function b(e) {
              var t;
              return 48 <= e && e <= 57
                ? e - 48
                : 97 <= (t = 32 | e) && t <= 102
                ? t - 97 + 10
                : -1;
            }
            function x(e) {
              return 48 === e
                ? "\0"
                : 97 === e
                ? ""
                : 98 === e
                ? "\b"
                : 116 === e || 9 === e
                ? "\t"
                : 110 === e
                ? "\n"
                : 118 === e
                ? "\v"
                : 102 === e
                ? "\f"
                : 114 === e
                ? "\r"
                : 101 === e
                ? ""
                : 32 === e
                ? " "
                : 34 === e
                ? '"'
                : 47 === e
                ? "/"
                : 92 === e
                ? "\\"
                : 78 === e
                ? ""
                : 95 === e
                ? " "
                : 76 === e
                ? "\u2028"
                : 80 === e
                ? "\u2029"
                : "";
            }
            function w(e) {
              return e <= 65535
                ? String.fromCharCode(e)
                : String.fromCharCode(
                    55296 + ((e - 65536) >> 10),
                    56320 + ((e - 65536) & 1023)
                  );
            }
            for (
              var A = new Array(256), k = new Array(256), C = 0;
              C < 256;
              C++
            )
              (A[C] = x(C) ? 1 : 0), (k[C] = x(C));
            function S(e, t) {
              (this.input = e),
                (this.filename = t.filename || null),
                (this.schema = t.schema || s),
                (this.onWarning = t.onWarning || null),
                (this.legacy = t.legacy || !1),
                (this.json = t.json || !1),
                (this.listener = t.listener || null),
                (this.implicitTypes = this.schema.compiledImplicit),
                (this.typeMap = this.schema.compiledTypeMap),
                (this.length = e.length),
                (this.position = 0),
                (this.line = 0),
                (this.lineStart = 0),
                (this.lineIndent = 0),
                (this.documents = []);
            }
            function j(e, t) {
              return new i(
                t,
                new o(
                  e.filename,
                  e.input,
                  e.position,
                  e.line,
                  e.position - e.lineStart
                )
              );
            }
            function E(e, t) {
              throw j(e, t);
            }
            function T(e, t) {
              e.onWarning && e.onWarning.call(null, j(e, t));
            }
            var N = {
              YAML: function (e, t, n) {
                var r, i, o;
                null !== e.version && E(e, "duplication of %YAML directive"),
                  1 !== n.length &&
                    E(e, "YAML directive accepts exactly one argument"),
                  null === (r = /^([0-9]+)\.([0-9]+)$/.exec(n[0])) &&
                    E(e, "ill-formed argument of the YAML directive"),
                  (i = parseInt(r[1], 10)),
                  (o = parseInt(r[2], 10)),
                  1 !== i && E(e, "unacceptable YAML version of the document"),
                  (e.version = n[0]),
                  (e.checkLineBreaks = o < 2),
                  1 !== o &&
                    2 !== o &&
                    T(e, "unsupported YAML version of the document");
              },
              TAG: function (e, t, n) {
                var r, i;
                2 !== n.length &&
                  E(e, "TAG directive accepts exactly two arguments"),
                  (r = n[0]),
                  (i = n[1]),
                  p.test(r) ||
                    E(
                      e,
                      "ill-formed tag handle (first argument) of the TAG directive"
                    ),
                  u.call(e.tagMap, r) &&
                    E(
                      e,
                      'there is a previously declared suffix for "' +
                        r +
                        '" tag handle'
                    ),
                  d.test(i) ||
                    E(
                      e,
                      "ill-formed tag prefix (second argument) of the TAG directive"
                    ),
                  (e.tagMap[r] = i);
              },
            };
            function O(e, t, n, r) {
              var i, o, a, s;
              if (t < n) {
                if (((s = e.input.slice(t, n)), r))
                  for (i = 0, o = s.length; i < o; i += 1)
                    9 === (a = s.charCodeAt(i)) ||
                      (32 <= a && a <= 1114111) ||
                      E(e, "expected valid JSON character");
                else
                  l.test(s) &&
                    E(e, "the stream contains non-printable characters");
                e.result += s;
              }
            }
            function M(e, t, n, i) {
              var o, a, s, l;
              for (
                r.isObject(n) ||
                  E(
                    e,
                    "cannot merge mappings; the provided source object is unacceptable"
                  ),
                  s = 0,
                  l = (o = Object.keys(n)).length;
                s < l;
                s += 1
              )
                (a = o[s]), u.call(t, a) || ((t[a] = n[a]), (i[a] = !0));
            }
            function L(e, t, n, r, i, o, a, s) {
              var l, c;
              if (Array.isArray(i))
                for (
                  l = 0, c = (i = Array.prototype.slice.call(i)).length;
                  l < c;
                  l += 1
                )
                  Array.isArray(i[l]) &&
                    E(e, "nested arrays are not supported inside keys"),
                    "object" == typeof i &&
                      "[object Object]" === h(i[l]) &&
                      (i[l] = "[object Object]");
              if (
                ("object" == typeof i &&
                  "[object Object]" === h(i) &&
                  (i = "[object Object]"),
                (i = String(i)),
                null === t && (t = {}),
                "tag:yaml.org,2002:merge" === r)
              )
                if (Array.isArray(o))
                  for (l = 0, c = o.length; l < c; l += 1) M(e, t, o[l], n);
                else M(e, t, o, n);
              else
                e.json ||
                  u.call(n, i) ||
                  !u.call(t, i) ||
                  ((e.line = a || e.line),
                  (e.position = s || e.position),
                  E(e, "duplicated mapping key")),
                  (t[i] = o),
                  delete n[i];
              return t;
            }
            function I(e) {
              var t;
              10 === (t = e.input.charCodeAt(e.position))
                ? e.position++
                : 13 === t
                ? (e.position++,
                  10 === e.input.charCodeAt(e.position) && e.position++)
                : E(e, "a line break is expected"),
                (e.line += 1),
                (e.lineStart = e.position);
            }
            function D(e, t, n) {
              for (var r = 0, i = e.input.charCodeAt(e.position); 0 !== i; ) {
                for (; m(i); ) i = e.input.charCodeAt(++e.position);
                if (t && 35 === i)
                  do {
                    i = e.input.charCodeAt(++e.position);
                  } while (10 !== i && 13 !== i && 0 !== i);
                if (!g(i)) break;
                for (
                  I(e),
                    i = e.input.charCodeAt(e.position),
                    r++,
                    e.lineIndent = 0;
                  32 === i;

                )
                  e.lineIndent++, (i = e.input.charCodeAt(++e.position));
              }
              return (
                -1 !== n &&
                  0 !== r &&
                  e.lineIndent < n &&
                  T(e, "deficient indentation"),
                r
              );
            }
            function W(e) {
              var t,
                n = e.position;
              return !(
                (45 !== (t = e.input.charCodeAt(n)) && 46 !== t) ||
                t !== e.input.charCodeAt(n + 1) ||
                t !== e.input.charCodeAt(n + 2) ||
                ((n += 3), 0 !== (t = e.input.charCodeAt(n)) && !y(t))
              );
            }
            function F(e, t) {
              1 === t
                ? (e.result += " ")
                : t > 1 && (e.result += r.repeat("\n", t - 1));
            }
            function _(e, t) {
              var n,
                r,
                i = e.tag,
                o = e.anchor,
                a = [],
                s = !1;
              for (
                null !== e.anchor && (e.anchorMap[e.anchor] = a),
                  r = e.input.charCodeAt(e.position);
                0 !== r && 45 === r && y(e.input.charCodeAt(e.position + 1));

              )
                if (((s = !0), e.position++, D(e, !0, -1) && e.lineIndent <= t))
                  a.push(null), (r = e.input.charCodeAt(e.position));
                else if (
                  ((n = e.line),
                  H(e, t, 3, !1, !0),
                  a.push(e.result),
                  D(e, !0, -1),
                  (r = e.input.charCodeAt(e.position)),
                  (e.line === n || e.lineIndent > t) && 0 !== r)
                )
                  E(e, "bad indentation of a sequence entry");
                else if (e.lineIndent < t) break;
              return (
                !!s &&
                ((e.tag = i),
                (e.anchor = o),
                (e.kind = "sequence"),
                (e.result = a),
                !0)
              );
            }
            function P(e) {
              var t,
                n,
                r,
                i,
                o = !1,
                a = !1;
              if (33 !== (i = e.input.charCodeAt(e.position))) return !1;
              if (
                (null !== e.tag && E(e, "duplication of a tag property"),
                60 === (i = e.input.charCodeAt(++e.position))
                  ? ((o = !0), (i = e.input.charCodeAt(++e.position)))
                  : 33 === i
                  ? ((a = !0),
                    (n = "!!"),
                    (i = e.input.charCodeAt(++e.position)))
                  : (n = "!"),
                (t = e.position),
                o)
              ) {
                do {
                  i = e.input.charCodeAt(++e.position);
                } while (0 !== i && 62 !== i);
                e.position < e.length
                  ? ((r = e.input.slice(t, e.position)),
                    (i = e.input.charCodeAt(++e.position)))
                  : E(e, "unexpected end of the stream within a verbatim tag");
              } else {
                for (; 0 !== i && !y(i); )
                  33 === i &&
                    (a
                      ? E(e, "tag suffix cannot contain exclamation marks")
                      : ((n = e.input.slice(t - 1, e.position + 1)),
                        p.test(n) ||
                          E(
                            e,
                            "named tag handle cannot contain such characters"
                          ),
                        (a = !0),
                        (t = e.position + 1))),
                    (i = e.input.charCodeAt(++e.position));
                (r = e.input.slice(t, e.position)),
                  f.test(r) &&
                    E(e, "tag suffix cannot contain flow indicator characters");
              }
              return (
                r &&
                  !d.test(r) &&
                  E(e, "tag name cannot contain such characters: " + r),
                o
                  ? (e.tag = r)
                  : u.call(e.tagMap, n)
                  ? (e.tag = e.tagMap[n] + r)
                  : "!" === n
                  ? (e.tag = "!" + r)
                  : "!!" === n
                  ? (e.tag = "tag:yaml.org,2002:" + r)
                  : E(e, 'undeclared tag handle "' + n + '"'),
                !0
              );
            }
            function q(e) {
              var t, n;
              if (38 !== (n = e.input.charCodeAt(e.position))) return !1;
              for (
                null !== e.anchor && E(e, "duplication of an anchor property"),
                  n = e.input.charCodeAt(++e.position),
                  t = e.position;
                0 !== n && !y(n) && !v(n);

              )
                n = e.input.charCodeAt(++e.position);
              return (
                e.position === t &&
                  E(
                    e,
                    "name of an anchor node must contain at least one character"
                  ),
                (e.anchor = e.input.slice(t, e.position)),
                !0
              );
            }
            function H(e, t, n, i, o) {
              var a,
                s,
                l,
                c,
                f,
                p,
                d,
                h,
                x = 1,
                C = !1,
                S = !1;
              if (
                (null !== e.listener && e.listener("open", e),
                (e.tag = null),
                (e.anchor = null),
                (e.kind = null),
                (e.result = null),
                (a = s = l = 4 === n || 3 === n),
                i &&
                  D(e, !0, -1) &&
                  ((C = !0),
                  e.lineIndent > t
                    ? (x = 1)
                    : e.lineIndent === t
                    ? (x = 0)
                    : e.lineIndent < t && (x = -1)),
                1 === x)
              )
                for (; P(e) || q(e); )
                  D(e, !0, -1)
                    ? ((C = !0),
                      (l = a),
                      e.lineIndent > t
                        ? (x = 1)
                        : e.lineIndent === t
                        ? (x = 0)
                        : e.lineIndent < t && (x = -1))
                    : (l = !1);
              if (
                (l && (l = C || o),
                (1 !== x && 4 !== n) ||
                  ((d = 1 === n || 2 === n ? t : t + 1),
                  (h = e.position - e.lineStart),
                  1 === x
                    ? (l &&
                        (_(e, h) ||
                          (function (e, t, n) {
                            var r,
                              i,
                              o,
                              a,
                              s,
                              u = e.tag,
                              l = e.anchor,
                              c = {},
                              f = {},
                              p = null,
                              d = null,
                              h = null,
                              g = !1,
                              v = !1;
                            for (
                              null !== e.anchor && (e.anchorMap[e.anchor] = c),
                                s = e.input.charCodeAt(e.position);
                              0 !== s;

                            ) {
                              if (
                                ((r = e.input.charCodeAt(e.position + 1)),
                                (o = e.line),
                                (a = e.position),
                                (63 !== s && 58 !== s) || !y(r))
                              ) {
                                if (!H(e, n, 2, !1, !0)) break;
                                if (e.line === o) {
                                  for (
                                    s = e.input.charCodeAt(e.position);
                                    m(s);

                                  )
                                    s = e.input.charCodeAt(++e.position);
                                  if (58 === s)
                                    y((s = e.input.charCodeAt(++e.position))) ||
                                      E(
                                        e,
                                        "a whitespace character is expected after the key-value separator within a block mapping"
                                      ),
                                      g &&
                                        (L(e, c, f, p, d, null),
                                        (p = d = h = null)),
                                      (v = !0),
                                      (g = !1),
                                      (i = !1),
                                      (p = e.tag),
                                      (d = e.result);
                                  else {
                                    if (!v)
                                      return (e.tag = u), (e.anchor = l), !0;
                                    E(
                                      e,
                                      "can not read an implicit mapping pair; a colon is missed"
                                    );
                                  }
                                } else {
                                  if (!v)
                                    return (e.tag = u), (e.anchor = l), !0;
                                  E(
                                    e,
                                    "can not read a block mapping entry; a multiline key may not be an implicit key"
                                  );
                                }
                              } else
                                63 === s
                                  ? (g &&
                                      (L(e, c, f, p, d, null),
                                      (p = d = h = null)),
                                    (v = !0),
                                    (g = !0),
                                    (i = !0))
                                  : g
                                  ? ((g = !1), (i = !0))
                                  : E(
                                      e,
                                      "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"
                                    ),
                                  (e.position += 1),
                                  (s = r);
                              if (
                                ((e.line === o || e.lineIndent > t) &&
                                  (H(e, t, 4, !0, i) &&
                                    (g ? (d = e.result) : (h = e.result)),
                                  g ||
                                    (L(e, c, f, p, d, h, o, a),
                                    (p = d = h = null)),
                                  D(e, !0, -1),
                                  (s = e.input.charCodeAt(e.position))),
                                e.lineIndent > t && 0 !== s)
                              )
                                E(e, "bad indentation of a mapping entry");
                              else if (e.lineIndent < t) break;
                            }
                            return (
                              g && L(e, c, f, p, d, null),
                              v &&
                                ((e.tag = u),
                                (e.anchor = l),
                                (e.kind = "mapping"),
                                (e.result = c)),
                              v
                            );
                          })(e, h, d))) ||
                      (function (e, t) {
                        var n,
                          r,
                          i,
                          o,
                          a,
                          s,
                          u,
                          l,
                          c,
                          f,
                          p = !0,
                          d = e.tag,
                          h = e.anchor,
                          g = {};
                        if (91 === (f = e.input.charCodeAt(e.position)))
                          (i = 93), (s = !1), (r = []);
                        else {
                          if (123 !== f) return !1;
                          (i = 125), (s = !0), (r = {});
                        }
                        for (
                          null !== e.anchor && (e.anchorMap[e.anchor] = r),
                            f = e.input.charCodeAt(++e.position);
                          0 !== f;

                        ) {
                          if (
                            (D(e, !0, t),
                            (f = e.input.charCodeAt(e.position)) === i)
                          )
                            return (
                              e.position++,
                              (e.tag = d),
                              (e.anchor = h),
                              (e.kind = s ? "mapping" : "sequence"),
                              (e.result = r),
                              !0
                            );
                          p ||
                            E(
                              e,
                              "missed comma between flow collection entries"
                            ),
                            (c = null),
                            (o = a = !1),
                            63 === f &&
                              y(e.input.charCodeAt(e.position + 1)) &&
                              ((o = a = !0), e.position++, D(e, !0, t)),
                            (n = e.line),
                            H(e, t, 1, !1, !0),
                            (l = e.tag),
                            (u = e.result),
                            D(e, !0, t),
                            (f = e.input.charCodeAt(e.position)),
                            (!a && e.line !== n) ||
                              58 !== f ||
                              ((o = !0),
                              (f = e.input.charCodeAt(++e.position)),
                              D(e, !0, t),
                              H(e, t, 1, !1, !0),
                              (c = e.result)),
                            s
                              ? L(e, r, g, l, u, c)
                              : o
                              ? r.push(L(e, null, g, l, u, c))
                              : r.push(u),
                            D(e, !0, t),
                            44 === (f = e.input.charCodeAt(e.position))
                              ? ((p = !0),
                                (f = e.input.charCodeAt(++e.position)))
                              : (p = !1);
                        }
                        E(
                          e,
                          "unexpected end of the stream within a flow collection"
                        );
                      })(e, d)
                      ? (S = !0)
                      : ((s &&
                          (function (e, t) {
                            var n,
                              i,
                              o,
                              a,
                              s,
                              u = 1,
                              l = !1,
                              c = !1,
                              f = t,
                              p = 0,
                              d = !1;
                            if (124 === (a = e.input.charCodeAt(e.position)))
                              i = !1;
                            else {
                              if (62 !== a) return !1;
                              i = !0;
                            }
                            for (e.kind = "scalar", e.result = ""; 0 !== a; )
                              if (
                                43 === (a = e.input.charCodeAt(++e.position)) ||
                                45 === a
                              )
                                1 === u
                                  ? (u = 43 === a ? 3 : 2)
                                  : E(
                                      e,
                                      "repeat of a chomping mode identifier"
                                    );
                              else {
                                if (
                                  !(
                                    (o =
                                      48 <= (s = a) && s <= 57 ? s - 48 : -1) >=
                                    0
                                  )
                                )
                                  break;
                                0 === o
                                  ? E(
                                      e,
                                      "bad explicit indentation width of a block scalar; it cannot be less than one"
                                    )
                                  : c
                                  ? E(
                                      e,
                                      "repeat of an indentation width identifier"
                                    )
                                  : ((f = t + o - 1), (c = !0));
                              }
                            if (m(a)) {
                              do {
                                a = e.input.charCodeAt(++e.position);
                              } while (m(a));
                              if (35 === a)
                                do {
                                  a = e.input.charCodeAt(++e.position);
                                } while (!g(a) && 0 !== a);
                            }
                            for (; 0 !== a; ) {
                              for (
                                I(e),
                                  e.lineIndent = 0,
                                  a = e.input.charCodeAt(e.position);
                                (!c || e.lineIndent < f) && 32 === a;

                              )
                                e.lineIndent++,
                                  (a = e.input.charCodeAt(++e.position));
                              if (
                                (!c && e.lineIndent > f && (f = e.lineIndent),
                                g(a))
                              )
                                p++;
                              else {
                                if (e.lineIndent < f) {
                                  3 === u
                                    ? (e.result += r.repeat(
                                        "\n",
                                        l ? 1 + p : p
                                      ))
                                    : 1 === u && l && (e.result += "\n");
                                  break;
                                }
                                for (
                                  i
                                    ? m(a)
                                      ? ((d = !0),
                                        (e.result += r.repeat(
                                          "\n",
                                          l ? 1 + p : p
                                        )))
                                      : d
                                      ? ((d = !1),
                                        (e.result += r.repeat("\n", p + 1)))
                                      : 0 === p
                                      ? l && (e.result += " ")
                                      : (e.result += r.repeat("\n", p))
                                    : (e.result += r.repeat(
                                        "\n",
                                        l ? 1 + p : p
                                      )),
                                    l = !0,
                                    c = !0,
                                    p = 0,
                                    n = e.position;
                                  !g(a) && 0 !== a;

                                )
                                  a = e.input.charCodeAt(++e.position);
                                O(e, n, e.position, !1);
                              }
                            }
                            return !0;
                          })(e, d)) ||
                        (function (e, t) {
                          var n, r, i;
                          if (39 !== (n = e.input.charCodeAt(e.position)))
                            return !1;
                          for (
                            e.kind = "scalar",
                              e.result = "",
                              e.position++,
                              r = i = e.position;
                            0 !== (n = e.input.charCodeAt(e.position));

                          )
                            if (39 === n) {
                              if (
                                (O(e, r, e.position, !0),
                                39 !== (n = e.input.charCodeAt(++e.position)))
                              )
                                return !0;
                              (r = e.position), e.position++, (i = e.position);
                            } else
                              g(n)
                                ? (O(e, r, i, !0),
                                  F(e, D(e, !1, t)),
                                  (r = i = e.position))
                                : e.position === e.lineStart && W(e)
                                ? E(
                                    e,
                                    "unexpected end of the document within a single quoted scalar"
                                  )
                                : (e.position++, (i = e.position));
                          E(
                            e,
                            "unexpected end of the stream within a single quoted scalar"
                          );
                        })(e, d) ||
                        (function (e, t) {
                          var n, r, i, o, a, s, u;
                          if (34 !== (s = e.input.charCodeAt(e.position)))
                            return !1;
                          for (
                            e.kind = "scalar",
                              e.result = "",
                              e.position++,
                              n = r = e.position;
                            0 !== (s = e.input.charCodeAt(e.position));

                          ) {
                            if (34 === s)
                              return O(e, n, e.position, !0), e.position++, !0;
                            if (92 === s) {
                              if (
                                (O(e, n, e.position, !0),
                                g((s = e.input.charCodeAt(++e.position))))
                              )
                                D(e, !1, t);
                              else if (s < 256 && A[s])
                                (e.result += k[s]), e.position++;
                              else if (
                                (a =
                                  120 === (u = s)
                                    ? 2
                                    : 117 === u
                                    ? 4
                                    : 85 === u
                                    ? 8
                                    : 0) > 0
                              ) {
                                for (i = a, o = 0; i > 0; i--)
                                  (a = b(
                                    (s = e.input.charCodeAt(++e.position))
                                  )) >= 0
                                    ? (o = (o << 4) + a)
                                    : E(e, "expected hexadecimal character");
                                (e.result += w(o)), e.position++;
                              } else E(e, "unknown escape sequence");
                              n = r = e.position;
                            } else
                              g(s)
                                ? (O(e, n, r, !0),
                                  F(e, D(e, !1, t)),
                                  (n = r = e.position))
                                : e.position === e.lineStart && W(e)
                                ? E(
                                    e,
                                    "unexpected end of the document within a double quoted scalar"
                                  )
                                : (e.position++, (r = e.position));
                          }
                          E(
                            e,
                            "unexpected end of the stream within a double quoted scalar"
                          );
                        })(e, d)
                          ? (S = !0)
                          : (function (e) {
                              var t, n, r;
                              if (42 !== (r = e.input.charCodeAt(e.position)))
                                return !1;
                              for (
                                r = e.input.charCodeAt(++e.position),
                                  t = e.position;
                                0 !== r && !y(r) && !v(r);

                              )
                                r = e.input.charCodeAt(++e.position);
                              return (
                                e.position === t &&
                                  E(
                                    e,
                                    "name of an alias node must contain at least one character"
                                  ),
                                (n = e.input.slice(t, e.position)),
                                e.anchorMap.hasOwnProperty(n) ||
                                  E(e, 'unidentified alias "' + n + '"'),
                                (e.result = e.anchorMap[n]),
                                D(e, !0, -1),
                                !0
                              );
                            })(e)
                          ? ((S = !0),
                            (null === e.tag && null === e.anchor) ||
                              E(e, "alias node should not have any properties"))
                          : (function (e, t, n) {
                              var r,
                                i,
                                o,
                                a,
                                s,
                                u,
                                l,
                                c,
                                f = e.kind,
                                p = e.result;
                              if (
                                y((c = e.input.charCodeAt(e.position))) ||
                                v(c) ||
                                35 === c ||
                                38 === c ||
                                42 === c ||
                                33 === c ||
                                124 === c ||
                                62 === c ||
                                39 === c ||
                                34 === c ||
                                37 === c ||
                                64 === c ||
                                96 === c
                              )
                                return !1;
                              if (
                                (63 === c || 45 === c) &&
                                (y((r = e.input.charCodeAt(e.position + 1))) ||
                                  (n && v(r)))
                              )
                                return !1;
                              for (
                                e.kind = "scalar",
                                  e.result = "",
                                  i = o = e.position,
                                  a = !1;
                                0 !== c;

                              ) {
                                if (58 === c) {
                                  if (
                                    y(
                                      (r = e.input.charCodeAt(e.position + 1))
                                    ) ||
                                    (n && v(r))
                                  )
                                    break;
                                } else if (35 === c) {
                                  if (y(e.input.charCodeAt(e.position - 1)))
                                    break;
                                } else {
                                  if (
                                    (e.position === e.lineStart && W(e)) ||
                                    (n && v(c))
                                  )
                                    break;
                                  if (g(c)) {
                                    if (
                                      ((s = e.line),
                                      (u = e.lineStart),
                                      (l = e.lineIndent),
                                      D(e, !1, -1),
                                      e.lineIndent >= t)
                                    ) {
                                      (a = !0),
                                        (c = e.input.charCodeAt(e.position));
                                      continue;
                                    }
                                    (e.position = o),
                                      (e.line = s),
                                      (e.lineStart = u),
                                      (e.lineIndent = l);
                                    break;
                                  }
                                }
                                a &&
                                  (O(e, i, o, !1),
                                  F(e, e.line - s),
                                  (i = o = e.position),
                                  (a = !1)),
                                  m(c) || (o = e.position + 1),
                                  (c = e.input.charCodeAt(++e.position));
                              }
                              return (
                                O(e, i, o, !1),
                                !!e.result || ((e.kind = f), (e.result = p), !1)
                              );
                            })(e, d, 1 === n) &&
                            ((S = !0), null === e.tag && (e.tag = "?")),
                        null !== e.anchor && (e.anchorMap[e.anchor] = e.result))
                    : 0 === x && (S = l && _(e, h))),
                null !== e.tag && "!" !== e.tag)
              )
                if ("?" === e.tag) {
                  for (c = 0, f = e.implicitTypes.length; c < f; c += 1)
                    if ((p = e.implicitTypes[c]).resolve(e.result)) {
                      (e.result = p.construct(e.result)),
                        (e.tag = p.tag),
                        null !== e.anchor && (e.anchorMap[e.anchor] = e.result);
                      break;
                    }
                } else
                  u.call(e.typeMap[e.kind || "fallback"], e.tag)
                    ? ((p = e.typeMap[e.kind || "fallback"][e.tag]),
                      null !== e.result &&
                        p.kind !== e.kind &&
                        E(
                          e,
                          "unacceptable node kind for !<" +
                            e.tag +
                            '> tag; it should be "' +
                            p.kind +
                            '", not "' +
                            e.kind +
                            '"'
                        ),
                      p.resolve(e.result)
                        ? ((e.result = p.construct(e.result)),
                          null !== e.anchor &&
                            (e.anchorMap[e.anchor] = e.result))
                        : E(
                            e,
                            "cannot resolve a node with !<" +
                              e.tag +
                              "> explicit tag"
                          ))
                    : E(e, "unknown tag !<" + e.tag + ">");
              return (
                null !== e.listener && e.listener("close", e),
                null !== e.tag || null !== e.anchor || S
              );
            }
            function R(e) {
              var t,
                n,
                r,
                i,
                o = e.position,
                a = !1;
              for (
                e.version = null,
                  e.checkLineBreaks = e.legacy,
                  e.tagMap = {},
                  e.anchorMap = {};
                0 !== (i = e.input.charCodeAt(e.position)) &&
                (D(e, !0, -1),
                (i = e.input.charCodeAt(e.position)),
                !(e.lineIndent > 0 || 37 !== i));

              ) {
                for (
                  a = !0, i = e.input.charCodeAt(++e.position), t = e.position;
                  0 !== i && !y(i);

                )
                  i = e.input.charCodeAt(++e.position);
                for (
                  r = [],
                    (n = e.input.slice(t, e.position)).length < 1 &&
                      E(
                        e,
                        "directive name must not be less than one character in length"
                      );
                  0 !== i;

                ) {
                  for (; m(i); ) i = e.input.charCodeAt(++e.position);
                  if (35 === i) {
                    do {
                      i = e.input.charCodeAt(++e.position);
                    } while (0 !== i && !g(i));
                    break;
                  }
                  if (g(i)) break;
                  for (t = e.position; 0 !== i && !y(i); )
                    i = e.input.charCodeAt(++e.position);
                  r.push(e.input.slice(t, e.position));
                }
                0 !== i && I(e),
                  u.call(N, n)
                    ? N[n](e, n, r)
                    : T(e, 'unknown document directive "' + n + '"');
              }
              D(e, !0, -1),
                0 === e.lineIndent &&
                45 === e.input.charCodeAt(e.position) &&
                45 === e.input.charCodeAt(e.position + 1) &&
                45 === e.input.charCodeAt(e.position + 2)
                  ? ((e.position += 3), D(e, !0, -1))
                  : a && E(e, "directives end mark is expected"),
                H(e, e.lineIndent - 1, 4, !1, !0),
                D(e, !0, -1),
                e.checkLineBreaks &&
                  c.test(e.input.slice(o, e.position)) &&
                  T(e, "non-ASCII line breaks are interpreted as content"),
                e.documents.push(e.result),
                e.position === e.lineStart && W(e)
                  ? 46 === e.input.charCodeAt(e.position) &&
                    ((e.position += 3), D(e, !0, -1))
                  : e.position < e.length - 1 &&
                    E(
                      e,
                      "end of the stream or a document separator is expected"
                    );
            }
            function B(e, t) {
              (t = t || {}),
                0 !== (e = String(e)).length &&
                  (10 !== e.charCodeAt(e.length - 1) &&
                    13 !== e.charCodeAt(e.length - 1) &&
                    (e += "\n"),
                  65279 === e.charCodeAt(0) && (e = e.slice(1)));
              var n = new S(e, t);
              for (n.input += "\0"; 32 === n.input.charCodeAt(n.position); )
                (n.lineIndent += 1), (n.position += 1);
              for (; n.position < n.length - 1; ) R(n);
              return n.documents;
            }
            function z(e, t, n) {
              var r,
                i,
                o = B(e, n);
              if ("function" != typeof t) return o;
              for (r = 0, i = o.length; r < i; r += 1) t(o[r]);
            }
            function U(e, t) {
              var n = B(e, t);
              if (0 !== n.length) {
                if (1 === n.length) return n[0];
                throw new i(
                  "expected a single document in the stream, but found more"
                );
              }
            }
            (t.exports.loadAll = z),
              (t.exports.load = U),
              (t.exports.safeLoadAll = function (e, t, n) {
                if ("function" != typeof t)
                  return z(e, r.extend({ schema: a }, n));
                z(e, t, r.extend({ schema: a }, n));
              }),
              (t.exports.safeLoad = function (e, t) {
                return U(e, r.extend({ schema: a }, t));
              });
          },
          {
            "./common": 2,
            "./exception": 4,
            "./mark": 6,
            "./schema/default_full": 9,
            "./schema/default_safe": 10,
          },
        ],
        6: [
          function (e, t, n) {
            "use strict";
            var r = e("./common");
            function i(e, t, n, r, i) {
              (this.name = e),
                (this.buffer = t),
                (this.position = n),
                (this.line = r),
                (this.column = i);
            }
            (i.prototype.getSnippet = function (e, t) {
              var n, i, o, a, s;
              if (!this.buffer) return null;
              for (
                e = e || 4, t = t || 75, n = "", i = this.position;
                i > 0 &&
                -1 === "\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(i - 1));

              )
                if (((i -= 1), this.position - i > t / 2 - 1)) {
                  (n = " ... "), (i += 5);
                  break;
                }
              for (
                o = "", a = this.position;
                a < this.buffer.length &&
                -1 === "\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(a));

              )
                if ((a += 1) - this.position > t / 2 - 1) {
                  (o = " ... "), (a -= 5);
                  break;
                }
              return (
                (s = this.buffer.slice(i, a)),
                r.repeat(" ", e) +
                  n +
                  s +
                  o +
                  "\n" +
                  r.repeat(" ", e + this.position - i + n.length) +
                  "^"
              );
            }),
              (i.prototype.toString = function (e) {
                var t,
                  n = "";
                return (
                  this.name && (n += 'in "' + this.name + '" '),
                  (n +=
                    "at line " +
                    (this.line + 1) +
                    ", column " +
                    (this.column + 1)),
                  e || ((t = this.getSnippet()) && (n += ":\n" + t)),
                  n
                );
              }),
              (t.exports = i);
          },
          { "./common": 2 },
        ],
        7: [
          function (e, t, n) {
            "use strict";
            var r = e("./common"),
              i = e("./exception"),
              o = e("./type");
            function a(e, t, n) {
              var r = [];
              return (
                e.include.forEach(function (e) {
                  n = a(e, t, n);
                }),
                e[t].forEach(function (e) {
                  n.forEach(function (t, n) {
                    t.tag === e.tag && t.kind === e.kind && r.push(n);
                  }),
                    n.push(e);
                }),
                n.filter(function (e, t) {
                  return -1 === r.indexOf(t);
                })
              );
            }
            function s(e) {
              (this.include = e.include || []),
                (this.implicit = e.implicit || []),
                (this.explicit = e.explicit || []),
                this.implicit.forEach(function (e) {
                  if (e.loadKind && "scalar" !== e.loadKind)
                    throw new i(
                      "There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported."
                    );
                }),
                (this.compiledImplicit = a(this, "implicit", [])),
                (this.compiledExplicit = a(this, "explicit", [])),
                (this.compiledTypeMap = (function () {
                  var e,
                    t,
                    n = { scalar: {}, sequence: {}, mapping: {}, fallback: {} };
                  function r(e) {
                    n[e.kind][e.tag] = n.fallback[e.tag] = e;
                  }
                  for (e = 0, t = arguments.length; e < t; e += 1)
                    arguments[e].forEach(r);
                  return n;
                })(this.compiledImplicit, this.compiledExplicit));
            }
            (s.DEFAULT = null),
              (s.create = function () {
                var e, t;
                switch (arguments.length) {
                  case 1:
                    (e = s.DEFAULT), (t = arguments[0]);
                    break;
                  case 2:
                    (e = arguments[0]), (t = arguments[1]);
                    break;
                  default:
                    throw new i(
                      "Wrong number of arguments for Schema.create function"
                    );
                }
                if (
                  ((e = r.toArray(e)),
                  (t = r.toArray(t)),
                  !e.every(function (e) {
                    return e instanceof s;
                  }))
                )
                  throw new i(
                    "Specified list of super schemas (or a single Schema object) contains a non-Schema object."
                  );
                if (
                  !t.every(function (e) {
                    return e instanceof o;
                  })
                )
                  throw new i(
                    "Specified list of YAML types (or a single Type object) contains a non-Type object."
                  );
                return new s({ include: e, explicit: t });
              }),
              (t.exports = s);
          },
          { "./common": 2, "./exception": 4, "./type": 13 },
        ],
        8: [
          function (e, t, n) {
            "use strict";
            var r = e("../schema");
            t.exports = new r({ include: [e("./json")] });
          },
          { "../schema": 7, "./json": 12 },
        ],
        9: [
          function (e, t, n) {
            "use strict";
            var r = e("../schema");
            t.exports = r.DEFAULT = new r({
              include: [e("./default_safe")],
              explicit: [
                e("../type/js/undefined"),
                e("../type/js/regexp"),
                e("../type/js/function"),
              ],
            });
          },
          {
            "../schema": 7,
            "../type/js/function": 18,
            "../type/js/regexp": 19,
            "../type/js/undefined": 20,
            "./default_safe": 10,
          },
        ],
        10: [
          function (e, t, n) {
            "use strict";
            var r = e("../schema");
            t.exports = new r({
              include: [e("./core")],
              implicit: [e("../type/timestamp"), e("../type/merge")],
              explicit: [
                e("../type/binary"),
                e("../type/omap"),
                e("../type/pairs"),
                e("../type/set"),
              ],
            });
          },
          {
            "../schema": 7,
            "../type/binary": 14,
            "../type/merge": 22,
            "../type/omap": 24,
            "../type/pairs": 25,
            "../type/set": 27,
            "../type/timestamp": 29,
            "./core": 8,
          },
        ],
        11: [
          function (e, t, n) {
            "use strict";
            var r = e("../schema");
            t.exports = new r({
              explicit: [e("../type/str"), e("../type/seq"), e("../type/map")],
            });
          },
          {
            "../schema": 7,
            "../type/map": 21,
            "../type/seq": 26,
            "../type/str": 28,
          },
        ],
        12: [
          function (e, t, n) {
            "use strict";
            var r = e("../schema");
            t.exports = new r({
              include: [e("./failsafe")],
              implicit: [
                e("../type/null"),
                e("../type/bool"),
                e("../type/int"),
                e("../type/float"),
              ],
            });
          },
          {
            "../schema": 7,
            "../type/bool": 15,
            "../type/float": 16,
            "../type/int": 17,
            "../type/null": 23,
            "./failsafe": 11,
          },
        ],
        13: [
          function (e, t, n) {
            "use strict";
            var r = e("./exception"),
              i = [
                "kind",
                "resolve",
                "construct",
                "instanceOf",
                "predicate",
                "represent",
                "defaultStyle",
                "styleAliases",
              ],
              o = ["scalar", "sequence", "mapping"];
            t.exports = function (e, t) {
              var n, a;
              if (
                ((t = t || {}),
                Object.keys(t).forEach(function (t) {
                  if (-1 === i.indexOf(t))
                    throw new r(
                      'Unknown option "' +
                        t +
                        '" is met in definition of "' +
                        e +
                        '" YAML type.'
                    );
                }),
                (this.tag = e),
                (this.kind = t.kind || null),
                (this.resolve =
                  t.resolve ||
                  function () {
                    return !0;
                  }),
                (this.construct =
                  t.construct ||
                  function (e) {
                    return e;
                  }),
                (this.instanceOf = t.instanceOf || null),
                (this.predicate = t.predicate || null),
                (this.represent = t.represent || null),
                (this.defaultStyle = t.defaultStyle || null),
                (this.styleAliases =
                  ((n = t.styleAliases || null),
                  (a = {}),
                  null !== n &&
                    Object.keys(n).forEach(function (e) {
                      n[e].forEach(function (t) {
                        a[String(t)] = e;
                      });
                    }),
                  a)),
                -1 === o.indexOf(this.kind))
              )
                throw new r(
                  'Unknown kind "' +
                    this.kind +
                    '" is specified for "' +
                    e +
                    '" YAML type.'
                );
            };
          },
          { "./exception": 4 },
        ],
        14: [
          function (e, t, n) {
            "use strict";
            var r;
            try {
              r = e("buffer").Buffer;
            } catch (e) {}
            var i = e("../type"),
              o =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
            t.exports = new i("tag:yaml.org,2002:binary", {
              kind: "scalar",
              resolve: function (e) {
                if (null === e) return !1;
                var t,
                  n,
                  r = 0,
                  i = e.length,
                  a = o;
                for (n = 0; n < i; n++)
                  if (!((t = a.indexOf(e.charAt(n))) > 64)) {
                    if (t < 0) return !1;
                    r += 6;
                  }
                return r % 8 == 0;
              },
              construct: function (e) {
                var t,
                  n,
                  i = e.replace(/[\r\n=]/g, ""),
                  a = i.length,
                  s = o,
                  u = 0,
                  l = [];
                for (t = 0; t < a; t++)
                  t % 4 == 0 &&
                    t &&
                    (l.push((u >> 16) & 255),
                    l.push((u >> 8) & 255),
                    l.push(255 & u)),
                    (u = (u << 6) | s.indexOf(i.charAt(t)));
                return (
                  0 == (n = (a % 4) * 6)
                    ? (l.push((u >> 16) & 255),
                      l.push((u >> 8) & 255),
                      l.push(255 & u))
                    : 18 === n
                    ? (l.push((u >> 10) & 255), l.push((u >> 2) & 255))
                    : 12 === n && l.push((u >> 4) & 255),
                  r ? (r.from ? r.from(l) : new r(l)) : l
                );
              },
              predicate: function (e) {
                return r && r.isBuffer(e);
              },
              represent: function (e) {
                var t,
                  n,
                  r = "",
                  i = 0,
                  a = e.length,
                  s = o;
                for (t = 0; t < a; t++)
                  t % 3 == 0 &&
                    t &&
                    ((r += s[(i >> 18) & 63]),
                    (r += s[(i >> 12) & 63]),
                    (r += s[(i >> 6) & 63]),
                    (r += s[63 & i])),
                    (i = (i << 8) + e[t]);
                return (
                  0 == (n = a % 3)
                    ? ((r += s[(i >> 18) & 63]),
                      (r += s[(i >> 12) & 63]),
                      (r += s[(i >> 6) & 63]),
                      (r += s[63 & i]))
                    : 2 === n
                    ? ((r += s[(i >> 10) & 63]),
                      (r += s[(i >> 4) & 63]),
                      (r += s[(i << 2) & 63]),
                      (r += s[64]))
                    : 1 === n &&
                      ((r += s[(i >> 2) & 63]),
                      (r += s[(i << 4) & 63]),
                      (r += s[64]),
                      (r += s[64])),
                  r
                );
              },
            });
          },
          { "../type": 13 },
        ],
        15: [
          function (e, t, n) {
            "use strict";
            var r = e("../type");
            t.exports = new r("tag:yaml.org,2002:bool", {
              kind: "scalar",
              resolve: function (e) {
                if (null === e) return !1;
                var t = e.length;
                return (
                  (4 === t && ("true" === e || "True" === e || "TRUE" === e)) ||
                  (5 === t && ("false" === e || "False" === e || "FALSE" === e))
                );
              },
              construct: function (e) {
                return "true" === e || "True" === e || "TRUE" === e;
              },
              predicate: function (e) {
                return "[object Boolean]" === Object.prototype.toString.call(e);
              },
              represent: {
                lowercase: function (e) {
                  return e ? "true" : "false";
                },
                uppercase: function (e) {
                  return e ? "TRUE" : "FALSE";
                },
                camelcase: function (e) {
                  return e ? "True" : "False";
                },
              },
              defaultStyle: "lowercase",
            });
          },
          { "../type": 13 },
        ],
        16: [
          function (e, t, n) {
            "use strict";
            var r = e("../common"),
              i = e("../type"),
              o = new RegExp(
                "^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
              ),
              a = /^[-+]?[0-9]+e/;
            t.exports = new i("tag:yaml.org,2002:float", {
              kind: "scalar",
              resolve: function (e) {
                return null !== e && !(!o.test(e) || "_" === e[e.length - 1]);
              },
              construct: function (e) {
                var t, n, r, i;
                return (
                  (n =
                    "-" === (t = e.replace(/_/g, "").toLowerCase())[0]
                      ? -1
                      : 1),
                  (i = []),
                  "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)),
                  ".inf" === t
                    ? 1 === n
                      ? Number.POSITIVE_INFINITY
                      : Number.NEGATIVE_INFINITY
                    : ".nan" === t
                    ? NaN
                    : t.indexOf(":") >= 0
                    ? (t.split(":").forEach(function (e) {
                        i.unshift(parseFloat(e, 10));
                      }),
                      (t = 0),
                      (r = 1),
                      i.forEach(function (e) {
                        (t += e * r), (r *= 60);
                      }),
                      n * t)
                    : n * parseFloat(t, 10)
                );
              },
              predicate: function (e) {
                return (
                  "[object Number]" === Object.prototype.toString.call(e) &&
                  (e % 1 != 0 || r.isNegativeZero(e))
                );
              },
              represent: function (e, t) {
                var n;
                if (isNaN(e))
                  switch (t) {
                    case "lowercase":
                      return ".nan";
                    case "uppercase":
                      return ".NAN";
                    case "camelcase":
                      return ".NaN";
                  }
                else if (Number.POSITIVE_INFINITY === e)
                  switch (t) {
                    case "lowercase":
                      return ".inf";
                    case "uppercase":
                      return ".INF";
                    case "camelcase":
                      return ".Inf";
                  }
                else if (Number.NEGATIVE_INFINITY === e)
                  switch (t) {
                    case "lowercase":
                      return "-.inf";
                    case "uppercase":
                      return "-.INF";
                    case "camelcase":
                      return "-.Inf";
                  }
                else if (r.isNegativeZero(e)) return "-0.0";
                return (
                  (n = e.toString(10)), a.test(n) ? n.replace("e", ".e") : n
                );
              },
              defaultStyle: "lowercase",
            });
          },
          { "../common": 2, "../type": 13 },
        ],
        17: [
          function (e, t, n) {
            "use strict";
            var r = e("../common"),
              i = e("../type");
            function o(e) {
              return 48 <= e && e <= 55;
            }
            function a(e) {
              return 48 <= e && e <= 57;
            }
            t.exports = new i("tag:yaml.org,2002:int", {
              kind: "scalar",
              resolve: function (e) {
                if (null === e) return !1;
                var t,
                  n,
                  r = e.length,
                  i = 0,
                  s = !1;
                if (!r) return !1;
                if (
                  (("-" !== (t = e[i]) && "+" !== t) || (t = e[++i]), "0" === t)
                ) {
                  if (i + 1 === r) return !0;
                  if ("b" === (t = e[++i])) {
                    for (i++; i < r; i++)
                      if ("_" !== (t = e[i])) {
                        if ("0" !== t && "1" !== t) return !1;
                        s = !0;
                      }
                    return s && "_" !== t;
                  }
                  if ("x" === t) {
                    for (i++; i < r; i++)
                      if ("_" !== (t = e[i])) {
                        if (
                          !(
                            (48 <= (n = e.charCodeAt(i)) && n <= 57) ||
                            (65 <= n && n <= 70) ||
                            (97 <= n && n <= 102)
                          )
                        )
                          return !1;
                        s = !0;
                      }
                    return s && "_" !== t;
                  }
                  for (; i < r; i++)
                    if ("_" !== (t = e[i])) {
                      if (!o(e.charCodeAt(i))) return !1;
                      s = !0;
                    }
                  return s && "_" !== t;
                }
                if ("_" === t) return !1;
                for (; i < r; i++)
                  if ("_" !== (t = e[i])) {
                    if (":" === t) break;
                    if (!a(e.charCodeAt(i))) return !1;
                    s = !0;
                  }
                return (
                  !(!s || "_" === t) &&
                  (":" !== t || /^(:[0-5]?[0-9])+$/.test(e.slice(i)))
                );
              },
              construct: function (e) {
                var t,
                  n,
                  r = e,
                  i = 1,
                  o = [];
                return (
                  -1 !== r.indexOf("_") && (r = r.replace(/_/g, "")),
                  ("-" !== (t = r[0]) && "+" !== t) ||
                    ("-" === t && (i = -1), (t = (r = r.slice(1))[0])),
                  "0" === r
                    ? 0
                    : "0" === t
                    ? "b" === r[1]
                      ? i * parseInt(r.slice(2), 2)
                      : "x" === r[1]
                      ? i * parseInt(r, 16)
                      : i * parseInt(r, 8)
                    : -1 !== r.indexOf(":")
                    ? (r.split(":").forEach(function (e) {
                        o.unshift(parseInt(e, 10));
                      }),
                      (r = 0),
                      (n = 1),
                      o.forEach(function (e) {
                        (r += e * n), (n *= 60);
                      }),
                      i * r)
                    : i * parseInt(r, 10)
                );
              },
              predicate: function (e) {
                return (
                  "[object Number]" === Object.prototype.toString.call(e) &&
                  e % 1 == 0 &&
                  !r.isNegativeZero(e)
                );
              },
              represent: {
                binary: function (e) {
                  return e >= 0
                    ? "0b" + e.toString(2)
                    : "-0b" + e.toString(2).slice(1);
                },
                octal: function (e) {
                  return e >= 0
                    ? "0" + e.toString(8)
                    : "-0" + e.toString(8).slice(1);
                },
                decimal: function (e) {
                  return e.toString(10);
                },
                hexadecimal: function (e) {
                  return e >= 0
                    ? "0x" + e.toString(16).toUpperCase()
                    : "-0x" + e.toString(16).toUpperCase().slice(1);
                },
              },
              defaultStyle: "decimal",
              styleAliases: {
                binary: [2, "bin"],
                octal: [8, "oct"],
                decimal: [10, "dec"],
                hexadecimal: [16, "hex"],
              },
            });
          },
          { "../common": 2, "../type": 13 },
        ],
        18: [
          function (e, t, n) {
            "use strict";
            var r;
            try {
              r = e("esprima");
            } catch (e) {
              "undefined" != typeof window && (r = window.esprima);
            }
            var i = e("../../type");
            t.exports = new i("tag:yaml.org,2002:js/function", {
              kind: "scalar",
              resolve: function (e) {
                if (null === e) return !1;
                try {
                  var t = "(" + e + ")",
                    n = r.parse(t, { range: !0 });
                  return (
                    "Program" === n.type &&
                    1 === n.body.length &&
                    "ExpressionStatement" === n.body[0].type &&
                    ("ArrowFunctionExpression" === n.body[0].expression.type ||
                      "FunctionExpression" === n.body[0].expression.type)
                  );
                } catch (e) {
                  return !1;
                }
              },
              construct: function (e) {
                var t,
                  n = "(" + e + ")",
                  i = r.parse(n, { range: !0 }),
                  o = [];
                if (
                  "Program" !== i.type ||
                  1 !== i.body.length ||
                  "ExpressionStatement" !== i.body[0].type ||
                  ("ArrowFunctionExpression" !== i.body[0].expression.type &&
                    "FunctionExpression" !== i.body[0].expression.type)
                )
                  throw new Error("Failed to resolve function");
                return (
                  i.body[0].expression.params.forEach(function (e) {
                    o.push(e.name);
                  }),
                  (t = i.body[0].expression.body.range),
                  "BlockStatement" === i.body[0].expression.body.type
                    ? new Function(o, n.slice(t[0] + 1, t[1] - 1))
                    : new Function(o, "return " + n.slice(t[0], t[1]))
                );
              },
              predicate: function (e) {
                return (
                  "[object Function]" === Object.prototype.toString.call(e)
                );
              },
              represent: function (e) {
                return e.toString();
              },
            });
          },
          { "../../type": 13 },
        ],
        19: [
          function (e, t, n) {
            "use strict";
            var r = e("../../type");
            t.exports = new r("tag:yaml.org,2002:js/regexp", {
              kind: "scalar",
              resolve: function (e) {
                if (null === e) return !1;
                if (0 === e.length) return !1;
                var t = e,
                  n = /\/([gim]*)$/.exec(e),
                  r = "";
                if ("/" === t[0]) {
                  if ((n && (r = n[1]), r.length > 3)) return !1;
                  if ("/" !== t[t.length - r.length - 1]) return !1;
                }
                return !0;
              },
              construct: function (e) {
                var t = e,
                  n = /\/([gim]*)$/.exec(e),
                  r = "";
                return (
                  "/" === t[0] &&
                    (n && (r = n[1]),
                    (t = t.slice(1, t.length - r.length - 1))),
                  new RegExp(t, r)
                );
              },
              predicate: function (e) {
                return "[object RegExp]" === Object.prototype.toString.call(e);
              },
              represent: function (e) {
                var t = "/" + e.source + "/";
                return (
                  e.global && (t += "g"),
                  e.multiline && (t += "m"),
                  e.ignoreCase && (t += "i"),
                  t
                );
              },
            });
          },
          { "../../type": 13 },
        ],
        20: [
          function (e, t, n) {
            "use strict";
            var r = e("../../type");
            t.exports = new r("tag:yaml.org,2002:js/undefined", {
              kind: "scalar",
              resolve: function () {
                return !0;
              },
              construct: function () {},
              predicate: function (e) {
                return void 0 === e;
              },
              represent: function () {
                return "";
              },
            });
          },
          { "../../type": 13 },
        ],
        21: [
          function (e, t, n) {
            "use strict";
            var r = e("../type");
            t.exports = new r("tag:yaml.org,2002:map", {
              kind: "mapping",
              construct: function (e) {
                return null !== e ? e : {};
              },
            });
          },
          { "../type": 13 },
        ],
        22: [
          function (e, t, n) {
            "use strict";
            var r = e("../type");
            t.exports = new r("tag:yaml.org,2002:merge", {
              kind: "scalar",
              resolve: function (e) {
                return "<<" === e || null === e;
              },
            });
          },
          { "../type": 13 },
        ],
        23: [
          function (e, t, n) {
            "use strict";
            var r = e("../type");
            t.exports = new r("tag:yaml.org,2002:null", {
              kind: "scalar",
              resolve: function (e) {
                if (null === e) return !0;
                var t = e.length;
                return (
                  (1 === t && "~" === e) ||
                  (4 === t && ("null" === e || "Null" === e || "NULL" === e))
                );
              },
              construct: function () {
                return null;
              },
              predicate: function (e) {
                return null === e;
              },
              represent: {
                canonical: function () {
                  return "~";
                },
                lowercase: function () {
                  return "null";
                },
                uppercase: function () {
                  return "NULL";
                },
                camelcase: function () {
                  return "Null";
                },
              },
              defaultStyle: "lowercase",
            });
          },
          { "../type": 13 },
        ],
        24: [
          function (e, t, n) {
            "use strict";
            var r = e("../type"),
              i = Object.prototype.hasOwnProperty,
              o = Object.prototype.toString;
            t.exports = new r("tag:yaml.org,2002:omap", {
              kind: "sequence",
              resolve: function (e) {
                if (null === e) return !0;
                var t,
                  n,
                  r,
                  a,
                  s,
                  u = [],
                  l = e;
                for (t = 0, n = l.length; t < n; t += 1) {
                  if (((r = l[t]), (s = !1), "[object Object]" !== o.call(r)))
                    return !1;
                  for (a in r)
                    if (i.call(r, a)) {
                      if (s) return !1;
                      s = !0;
                    }
                  if (!s) return !1;
                  if (-1 !== u.indexOf(a)) return !1;
                  u.push(a);
                }
                return !0;
              },
              construct: function (e) {
                return null !== e ? e : [];
              },
            });
          },
          { "../type": 13 },
        ],
        25: [
          function (e, t, n) {
            "use strict";
            var r = e("../type"),
              i = Object.prototype.toString;
            t.exports = new r("tag:yaml.org,2002:pairs", {
              kind: "sequence",
              resolve: function (e) {
                if (null === e) return !0;
                var t,
                  n,
                  r,
                  o,
                  a,
                  s = e;
                for (
                  a = new Array(s.length), t = 0, n = s.length;
                  t < n;
                  t += 1
                ) {
                  if (((r = s[t]), "[object Object]" !== i.call(r))) return !1;
                  if (1 !== (o = Object.keys(r)).length) return !1;
                  a[t] = [o[0], r[o[0]]];
                }
                return !0;
              },
              construct: function (e) {
                if (null === e) return [];
                var t,
                  n,
                  r,
                  i,
                  o,
                  a = e;
                for (
                  o = new Array(a.length), t = 0, n = a.length;
                  t < n;
                  t += 1
                )
                  (r = a[t]), (i = Object.keys(r)), (o[t] = [i[0], r[i[0]]]);
                return o;
              },
            });
          },
          { "../type": 13 },
        ],
        26: [
          function (e, t, n) {
            "use strict";
            var r = e("../type");
            t.exports = new r("tag:yaml.org,2002:seq", {
              kind: "sequence",
              construct: function (e) {
                return null !== e ? e : [];
              },
            });
          },
          { "../type": 13 },
        ],
        27: [
          function (e, t, n) {
            "use strict";
            var r = e("../type"),
              i = Object.prototype.hasOwnProperty;
            t.exports = new r("tag:yaml.org,2002:set", {
              kind: "mapping",
              resolve: function (e) {
                if (null === e) return !0;
                var t,
                  n = e;
                for (t in n) if (i.call(n, t) && null !== n[t]) return !1;
                return !0;
              },
              construct: function (e) {
                return null !== e ? e : {};
              },
            });
          },
          { "../type": 13 },
        ],
        28: [
          function (e, t, n) {
            "use strict";
            var r = e("../type");
            t.exports = new r("tag:yaml.org,2002:str", {
              kind: "scalar",
              construct: function (e) {
                return null !== e ? e : "";
              },
            });
          },
          { "../type": 13 },
        ],
        29: [
          function (e, t, n) {
            "use strict";
            var r = e("../type"),
              i = new RegExp(
                "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
              ),
              o = new RegExp(
                "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
              );
            t.exports = new r("tag:yaml.org,2002:timestamp", {
              kind: "scalar",
              resolve: function (e) {
                return null !== e && (null !== i.exec(e) || null !== o.exec(e));
              },
              construct: function (e) {
                var t,
                  n,
                  r,
                  a,
                  s,
                  u,
                  l,
                  c,
                  f = 0,
                  p = null;
                if ((null === (t = i.exec(e)) && (t = o.exec(e)), null === t))
                  throw new Error("Date resolve error");
                if (((n = +t[1]), (r = +t[2] - 1), (a = +t[3]), !t[4]))
                  return new Date(Date.UTC(n, r, a));
                if (((s = +t[4]), (u = +t[5]), (l = +t[6]), t[7])) {
                  for (f = t[7].slice(0, 3); f.length < 3; ) f += "0";
                  f = +f;
                }
                return (
                  t[9] &&
                    ((p = 6e4 * (60 * +t[10] + +(t[11] || 0))),
                    "-" === t[9] && (p = -p)),
                  (c = new Date(Date.UTC(n, r, a, s, u, l, f))),
                  p && c.setTime(c.getTime() - p),
                  c
                );
              },
              instanceOf: Date,
              represent: function (e) {
                return e.toISOString();
              },
            });
          },
          { "../type": 13 },
        ],
        "/": [
          function (e, t, n) {
            "use strict";
            var r = e("./lib/js-yaml.js");
            t.exports = r;
          },
          { "./lib/js-yaml.js": 1 },
        ],
      },
      {},
      []
    )("/");
  },
  function (e, t, n) {
    "use strict";
    function r(e, t, n, i) {
      (this.message = e),
        (this.expected = t),
        (this.found = n),
        (this.location = i),
        (this.name = "SyntaxError"),
        "function" == typeof Error.captureStackTrace &&
          Error.captureStackTrace(this, r);
    }
    !(function (e, t) {
      function n() {
        this.constructor = e;
      }
      (n.prototype = t.prototype), (e.prototype = new n());
    })(r, Error),
      (r.buildMessage = function (e, t) {
        var n = {
          literal: function (e) {
            return '"' + i(e.text) + '"';
          },
          class: function (e) {
            var t,
              n = "";
            for (t = 0; t < e.parts.length; t++)
              n +=
                e.parts[t] instanceof Array
                  ? o(e.parts[t][0]) + "-" + o(e.parts[t][1])
                  : o(e.parts[t]);
            return "[" + (e.inverted ? "^" : "") + n + "]";
          },
          any: function (e) {
            return "any character";
          },
          end: function (e) {
            return "end of input";
          },
          other: function (e) {
            return e.description;
          },
        };
        function r(e) {
          return e.charCodeAt(0).toString(16).toUpperCase();
        }
        function i(e) {
          return e
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (e) {
              return "\\x0" + r(e);
            })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (e) {
              return "\\x" + r(e);
            });
        }
        function o(e) {
          return e
            .replace(/\\/g, "\\\\")
            .replace(/\]/g, "\\]")
            .replace(/\^/g, "\\^")
            .replace(/-/g, "\\-")
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (e) {
              return "\\x0" + r(e);
            })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (e) {
              return "\\x" + r(e);
            });
        }
        return (
          "Expected " +
          (function (e) {
            var t,
              r,
              i,
              o = new Array(e.length);
            for (t = 0; t < e.length; t++) o[t] = ((i = e[t]), n[i.type](i));
            if ((o.sort(), o.length > 0)) {
              for (t = 1, r = 1; t < o.length; t++)
                o[t - 1] !== o[t] && ((o[r] = o[t]), r++);
              o.length = r;
            }
            switch (o.length) {
              case 1:
                return o[0];
              case 2:
                return o[0] + " or " + o[1];
              default:
                return o.slice(0, -1).join(", ") + ", or " + o[o.length - 1];
            }
          })(e) +
          " but " +
          (function (e) {
            return e ? '"' + i(e) + '"' : "end of input";
          })(t) +
          " found."
        );
      }),
      (e.exports = {
        SyntaxError: r,
        parse: function (e, t) {
          t = void 0 !== t ? t : {};
          var n,
            i = {},
            o = { animation: he },
            a = he,
            s = function (e, t) {
              return t;
            },
            u = function (e, t) {
              return [e, ...t];
            },
            l = ue("---", !1),
            c = ue("-", !1),
            f = ue("{", !1),
            p = ue("}", !1),
            d = /^[a-z0-9~$%_+.\/?()]/i,
            h = le(
              [
                ["a", "z"],
                ["0", "9"],
                "~",
                "$",
                "%",
                "_",
                "+",
                ".",
                "/",
                "?",
                "(",
                ")",
              ],
              !1,
              !0
            ),
            g = ue("add", !1),
            m = ue(">", !1),
            y = ue("=", !1),
            v = ue("x", !1),
            b = ue("(", !1),
            x = ue(")", !1),
            w = ue("((", !1),
            A = ue("))", !1),
            k = ue(":", !1),
            C = ue("[", !1),
            S = ue("]", !1),
            j = ue('"', !1),
            E = /^[^"]/,
            T = le(['"'], !0, !1),
            N = /^[0-9]/,
            O = le([["0", "9"]], !1, !1),
            M = ue(".", !1),
            L = function () {
              return se();
            },
            I = ue("true", !1),
            D = ue("false", !1),
            W = ue("'", !1),
            F = { type: "any" },
            _ = ue("null", !1),
            P = ue("_", !1),
            q = ue("#", !1),
            H = ue("`", !1),
            R = function () {
              return se().replace(/\`/g, "");
            },
            B = /^[a-z0-9~$%_+.\/?]/i,
            z = le(
              [["a", "z"], ["0", "9"], "~", "$", "%", "_", "+", ".", "/", "?"],
              !1,
              !0
            ),
            U = /^[()a-z0-9~$%_+.\/?[\]:,]/i,
            $ = le(
              [
                "(",
                ")",
                ["a", "z"],
                ["0", "9"],
                "~",
                "$",
                "%",
                "_",
                "+",
                ".",
                "/",
                "?",
                "[",
                "]",
                ":",
                ",",
              ],
              !1,
              !0
            ),
            Y = ue("<", !1),
            G = ue(",", !1),
            V = ue("[]", !1),
            X = ue("//", !1),
            J = /^[^\n\r]/,
            K = le(["\n", "\r"], !0, !1),
            Q = /^[ \t]/,
            Z = le([" ", "\t"], !1, !1),
            ee = /^[\n\r]/,
            te = le(["\n", "\r"], !1, !1),
            ne = 0,
            re = 0,
            ie = [{ line: 1, column: 1 }],
            oe = 0,
            ae = [];
          if ("startRule" in t) {
            if (!(t.startRule in o))
              throw new Error(
                "Can't start parsing from rule \"" + t.startRule + '".'
              );
            a = o[t.startRule];
          }
          function se() {
            return e.substring(re, ne);
          }
          function ue(e, t) {
            return { type: "literal", text: e, ignoreCase: t };
          }
          function le(e, t, n) {
            return { type: "class", parts: e, inverted: t, ignoreCase: n };
          }
          function ce(t) {
            var n,
              r = ie[t];
            if (r) return r;
            for (n = t - 1; !ie[n]; ) n--;
            for (r = { line: (r = ie[n]).line, column: r.column }; n < t; )
              10 === e.charCodeAt(n) ? (r.line++, (r.column = 1)) : r.column++,
                n++;
            return (ie[t] = r), r;
          }
          function fe(e, t) {
            var n = ce(e),
              r = ce(t);
            return {
              start: { offset: e, line: n.line, column: n.column },
              end: { offset: t, line: r.line, column: r.column },
            };
          }
          function pe(e) {
            ne < oe || (ne > oe && ((oe = ne), (ae = [])), ae.push(e));
          }
          function de(e, t, n) {
            return new r(r.buildMessage(e, t), e, t, n);
          }
          function he() {
            var e, t, n, r, o, a, l, c, f;
            if (((e = ne), We() !== i)) {
              for (t = [], n = Fe(); n !== i; ) t.push(n), (n = Fe());
              if (t !== i)
                if ((n = me()) !== i) {
                  for (r = [], o = ne, a = [], l = Fe(); l !== i; )
                    a.push(l), (l = Fe());
                  if (a !== i)
                    if ((l = ge()) !== i) {
                      for (c = [], f = Fe(); f !== i; ) c.push(f), (f = Fe());
                      c !== i && (f = me()) !== i
                        ? ((re = o), (o = a = s(0, f)))
                        : ((ne = o), (o = i));
                    } else (ne = o), (o = i);
                  else (ne = o), (o = i);
                  for (; o !== i; ) {
                    for (r.push(o), o = ne, a = [], l = Fe(); l !== i; )
                      a.push(l), (l = Fe());
                    if (a !== i)
                      if ((l = ge()) !== i) {
                        for (c = [], f = Fe(); f !== i; ) c.push(f), (f = Fe());
                        c !== i && (f = me()) !== i
                          ? ((re = o), (o = a = s(0, f)))
                          : ((ne = o), (o = i));
                      } else (ne = o), (o = i);
                    else (ne = o), (o = i);
                  }
                  r !== i && (o = We()) !== i
                    ? ((a = De()) === i && (a = null),
                      a !== i ? ((re = e), (e = u(n, r))) : ((ne = e), (e = i)))
                    : ((ne = e), (e = i));
                } else (ne = e), (e = i);
              else (ne = e), (e = i);
            } else (ne = e), (e = i);
            return e;
          }
          function ge() {
            var t, n, r, o;
            if (
              ((t = ne),
              "---" === e.substr(ne, 3)
                ? ((n = "---"), (ne += 3))
                : ((n = i), pe(l)),
              n !== i)
            ) {
              for (
                r = [],
                  45 === e.charCodeAt(ne)
                    ? ((o = "-"), ne++)
                    : ((o = i), pe(c));
                o !== i;

              )
                r.push(o),
                  45 === e.charCodeAt(ne)
                    ? ((o = "-"), ne++)
                    : ((o = i), pe(c));
              r !== i ? (t = n = [n, r]) : ((ne = t), (t = i));
            } else (ne = t), (t = i);
            return t;
          }
          function me() {
            var e, t, n, r, o, a, s;
            for (e = ne, t = [], n = Fe(); n !== i; ) t.push(n), (n = Fe());
            if (t !== i) {
              for (n = [], r = ne, o = [], a = Fe(); a !== i; )
                o.push(a), (a = Fe());
              for (
                o !== i
                  ? ((a = we()) === i && (a = ye()),
                    a !== i ? ((re = r), (r = o = a)) : ((ne = r), (r = i)))
                  : ((ne = r), (r = i));
                r !== i;

              ) {
                for (n.push(r), r = ne, o = [], a = Fe(); a !== i; )
                  o.push(a), (a = Fe());
                o !== i
                  ? ((a = we()) === i && (a = ye()),
                    a !== i ? ((re = r), (r = o = a)) : ((ne = r), (r = i)))
                  : ((ne = r), (r = i));
              }
              if (n !== i) {
                for (r = [], o = Fe(); o !== i; ) r.push(o), (o = Fe());
                r !== i
                  ? ((re = e),
                    (s = n),
                    (e = t = (function () {
                      let e = {};
                      for (let t of arguments)
                        if (t)
                          for (let n in t) e[n] = (e[n] || []).concat(t[n]);
                      return e;
                    })(...s)))
                  : ((ne = e), (e = i));
              } else (ne = e), (e = i);
            } else (ne = e), (e = i);
            return e;
          }
          function ye() {
            var e, t, n, r, o, a;
            for (e = ne, t = [], n = Fe(); n !== i; ) t.push(n), (n = Fe());
            if (t !== i) {
              for (n = [], r = ne, o = [], a = Fe(); a !== i; )
                o.push(a), (a = Fe());
              if (
                (o !== i && (a = ve()) !== i
                  ? ((re = r), (r = o = a))
                  : ((ne = r), (r = i)),
                r !== i)
              )
                for (; r !== i; ) {
                  for (n.push(r), r = ne, o = [], a = Fe(); a !== i; )
                    o.push(a), (a = Fe());
                  o !== i && (a = ve()) !== i
                    ? ((re = r), (r = o = a))
                    : ((ne = r), (r = i));
                }
              else n = i;
              n !== i
                ? ((re = e), (e = t = { stack: n }))
                : ((ne = e), (e = i));
            } else (ne = e), (e = i);
            return e;
          }
          function ve() {
            var t, n, r, o, a, l, c, d, h, g;
            if (((t = ne), (n = be()) !== i))
              if (We() !== i)
                if (
                  ((r = ne),
                  (o = Ce()) !== i &&
                  (a = We()) !== i &&
                  (l = be()) !== i &&
                  (c = We()) !== i
                    ? ((re = r), (r = o = l))
                    : ((ne = r), (r = i)),
                  r === i && (r = null),
                  r !== i)
                )
                  if (
                    (123 === e.charCodeAt(ne)
                      ? ((o = "{"), ne++)
                      : ((o = i), pe(f)),
                    o !== i)
                  ) {
                    for (a = [], l = Fe(); l !== i; ) a.push(l), (l = Fe());
                    if (a !== i)
                      if (
                        (l = (function () {
                          var e, t;
                          (e = ne),
                            (t = (function () {
                              var e, t, n, r, o, a;
                              if (((e = ne), (t = xe()) !== i)) {
                                for (
                                  n = [],
                                    r = ne,
                                    (o = _e()) !== i && (a = xe()) !== i
                                      ? ((re = r), (o = s(0, a)), (r = o))
                                      : ((ne = r), (r = i));
                                  r !== i;

                                )
                                  n.push(r),
                                    (r = ne),
                                    (o = _e()) !== i && (a = xe()) !== i
                                      ? ((re = r), (o = s(0, a)), (r = o))
                                      : ((ne = r), (r = i));
                                n !== i
                                  ? ((re = e), (t = u(t, n)), (e = t))
                                  : ((ne = e), (e = i));
                              } else (ne = e), (e = i);
                              return e;
                            })()) === i && (t = null);
                          t !== i && ((re = e), (t = { fields: t || [] }));
                          return (e = t);
                        })()) !== i
                      ) {
                        for (c = [], d = Fe(); d !== i; ) c.push(d), (d = Fe());
                        c !== i
                          ? (125 === e.charCodeAt(ne)
                              ? ((d = "}"), ne++)
                              : ((d = i), pe(p)),
                            d !== i
                              ? ((re = t),
                                (h = n),
                                (t = n = Pe(
                                  (g = r)
                                    ? { func: h, target: g }
                                    : { func: h },
                                  l
                                )))
                              : ((ne = t), (t = i)))
                          : ((ne = t), (t = i));
                      } else (ne = t), (t = i);
                    else (ne = t), (t = i);
                  } else (ne = t), (t = i);
                else (ne = t), (t = i);
              else (ne = t), (t = i);
            else (ne = t), (t = i);
            return t;
          }
          function be() {
            var t, n, r;
            if (
              ((t = ne),
              (n = []),
              d.test(e.charAt(ne))
                ? ((r = e.charAt(ne)), ne++)
                : ((r = i), pe(h)),
              r !== i)
            )
              for (; r !== i; )
                n.push(r),
                  d.test(e.charAt(ne))
                    ? ((r = e.charAt(ne)), ne++)
                    : ((r = i), pe(h));
            else n = i;
            return n !== i && ((re = t), (n = se())), (t = n);
          }
          function xe() {
            var e;
            return (e = Ae()) === i && (e = je()), e;
          }
          function we() {
            var e, t, n, r, o, a;
            for (e = ne, t = [], n = Fe(); n !== i; ) t.push(n), (n = Fe());
            if (t !== i) {
              for (n = [], r = ne, o = [], a = Fe(); a !== i; )
                o.push(a), (a = Fe());
              if (
                (o !== i
                  ? ((a = Ae()) === i && (a = je()),
                    a !== i ? ((re = r), (r = o = a)) : ((ne = r), (r = i)))
                  : ((ne = r), (r = i)),
                r !== i)
              )
                for (; r !== i; ) {
                  for (n.push(r), r = ne, o = [], a = Fe(); a !== i; )
                    o.push(a), (a = Fe());
                  o !== i
                    ? ((a = Ae()) === i && (a = je()),
                      a !== i ? ((re = r), (r = o = a)) : ((ne = r), (r = i)))
                    : ((ne = r), (r = i));
                }
              else n = i;
              n !== i ? ((re = e), (e = t = { heap: n })) : ((ne = e), (e = i));
            } else (ne = e), (e = i);
            return e;
          }
          function Ae() {
            var t, n, r, o, a, s, u, l;
            return (
              (t = ne),
              (n = ke()) !== i
                ? ((r = We()) === i && (r = null),
                  r !== i
                    ? ((o = (function () {
                        var t, n, r, o;
                        (t = ne),
                          "add" === e.substr(ne, 3)
                            ? ((n = "add"), (ne += 3))
                            : ((n = i), pe(g));
                        n !== i
                          ? ((r = We()) === i && (r = null),
                            r !== i && (o = ke()) !== i
                              ? ((re = t), (t = n = { add: !0, fieldname: o }))
                              : ((ne = t), (t = i)))
                          : ((ne = t), (t = i));
                        return t;
                      })()) === i && (o = null),
                      o !== i
                        ? ((a = We()) === i && (a = null),
                          a !== i && (s = Ce()) !== i
                            ? ((u = We()) === i && (u = null),
                              u !== i
                                ? ((l = Se()) === i && (l = null),
                                  l !== i
                                    ? ((re = t),
                                      (t = n = Pe(
                                        { name: n, target: l },
                                        o,
                                        s
                                      )))
                                    : ((ne = t), (t = i)))
                                : ((ne = t), (t = i)))
                            : ((ne = t), (t = i)))
                        : ((ne = t), (t = i)))
                    : ((ne = t), (t = i)))
                : ((ne = t), (t = i)),
              t
            );
          }
          function ke() {
            var t;
            return (
              (t = (function () {
                var t, n;
                (t = ne),
                  95 === e.charCodeAt(ne)
                    ? ((n = "_"), ne++)
                    : ((n = i), pe(P));
                n !== i && ((re = t), (n = {}));
                return (t = n);
              })()) === i && (t = Ne()),
              t
            );
          }
          function Ce() {
            var t;
            return (
              (t = (function () {
                var t, n, r;
                (t = ne),
                  (n = []),
                  45 === e.charCodeAt(ne)
                    ? ((r = "-"), ne++)
                    : ((r = i), pe(c));
                if (r !== i)
                  for (; r !== i; )
                    n.push(r),
                      45 === e.charCodeAt(ne)
                        ? ((r = "-"), ne++)
                        : ((r = i), pe(c));
                else n = i;
                n !== i
                  ? (62 === e.charCodeAt(ne)
                      ? ((r = ">"), ne++)
                      : ((r = i), pe(m)),
                    r !== i ? ((re = t), (t = n = {})) : ((ne = t), (t = i)))
                  : ((ne = t), (t = i));
                return t;
              })()) === i &&
                (t = (function () {
                  var t, n, r, o, a;
                  (t = ne),
                    (n = []),
                    61 === e.charCodeAt(ne)
                      ? ((r = "="), ne++)
                      : ((r = i), pe(y));
                  if (r !== i)
                    for (; r !== i; )
                      n.push(r),
                        61 === e.charCodeAt(ne)
                          ? ((r = "="), ne++)
                          : ((r = i), pe(y));
                  else n = i;
                  if (n !== i)
                    if (
                      (120 === e.charCodeAt(ne)
                        ? ((r = "x"), ne++)
                        : ((r = i), pe(v)),
                      r !== i)
                    ) {
                      if (
                        ((o = []),
                        61 === e.charCodeAt(ne)
                          ? ((a = "="), ne++)
                          : ((a = i), pe(y)),
                        a !== i)
                      )
                        for (; a !== i; )
                          o.push(a),
                            61 === e.charCodeAt(ne)
                              ? ((a = "="), ne++)
                              : ((a = i), pe(y));
                      else o = i;
                      o !== i
                        ? ((re = t), (t = n = { assignment: !0, crossed: !0 }))
                        : ((ne = t), (t = i));
                    } else (ne = t), (t = i);
                  else (ne = t), (t = i);
                  return t;
                })()) === i &&
                (t = (function () {
                  var t, n, r, o;
                  (t = ne),
                    (n = []),
                    45 === e.charCodeAt(ne)
                      ? ((r = "-"), ne++)
                      : ((r = i), pe(c));
                  if (r !== i)
                    for (; r !== i; )
                      n.push(r),
                        45 === e.charCodeAt(ne)
                          ? ((r = "-"), ne++)
                          : ((r = i), pe(c));
                  else n = i;
                  n !== i
                    ? (120 === e.charCodeAt(ne)
                        ? ((r = "x"), ne++)
                        : ((r = i), pe(v)),
                      r !== i
                        ? (62 === e.charCodeAt(ne)
                            ? ((o = ">"), ne++)
                            : ((o = i), pe(m)),
                          o !== i
                            ? ((re = t), (t = n = { crossed: !0 }))
                            : ((ne = t), (t = i)))
                        : ((ne = t), (t = i)))
                    : ((ne = t), (t = i));
                  return t;
                })()) === i &&
                (t = (function () {
                  var t, n, r, o;
                  (t = ne),
                    (n = []),
                    61 === e.charCodeAt(ne)
                      ? ((r = "="), ne++)
                      : ((r = i), pe(y));
                  if (r !== i)
                    for (; r !== i; )
                      n.push(r),
                        61 === e.charCodeAt(ne)
                          ? ((r = "="), ne++)
                          : ((r = i), pe(y));
                  else n = i;
                  n !== i
                    ? (120 === e.charCodeAt(ne)
                        ? ((r = "x"), ne++)
                        : ((r = i), pe(v)),
                      r !== i
                        ? (62 === e.charCodeAt(ne)
                            ? ((o = ">"), ne++)
                            : ((o = i), pe(m)),
                          o !== i
                            ? ((re = t),
                              (t = n = { immutable: !0, crossed: !0 }))
                            : ((ne = t), (t = i)))
                        : ((ne = t), (t = i)))
                    : ((ne = t), (t = i));
                  return t;
                })()) === i &&
                (t = (function () {
                  var t, n, r;
                  (t = ne),
                    (n = []),
                    61 === e.charCodeAt(ne)
                      ? ((r = "="), ne++)
                      : ((r = i), pe(y));
                  if (r !== i)
                    for (; r !== i; )
                      n.push(r),
                        61 === e.charCodeAt(ne)
                          ? ((r = "="), ne++)
                          : ((r = i), pe(y));
                  else n = i;
                  n !== i
                    ? (62 === e.charCodeAt(ne)
                        ? ((r = ">"), ne++)
                        : ((r = i), pe(m)),
                      r !== i
                        ? ((re = t), (t = n = { immutable: !0 }))
                        : ((ne = t), (t = i)))
                    : ((ne = t), (t = i));
                  return t;
                })()) === i &&
                (t = (function () {
                  var t, n, r;
                  (t = ne),
                    (n = []),
                    61 === e.charCodeAt(ne)
                      ? ((r = "="), ne++)
                      : ((r = i), pe(y));
                  if (r !== i)
                    for (; r !== i; )
                      n.push(r),
                        61 === e.charCodeAt(ne)
                          ? ((r = "="), ne++)
                          : ((r = i), pe(y));
                  else n = i;
                  n !== i && ((re = t), (n = { assignment: !0 }));
                  return (t = n);
                })()),
              t
            );
          }
          function Se() {
            var e;
            return (e = je()) === i && (e = Ne()), e;
          }
          function je() {
            var t;
            return (
              (t = (function () {
                var t;
                (t = (function () {
                  var t, n, r, o;
                  (t = ne),
                    40 === e.charCodeAt(ne)
                      ? ((n = "("), ne++)
                      : ((n = i), pe(b));
                  n !== i && (r = Ee()) !== i
                    ? (41 === e.charCodeAt(ne)
                        ? ((o = ")"), ne++)
                        : ((o = i), pe(x)),
                      o !== i ? ((re = t), (t = n = r)) : ((ne = t), (t = i)))
                    : ((ne = t), (t = i));
                  return t;
                })()) === i &&
                  (t = (function () {
                    var t, n, r, o;
                    (t = ne),
                      "((" === e.substr(ne, 2)
                        ? ((n = "(("), (ne += 2))
                        : ((n = i), pe(w));
                    n !== i && (r = Ee()) !== i
                      ? ("))" === e.substr(ne, 2)
                          ? ((o = "))"), (ne += 2))
                          : ((o = i), pe(A)),
                        o !== i
                          ? ((re = t), (n = Pe({ immutable: !0 }, r)), (t = n))
                          : ((ne = t), (t = i)))
                      : ((ne = t), (t = i));
                    return t;
                  })());
                return t;
              })()) === i &&
                (t = (function () {
                  var t, n, r, o;
                  (t = ne),
                    91 === e.charCodeAt(ne)
                      ? ((n = "["), ne++)
                      : ((n = i), pe(C));
                  n !== i &&
                  We() !== i &&
                  (r = (function () {
                    var e, t, n, r, o, a;
                    if (((e = ne), (t = Se()) !== i)) {
                      for (
                        n = [],
                          r = ne,
                          (o = _e()) !== i && (a = Se()) !== i
                            ? ((re = r), (o = s(0, a)), (r = o))
                            : ((ne = r), (r = i));
                        r !== i;

                      )
                        n.push(r),
                          (r = ne),
                          (o = _e()) !== i && (a = Se()) !== i
                            ? ((re = r), (o = s(0, a)), (r = o))
                            : ((ne = r), (r = i));
                      n !== i
                        ? ((re = e), (t = u(t, n)), (e = t))
                        : ((ne = e), (e = i));
                    } else (ne = e), (e = i);
                    return e;
                  })()) !== i &&
                  We() !== i
                    ? (93 === e.charCodeAt(ne)
                        ? ((o = "]"), ne++)
                        : ((o = i), pe(S)),
                      o !== i
                        ? ((re = t), (t = n = { array: r }))
                        : ((ne = t), (t = i)))
                    : ((ne = t), (t = i));
                  return t;
                })()) === i &&
                (t = (function () {
                  var t, n, r, o;
                  (t = ne),
                    34 === e.charCodeAt(ne)
                      ? ((n = '"'), ne++)
                      : ((n = i), pe(j));
                  if (n !== i) {
                    for (
                      r = [],
                        E.test(e.charAt(ne))
                          ? ((o = e.charAt(ne)), ne++)
                          : ((o = i), pe(T));
                      o !== i;

                    )
                      r.push(o),
                        E.test(e.charAt(ne))
                          ? ((o = e.charAt(ne)), ne++)
                          : ((o = i), pe(T));
                    r !== i
                      ? (34 === e.charCodeAt(ne)
                          ? ((o = '"'), ne++)
                          : ((o = i), pe(j)),
                        o !== i
                          ? ((re = t), (n = { val: se() }), (t = n))
                          : ((ne = t), (t = i)))
                      : ((ne = t), (t = i));
                  } else (ne = t), (t = i);
                  return t;
                })()) === i &&
                (t = (function () {
                  var t, n;
                  (t = ne),
                    (n = (function () {
                      var t, n, r, o, a, s, u;
                      (t = ne),
                        (n = ne),
                        45 === e.charCodeAt(ne)
                          ? ((r = "-"), ne++)
                          : ((r = i), pe(c));
                      r === i && (r = null);
                      if (r !== i) {
                        for (
                          o = [],
                            N.test(e.charAt(ne))
                              ? ((a = e.charAt(ne)), ne++)
                              : ((a = i), pe(O));
                          a !== i;

                        )
                          o.push(a),
                            N.test(e.charAt(ne))
                              ? ((a = e.charAt(ne)), ne++)
                              : ((a = i), pe(O));
                        if (o !== i)
                          if (
                            (46 === e.charCodeAt(ne)
                              ? ((a = "."), ne++)
                              : ((a = i), pe(M)),
                            a !== i)
                          ) {
                            if (
                              ((s = []),
                              N.test(e.charAt(ne))
                                ? ((u = e.charAt(ne)), ne++)
                                : ((u = i), pe(O)),
                              u !== i)
                            )
                              for (; u !== i; )
                                s.push(u),
                                  N.test(e.charAt(ne))
                                    ? ((u = e.charAt(ne)), ne++)
                                    : ((u = i), pe(O));
                            else s = i;
                            s !== i
                              ? (n = r = [r, o, a, s])
                              : ((ne = n), (n = i));
                          } else (ne = n), (n = i);
                        else (ne = n), (n = i);
                      } else (ne = n), (n = i);
                      if (n === i) {
                        if (
                          ((n = ne),
                          (r = []),
                          N.test(e.charAt(ne))
                            ? ((o = e.charAt(ne)), ne++)
                            : ((o = i), pe(O)),
                          o !== i)
                        )
                          for (; o !== i; )
                            r.push(o),
                              N.test(e.charAt(ne))
                                ? ((o = e.charAt(ne)), ne++)
                                : ((o = i), pe(O));
                        else r = i;
                        if (r !== i)
                          if (
                            (46 === e.charCodeAt(ne)
                              ? ((o = "."), ne++)
                              : ((o = i), pe(M)),
                            o !== i)
                          ) {
                            for (
                              a = [],
                                N.test(e.charAt(ne))
                                  ? ((s = e.charAt(ne)), ne++)
                                  : ((s = i), pe(O));
                              s !== i;

                            )
                              a.push(s),
                                N.test(e.charAt(ne))
                                  ? ((s = e.charAt(ne)), ne++)
                                  : ((s = i), pe(O));
                            a !== i ? (n = r = [r, o, a]) : ((ne = n), (n = i));
                          } else (ne = n), (n = i);
                        else (ne = n), (n = i);
                      }
                      n !== i && ((re = t), (n = L()));
                      return (t = n);
                    })()) === i &&
                      (n = (function () {
                        var t, n, r, o;
                        (t = ne),
                          45 === e.charCodeAt(ne)
                            ? ((n = "-"), ne++)
                            : ((n = i), pe(c));
                        n === i && (n = null);
                        if (n !== i) {
                          if (
                            ((r = []),
                            N.test(e.charAt(ne))
                              ? ((o = e.charAt(ne)), ne++)
                              : ((o = i), pe(O)),
                            o !== i)
                          )
                            for (; o !== i; )
                              r.push(o),
                                N.test(e.charAt(ne))
                                  ? ((o = e.charAt(ne)), ne++)
                                  : ((o = i), pe(O));
                          else r = i;
                          r !== i
                            ? ((re = t), (n = L()), (t = n))
                            : ((ne = t), (t = i));
                        } else (ne = t), (t = i);
                        return t;
                      })()) === i &&
                      (n = (function () {
                        var t, n;
                        (t = ne),
                          "true" === e.substr(ne, 4)
                            ? ((n = "true"), (ne += 4))
                            : ((n = i), pe(I));
                        n !== i && ((re = t), (n = !0));
                        (t = n) === i &&
                          ((t = ne),
                          "false" === e.substr(ne, 5)
                            ? ((n = "false"), (ne += 5))
                            : ((n = i), pe(D)),
                          n !== i && ((re = t), (n = !1)),
                          (t = n));
                        return t;
                      })()) === i &&
                      (n = (function () {
                        var t, n, r, o;
                        (t = ne),
                          39 === e.charCodeAt(ne)
                            ? ((n = "'"), ne++)
                            : ((n = i), pe(W));
                        n !== i
                          ? (e.length > ne
                              ? ((r = e.charAt(ne)), ne++)
                              : ((r = i), pe(F)),
                            r !== i
                              ? (39 === e.charCodeAt(ne)
                                  ? ((o = "'"), ne++)
                                  : ((o = i), pe(W)),
                                o !== i
                                  ? ((re = t), (n = L()), (t = n))
                                  : ((ne = t), (t = i)))
                              : ((ne = t), (t = i)))
                          : ((ne = t), (t = i));
                        return t;
                      })()) === i &&
                      (n = (function () {
                        var t, n;
                        (t = ne),
                          "null" === e.substr(ne, 4)
                            ? ((n = "null"), (ne += 4))
                            : ((n = i), pe(_));
                        n !== i && ((re = t), (n = null));
                        return (t = n);
                      })()) === i &&
                      (n = Me());
                  n !== i && ((re = t), (n = { val: n }));
                  return (t = n);
                })()),
              t
            );
          }
          function Ee() {
            var e, t, n, r, o, a, l, c, f;
            for (e = ne, t = [], n = Fe(); n !== i; ) t.push(n), (n = Fe());
            if (t !== i)
              if ((n = We()) !== i)
                if ((r = Ie()) !== i)
                  if (We() !== i) {
                    for (o = [], a = Fe(); a !== i; ) o.push(a), (a = Fe());
                    if (o !== i)
                      if ((a = We()) !== i)
                        if (
                          (l = (function () {
                            var e, t;
                            (e = ne),
                              (t = (function () {
                                var e, t, n, r, o, a;
                                if (((e = ne), (t = Te()) !== i)) {
                                  for (
                                    n = [],
                                      r = ne,
                                      (o = _e()) !== i && (a = Te()) !== i
                                        ? ((re = r), (o = s(0, a)), (r = o))
                                        : ((ne = r), (r = i));
                                    r !== i;

                                  )
                                    n.push(r),
                                      (r = ne),
                                      (o = _e()) !== i && (a = Te()) !== i
                                        ? ((re = r), (o = s(0, a)), (r = o))
                                        : ((ne = r), (r = i));
                                  n !== i
                                    ? ((re = e), (t = u(t, n)), (e = t))
                                    : ((ne = e), (e = i));
                                } else (ne = e), (e = i);
                                return e;
                              })()) === i && (t = null);
                            t !== i && ((re = e), (t = t || []));
                            return (e = t);
                          })()) !== i
                        )
                          if (We() !== i) {
                            for (c = [], f = Fe(); f !== i; )
                              c.push(f), (f = Fe());
                            c !== i
                              ? ((re = e), (e = t = { object: r, fields: l }))
                              : ((ne = e), (e = i));
                          } else (ne = e), (e = i);
                        else (ne = e), (e = i);
                      else (ne = e), (e = i);
                    else (ne = e), (e = i);
                  } else (ne = e), (e = i);
                else (ne = e), (e = i);
              else (ne = e), (e = i);
            else (ne = e), (e = i);
            return e;
          }
          function Te() {
            var t;
            return (
              (t = Ae()) === i &&
                (t = (function () {
                  var t, n, r, o;
                  (t = ne),
                    (n = Se()) !== i && We() !== i
                      ? (58 === e.charCodeAt(ne)
                          ? ((r = ":"), ne++)
                          : ((r = i), pe(k)),
                        r !== i && We() !== i && (o = Se()) !== i
                          ? ((re = t), (t = n = { array: [n, o], inside: !0 }))
                          : ((ne = t), (t = i)))
                      : ((ne = t), (t = i));
                  return t;
                })()) === i &&
                (t = je()),
              t
            );
          }
          function Ne() {
            var t, n, r, o;
            return (
              (t = ne),
              (n = ne),
              (r = Oe()) === i && (r = null),
              r !== i
                ? (35 === e.charCodeAt(ne)
                    ? ((o = "#"), ne++)
                    : ((o = i), pe(q)),
                  o !== i ? (n = r = [r, o]) : ((ne = n), (n = i)))
                : ((ne = n), (n = i)),
              n === i && (n = null),
              n !== i && (r = Oe()) !== i
                ? ((re = t), (t = n = { ref: se().replace(/\`/g, "") }))
                : ((ne = t), (t = i)),
              t
            );
          }
          function Oe() {
            var t;
            return (
              (t = (function () {
                var t, n;
                (t = []),
                  B.test(e.charAt(ne))
                    ? ((n = e.charAt(ne)), ne++)
                    : ((n = i), pe(z));
                if (n !== i)
                  for (; n !== i; )
                    t.push(n),
                      B.test(e.charAt(ne))
                        ? ((n = e.charAt(ne)), ne++)
                        : ((n = i), pe(z));
                else t = i;
                return t;
              })()) === i && (t = Me()),
              t
            );
          }
          function Me() {
            var t, n, r, o, a, s;
            if (
              ((t = ne),
              96 === e.charCodeAt(ne) ? ((n = "`"), ne++) : ((n = i), pe(H)),
              n !== i)
            )
              if (Le() !== i) {
                for (
                  r = [],
                    o = ne,
                    (a = We()) !== i && (s = Le()) !== i
                      ? (o = a = [a, s])
                      : ((ne = o), (o = i));
                  o !== i;

                )
                  r.push(o),
                    (o = ne),
                    (a = We()) !== i && (s = Le()) !== i
                      ? (o = a = [a, s])
                      : ((ne = o), (o = i));
                r !== i
                  ? (96 === e.charCodeAt(ne)
                      ? ((o = "`"), ne++)
                      : ((o = i), pe(H)),
                    o !== i ? ((re = t), (t = n = R())) : ((ne = t), (t = i)))
                  : ((ne = t), (t = i));
              } else (ne = t), (t = i);
            else (ne = t), (t = i);
            return t;
          }
          function Le() {
            var t, n;
            if (
              ((t = []),
              U.test(e.charAt(ne))
                ? ((n = e.charAt(ne)), ne++)
                : ((n = i), pe($)),
              n !== i)
            )
              for (; n !== i; )
                t.push(n),
                  U.test(e.charAt(ne))
                    ? ((n = e.charAt(ne)), ne++)
                    : ((n = i), pe($));
            else t = i;
            return t;
          }
          function Ie() {
            var t, n, r;
            return (
              (t = ne),
              Oe() !== i
                ? ((n = (function () {
                    var t, n, r, o, a, s, u;
                    (t = ne),
                      60 === e.charCodeAt(ne)
                        ? ((n = "<"), ne++)
                        : ((n = i), pe(Y));
                    if (n !== i)
                      if ((r = Ie()) !== i) {
                        for (
                          o = [],
                            a = ne,
                            44 === e.charCodeAt(ne)
                              ? ((s = ","), ne++)
                              : ((s = i), pe(G)),
                            s !== i && (u = Ie()) !== i
                              ? (a = s = [s, u])
                              : ((ne = a), (a = i));
                          a !== i;

                        )
                          o.push(a),
                            (a = ne),
                            44 === e.charCodeAt(ne)
                              ? ((s = ","), ne++)
                              : ((s = i), pe(G)),
                            s !== i && (u = Ie()) !== i
                              ? (a = s = [s, u])
                              : ((ne = a), (a = i));
                        o !== i
                          ? (62 === e.charCodeAt(ne)
                              ? ((a = ">"), ne++)
                              : ((a = i), pe(m)),
                            a !== i
                              ? (t = n = [n, r, o, a])
                              : ((ne = t), (t = i)))
                          : ((ne = t), (t = i));
                      } else (ne = t), (t = i);
                    else (ne = t), (t = i);
                    return t;
                  })()) === i && (n = null),
                  n !== i
                    ? ((r = (function () {
                        var t;
                        "[]" === e.substr(ne, 2)
                          ? ((t = "[]"), (ne += 2))
                          : ((t = i), pe(V));
                        return t;
                      })()) === i && (r = null),
                      r !== i ? ((re = t), (t = R())) : ((ne = t), (t = i)))
                    : ((ne = t), (t = i)))
                : ((ne = t), (t = i)),
              t
            );
          }
          function De() {
            var t, n, r, o;
            if (
              ((t = ne),
              "//" === e.substr(ne, 2)
                ? ((n = "//"), (ne += 2))
                : ((n = i), pe(X)),
              n !== i)
            ) {
              for (
                r = [],
                  J.test(e.charAt(ne))
                    ? ((o = e.charAt(ne)), ne++)
                    : ((o = i), pe(K));
                o !== i;

              )
                r.push(o),
                  J.test(e.charAt(ne))
                    ? ((o = e.charAt(ne)), ne++)
                    : ((o = i), pe(K));
              r !== i ? (t = n = [n, r]) : ((ne = t), (t = i));
            } else (ne = t), (t = i);
            return t;
          }
          function We() {
            var t, n;
            for (
              t = [],
                Q.test(e.charAt(ne))
                  ? ((n = e.charAt(ne)), ne++)
                  : ((n = i), pe(Z));
              n !== i;

            )
              t.push(n),
                Q.test(e.charAt(ne))
                  ? ((n = e.charAt(ne)), ne++)
                  : ((n = i), pe(Z));
            return t;
          }
          function Fe() {
            var t, n, r, o, a;
            if (((t = ne), (n = We()) !== i))
              if (((r = De()) === i && (r = null), r !== i)) {
                if (
                  ((o = []),
                  ee.test(e.charAt(ne))
                    ? ((a = e.charAt(ne)), ne++)
                    : ((a = i), pe(te)),
                  a !== i)
                )
                  for (; a !== i; )
                    o.push(a),
                      ee.test(e.charAt(ne))
                        ? ((a = e.charAt(ne)), ne++)
                        : ((a = i), pe(te));
                else o = i;
                o !== i && (a = We()) !== i
                  ? (t = n = [n, r, o, a])
                  : ((ne = t), (t = i));
              } else (ne = t), (t = i);
            else (ne = t), (t = i);
            return t;
          }
          function _e() {
            var t, n, r, o, a, s;
            if (((t = ne), (n = We()) !== i)) {
              if (
                (44 === e.charCodeAt(ne) ? ((r = ","), ne++) : ((r = i), pe(G)),
                r === i)
              )
                for (r = [], o = Fe(); o !== i; ) r.push(o), (o = Fe());
              if (r !== i)
                if ((o = We()) !== i) {
                  for (a = [], s = Fe(); s !== i; ) a.push(s), (s = Fe());
                  a !== i ? (t = n = [n, r, o, a]) : ((ne = t), (t = i));
                } else (ne = t), (t = i);
              else (ne = t), (t = i);
            } else (ne = t), (t = i);
            return t;
          }
          function Pe() {
            return Object.assign({}, ...arguments);
          }
          if ((n = a()) !== i && ne === e.length) return n;
          throw (
            (n !== i && ne < e.length && pe({ type: "end" }),
            de(
              ae,
              oe < e.length ? e.charAt(oe) : null,
              oe < e.length ? fe(oe, oe + 1) : fe(oe, oe)
            ))
          );
        },
      });
  },
  function (e, t, n) {
    "use strict";
    function r(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function i(e, t) {
      var n = document.createElementNS("http://www.w3.org/2000/svg", e);
      return t && n.classList.add(t), n;
    }
    function o(e) {
      var t = i("svg", ["no-markdown"]),
        n = (Math.random() + 1).toString(36).substring(7);
      return (
        t.insertAdjacentHTML(
          "afterbegin",
          '\n    <defs>\n      <marker id="snap-arrowhead-' +
            n +
            '" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">\n        <path d="M0,8 L8,4 L0,0"/>\n      </marker>\n      <filter id="snap-double-' +
            n +
            '" x="-150%" y="-150%" width="300%" height="300%" filterUnits="userSpaceOnUse">\n        <feMorphology in="SourceGraphic" result="Doubled" operator="dilate" radius="1"/>\n        <feComposite in="SourceGraphic" in2="Doubled" result="Out" operator="xor"/>\n      </filter>\n    </defs>\n    <style>\n    rect.snap-obj { stroke: black; fill: none; }\n    path.snap-separator { stroke: black; fill: none; }\n    path.snap-container { stroke: black; fill: none; }\n    path.snap-arrow-' +
            n +
            " { stroke: black; fill: none; marker-end: url(#snap-arrowhead-" +
            n +
            "); }\n    path.snap-x { stroke: red; stroke-width: 2; fill: none }\n    #snap-arrowhead-" +
            n +
            " { stroke: black; fill: none; }\n    .snap-immutable-" +
            n +
            " { filter: url(#snap-double-" +
            n +
            "); }\n    text.object { font-family: sans-serif; font-size: 10pt; text-anchor: middle; transform: translateY(1.5ex); }\n    text.func { font-family: sans-serif; font-size: 10pt; text-anchor: middle; transform: translateY(1.5ex); }\n    text.value { font-family: sans-serif; font-size: 12pt; text-anchor: start; transform: translateY(1.5ex); }\n    text.assignmentval { font-family: sans-serif; font-size: 12pt; }\n    </style>\n  "
        ),
        e && e(n),
        t
      );
    }
    var a,
      s = o(),
      u =
        ((a = 0),
        function (e) {
          return "" + e + a++;
        }),
      l = [];
    function c(e) {
      var t = {
        id: "heap",
        children: [],
        edges: [],
        layoutOptions: {
          "elk.layered.crossingMinimization.semiInteractive": !0,
        },
      };
      return (
        e.forEach(function (e) {
          return p(e, t);
        }),
        t
      );
    }
    function f(e) {
      var t = {
        id: "stack",
        children: [],
        roughEdges: [],
        layoutOptions: {
          "elk.layered.crossingMinimization.semiInteractive": !0,
        },
      };
      return (
        e.forEach(function (e) {
          return p(e, t);
        }),
        t
      );
    }
    function p(e, t) {
      var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        r = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
        i = 20;
      if (e.name) {
        var o = e.name.ref && e.name.ref.startsWith("#");
        if (e.name.ref && o && !n) return;
        var a = Object.assign(
          {
            id: e.source,
            labels: o || !e.independent ? [] : h(e.name.ref, e.val, r),
          },
          e
        );
        if (
          (a.layoutOptions || (a.layoutOptions = {}),
          (a.layoutOptions = Object.assign(
            {
              "elk.nodeLabels.placement": "INSIDE V_TOP H_CENTER",
              "elk.nodeSize.constraints": "MINIMUM_SIZE",
              "elk.position": "(" + i * e.id + ", 0)",
            },
            a.layoutOptions
          )),
          t.children.push(a),
          !e.erased)
        ) {
          var s = !0,
            l = !1,
            c = void 0;
          try {
            for (
              var f, d = a.target.to[Symbol.iterator]();
              !(s = (f = d.next()).done);
              s = !0
            ) {
              var g = f.value,
                m = Object.assign(
                  { id: u("edge"), sources: [a.source], targets: [g.id] },
                  e
                );
              r && !e.assignment
                ? t.edges.push(Object.assign(m, g.options))
                : r || t.roughEdges.push(Object.assign(m, g.options));
            }
          } catch (e) {
            (l = !0), (c = e);
          } finally {
            try {
              !s && d.return && d.return();
            } finally {
              if (l) throw c;
            }
          }
        }
      } else if (!e.erased) {
        if (e.object || e.func) {
          var y = h(e.object || e.func),
            v = Object.assign(
              {
                id: u("obj"),
                layoutOptions: {
                  "elk.nodeLabels.placement": "INSIDE V_TOP H_CENTER",
                  "elk.nodeSize.constraints": "NODE_LABELS MINIMUM_SIZE",
                  "elk.layered.crossingMinimization.semiInteractive": !0,
                  "elk.position": "(" + i * e.id + ", 0)",
                  "elk.layered.crossingMinimization.layerChoiceConstraint":
                    e.id,
                  "elk.layered.mergeEdges": !0,
                },
                labels: y,
                children: [],
                edges: [],
                roughEdges: [],
              },
              e
            );
          if (v.fields.length) {
            var b = Math.max.apply(
              null,
              y.map(function (e) {
                return e.width;
              })
            );
            Object.assign(v.layoutOptions, {
              "elk.nodeSize.minimum": e.func ? b + ",0" : "0," + b,
            });
          }
          return (
            t.children.push(v),
            void v.fields.forEach(function (t, n) {
              t.layoutOptions || (t.layoutOptions = {}),
                (t.layoutOptions = Object.assign(
                  { "elk.position": "(" + i * n + ", 0)" },
                  t.layoutOptions
                )),
                p(t, v, !0, !Boolean(e.func));
            })
          );
        }
        if (e.array) {
          var x = Object.assign(
            {
              id: u("arr"),
              layoutOptions: {
                "elk.layered.crossingMinimization.semiInteractive": !0,
                "elk.layered.mergeEdges": !0,
              },
              children: [],
              edges: [],
            },
            e
          );
          return (
            e.inside || t.children.push(x),
            void x.array.forEach(function (n, r) {
              n.layoutOptions || (n.layoutOptions = {}),
                e.inside
                  ? ((n.group = x.id),
                    (n.layoutOptions = Object.assign(
                      e.layoutOptions,
                      n.layoutOptions
                    )),
                    p(n, t, !0))
                  : ((n.layoutOptions = Object.assign(
                      { "elk.position": "(" + i * r + ", 0)" },
                      n.layoutOptions
                    )),
                    p(n, x, !0));
            })
          );
        }
        if (void 0 === e.val)
          throw new Error("Snapdown cannot incorporate: " + Object.keys(e));
        var w = h(e.val);
        t.children.push(
          Object.assign(
            {
              id: u("val"),
              layoutOptions: {
                "elk.nodeLabels.placement": "INSIDE V_TOP H_CENTER",
                "elk.position": "(" + i * e.id + ", 0)",
              },
              labels: w,
              width: Math.max(w[0].width, 30),
              height: w[0].height,
            },
            e
          )
        );
      }
    }
    function d(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : void 0,
        n = e.split("\n"),
        o = 0;
      t && (n.push(t), (o = 5));
      var a = n.map(function (e) {
        var n = i("text");
        (n.textContent = e), s.append(n);
        var r = n.getBoundingClientRect(),
          a = r.width,
          u = r.height;
        return s.removeChild(n), { width: t ? a + 2 * o : a, height: u };
      });
      return {
        width: Math.max.apply(
          Math,
          r(
            a.map(function (e) {
              return e.width;
            })
          )
        ),
        height: a.reduce(function (e, t) {
          return e + t.height;
        }, 0),
      };
    }
    function h(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : void 0,
        n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      if (void 0 === e) return [];
      var r = d((e = ("" + e).split("#")[0]), t, n),
        i = r.width,
        o = r.height;
      return [{ text: e, width: i, height: o }];
    }
    function g(e, t, n, r, o) {
      var a = i("g");
      if (
        (o.func && ((o.x = o.x - (n - o.width) / 2), (o.width = n)),
        a.setAttribute("transform", "translate(" + o.x + "," + o.y + ")"),
        o.object || o.array || o.func)
      ) {
        var s = i("rect", "snap-obj");
        if (
          (["width", "height"].forEach(function (e) {
            return s.setAttribute(e, o[e]);
          }),
          o.object && s.setAttribute("rx", 20),
          o.array)
        )
          for (var u = 1; u < o.children.length; u++)
            y(a, u * (o.width / o.children.length), o.height);
        o.immutable && s.classList.add("snap-immutable-" + t), a.append(s);
      }
      var l = o.object ? "object" : o.array ? "array" : o.func ? "func" : "";
      o.labels && o.labels.forEach(v.bind(null, a, o, r)),
        o.children && o.children.forEach(g.bind(null, a, t, n, r.concat([l])));
      var c = {},
        f = !0,
        p = !1,
        d = void 0;
      try {
        for (
          var h, x = (o.edges || [])[Symbol.iterator]();
          !(f = (h = x.next()).done);
          f = !0
        ) {
          var w = h.value;
          w.source in c
            ? ((w.isHyperedge = c[w.source].isHyperedge),
              (c[w.source].isHyperedge.count += 1))
            : ((w.isHyperedge = { count: 1 }), (c[w.source] = w));
        }
      } catch (e) {
        (p = !0), (d = e);
      } finally {
        try {
          !f && x.return && x.return();
        } finally {
          if (p) throw d;
        }
      }
      if (
        (o.edges && o.edges.forEach(b.bind(null, a, t)),
        o.children && o.children.length)
      ) {
        for (
          var A = o.children[0].group, k = 0, C = 0;
          C < o.children.length;
          C++
        )
          o.children[C].group != A &&
            (A &&
              m(
                a,
                o.children[k].x,
                o.children[C - 1].x,
                o.height,
                o.children[k]
              ),
            (A = o.children[C].group),
            (k = C));
        A &&
          k != o.children.length - 1 &&
          m(
            a,
            o.children[k].x,
            o.children[o.children.length - 1].x,
            o.height,
            o.children[k]
          );
      }
      e.append(a);
    }
    function m(e, t, n, r, o) {
      var a = o.width,
        s = o.height,
        u = i("path", "snap-container"),
        l = r - (3 * s) / 2,
        c = r - s / 2,
        f = t,
        p = n + a;
      u.setAttribute(
        "d",
        "M " +
          f +
          " " +
          l +
          " L " +
          f +
          " " +
          c +
          " L " +
          p +
          " " +
          c +
          " L " +
          p +
          " " +
          l +
          " L " +
          f +
          " " +
          l
      ),
        e.append(u);
    }
    function y(e, t, n) {
      var r = i("path", "snap-separator");
      r.setAttribute("d", "M " + t + " 0 L " + t + " " + n), e.append(r);
    }
    function v(e, t, n, r) {
      var o = i("text");
      ["x", "y"].forEach(function (e) {
        return o.setAttribute(e, r[e]);
      });
      var a = r.text.split("#")[0];
      if (t.source && !n.includes("func")) {
        s.append(o), (o.textContent = a), o.classList.add("value");
        var u = o.getBoundingClientRect();
        if ((s.removeChild(o), e.append(o), t.assignment && t.val)) {
          var l = i("rect", "snap-obj"),
            c = i("text");
          c.classList.add("assignmentval"),
            (c.textContent = t.val),
            s.append(c),
            c.setAttribute("y", t.height + c.getBoundingClientRect().height);
          var f = c.getBoundingClientRect(),
            p = Math.min(f.left, u.left),
            d =
              (Math.max(f.right, u.right), p + Math.max(f.width, u.width) / 2);
          c.setAttribute("x", d - f.width / 2 + 5),
            o.setAttribute("x", d - u.width / 2 + 5);
          l.setAttribute("width", f.width + 10),
            l.setAttribute("height", f.height + 5),
            l.setAttribute("x", c.getAttribute("x") - 5),
            l.setAttribute("y", t.height),
            s.removeChild(c),
            e.append(c),
            e.append(l);
        }
      } else if (t.object)
        o.classList.add("object"),
          o.setAttribute("x", t.width / 2),
          (o.textContent = a);
      else if (t.func)
        o.classList.add("func"),
          o.setAttribute("x", t.width / 2),
          (o.textContent = a);
      else {
        o.classList.add("value");
        var h = a.split("\n"),
          g = 0,
          m = !0,
          y = !1,
          v = void 0;
        try {
          for (
            var b, x = h[Symbol.iterator]();
            !(m = (b = x.next()).done);
            m = !0
          ) {
            var w = b.value,
              A = i("tspan");
            s.append(o),
              (A.textContent = w),
              A.setAttribute("x", r.x),
              A.setAttribute("dy", g),
              o.append(A),
              s.removeChild(o);
            var k = i("text");
            (k.textContent = w),
              s.append(k),
              (g = k.getBoundingClientRect().height),
              s.removeChild(k);
          }
        } catch (e) {
          (y = !0), (v = e);
        } finally {
          try {
            !m && x.return && x.return();
          } finally {
            if (y) throw v;
          }
        }
      }
      e.append(o);
    }
    function b(e, t, n) {
      var r = i("path", "snap-arrow-" + t);
      n.immutable && r.classList.add("snap-immutable-" + t),
        r.setAttribute(
          "d",
          n.sections
            .map(function (e) {
              var t = ["M " + e.startPoint.x + " " + e.startPoint.y],
                n = Array.from(e.bendPoints || []);
              n.push(e.endPoint);
              for (
                var r = function (e) {
                    var r = n.length - e;
                    if (r > 3) {
                      var o = [0, 1, 2].map(function (t) {
                        return n[e + t].x + " " + n[e + t].y;
                      });
                      t.push("C " + o.join(" ")), (e += 3);
                    } else if (r > 2) {
                      var a = [0, 1].map(function (t) {
                        return n[e + t].x + " " + n[e + t].y;
                      });
                      t.push("Q " + a.join(" ")), (e += 2);
                    } else t.push("L " + n[e].x + " " + n[e].y), (e += 1);
                    i = e;
                  },
                  i = 0;
                i < n.length;

              )
                r(i);
              return t.join(" ");
            })
            .join(" ")
        ),
        e.append(r),
        n.crossed && x(e, r);
    }
    function x(e, t) {
      var n = t.getPointAtLength(t.getTotalLength() / 2),
        o = i("path", "snap-x"),
        a = ["M", "L", "M", "L"],
        s = [-5, 5, -5, 5],
        u = [-5, 5, 5, -5];
      o.setAttribute(
        "d",
        [].concat
          .apply(
            [],
            [].concat(r(Array(4).keys())).map(function (e) {
              return [a[e], n.x + s[e], n.y + u[e]];
            })
          )
          .join(" ")
      ),
        e.append(o);
    }
    e.exports = {
      drawable: function (e) {
        document.body.append(s), (l = []);
        var t = !0,
          n = !1,
          r = void 0;
        try {
          for (
            var i, o = e.stack[Symbol.iterator]();
            !(t = (i = o.next()).done);
            t = !0
          ) {
            var a = i.value;
            if (a.fields) {
              var u = !0,
                p = !1,
                d = void 0;
              try {
                for (
                  var h, g = a.fields[Symbol.iterator]();
                  !(u = (h = g.next()).done);
                  u = !0
                ) {
                  var m = h.value.target || { to: [] },
                    y = !0,
                    v = !1,
                    b = void 0;
                  try {
                    for (
                      var x, w = m.to[Symbol.iterator]();
                      !(y = (x = w.next()).done);
                      y = !0
                    ) {
                      var A = x.value;
                      l.push(A.id);
                    }
                  } catch (e) {
                    (v = !0), (b = e);
                  } finally {
                    try {
                      !y && w.return && w.return();
                    } finally {
                      if (v) throw b;
                    }
                  }
                }
              } catch (e) {
                (p = !0), (d = e);
              } finally {
                try {
                  !u && g.return && g.return();
                } finally {
                  if (p) throw d;
                }
              }
            }
          }
        } catch (e) {
          (n = !0), (r = e);
        } finally {
          try {
            !t && o.return && o.return();
          } finally {
            if (n) throw r;
          }
        }
        var k = [
          {
            id: "diagram",
            layoutOptions: {
              "elk.algorithm": "layered",
              "elk.direction": "DOWN",
              "elk.edgeRouting": "POLYLINE",
              "elk.hierarchyHandling": "INCLUDE_CHILDREN",
              "elk.layered.crossingMinimization.semiInteractive": !0,
            },
            children: [c(e.heap)],
          },
          {
            id: "stackDiagram",
            layoutOptions: {
              "elk.algorithm": "layered",
              "elk.direction": "RIGHT",
              "elk.edgeRouting": "POLYLINE",
              "elk.hierarchyHandling": "INCLUDE_CHILDREN",
              "elk.layered.crossingMinimization.semiInteractive": !0,
            },
            children: [f(e.stack)],
          },
        ];
        return document.body.removeChild(s), k;
      },
      draw: function (e, t, n) {
        var i = void 0,
          a = o(function (e) {
            i = e;
          });
        (a.id = n),
          e.parentNode.insertBefore(a, e.nextSibling),
          ["width", "height"].forEach(function (e) {
            return a.setAttribute(e, t[e]);
          }),
          document.body.append(s);
        var u = (function e(t) {
          return t.func
            ? t.width
            : t.children && t.children.length
            ? Math.max.apply(
                Math,
                r(
                  t.children.map(function (t) {
                    return e(t);
                  })
                )
              )
            : 0;
        })(t);
        return (
          t.children.forEach(g.bind(null, a, i, u, [])),
          document.body.removeChild(s),
          a
        );
      },
      createSVG: i,
      createSVGRoot: o,
      addCross: x,
    };
  },
  function (e, t, n) {
    "use strict";
    var r = n(18).examples,
      i =
        '\n<style>\n@keyframes slidein {\n  from {\n    left: 100%;\n    width: 30%; \n  }\n\n  to {\n    left: 70%;\n    width: 30%;\n  }\n}\n\n@keyframes slideout {\n  from {\n    left: 70%;\n    width: 30%; \n  }\n\n  to {\n    left: 100%;\n    width: 30%;\n  }\n}\n\n.sidenav {\n  height: 100%; /* 100% Full-height */\n  width: 30%; /* 30% width */\n  position: fixed; /* Stay in place */\n  z-index: 1; /* Stay on top */\n  top: 0; /* Stay at the top */\n  left: 70%;\n  background-color: #EFEFEF;\n  overflow-x: hidden; /* Disable horizontal scroll */\n  animation-duration: 1s;\n  animation-name: slidein;\n}\n\n.hidenav {\n  height: 100%; /* 100% Full-height */\n  width: 30%; /* 30% width */\n  position: fixed; /* Stay in place */\n  z-index: 1; /* Stay on top */\n  top: 0; /* Stay at the top */\n  left: 100%;\n  background-color: #EFEFEF;\n  overflow-x: hidden; /* Disable horizontal scroll */\n  animation-duration: 1s;\n  animation-name: slideout;\n}\n\n.hidden {\n  display: none;\n}\n</style>\n\n<div id="snapdownHelp" class="hidden">\n<div style="width: 100%; position: fixed; padding: 20px; z-index: 2; background-color: #DFDFDF;">\n<a href="#" onclick="Snapdown.hideHelp(); return false;"><b>&gt; hide Snapdown help</b></a>\n</div>\n<br />\n<br />\n<div style="padding: 20px;">\n<br />\nSnapdown is a language for <b>drawing</b> snapshot diagrams.\n<br />\n<br />\nClick on the links below to see examples of Snapdown in action!\n<br />\nIn each example, you\'ll see a snippet of Snapdown syntax and the corresponding diagram side-by-side.\n<br />\n<br />\n' +
        Object.keys(r)
          .map(function (e) {
            return (
              '\n<div>\n<a href="#" onclick="Snapdown.showExample(\'' +
              e +
              "'); return false;\">" +
              r[e].name +
              '</a>\n<div id="' +
              e +
              '-helptext" style="display: inline-block;">(click to expand)</div>\n<div id="' +
              e +
              '-content" style="display: none;">\n<div>' +
              r[e].explanation +
              '</div>\n<br />\n<table style="width:100%"><tr><td width="50%">\n<span style=\'width: 50%; font-family: monospace; font-size: 12px;\'>' +
              r[e].snapdown.replace(/(?:\r\n|\r|\n)/g, "<br />") +
              '</span>\n</td><td>\n<script type="application/snapdown" id="example2" class="no-markdown" percentSize="' +
              r[e].percentSize +
              '">\n' +
              r[e].snapdown +
              "\n</script>\n</td>\n</tr>\n</table>\n</div>\n</div>\n"
            );
          })
          .join("<br />") +
        "\n</div>\n";
    e.exports = { sidebarHTML: i };
  },
  function (e, t, n) {
    "use strict";
    e.exports = {
      examples: {
        primitives: {
          name: "Primitives",
          snapdown: 'i -> 5\ns -> "abc"',
          explanation:
            'In this example, we have two variables:                   <tt>i</tt> points to the value <tt>5</tt>, and <tt>s</tt> points to the value <tt>"abc"</tt>.',
          percentSize: "100",
        },
        objects: {
          name: "Objects",
          snapdown: 'f -> (MyFloat 5.0)\ns -> (MyString "abc")',
          explanation:
            'In this example, <tt>f</tt> points to a <tt>MyFloat</tt> object with the value <tt>5.0</tt>,                   <tt>s</tt> points to a <tt>MyString</tt> object with the value <tt>"abc"</tt>.',
          percentSize: "80",
        },
        fields: {
          name: "Fields",
          snapdown:
            "lst -> (\nArrayList\n0 -> 1000\n1 -> 2000\n2 -> 3000\nlength -> 3\n)",
          explanation:
            "Here we have a variable <tt>lst</tt> pointing to an <tt>ArrayList</tt> with three fields representing the elements,                   and a fourth field representing the length.                   (Note that Java, or another programming language, may not actually represent the list this way --                   Snapdown is purely a drawing tool that can get us any representation we wish.)",
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
            "In this example, we have a <tt>MyLine</tt> with three fields. The <tt>start</tt> and <tt>end</tt> fields                   are best expressed as pairs of numbers. We can use backticks `` to display the text                   <tt>(10, 10)</tt> verbatim. We can represent the <tt>GREEN</tt> color in a similar fashion.",
          percentSize: "100",
        },
        mapfields: {
          name: "Map fields",
          snapdown:
            's -> (String "value")\nm -> (\nHashMap\n(String "key") <-> s\n)\nm2 -> (\nHashMap\n(String "otherKey") <-> s\n)',
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
            "In this example, the variable <tt>t</tt> is an alias of <tt>s</tt>, and <tt>season2</tt> is an                   (immutable) alias of the <tt>season</tt> field of <tt>s</tt>.",
          percentSize: "80",
        },
        unnamed: {
          name: "Unnamed references",
          snapdown:
            '#sem -> (\nSemester\nseason -> ((String "Fall"))\nyear -> 2020\n)\nc1 -> (\nCourse\n`...`\nsemester -> #sem\n)\nc2 -> (\nCourse\n`...`\nsemester -> #sem\n)',
          explanation:
            "References are considered unnamed if they start with a hash symbol, <tt>#</tt>. In this example,                   the <tt>#sem</tt> name is never actually drawn in the diagram, but we can use it                   inside the two <tt>Course</tt> objects to avoid deeper nesting, and to avoid repeating                   the same <tt>Semester</tt> object twice.",
          percentSize: "70",
        },
        reassignments: {
          name: "Reassignments",
          snapdown:
            "a -x> (\nMyClass\nb -x> ((MyImmutableClass))\n)\na -> 5\nb => (MyOtherClass)",
          explanation:
            "Use an <tt>x</tt> in the middle of an arrow to indicate that an arrow should be crossed out.                   Arrows are typically crossed out to indicate reassignment.",
          percentSize: "70",
        },
      },
    };
  },
  function (e, t, n) {
    "use strict";
    var r = function (e, t) {
      if (Array.isArray(e)) return e;
      if (Symbol.iterator in Object(e))
        return (function (e, t) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (
              var a, s = e[Symbol.iterator]();
              !(r = (a = s.next()).done) &&
              (n.push(a.value), !t || n.length !== t);
              r = !0
            );
          } catch (e) {
            (i = !0), (o = e);
          } finally {
            try {
              !r && s.return && s.return();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        })(e, t);
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    };
    function i(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    var o = n(20);
    function a(e, t, n, r) {
      return (
        (r[t] = (r[t] || 0) + 2),
        e.map(function (e) {
          return [5 * e[0], 5 * (e[1] + r[t] - 2)];
        })
      );
    }
    e.exports = {
      layoutRoughEdges: function (e) {
        var t = (function (e) {
            return {
              x: e[0].width + e[1].width,
              y: Math.max(e[0].height, e[1].height),
            };
          })(e),
          n = (function (e) {
            return { x: e[1].width, y: 0 };
          })(e),
          s = [],
          u = {};
        e.forEach(function (e) {
          var t = e.children[0],
            r = n;
          "stack" == t.id && (r = { x: 0, y: 0 }), (t.x = 0), (t.y = 0);
          var o = (function e(t, n, r) {
            var o = [],
              a = Object.assign({}, n);
            return t.children || t.edges
              ? (t.children &&
                  t.children.forEach(function (n) {
                    if (n.object || n.func) {
                      var s = {
                        type: n.object ? "node" : "func",
                        x: n.x + r.x,
                        y: n.y + r.y,
                        width: n.width,
                        height: n.height,
                        id: n.id,
                      };
                      o.push(s), (a[n.id] = s);
                    } else if (n.labels) {
                      var u = {},
                        l = [];
                      if (
                        (n.labels.forEach(function (e) {
                          (u = {
                            type: "label",
                            x: n.x + e.x + r.x,
                            y: n.y + e.y + r.y,
                            width: e.width,
                            height: e.height,
                            id: n.id,
                          }),
                            o.push(u),
                            l.push(u);
                        }),
                        t.id in a && "func" == a[t.id].type)
                      ) {
                        var c = a[t.id].labels || [];
                        a[t.id] = Object.assign(a[t.id], {
                          labels: c.concat(l),
                        });
                      }
                      a[n.id] = u;
                    } else if (n.x && n.y && n.width && n.height && n.id) {
                      var f = {
                        type: "other",
                        x: n.x + r.x,
                        y: n.y + r.y,
                        width: n.width,
                        height: n.height,
                        id: n.id,
                      };
                      a[n.id] = f;
                    }
                    var p = e(n, a, { x: n.x + r.x, y: n.y + r.y });
                    o.push.apply(o, i(p.obstacles)),
                      (a = Object.assign(a, p.objInfo));
                  }),
                t.edges &&
                  t.edges.forEach(function (e) {
                    o.push({
                      type: "edge",
                      sections: e.sections,
                      offset: r,
                      id: e.id,
                    });
                  }),
                { obstacles: o, objInfo: a })
              : { obstacles: o, objInfo: a };
          })(t, {}, r);
          s.push.apply(s, i(o.obstacles)), (u = Object.assign(u, o.objInfo));
        });
        var l = [],
          c = [];
        e.forEach(function (e) {
          var t = (function e(t, n) {
              var o = [],
                a = [];
              return t.children
                ? (t.roughEdges &&
                    t.roughEdges.forEach(function (e) {
                      if (e.source && e.target && e.target.to) {
                        var t = e.source;
                        a.push(t);
                        var r = e.target.to[0].id;
                        if (t in n && r in n) {
                          var i = n[t],
                            s = n[r];
                          o.push({
                            edge: [
                              Math.ceil((i.x + i.width) / 5 + 1),
                              Math.ceil(i.y / 5),
                              Math.floor(s.x / 5 - 1),
                              Math.floor((s.y + s.height / 2) / 5),
                            ],
                            source: [i.x + i.width, i.y + i.height / 2],
                            target: [s.x, s.y + s.height / 2],
                            sourceId: t,
                            targetId: r,
                            crossed: Boolean(e.crossed),
                          });
                        }
                      }
                    }),
                  t.children.forEach(function (t) {
                    var s = e(t, n),
                      u = r(s, 2),
                      l = u[0],
                      c = u[1];
                    o.push.apply(o, i(l)), a.push.apply(a, i(c));
                  }),
                  [o, a])
                : [o, a];
            })(e, u),
            n = r(t, 2),
            o = n[0],
            a = n[1];
          l.push.apply(l, i(o)), c.push.apply(c, i(a));
        });
        var f = (function (e, t, n, r) {
            var i = new o.Grid(Math.ceil(e.x / 5), Math.ceil(e.y / 5) + 5),
              a = {};
            return (
              t.forEach(function (t) {
                if ("node" == t.type || "func" == t.type || "label" == t.type) {
                  var r = "node" == t.type ? 10 : 0,
                    o = "node" == t.type ? 25 : 0,
                    s = t.x,
                    u = t.x + t.width,
                    l = Math.max(t.y - r, 0),
                    c = Math.min(t.y + t.height + o, e.y),
                    f = n[t.id].labels || [],
                    p = [],
                    d = {},
                    h = !0,
                    g = !1,
                    m = void 0;
                  try {
                    for (
                      var y, v = f[Symbol.iterator]();
                      !(h = (y = v.next()).done);
                      h = !0
                    ) {
                      var b = y.value,
                        x = Math.floor(b.y / 5);
                      p.push(x), (d[x] = b.id);
                    }
                  } catch (e) {
                    (g = !0), (m = e);
                  } finally {
                    try {
                      !h && v.return && v.return();
                    } finally {
                      if (g) throw m;
                    }
                  }
                  for (var w = s; w <= u; w += 5) {
                    var A = Math.floor(w / 5);
                    i.setWalkableAt(A, Math.ceil(l / 5), !1),
                      i.setWalkableAt(A, Math.floor(c / 5), !1);
                  }
                  for (var k = l; k <= c; k += 5) {
                    var C = Math.floor(k / 5);
                    i.setWalkableAt(Math.ceil(s / 5), C, !1),
                      p.includes(C) && (a[d[C]] = [Math.floor(u / 5), C]),
                      i.setWalkableAt(Math.floor(u / 5), C, !1);
                  }
                } else t.type;
              }),
              { grid: i, holeInfo: a }
            );
          })(t, s, u),
          p = f.grid,
          d = f.holeInfo,
          h = new o.AStarFinder({ allowDiagonal: !0 }),
          g = [],
          m = {};
        return (
          l.forEach(function (e) {
            var t = e.edge,
              n = e.source,
              r = (e.target, e.sourceId),
              s = d[r],
              u = p.clone();
            u.setWalkableAt(s[0], s[1], !0);
            var l = h.findPath.apply(h, i(t).concat([u]));
            g.push({
              path: a(o.Util.smoothenPath(u, l), n, 0, m),
              crossed: e.crossed,
            });
          }),
          g
        );
      },
    };
  },
  function (e, t, n) {
    e.exports = n(21);
  },
  function (e, t, n) {
    "use strict";
    e.exports = {
      Heap: n(3),
      Node: n(6),
      Grid: n(24),
      Util: n(1),
      DiagonalMovement: n(0),
      Heuristic: n(2),
      AStarFinder: n(7),
      BestFirstFinder: n(25),
      BreadthFirstFinder: n(26),
      DijkstraFinder: n(27),
      BiAStarFinder: n(8),
      BiBestFirstFinder: n(28),
      BiBreadthFirstFinder: n(29),
      BiDijkstraFinder: n(30),
      IDAStarFinder: n(31),
      JumpPointFinder: n(32),
    };
  },
  function (e, t, n) {
    (function (e) {
      (function () {
        var t, n, r, i, o, a, s, u, l, c, f, p, d, h, g;
        (r = Math.floor),
          (c = Math.min),
          (n = function (e, t) {
            return e < t ? -1 : e > t ? 1 : 0;
          }),
          (l = function (e, t, i, o, a) {
            var s;
            if ((null == i && (i = 0), null == a && (a = n), i < 0))
              throw new Error("lo must be non-negative");
            for (null == o && (o = e.length); i < o; )
              a(t, e[(s = r((i + o) / 2))]) < 0 ? (o = s) : (i = s + 1);
            return [].splice.apply(e, [i, i - i].concat(t)), t;
          }),
          (a = function (e, t, r) {
            return null == r && (r = n), e.push(t), h(e, 0, e.length - 1, r);
          }),
          (o = function (e, t) {
            var r, i;
            return (
              null == t && (t = n),
              (r = e.pop()),
              e.length ? ((i = e[0]), (e[0] = r), g(e, 0, t)) : (i = r),
              i
            );
          }),
          (u = function (e, t, r) {
            var i;
            return null == r && (r = n), (i = e[0]), (e[0] = t), g(e, 0, r), i;
          }),
          (s = function (e, t, r) {
            var i;
            return (
              null == r && (r = n),
              e.length &&
                r(e[0], t) < 0 &&
                ((t = (i = [e[0], t])[0]), (e[0] = i[1]), g(e, 0, r)),
              t
            );
          }),
          (i = function (e, t) {
            var i, o, a, s, u, l;
            for (
              null == t && (t = n),
                u = [],
                o = 0,
                a = (s = function () {
                  l = [];
                  for (
                    var t = 0, n = r(e.length / 2);
                    0 <= n ? t < n : t > n;
                    0 <= n ? t++ : t--
                  )
                    l.push(t);
                  return l;
                }
                  .apply(this)
                  .reverse()).length;
              o < a;
              o++
            )
              (i = s[o]), u.push(g(e, i, t));
            return u;
          }),
          (d = function (e, t, r) {
            var i;
            if ((null == r && (r = n), -1 !== (i = e.indexOf(t))))
              return h(e, 0, i, r), g(e, i, r);
          }),
          (f = function (e, t, r) {
            var o, a, u, l, c;
            if ((null == r && (r = n), !(a = e.slice(0, t)).length)) return a;
            for (i(a, r), u = 0, l = (c = e.slice(t)).length; u < l; u++)
              (o = c[u]), s(a, o, r);
            return a.sort(r).reverse();
          }),
          (p = function (e, t, r) {
            var a, s, u, f, p, d, h, g, m;
            if ((null == r && (r = n), 10 * t <= e.length)) {
              if (!(u = e.slice(0, t).sort(r)).length) return u;
              for (
                s = u[u.length - 1], f = 0, d = (h = e.slice(t)).length;
                f < d;
                f++
              )
                r((a = h[f]), s) < 0 &&
                  (l(u, a, 0, null, r), u.pop(), (s = u[u.length - 1]));
              return u;
            }
            for (
              i(e, r), m = [], p = 0, g = c(t, e.length);
              0 <= g ? p < g : p > g;
              0 <= g ? ++p : --p
            )
              m.push(o(e, r));
            return m;
          }),
          (h = function (e, t, r, i) {
            var o, a, s;
            for (
              null == i && (i = n), o = e[r];
              r > t && i(o, (a = e[(s = (r - 1) >> 1)])) < 0;

            )
              (e[r] = a), (r = s);
            return (e[r] = o);
          }),
          (g = function (e, t, r) {
            var i, o, a, s, u;
            for (
              null == r && (r = n),
                o = e.length,
                u = t,
                a = e[t],
                i = 2 * t + 1;
              i < o;

            )
              (s = i + 1) < o && !(r(e[i], e[s]) < 0) && (i = s),
                (e[t] = e[i]),
                (i = 2 * (t = i) + 1);
            return (e[t] = a), h(e, u, t, r);
          }),
          (t = (function () {
            function e(e) {
              (this.cmp = null != e ? e : n), (this.nodes = []);
            }
            return (
              (e.push = a),
              (e.pop = o),
              (e.replace = u),
              (e.pushpop = s),
              (e.heapify = i),
              (e.updateItem = d),
              (e.nlargest = f),
              (e.nsmallest = p),
              (e.prototype.push = function (e) {
                return a(this.nodes, e, this.cmp);
              }),
              (e.prototype.pop = function () {
                return o(this.nodes, this.cmp);
              }),
              (e.prototype.peek = function () {
                return this.nodes[0];
              }),
              (e.prototype.contains = function (e) {
                return -1 !== this.nodes.indexOf(e);
              }),
              (e.prototype.replace = function (e) {
                return u(this.nodes, e, this.cmp);
              }),
              (e.prototype.pushpop = function (e) {
                return s(this.nodes, e, this.cmp);
              }),
              (e.prototype.heapify = function () {
                return i(this.nodes, this.cmp);
              }),
              (e.prototype.updateItem = function (e) {
                return d(this.nodes, e, this.cmp);
              }),
              (e.prototype.clear = function () {
                return (this.nodes = []);
              }),
              (e.prototype.empty = function () {
                return 0 === this.nodes.length;
              }),
              (e.prototype.size = function () {
                return this.nodes.length;
              }),
              (e.prototype.clone = function () {
                var t;
                return ((t = new e()).nodes = this.nodes.slice(0)), t;
              }),
              (e.prototype.toArray = function () {
                return this.nodes.slice(0);
              }),
              (e.prototype.insert = e.prototype.push),
              (e.prototype.top = e.prototype.peek),
              (e.prototype.front = e.prototype.peek),
              (e.prototype.has = e.prototype.contains),
              (e.prototype.copy = e.prototype.clone),
              e
            );
          })()),
          (null !== e ? e.exports : void 0)
            ? (e.exports = t)
            : (window.Heap = t);
      }.call(this));
    }.call(this, n(23)(e)));
  },
  function (e, t) {
    e.exports = function (e) {
      return (
        e.webpackPolyfill ||
          ((e.deprecate = function () {}),
          (e.paths = []),
          e.children || (e.children = []),
          Object.defineProperty(e, "loaded", {
            enumerable: !0,
            get: function () {
              return e.l;
            },
          }),
          Object.defineProperty(e, "id", {
            enumerable: !0,
            get: function () {
              return e.i;
            },
          }),
          (e.webpackPolyfill = 1)),
        e
      );
    };
  },
  function (e, t, n) {
    "use strict";
    var r =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (e) {
              return typeof e;
            }
          : function (e) {
              return e &&
                "function" == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? "symbol"
                : typeof e;
            },
      i = n(6),
      o = n(0);
    function a(e, t, n) {
      var i;
      "object" !== (void 0 === e ? "undefined" : r(e))
        ? (i = e)
        : ((t = e.length), (i = e[0].length), (n = e)),
        (this.width = i),
        (this.height = t),
        (this.nodes = this._buildNodes(i, t, n));
    }
    (a.prototype._buildNodes = function (e, t, n) {
      var r,
        o,
        a = new Array(t);
      for (r = 0; r < t; ++r)
        for (a[r] = new Array(e), o = 0; o < e; ++o) a[r][o] = new i(o, r);
      if (void 0 === n) return a;
      if (n.length !== t || n[0].length !== e)
        throw new Error("Matrix size does not fit");
      for (r = 0; r < t; ++r)
        for (o = 0; o < e; ++o) n[r][o] && (a[r][o].walkable = !1);
      return a;
    }),
      (a.prototype.getNodeAt = function (e, t) {
        return this.nodes[t][e];
      }),
      (a.prototype.isWalkableAt = function (e, t) {
        return this.isInside(e, t) && this.nodes[t][e].walkable;
      }),
      (a.prototype.isInside = function (e, t) {
        return e >= 0 && e < this.width && t >= 0 && t < this.height;
      }),
      (a.prototype.setWalkableAt = function (e, t, n) {
        this.nodes[t][e].walkable = n;
      }),
      (a.prototype.getNeighbors = function (e, t) {
        var n = e.x,
          r = e.y,
          i = [],
          a = !1,
          s = !1,
          u = !1,
          l = !1,
          c = !1,
          f = !1,
          p = !1,
          d = !1,
          h = this.nodes;
        if (
          (this.isWalkableAt(n, r - 1) && (i.push(h[r - 1][n]), (a = !0)),
          this.isWalkableAt(n + 1, r) && (i.push(h[r][n + 1]), (u = !0)),
          this.isWalkableAt(n, r + 1) && (i.push(h[r + 1][n]), (c = !0)),
          this.isWalkableAt(n - 1, r) && (i.push(h[r][n - 1]), (p = !0)),
          t === o.Never)
        )
          return i;
        if (t === o.OnlyWhenNoObstacles)
          (s = p && a), (l = a && u), (f = u && c), (d = c && p);
        else if (t === o.IfAtMostOneObstacle)
          (s = p || a), (l = a || u), (f = u || c), (d = c || p);
        else {
          if (t !== o.Always)
            throw new Error("Incorrect value of diagonalMovement");
          (s = !0), (l = !0), (f = !0), (d = !0);
        }
        return (
          s && this.isWalkableAt(n - 1, r - 1) && i.push(h[r - 1][n - 1]),
          l && this.isWalkableAt(n + 1, r - 1) && i.push(h[r - 1][n + 1]),
          f && this.isWalkableAt(n + 1, r + 1) && i.push(h[r + 1][n + 1]),
          d && this.isWalkableAt(n - 1, r + 1) && i.push(h[r + 1][n - 1]),
          i
        );
      }),
      (a.prototype.clone = function () {
        var e,
          t,
          n = this.width,
          r = this.height,
          o = this.nodes,
          s = new a(n, r),
          u = new Array(r);
        for (e = 0; e < r; ++e)
          for (u[e] = new Array(n), t = 0; t < n; ++t)
            u[e][t] = new i(t, e, o[e][t].walkable);
        return (s.nodes = u), s;
      }),
      (e.exports = a);
  },
  function (e, t, n) {
    "use strict";
    var r = n(7);
    function i(e) {
      r.call(this, e);
      var t = this.heuristic;
      this.heuristic = function (e, n) {
        return 1e6 * t(e, n);
      };
    }
    (i.prototype = new r()), (i.prototype.constructor = i), (e.exports = i);
  },
  function (e, t, n) {
    "use strict";
    var r = n(1),
      i = n(0);
    function o(e) {
      (e = e || {}),
        (this.allowDiagonal = e.allowDiagonal),
        (this.dontCrossCorners = e.dontCrossCorners),
        (this.diagonalMovement = e.diagonalMovement),
        this.diagonalMovement ||
          (this.allowDiagonal
            ? this.dontCrossCorners
              ? (this.diagonalMovement = i.OnlyWhenNoObstacles)
              : (this.diagonalMovement = i.IfAtMostOneObstacle)
            : (this.diagonalMovement = i.Never));
    }
    (o.prototype.findPath = function (e, t, n, i, o) {
      var a,
        s,
        u,
        l,
        c,
        f = [],
        p = this.diagonalMovement,
        d = o.getNodeAt(e, t),
        h = o.getNodeAt(n, i);
      for (f.push(d), d.opened = !0; f.length; ) {
        if ((((u = f.shift()).closed = !0), u === h)) return r.backtrace(h);
        for (l = 0, c = (a = o.getNeighbors(u, p)).length; l < c; ++l)
          (s = a[l]).closed ||
            s.opened ||
            (f.push(s), (s.opened = !0), (s.parent = u));
      }
      return [];
    }),
      (e.exports = o);
  },
  function (e, t, n) {
    "use strict";
    var r = n(7);
    function i(e) {
      r.call(this, e),
        (this.heuristic = function (e, t) {
          return 0;
        });
    }
    (i.prototype = new r()), (i.prototype.constructor = i), (e.exports = i);
  },
  function (e, t, n) {
    "use strict";
    var r = n(8);
    function i(e) {
      r.call(this, e);
      var t = this.heuristic;
      this.heuristic = function (e, n) {
        return 1e6 * t(e, n);
      };
    }
    (i.prototype = new r()), (i.prototype.constructor = i), (e.exports = i);
  },
  function (e, t, n) {
    "use strict";
    var r = n(1),
      i = n(0);
    function o(e) {
      (e = e || {}),
        (this.allowDiagonal = e.allowDiagonal),
        (this.dontCrossCorners = e.dontCrossCorners),
        (this.diagonalMovement = e.diagonalMovement),
        this.diagonalMovement ||
          (this.allowDiagonal
            ? this.dontCrossCorners
              ? (this.diagonalMovement = i.OnlyWhenNoObstacles)
              : (this.diagonalMovement = i.IfAtMostOneObstacle)
            : (this.diagonalMovement = i.Never));
    }
    (o.prototype.findPath = function (e, t, n, i, o) {
      var a,
        s,
        u,
        l,
        c,
        f = o.getNodeAt(e, t),
        p = o.getNodeAt(n, i),
        d = [],
        h = [],
        g = this.diagonalMovement;
      for (
        d.push(f), f.opened = !0, f.by = 0, h.push(p), p.opened = !0, p.by = 1;
        d.length && h.length;

      ) {
        for (
          (u = d.shift()).closed = !0,
            l = 0,
            c = (a = o.getNeighbors(u, g)).length;
          l < c;
          ++l
        )
          if (!(s = a[l]).closed)
            if (s.opened) {
              if (1 === s.by) return r.biBacktrace(u, s);
            } else d.push(s), (s.parent = u), (s.opened = !0), (s.by = 0);
        for (
          (u = h.shift()).closed = !0,
            l = 0,
            c = (a = o.getNeighbors(u, g)).length;
          l < c;
          ++l
        )
          if (!(s = a[l]).closed)
            if (s.opened) {
              if (0 === s.by) return r.biBacktrace(s, u);
            } else h.push(s), (s.parent = u), (s.opened = !0), (s.by = 1);
      }
      return [];
    }),
      (e.exports = o);
  },
  function (e, t, n) {
    "use strict";
    var r = n(8);
    function i(e) {
      r.call(this, e),
        (this.heuristic = function (e, t) {
          return 0;
        });
    }
    (i.prototype = new r()), (i.prototype.constructor = i), (e.exports = i);
  },
  function (e, t, n) {
    "use strict";
    n(1);
    var r = n(2),
      i = n(6),
      o = n(0);
    function a(e) {
      (e = e || {}),
        (this.allowDiagonal = e.allowDiagonal),
        (this.dontCrossCorners = e.dontCrossCorners),
        (this.diagonalMovement = e.diagonalMovement),
        (this.heuristic = e.heuristic || r.manhattan),
        (this.weight = e.weight || 1),
        (this.trackRecursion = e.trackRecursion || !1),
        (this.timeLimit = e.timeLimit || 1 / 0),
        this.diagonalMovement ||
          (this.allowDiagonal
            ? this.dontCrossCorners
              ? (this.diagonalMovement = o.OnlyWhenNoObstacles)
              : (this.diagonalMovement = o.IfAtMostOneObstacle)
            : (this.diagonalMovement = o.Never)),
        this.diagonalMovement === o.Never
          ? (this.heuristic = e.heuristic || r.manhattan)
          : (this.heuristic = e.heuristic || r.octile);
    }
    (a.prototype.findPath = function (e, t, n, r, o) {
      var a,
        s,
        u,
        l = new Date().getTime(),
        c = function (e, t) {
          return this.heuristic(Math.abs(t.x - e.x), Math.abs(t.y - e.y));
        }.bind(this),
        f = function (e, t, n, r, a) {
          if (
            this.timeLimit > 0 &&
            new Date().getTime() - l > 1e3 * this.timeLimit
          )
            return 1 / 0;
          var s,
            u,
            p,
            h,
            g = t + c(e, d) * this.weight;
          if (g > n) return g;
          if (e == d) return (r[a] = [e.x, e.y]), e;
          var m,
            y,
            v = o.getNeighbors(e, this.diagonalMovement);
          for (p = 0, s = 1 / 0; (h = v[p]); ++p) {
            if (
              (this.trackRecursion &&
                ((h.retainCount = h.retainCount + 1 || 1),
                !0 !== h.tested && (h.tested = !0)),
              (u = f(
                h,
                t +
                  ((y = h), (m = e).x === y.x || m.y === y.y ? 1 : Math.SQRT2),
                n,
                r,
                a + 1
              )) instanceof i)
            )
              return (r[a] = [e.x, e.y]), u;
            this.trackRecursion && 0 == --h.retainCount && (h.tested = !1),
              u < s && (s = u);
          }
          return s;
        }.bind(this),
        p = o.getNodeAt(e, t),
        d = o.getNodeAt(n, r),
        h = c(p, d);
      for (a = 0; ; ++a) {
        if ((u = f(p, 0, h, (s = []), 0)) === 1 / 0) return [];
        if (u instanceof i) return s;
        h = u;
      }
      return [];
    }),
      (e.exports = a);
  },
  function (e, t, n) {
    "use strict";
    var r = n(0),
      i = n(33),
      o = n(34),
      a = n(35),
      s = n(36);
    e.exports = function (e) {
      return (e = e || {}).diagonalMovement === r.Never
        ? new i(e)
        : e.diagonalMovement === r.Always
        ? new o(e)
        : e.diagonalMovement === r.OnlyWhenNoObstacles
        ? new a(e)
        : new s(e);
    };
  },
  function (e, t, n) {
    "use strict";
    var r = n(4),
      i = n(0);
    function o(e) {
      r.call(this, e);
    }
    (o.prototype = new r()),
      (o.prototype.constructor = o),
      (o.prototype._jump = function (e, t, n, r) {
        var i = this.grid,
          o = e - n,
          a = t - r;
        if (!i.isWalkableAt(e, t)) return null;
        if (
          (!0 === this.trackJumpRecursion && (i.getNodeAt(e, t).tested = !0),
          i.getNodeAt(e, t) === this.endNode)
        )
          return [e, t];
        if (0 !== o) {
          if (
            (i.isWalkableAt(e, t - 1) && !i.isWalkableAt(e - o, t - 1)) ||
            (i.isWalkableAt(e, t + 1) && !i.isWalkableAt(e - o, t + 1))
          )
            return [e, t];
        } else {
          if (0 === a)
            throw new Error(
              "Only horizontal and vertical movements are allowed"
            );
          if (
            (i.isWalkableAt(e - 1, t) && !i.isWalkableAt(e - 1, t - a)) ||
            (i.isWalkableAt(e + 1, t) && !i.isWalkableAt(e + 1, t - a))
          )
            return [e, t];
          if (this._jump(e + 1, t, e, t) || this._jump(e - 1, t, e, t))
            return [e, t];
        }
        return this._jump(e + o, t + a, e, t);
      }),
      (o.prototype._findNeighbors = function (e) {
        var t,
          n,
          r,
          o,
          a,
          s,
          u,
          l,
          c = e.parent,
          f = e.x,
          p = e.y,
          d = this.grid,
          h = [];
        if (c)
          (t = c.x),
            (n = c.y),
            (r = (f - t) / Math.max(Math.abs(f - t), 1)),
            (o = (p - n) / Math.max(Math.abs(p - n), 1)),
            0 !== r
              ? (d.isWalkableAt(f, p - 1) && h.push([f, p - 1]),
                d.isWalkableAt(f, p + 1) && h.push([f, p + 1]),
                d.isWalkableAt(f + r, p) && h.push([f + r, p]))
              : 0 !== o &&
                (d.isWalkableAt(f - 1, p) && h.push([f - 1, p]),
                d.isWalkableAt(f + 1, p) && h.push([f + 1, p]),
                d.isWalkableAt(f, p + o) && h.push([f, p + o]));
        else
          for (u = 0, l = (a = d.getNeighbors(e, i.Never)).length; u < l; ++u)
            (s = a[u]), h.push([s.x, s.y]);
        return h;
      }),
      (e.exports = o);
  },
  function (e, t, n) {
    "use strict";
    var r = n(4),
      i = n(0);
    function o(e) {
      r.call(this, e);
    }
    (o.prototype = new r()),
      (o.prototype.constructor = o),
      (o.prototype._jump = function (e, t, n, r) {
        var i = this.grid,
          o = e - n,
          a = t - r;
        if (!i.isWalkableAt(e, t)) return null;
        if (
          (!0 === this.trackJumpRecursion && (i.getNodeAt(e, t).tested = !0),
          i.getNodeAt(e, t) === this.endNode)
        )
          return [e, t];
        if (0 !== o && 0 !== a) {
          if (
            (i.isWalkableAt(e - o, t + a) && !i.isWalkableAt(e - o, t)) ||
            (i.isWalkableAt(e + o, t - a) && !i.isWalkableAt(e, t - a))
          )
            return [e, t];
          if (this._jump(e + o, t, e, t) || this._jump(e, t + a, e, t))
            return [e, t];
        } else if (0 !== o) {
          if (
            (i.isWalkableAt(e + o, t + 1) && !i.isWalkableAt(e, t + 1)) ||
            (i.isWalkableAt(e + o, t - 1) && !i.isWalkableAt(e, t - 1))
          )
            return [e, t];
        } else if (
          (i.isWalkableAt(e + 1, t + a) && !i.isWalkableAt(e + 1, t)) ||
          (i.isWalkableAt(e - 1, t + a) && !i.isWalkableAt(e - 1, t))
        )
          return [e, t];
        return this._jump(e + o, t + a, e, t);
      }),
      (o.prototype._findNeighbors = function (e) {
        var t,
          n,
          r,
          o,
          a,
          s,
          u,
          l,
          c = e.parent,
          f = e.x,
          p = e.y,
          d = this.grid,
          h = [];
        if (c)
          (t = c.x),
            (n = c.y),
            (r = (f - t) / Math.max(Math.abs(f - t), 1)),
            (o = (p - n) / Math.max(Math.abs(p - n), 1)),
            0 !== r && 0 !== o
              ? (d.isWalkableAt(f, p + o) && h.push([f, p + o]),
                d.isWalkableAt(f + r, p) && h.push([f + r, p]),
                d.isWalkableAt(f + r, p + o) && h.push([f + r, p + o]),
                d.isWalkableAt(f - r, p) || h.push([f - r, p + o]),
                d.isWalkableAt(f, p - o) || h.push([f + r, p - o]))
              : 0 === r
              ? (d.isWalkableAt(f, p + o) && h.push([f, p + o]),
                d.isWalkableAt(f + 1, p) || h.push([f + 1, p + o]),
                d.isWalkableAt(f - 1, p) || h.push([f - 1, p + o]))
              : (d.isWalkableAt(f + r, p) && h.push([f + r, p]),
                d.isWalkableAt(f, p + 1) || h.push([f + r, p + 1]),
                d.isWalkableAt(f, p - 1) || h.push([f + r, p - 1]));
        else
          for (u = 0, l = (a = d.getNeighbors(e, i.Always)).length; u < l; ++u)
            (s = a[u]), h.push([s.x, s.y]);
        return h;
      }),
      (e.exports = o);
  },
  function (e, t, n) {
    "use strict";
    var r = n(4),
      i = n(0);
    function o(e) {
      r.call(this, e);
    }
    (o.prototype = new r()),
      (o.prototype.constructor = o),
      (o.prototype._jump = function (e, t, n, r) {
        var i = this.grid,
          o = e - n,
          a = t - r;
        if (!i.isWalkableAt(e, t)) return null;
        if (
          (!0 === this.trackJumpRecursion && (i.getNodeAt(e, t).tested = !0),
          i.getNodeAt(e, t) === this.endNode)
        )
          return [e, t];
        if (0 !== o && 0 !== a) {
          if (this._jump(e + o, t, e, t) || this._jump(e, t + a, e, t))
            return [e, t];
        } else if (0 !== o) {
          if (
            (i.isWalkableAt(e, t - 1) && !i.isWalkableAt(e - o, t - 1)) ||
            (i.isWalkableAt(e, t + 1) && !i.isWalkableAt(e - o, t + 1))
          )
            return [e, t];
        } else if (
          0 !== a &&
          ((i.isWalkableAt(e - 1, t) && !i.isWalkableAt(e - 1, t - a)) ||
            (i.isWalkableAt(e + 1, t) && !i.isWalkableAt(e + 1, t - a)))
        )
          return [e, t];
        return i.isWalkableAt(e + o, t) && i.isWalkableAt(e, t + a)
          ? this._jump(e + o, t + a, e, t)
          : null;
      }),
      (o.prototype._findNeighbors = function (e) {
        var t,
          n,
          r,
          o,
          a,
          s,
          u,
          l,
          c,
          f = e.parent,
          p = e.x,
          d = e.y,
          h = this.grid,
          g = [];
        if (f) {
          if (
            ((t = f.x),
            (n = f.y),
            (r = (p - t) / Math.max(Math.abs(p - t), 1)),
            (o = (d - n) / Math.max(Math.abs(d - n), 1)),
            0 !== r && 0 !== o)
          )
            h.isWalkableAt(p, d + o) && g.push([p, d + o]),
              h.isWalkableAt(p + r, d) && g.push([p + r, d]),
              h.isWalkableAt(p, d + o) &&
                h.isWalkableAt(p + r, d) &&
                g.push([p + r, d + o]);
          else if (0 !== r) {
            c = h.isWalkableAt(p + r, d);
            var m = h.isWalkableAt(p, d + 1),
              y = h.isWalkableAt(p, d - 1);
            c &&
              (g.push([p + r, d]),
              m && g.push([p + r, d + 1]),
              y && g.push([p + r, d - 1])),
              m && g.push([p, d + 1]),
              y && g.push([p, d - 1]);
          } else if (0 !== o) {
            c = h.isWalkableAt(p, d + o);
            var v = h.isWalkableAt(p + 1, d),
              b = h.isWalkableAt(p - 1, d);
            c &&
              (g.push([p, d + o]),
              v && g.push([p + 1, d + o]),
              b && g.push([p - 1, d + o])),
              v && g.push([p + 1, d]),
              b && g.push([p - 1, d]);
          }
        } else
          for (
            u = 0, l = (a = h.getNeighbors(e, i.OnlyWhenNoObstacles)).length;
            u < l;
            ++u
          )
            (s = a[u]), g.push([s.x, s.y]);
        return g;
      }),
      (e.exports = o);
  },
  function (e, t, n) {
    "use strict";
    var r = n(4),
      i = n(0);
    function o(e) {
      r.call(this, e);
    }
    (o.prototype = new r()),
      (o.prototype.constructor = o),
      (o.prototype._jump = function (e, t, n, r) {
        var i = this.grid,
          o = e - n,
          a = t - r;
        if (!i.isWalkableAt(e, t)) return null;
        if (
          (!0 === this.trackJumpRecursion && (i.getNodeAt(e, t).tested = !0),
          i.getNodeAt(e, t) === this.endNode)
        )
          return [e, t];
        if (0 !== o && 0 !== a) {
          if (
            (i.isWalkableAt(e - o, t + a) && !i.isWalkableAt(e - o, t)) ||
            (i.isWalkableAt(e + o, t - a) && !i.isWalkableAt(e, t - a))
          )
            return [e, t];
          if (this._jump(e + o, t, e, t) || this._jump(e, t + a, e, t))
            return [e, t];
        } else if (0 !== o) {
          if (
            (i.isWalkableAt(e + o, t + 1) && !i.isWalkableAt(e, t + 1)) ||
            (i.isWalkableAt(e + o, t - 1) && !i.isWalkableAt(e, t - 1))
          )
            return [e, t];
        } else if (
          (i.isWalkableAt(e + 1, t + a) && !i.isWalkableAt(e + 1, t)) ||
          (i.isWalkableAt(e - 1, t + a) && !i.isWalkableAt(e - 1, t))
        )
          return [e, t];
        return i.isWalkableAt(e + o, t) || i.isWalkableAt(e, t + a)
          ? this._jump(e + o, t + a, e, t)
          : null;
      }),
      (o.prototype._findNeighbors = function (e) {
        var t,
          n,
          r,
          o,
          a,
          s,
          u,
          l,
          c = e.parent,
          f = e.x,
          p = e.y,
          d = this.grid,
          h = [];
        if (c)
          (t = c.x),
            (n = c.y),
            (r = (f - t) / Math.max(Math.abs(f - t), 1)),
            (o = (p - n) / Math.max(Math.abs(p - n), 1)),
            0 !== r && 0 !== o
              ? (d.isWalkableAt(f, p + o) && h.push([f, p + o]),
                d.isWalkableAt(f + r, p) && h.push([f + r, p]),
                (d.isWalkableAt(f, p + o) || d.isWalkableAt(f + r, p)) &&
                  h.push([f + r, p + o]),
                !d.isWalkableAt(f - r, p) &&
                  d.isWalkableAt(f, p + o) &&
                  h.push([f - r, p + o]),
                !d.isWalkableAt(f, p - o) &&
                  d.isWalkableAt(f + r, p) &&
                  h.push([f + r, p - o]))
              : 0 === r
              ? d.isWalkableAt(f, p + o) &&
                (h.push([f, p + o]),
                d.isWalkableAt(f + 1, p) || h.push([f + 1, p + o]),
                d.isWalkableAt(f - 1, p) || h.push([f - 1, p + o]))
              : d.isWalkableAt(f + r, p) &&
                (h.push([f + r, p]),
                d.isWalkableAt(f, p + 1) || h.push([f + r, p + 1]),
                d.isWalkableAt(f, p - 1) || h.push([f + r, p - 1]));
        else
          for (
            u = 0, l = (a = d.getNeighbors(e, i.IfAtMostOneObstacle)).length;
            u < l;
            ++u
          )
            (s = a[u]), h.push([s.x, s.y]);
        return h;
      }),
      (e.exports = o);
  },
  function (e, t, n) {
    "use strict";
    var r = function (e, t) {
      if (Array.isArray(e)) return e;
      if (Symbol.iterator in Object(e))
        return (function (e, t) {
          var n = [],
            r = !0,
            i = !1,
            o = void 0;
          try {
            for (
              var a, s = e[Symbol.iterator]();
              !(r = (a = s.next()).done) &&
              (n.push(a.value), !t || n.length !== t);
              r = !0
            );
          } catch (e) {
            (i = !0), (o = e);
          } finally {
            try {
              !r && s.return && s.return();
            } finally {
              if (i) throw o;
            }
          }
          return n;
        })(e, t);
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    };
    function i(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    var o = n(9),
      a = n(5);
    function s(e, t, n, r) {
      var i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
        s = a.extend(!0, {}, t),
        u = a.extend(!0, {}, n);
      e.usedIter = r;
      var l = e.name.ref,
        c = [];
      try {
        c = o.lookupRef(l, s.heap, []).ids.map(function (e) {
          return e.id;
        });
      } catch (Z) {}
      var f = [],
        p = [],
        d = [],
        h = !1;
      function g(e) {
        return e.name && e.name.ref == l && !(e.usedIter === r);
      }
      function m(e, t, n) {
        (e.independent && h) ||
          (f.push(t),
          p.push(n),
          d.push(Boolean(e.independent)),
          (e.usedIter = r)),
          e.independent && (h = !0);
      }
      var y = !0,
        v = !1,
        b = void 0;
      try {
        for (
          var x, w = u.heap[Symbol.iterator]();
          !(y = (x = w.next()).done);
          y = !0
        ) {
          var A = x.value;
          if (g(A)) m(A, A.id, null);
          else if (A.fields) {
            var k = !0,
              C = !1,
              S = void 0;
            try {
              for (
                var j, E = A.fields[Symbol.iterator]();
                !(k = (j = E.next()).done);
                k = !0
              ) {
                var T = j.value;
                g(T) && m(T, A.id, T.id);
              }
            } catch (e) {
              (C = !0), (S = e);
            } finally {
              try {
                !k && E.return && E.return();
              } finally {
                if (C) throw S;
              }
            }
          }
        }
      } catch (e) {
        (v = !0), (b = e);
      } finally {
        try {
          !y && w.return && w.return();
        } finally {
          if (v) throw b;
        }
      }
      if ((i && f.length && (e.hyper = !0), f.length)) {
        for (var N = !1, O = 0; O < f.length; O++) {
          for (var M = [], L = !1, I = 0; I < s.heap.length; I++) {
            var D =
                s.heap[I].target &&
                s.heap[I].target.fields &&
                s.heap[I].target.id == f[O],
              W = s.heap[I].fields && s.heap[I].id == f[O];
            if (
              e.add &&
              s.heap[I].target &&
              s.heap[I].target.fields &&
              (c.includes(s.heap[I].id) || c.includes(s.heap[I].target.id))
            ) {
              var F = a.extend(!0, {}, e),
                _ = s.heap[I].target.fields;
              (F.name = F.fieldname), _.push(F), (N = !0);
            } else if (e.add || p[O] || s.heap[I].id != f[O]) {
              if (p[O] && (D || W)) {
                for (
                  var P = D ? s.heap[I].target.fields : s.heap[I].fields,
                    q = [],
                    H = !1,
                    R = 0;
                  R < P.length;
                  R++
                )
                  P[R].id == p[O] &&
                    (d[O]
                      ? (i
                          ? ((P[R].hyper = !0), (e.hyper = !1), (H = !0))
                          : ((P[R].hyper = !0),
                            (e.hyper = !1),
                            (H = !0),
                            (P[R].erased = !0)),
                        delete P[R].independent,
                        null === e.target &&
                          P[R].target &&
                          (e.target = { to: [{ id: P[R].target.id }] }),
                        (N = !0))
                      : q.push(R));
                if ((H && P.push(e), q.reverse(), !i)) {
                  var B = !0,
                    z = !1,
                    U = void 0;
                  try {
                    for (
                      var $, Y = q[Symbol.iterator]();
                      !(B = ($ = Y.next()).done);
                      B = !0
                    ) {
                      var G = $.value;
                      P[G].erased = !0;
                    }
                  } catch (e) {
                    (z = !0), (U = e);
                  } finally {
                    try {
                      !B && Y.return && Y.return();
                    } finally {
                      if (z) throw U;
                    }
                  }
                }
              }
            } else
              d[O]
                ? (i
                    ? ((s.heap[I].hyper = !0), (e.hyper = !1), (L = !0))
                    : ((s.heap[I].hyper = !0),
                      (e.hyper = !1),
                      (L = !0),
                      (s.heap[I].erased = !0)),
                  delete s.heap[I].independent,
                  null === e.target &&
                    s.heap[I].target &&
                    (e.target = { to: [{ id: s.heap[I].target.id }] }),
                  (N = !0))
                : M.push(I);
          }
          if ((L && s.heap.push(a.extend(!0, {}, e)), M.reverse(), !i)) {
            var V = !0,
              X = !1,
              J = void 0;
            try {
              for (
                var K, Q = M[Symbol.iterator]();
                !(V = (K = Q.next()).done);
                V = !0
              ) {
                var Z = K.value;
                s.heap[Z].erased = !0;
              }
            } catch (e) {
              (X = !0), (J = e);
            } finally {
              try {
                !V && Q.return && Q.return();
              } finally {
                if (X) throw J;
              }
            }
          }
        }
        N || s.heap.push(a.extend(!0, {}, e));
      } else s.heap.push(a.extend(!0, {}, e));
      return [s, u];
    }
    e.exports = {
      specToDiagrams: function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if (1 == e.length) return e;
        for (
          var n = a.extend(!0, {}, e[0]), i = o.transform(n), u = [n], l = 1;
          l < e.length;
          l++
        ) {
          for (var c = e[l].heap, f = 0; f < c.length; f++)
            if (c[f].name.ref) {
              var p = s(c[f], n, i, l, t),
                d = r(p, 2);
              (n = d[0]), (i = d[1]);
            }
          (i = o.transform(n, !1)), u.push(a.extend(!0, {}, n));
        }
        return u;
      },
      modifyMaster: function (e, t) {
        return (
          (function e(t, n) {
            for (
              var r = t.children || [],
                i = t.edges || [],
                o = n.childIds,
                a = n.edgeIds,
                s = [],
                u = [],
                l = 0;
              l < r.length;
              l++
            )
              o.includes(r[l].id) ? e(r[l], n) : s.push(l);
            for (var c = s.length - 1; c >= 0; c--) r.splice(s[c], 1);
            for (var f = 0; f < i.length; f++)
              a.includes(
                i[f].id +
                  "-" +
                  i[f].sources[0] +
                  "-" +
                  i[f].targets[0] +
                  "-" +
                  Boolean(i[f].crossed)
              ) || u.push(f);
            for (var p = u.length - 1; p >= 0; p--) i.splice(u[p], 1);
          })(
            (e = a.extend(!0, {}, e)),
            (function e(t) {
              var n = t.children || [],
                r = t.edges || [],
                o = [],
                a = [];
              if (n.length) {
                var s = !0,
                  u = !1,
                  l = void 0;
                try {
                  for (
                    var c, f = n[Symbol.iterator]();
                    !(s = (c = f.next()).done);
                    s = !0
                  ) {
                    var p = c.value,
                      d = e(p);
                    (a = [].concat(i(a), i(d.edgeIds))),
                      (o = [].concat(i(o), [p.id], i(d.childIds)));
                  }
                } catch (e) {
                  (u = !0), (l = e);
                } finally {
                  try {
                    !s && f.return && f.return();
                  } finally {
                    if (u) throw l;
                  }
                }
              }
              if (r.length) {
                var h = !0,
                  g = !1,
                  m = void 0;
                try {
                  for (
                    var y, v = r[Symbol.iterator]();
                    !(h = (y = v.next()).done);
                    h = !0
                  ) {
                    var b = y.value;
                    b.erased ||
                      (a = [].concat(i(a), [
                        b.id +
                          "-" +
                          b.sources[0] +
                          "-" +
                          b.targets[0] +
                          "-" +
                          Boolean(b.crossed),
                      ]));
                  }
                } catch (e) {
                  (g = !0), (m = e);
                } finally {
                  try {
                    !h && v.return && v.return();
                  } finally {
                    if (g) throw m;
                  }
                }
              }
              return { childIds: o, edgeIds: a };
            })(t)
          ),
          e
        );
      },
    };
  },
]);
//# sourceMappingURL=snapdown.js.map
