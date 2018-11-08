(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./__tests__/marked_spec.coffee");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./__tests__/marked_spec.coffee":
/*!**************************************!*\
  !*** ./__tests__/marked_spec.coffee ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Marked, TurndownService, fs, gfm, glob, shallow, to_md;
({
  shallow
} = __webpack_require__(/*! vue-test-utils */ "vue-test-utils"));
glob = __webpack_require__(/*! glob */ "glob");
fs = __webpack_require__(/*! file-system */ "file-system");
({
  Marked
} = __webpack_require__(/*! ../src/index */ "./src/index.coffee"));
Object.assign(Marked.options, {
  silent: false,
  indentCode: true,
  em: true
});
Object.assign(Marked.options.renderer, {
  paragraph: function (text) {
    var m;
    ({
      m
    } = this.options);
    return m('p', {}, text);
  }
});
TurndownService = __webpack_require__(/*! turndown */ "turndown");
({
  gfm
} = __webpack_require__(/*! turndown-plugin-gfm */ "turndown-plugin-gfm"));
to_md = new TurndownService({
  bulletListMarker: '+'
});
to_md.use(gfm);
to_md.addRule('confirm link', {
  filter: ['b'],
  replacement: function (content, node, options) {
    var href, title;
    console.warn(arguments);
    [href, title] = ["href", "title"].map(function (key) {
      return node.getAttribute(key);
    });

    if (title) {
      return `[${content}](${href} ${title})`;
    } else {
      return `[${content}](${href})`;
    }
  }
});
/*
こまけえことはいいんだよ = (str)->
  str
  .replace /\s/g,""
  .replace /<(\w+)><\/\1>/g,"" 
  .replace /\\\\`/g,'`' 
*/

glob.sync("./__tests__/**/*.md").map(function (path) {
  return describe(path, function () {
    var value;
    value = fs.readFileSync(path, 'utf8');
    return test('snapshot', function () {
      var context, html, wrapper;
      context = {
        book_id: 'spec-1',
        part_id: 'spec-1-1'
      };
      wrapper = shallow(Marked, {
        propsData: {
          value,
          context
        }
      });
      html = wrapper.html();
      return expect(html).toMatchSnapshot();
    });
  });
});
/*
value = to_md.turndown html
wrapper2 = shallow Marked,
  propsData: { value, context }
html2 = wrapper2.html()

expect( こまけえことはいいんだよ html ).toEqual( こまけえことはいいんだよ html2 )
*/

/***/ }),

/***/ "./node_modules/coffee-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/dagre.vue?vue&type=script&lang=coffee&":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/coffee-loader??ref--0!./node_modules/vue-loader/lib??vue-loader-options!./src/dagre.vue?vue&type=script&lang=coffee& ***!
  \*******************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DagreRenderer, dagre, init, marker, options, parse, vm;
dagre = __webpack_require__(/*! dagre */ "dagre");
parse = __webpack_require__(/*! ./dagre-parse */ "./src/dagre-parse.coffee");

marker = function (key) {
  switch (key) {
    case '<':
    case '(':
      return 'url(#svg-marker-arrow-start)';

    case '>':
    case ')':
      return 'url(#svg-marker-arrow-end)';

    case 'O':
    case 'o':
      return 'url(#svg-marker-circle)';

    case 'X':
    case 'x':
      return 'url(#svg-marker-cross)';

    default:
      return null;
  }
};

DagreRenderer = class DagreRenderer {
  newline() {}

  error(line) {
    return this.graph.errors.push(line);
  }

  href(key) {
    return key;
  }

  dic(v) {
    return ['box', v, v];
  }

  is_edge(v, w) {
    return this.graph.edge({
      v,
      w
    });
  }

  is_node(v) {
    return this.graph.node(v);
  }

  edge(v, w, line, start, end, label) {
    var edge_label_width, weight;
    ({
      edge_label_width
    } = this.options.style);
    weight = line.length;
    start = marker(start);
    end = marker(end);

    line = function () {
      switch (line[0]) {
        case '=':
          return 'wide';

        case '-':
          return 'solid';

        case '.':
          return 'dotted';

        default:
          return 'hide';
      }
    }();

    if (label == null) {
      label = "   ";
    }

    return this.graph.setEdge(v, w, {
      key: [v, w].join(),
      "marker-start": start,
      "marker-end": end,
      minlen: 1,
      weight: weight,
      class: line,
      label: label,
      labelpos: 'c',
      width: 25 * label.length + edge_label_width,
      height: 30,
      rx: 5,
      ry: 5
    });
  }

  box(v, label) {
    var border_width;
    ({
      border_width
    } = this.options.style);
    return this.graph.setNode(v, {
      label: label,
      class: 'box',
      width: 90 + border_width,
      height: 90 + border_width,
      rx: 10,
      ry: 10
    });
  }

  icon(v, label) {
    var border_width;
    ({
      border_width
    } = this.options.style);
    return this.graph.setNode(v, {
      label: label,
      class: 'icon',
      width: 90 + border_width,
      height: 130 + border_width,
      rx: 10,
      ry: 10
    });
  }

  cluster(v, w, label) {
    this.graph.setNode(w, {
      key: w,
      label: label,
      class: 'cluster'
    });
    return this.graph.setParent(v, w);
  }

};

init = function (options) {
  var g;
  g = new dagre.graphlib.Graph({
    directed: true,
    compound: true,
    multigraph: false
  });
  g.setGraph(options.graph);
  g.errors = [];
  options.renderer.options = options;
  options.renderer.graph = g;
  return g;
};

options = {
  renderer: new DagreRenderer(),
  style: {
    edge_label_width: 20,
    border_width: 10
  },
  graph: {
    // acyclicer: 'greedy'
    // ranker: 'network-simplex'
    // ranker: 'tight-tree'
    ranker: 'longest-path',
    rankdir: 'RL',
    // TB / BT / LR / RL
    nodesep: 10,
    ranksep: 10,
    edgesep: 0,
    marginx: 3,
    marginy: 3
  }
};
vm = {
  name: 'Dagre',
  options: options,
  props: ["value", "context"],
  methods: {
    path_d: function (list) {
      return 'M' + list.map(function ({
        x,
        y
      }) {
        return `${x},${y}`; // .join('T') # CurveTo Cx1,y1 x2,y2 x,y Sx2y2 x,y Qx1,y1, x,y Tx,y
      }).join('L'); // LineTo Lx,y Hx Vy
    }
  },
  computed: {
    root: function () {
      return this.graph.graph();
    },
    edge_paths: function () {
      var i, key, len, o, ref, results;
      ref = this.graph.edges();
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        o = this.graph.edge(key);

        if (!(o != null ? o.points : void 0)) {
          continue;
        }

        results.push(Object.assign({}, o, {
          key: "path-" + o.key,
          d: this.path_d(o.points),
          points: void 0
        }));
      }

      return results;
    },
    edge_rects: function () {
      var edge_label_width, i, key, len, o, ref, ref1, results;
      ({
        edge_label_width
      } = options.style);
      ref = this.graph.edges();
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        o = this.graph.edge(key);

        if (!(o != null ? (ref1 = o.label) != null ? ref1.trim() : void 0 : void 0)) {
          continue;
        }

        results.push(Object.assign({}, o, {
          key: "labelrect-" + o.key,
          width: o.width - edge_label_width,
          x: o.x - o.width * 0.5 + edge_label_width * 0.5,
          y: o.y - o.height * 0.7,
          points: void 0
        }));
      }

      return results;
    },
    edge_labels: function () {
      var i, key, len, o, ref, results;
      ref = this.graph.edges();
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        o = this.graph.edge(key);

        if (!(o != null ? o.label : void 0)) {
          continue;
        }

        results.push(Object.assign({}, o, {
          key: "text-" + o.key,
          label: o.label,
          points: void 0
        }));
      }

      return results;
    },
    node_images: function () {
      var border_width, i, key, len, o, ref, renderer, results;
      ({
        renderer
      } = options);
      ({
        border_width
      } = options.style);
      ref = this.graph.nodes();
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        o = this.graph.node(key);

        if ('icon' !== o.class) {
          continue;
        }

        results.push({
          key: "image-" + key,
          x: o.x - o.width * 0.5 + border_width * 0.5,
          y: o.y - o.height * 0.5 + border_width * 0.5,
          width: o.width - border_width,
          height: o.height - border_width,
          href: renderer.href(key)
        });
      }

      return results;
    },
    node_rects: function () {
      var i, key, len, o, ref, results;
      ref = this.graph.nodes();
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        o = this.graph.node(key);

        if (!o) {
          continue;
        }

        results.push({
          key: "rect-" + key,
          rx: o.rx,
          ry: o.ry,
          x: o.x - o.width / 2,
          y: o.y - o.height / 2,
          width: o.width,
          height: o.height
        });
      }

      return results;
    },
    view_box: function () {
      return `0 0 ${this.root.width} ${this.root.height}`;
    },
    graph: function () {
      var g;
      g = init(options);
      parse(options.renderer, this.value);
      dagre.layout(g);
      return g;
    }
  }
};
exports.default = vm;

/***/ }),

/***/ "./node_modules/coffee-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/marked.vue?vue&type=script&lang=coffee&":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/coffee-loader??ref--0!./node_modules/vue-loader/lib??vue-loader-options!./src/marked.vue?vue&type=script&lang=coffee& ***!
  \********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var Dagre, MarkedRenderer, _, itself, marked, options, vm;

_ = __webpack_require__(/*! lodash */ "lodash");
marked = __webpack_require__(/*! ./marked-parse */ "./src/marked-parse.coffee");
Dagre = __webpack_require__(/*! ./dagre.vue */ "./src/dagre.vue").default;

itself = function (o) {
  return o;
};

MarkedRenderer = function () {
  class MarkedRenderer {
    code(code, lang) {
      var langPrefix, m;
      ({
        m,
        langPrefix
      } = this.options);

      switch (lang != null ? lang.toLowerCase() : void 0) {
        case '':
        case null:
        case void 0:
          return m('pre', {}, [m('code', {}, code)]);

        case 'svg':
        case 'dagre':
          return m(Dagre, {
            attrs: {
              value: code
            }
          });

        default:
          lang = langPrefix + lang;
          return m('pre', {}, [m('code', {
            class: lang
          }, code)]);
      }
    }

    blockquote(quote) {
      var m;
      ({
        m
      } = this.options);
      return m('blockquote', {}, quote);
    }

    heading(text, level, raw) {
      var headerIds, headerPrefix, id, m;
      ({
        m,
        headerIds,
        headerPrefix
      } = this.options);

      if (headerIds) {
        id = headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
        return m(`h${level}`, {
          attrs: {
            id
          }
        }, text);
      } else {
        return m(`h${level}`, {}, text);
      }
    }

    hr() {
      var m;
      ({
        m
      } = this.options);
      return m('hr');
    }

    list(body, ordered, start, taskList) {
      var m, type;
      ({
        m
      } = this.options);
      type = ordered ? "ol" : "ul";

      if (!(ordered && start !== 1)) {
        start = void 0;
      }

      return m(type, {
        attrs: {
          start
        }
      }, body);
    }

    listitem(text, checked) {
      var m;
      ({
        m
      } = this.options);

      if (checked != null) {
        return m('li', {
          attrs: {
            class: 'task-list-item'
          }
        }, [m("input", {
          attrs: {
            type: 'checkbox',
            checked: checked,
            class: 'task-list-item-checkbox'
          }
        }), ...text]);
      } else {
        return m('li', {}, text);
      }
    }

    table(header, body, top) {
      var m;
      ({
        m
      } = this.options);
      return m('table', {}, [m('thead', {}, [header]), m('tbody', {}, body)]);
    }

    tablerow(content) {
      var m;
      ({
        m
      } = this.options);
      return m('tr', {}, content);
    }

    tablecell(content, {
      header,
      align
    }) {
      var m, tag;
      ({
        m
      } = this.options);
      tag = header ? 'th' : 'td';
      return m(tag, {
        class: align != null ? align[0] : void 0
      }, content);
    } // span level renderer


    em(text) {
      var m;
      ({
        m
      } = this.options);
      return m('em', {}, text);
    }

    strong(text) {
      var m;
      ({
        m
      } = this.options);
      return m('strong', {}, text);
    }

    codespan(text) {
      var m;
      ({
        m
      } = this.options);
      return m('code', {}, text);
    }

    br() {
      return '\n';
    }

    del(text) {
      var m;
      ({
        m
      } = this.options);
      return m('del', {}, text);
    }

    note(num, text, title) {
      var m;
      ({
        m
      } = this.options);
      return m('sup', {
        attrs: {
          title,
          class: 'note'
        }
      }, num);
    }

    link(href, title, text) {
      var hostname, m, protocol;
      ({
        m
      } = this.options);
      [protocol, hostname] = href.split(/\:\/\/|\/|\?|\#/g);
      text || (text = protocol);
      title || (title = [protocol, hostname].join("\n"));

      switch (href) {
        case null:
        case void 0:
        case "":
        case "#":
          return m("q", {
            attrs: {
              title
            }
          }, text);

        default:
          return m("a", {
            attrs: {
              title,
              href,
              chk: 'confirm'
            }
          }, text);
      }
    }

    image(src, title, alt) {
      var m;

      if (!title) {
        title = void 0;
      }

      ({
        m
      } = this.options);
      return m('img', {
        attrs: {
          src,
          alt,
          title
        }
      });
    }

    url(href) {
      return href;
    } // markdown-it


    container(text, lang) {
      var m;
      ({
        m
      } = this.options);
      return m('p', {
        attrs: {
          class: lang
        }
      }, text);
    }

    strikeout(text) {
      var m;
      ({
        m
      } = this.options);
      return m('s', {}, text);
    }

    span(text) {
      var m;
      ({
        m
      } = this.options);
      return m('span', {}, text);
    }

    ins(text) {
      var m;
      ({
        m
      } = this.options);
      return m('ins', {}, text);
    }

    kbd(text) {
      var m;
      ({
        m
      } = this.options);
      return m('kbd', {}, text);
    }

    mdi(name) {
      var m;
      ({
        m
      } = this.options);
      return m('i', {
        attrs: {
          class: `mdi ${name}`
        }
      });
    }

    abbr(text, title) {
      var m;
      ({
        m
      } = this.options);
      return m('ruby', {}, [text, m('rp', {}, ["《"]), m('rt', {}, title), m('rp', {}, ["》"])]);
    }

    mark(text) {
      var m;
      ({
        m
      } = this.options);
      return m('abbr', {}, text);
    }

    sup(text) {
      var m;
      ({
        m
      } = this.options);
      return m('sup', {}, text);
    }

    sub(text) {
      var m;
      ({
        m
      } = this.options);
      return m('sub', {}, text);
    }

    cite(text, cite, end) {
      var m;
      ({
        m
      } = this.options);

      if (cite) {
        return m('q', {
          attrs: {
            cite,
            end
          }
        }, text);
      } else {
        return text;
      }
    }

    cite_exist(cite) {
      return true;
    }

  }

  ;
  MarkedRenderer.prototype.paragraph = itself;
  MarkedRenderer.prototype.text = itself;
  MarkedRenderer.prototype.html = itself;
  return MarkedRenderer;
}.call(undefined);

options = {
  renderer: new MarkedRenderer(),
  tag: 'article',
  langPrefix: 'language-',
  ruby: true,
  cite: true,
  gfm: true,
  tables: true,
  indentCode: false,
  taskLists: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: true,
  silent: true,
  em: false
};
vm = {
  name: "Marked",
  options: options,
  props: ["value", "context"],
  render: function (m) {
    var context, value;
    ({
      value,
      context
    } = this);

    if (value) {
      options.m = m;
      options.context = context;
      options.renderer.options = options;
      return marked(value, options);
    } else {
      return '';
    }
  }
};
exports.default = vm;

/***/ }),

/***/ "./node_modules/coffee-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/marksvg.vue?vue&type=script&lang=coffee&":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/coffee-loader??ref--0!./node_modules/vue-loader/lib??vue-loader-options!./src/marksvg.vue?vue&type=script&lang=coffee& ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// inspired by https://github.com/wakufactory/MarkDownDiagram
var SVG, SvgRenderer, marker, options, parse_touch, vm;
SVG = __webpack_require__(/*! ./marksvg-parse */ "./src/marksvg-parse.coffee");

marker = function (key) {
  switch (key) {
    case '<':
    case '(':
      return 'url(#svg-marker-arrow-start)';

    case '>':
    case ')':
      return 'url(#svg-marker-arrow-end)';

    case 'O':
    case 'o':
      return 'url(#svg-marker-circle)';

    case 'X':
    case 'x':
      return 'url(#svg-marker-cross)';

    default:
      return null;
  }
};

SvgRenderer = class SvgRenderer {
  plain() {
    return this.data = {
      nodes: {},
      paths: {},
      rects: {},
      texts: {},
      labels: {},
      images: {},
      errors: []
    };
  }

  pos({
    x,
    y,
    width,
    height
  }, mark) {
    var curve, gap_size, vx, vy;
    ({
      gap_size
    } = this.options.style);
    curve = 1 * gap_size;

    switch (mark) {
      case '^':
      case 'u':
        x += 0.5 * width; // y origin

        vx = 0;
        vy = -curve;
        break;

      case 'v':
      case 'd':
        x += 0.5 * width;
        y += 1.0 * height;
        vx = 0;
        vy = curve;
        break;

      case '<':
      case 'l':
        // x origin
        y += 0.5 * height;
        vx = -curve;
        vy = 0;
        break;

      case '>':
      case 'r':
        x += 1.0 * width;
        y += 0.5 * height;
        vx = curve;
        vy = 0;
    }

    return {
      x,
      y,
      vx,
      vy
    };
  }

  newline() {}

  error(line) {
    return this.data.errors.push(line);
  }

  href(key) {
    return key;
  }

  dic(v) {
    return ['icon', v, v];
  }

  node(name, v) {
    return this.data.nodes[name] = this.data.rects[v];
  }

  is_cluster(v) {
    var ref;
    return ((ref = this.data.rects[v]) != null ? ref.class : void 0) === 'cluster';
  }

  label(v, label, pos, x, y) {
    var className, key, radius, rx, ry;

    if (!label) {
      return;
    }

    ({
      radius
    } = this.options.style); // text

    key = `label-${v}`;

    if (label == null) {
      label = "   ";
    }

    className = "pen";
    this.data.texts[v] = {
      class: className,
      "text-anchor": pos,
      key,
      label,
      x,
      y
    }; // label
    // x, y, width, height は後で。

    ({
      radius
    } = this.options.style);
    key = `rect-label-${v}`;
    rx = radius;
    ry = radius;
    return this.data.labels[v] = {
      class: className,
      key,
      rx,
      ry
    };
  }

  edge(v, w, line, start, end, headpos, tailpos, label) {
    var className, cvpx, cvpy, cwpx, cwpy, d, key, lx, ly, vo, vp, vw, weight, wo, wp;
    weight = line.length;
    start = marker(start);
    end = marker(end);

    className = function () {
      switch (line[0]) {
        case '=':
          return 'wide';

        case '-':
          return 'solid';

        case '.':
          return 'dotted';

        default:
          return 'hide';
      }
    }();

    vw = [v, w].join("+");
    key = `path=${vw}`;
    vo = this.data.rects[v];
    wo = this.data.rects[w];
    vp = this.pos(vo, headpos);
    wp = this.pos(wo, tailpos);
    cvpx = vp.x + vp.vx;
    cvpy = vp.y + vp.vy;
    cwpx = wp.x + wp.vx;
    cwpy = wp.y + wp.vy;
    lx = parseInt(0.5 * (cvpx + cwpx));
    ly = parseInt(0.5 * (cvpy + cwpy));
    d = `M${vp.x},${vp.y}C${cvpx},${cvpy},${cwpx},${cwpy},${wp.x},${wp.y}`; // path

    this.data.paths[vw] = {
      class: className,
      key,
      d,
      "marker-start": start,
      "marker-end": end
    }; // x, y は中点

    return this.label(vw, label, 'middle', lx, ly);
  }

  auto_xy(x, y) {
    var gap_size, icon_width, key, xs;

    if (x != null && y != null) {
      return [parseInt(x), parseInt(y)];
    }

    ({
      icon_width,
      gap_size
    } = this.options.style);

    xs = function () {
      var ref, results;
      ref = this.data.rects;
      results = [];

      for (key in ref) {
        ({
          x
        } = ref[key]);
        results.push(x);
      }

      return results;
    }.call(this);

    xs.push(-(icon_width + gap_size));
    x = Math.max(...xs);
    x += icon_width + gap_size;
    y = gap_size;
    return [x, y];
  }

  box(v, label, side = ' ', x, y) {
    var border_width, className, height, icon_width, key, radius, rx, ry, width;
    ({
      border_width,
      icon_width,
      radius
    } = this.options.style);
    [x, y] = this.auto_xy(x, y);
    width = icon_width + 2 * border_width;
    height = icon_width + 2 * border_width;
    rx = radius;
    ry = radius;
    className = 'box';
    key = `${side}rect=${v}`; // rect

    this.data.rects[v] = {
      class: className,
      key,
      width,
      height,
      x,
      y,
      rx,
      ry
    }; // x, y はボトム

    x += 0.5 * width;
    y += 1.0 * height - 2 * border_width;
    return this.label(v, label, 'middle', x, y);
  }

  icon(v, label, side = ' ', x, y) {
    var border_width, className, extrax, extray, height, href, icon_height, icon_width, is_horizontal, is_vertical, key, label_height, radius, roll, rx, ry, transform, width;
    ({
      border_width,
      label_height,
      icon_width,
      icon_height,
      radius
    } = this.options.style);

    switch (side) {
      case '^':
      case 'u':
      case ' ':
        roll = 0;
        is_vertical = true;
        extrax = 0;
        extray = 0;
        break;

      case 'v':
      case 'd':
        roll = 180;
        is_vertical = true;
        extrax = 0;
        extray = 0;
        break;

      case '<':
      case 'l':
        roll = 270;
        is_horizontal = true;
        extrax = 0;
        extray = -0.5;
        break;

      case '>':
      case 'r':
        roll = 90;
        is_horizontal = true;
        extrax = 0.5;
        extray = 0;
    }

    [x, y] = this.auto_xy(x, y);
    width = icon_width;
    height = icon_height;
    rx = radius;
    ry = radius;
    extrax *= height - width;
    extray *= height - width;
    transform = roll ? `rotate(${roll}, ${x + border_width + extrax + 0.5 * width}, ${y + border_width + extray + 0.5 * height})` : void 0;
    href = this.href(v);
    className = 'icon';
    key = `image=${v}`; // image

    this.data.images[v] = {
      class: className,
      key,
      href,
      transform,
      width,
      height,
      rx,
      ry,
      x: x + border_width,
      y: y + border_width
    };

    if (is_horizontal) {
      [width, height] = [height, width];
    }

    width = width + 2 * border_width;
    height = height + 2 * border_width + label_height;
    className = 'box';
    key = `${side}rect=${v}`; // rect

    this.data.rects[v] = {
      class: className,
      key,
      width,
      height,
      x,
      y,
      rx,
      ry
    }; // x, y はボトム

    x += 0.5 * width;
    y += 1.0 * height - 2 * border_width;
    return this.label(v, label, 'middle', x, y);
  }

  cluster(vs, label) {
    var className, fill, height, key, label_height, radius, rx, ry, vos, width, x, y;
    ({
      label_height,
      radius
    } = this.options.style);
    vos = vs.map(v => {
      return this.data.rects[v];
    });
    className = 'cluster';
    fill = 'none';
    key = `rect=${label}`;
    ({
      x,
      y,
      width,
      height
    } = this.cover(vos));
    rx = radius;
    ry = radius; // rect

    this.data.rects[label] = {
      class: className,
      key,
      fill,
      width,
      height,
      x,
      y,
      rx,
      ry
    }; // x, y は右上

    x += 1.0 * width;
    y += 0.5 * label_height;
    return this.label(label, label, 'end', x, y);
  }

  cover(vos) {
    var height, icon_width, label_height, width, x, xmax, xmin, y, ymax, ymin;
    ({
      label_height,
      icon_width
    } = this.options.style);

    if (!vos.length) {
      vos.push({
        x: label_height,
        y: label_height,
        width: icon_width,
        height: icon_width
      });
    }

    xmin = Math.min(...vos.map(function (o) {
      return o.x;
    }));
    xmax = Math.max(...vos.map(function (o) {
      return o.x + o.width;
    }));
    ymin = Math.min(...vos.map(function (o) {
      return o.y;
    }));
    ymax = Math.max(...vos.map(function (o) {
      return o.y + o.height;
    }));
    width = xmax - xmin + label_height;
    height = ymax - ymin + label_height;
    x = xmin - 0.5 * label_height;
    y = ymin - 0.5 * label_height;
    return {
      x,
      y,
      width,
      height
    };
  }

};
options = {
  renderer: new SvgRenderer(),
  style: {
    gap_size: 50,
    icon_width: 90,
    icon_height: 130,
    label_height: 28,
    border_width: 5,
    radius: 3
  }
};
options.renderer.options = options;

parse_touch = function (e) {
  var pageX, pageY, target;
  ({
    pageX,
    pageY
  } = e.changedTouches[0]);
  ({
    target
  } = e);
  return {
    pageX,
    pageY,
    target
  };
};

vm = {
  name: 'MarkSVG',
  options: options,
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    context: Object
  },
  data: function () {
    var gdata, move, moved, tokens, zoom;
    move = {
      id: null,
      x: 0,
      y: 0,
      px: 0,
      py: 0
    };
    moved = {
      x: 0,
      y: 0,
      rx: 0,
      ry: 0,
      width: 0,
      height: 0
    };
    zoom = 1.0;
    gdata = options.renderer.plain();
    tokens = [];
    return {
      zoom,
      move,
      moved,
      gdata,
      tokens
    };
  },
  methods: {
    do_graph: function () {
      this.gdata = options.renderer.plain();
      this.tokens = SVG.parse(options.renderer, this.value);
      return this.$nextTick(() => {
        var border_width, box, height, key, lk, ref, ref1, ref2, ref3, ref4, results, tk, val, width, x, y;

        if (!(width = (ref = this.$refs.root) != null ? typeof ref.getClientRects === "function" ? (ref1 = ref.getClientRects()) != null ? (ref2 = ref1[0]) != null ? ref2.width : void 0 : void 0 : void 0 : void 0)) {
          return;
        }

        this.zoom = this.root.width / width;
        results = [];

        for (key in this.gdata.texts) {
          tk = 'label-' + key;
          lk = 'rect-label-' + key;

          if (!(box = (ref3 = this.$refs[tk]) != null ? (ref4 = ref3[0]) != null ? typeof ref4.getBBox === "function" ? ref4.getBBox() : void 0 : void 0 : void 0)) {
            continue;
          }

          ({
            width,
            height,
            x,
            y
          } = box);
          ({
            border_width
          } = options.style);
          width += 4 * border_width;
          height += 2 * border_width;
          x -= 2 * border_width;
          y -= 1 * border_width;
          options.style.label_height = height;
          results.push(function () {
            var ref5, results1;
            ref5 = {
              x,
              y,
              width,
              height
            };
            results1 = [];

            for (key in ref5) {
              val = ref5[key];
              results1.push(this.$refs[lk][0].setAttribute(key, val));
            }

            return results1;
          }.call(this));
        }

        return results;
      });
    },
    move_xy: function () {
      var dx, dy, x, y;
      ({
        x,
        y,
        dx,
        dy
      } = this.move);
      x = parseInt(Math.max(0, x + dx));
      y = parseInt(Math.max(0, y + dy));
      return {
        x,
        y
      };
    },
    movespace: function () {
      var cb, finish, move;

      move = ({
        pageX,
        pageY,
        target
      }) => {
        var dx, dy, px, py;

        if (this.move.id) {
          ({
            px,
            py
          } = this.move);
          dx = pageX - px;
          dy = pageY - py;
          this.move.dx = this.zoom * dx;
          this.move.dy = this.zoom * dy;
          return this.recalc();
        }
      };

      finish = ({
        pageX,
        pageY,
        target
      }) => {
        var dx, dy, px, py;

        if (this.move.id) {
          ({
            px,
            py
          } = this.move);
          dx = pageX - px;
          dy = pageY - py;

          if (dx === dy && dy === 0) {
            this.do_roll(this.move.id);
          } else {
            this.move.dx = this.zoom * dx;
            this.move.dy = this.zoom * dy;
            this.do_move(this.move.id);
          }

          return this.move.id = null;
        }
      };

      return cb = {
        touchend: e => {
          return finish(parse_touch(e));
        },
        touchleave: e => {
          return finish(parse_touch(e));
        },
        touchmove: e => {
          return move(parse_touch(e));
        },
        mouseup: finish,
        mouseleave: finish,
        mousemove: move
      };
    },
    draggable: function (id) {
      var cb, start;

      start = ({
        pageX,
        pageY,
        target
      }) => {
        var height, rx, ry, width, x, y;
        ({
          x,
          y,
          rx,
          ry,
          width,
          height
        } = this.gdata.rects[id]);
        this.moved = {
          x,
          y,
          rx,
          ry,
          width,
          height
        };
        return this.move = {
          id,
          x,
          y,
          px: pageX,
          py: pageY
        };
      };

      return cb = {
        touchstart: e => {
          e.preventDefault();
          return start(parse_touch(e));
        },
        mousedown: e => {
          e.preventDefault();
          return start(e);
        }
      };
    },
    recalc: function () {
      if (!this.edit) {
        return;
      }

      return Object.assign(this.moved, this.move_xy());
    },
    do_move: function (id) {
      if (!this.edit) {
        return;
      }

      Object.assign(this.gdata.rects[id], this.move_xy());
      this.$emit('input', SVG.stringify(this.tokens, this.gdata));
      return this.do_graph();
    },
    do_roll: function (id) {
      var idx, key, side, sides;

      if (!this.edit) {
        return;
      }

      ({
        key
      } = this.gdata.rects[id]);
      sides = ' >v<^>';
      side = key[0];
      idx = 1 + sides.indexOf(side);
      key = sides[idx] + key.slice(1);
      this.gdata.rects[id].key = key;
      this.$emit('input', SVG.stringify(this.tokens, this.gdata));
      return this.do_graph();
    },
    nop: function () {
      return false;
    }
  },
  computed: {
    root: function () {
      return options.renderer.cover(Object.values(this.graph.rects));
    },
    view_box: function () {
      return `${this.root.x} ${this.root.y} ${this.root.width} ${this.root.height}`;
    },
    graph: function () {
      this.do_graph();
      return this.gdata;
    }
  }
};
exports.default = vm;

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/pug-plain-loader/index.js!./node_modules/vue-loader/lib/index.js?!./src/dagre.vue?vue&type=template&id=9d15a698&lang=pug&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader!./node_modules/vue-loader/lib??vue-loader-options!./src/dagre.vue?vue&type=template&id=9d15a698&lang=pug& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("article", [
    _c(
      "svg",
      {
        style: "max-width: 100%; width: " + _vm.root.width + "px;",
        attrs: { viewBox: _vm.view_box }
      },
      [
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-circle",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "5",
              refY: "5",
              orient: "auto"
            }
          },
          [_c("circle", { attrs: { cx: "5", cy: "5", r: "4" } })]
        ),
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-arrow-start",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "3",
              refY: "5",
              orient: "auto"
            }
          },
          [
            _c("path", {
              staticClass: "path",
              attrs: { d: "M10,0 L0,5 L10,10 z" }
            })
          ]
        ),
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-arrow-end",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "3",
              refY: "5",
              orient: "auto"
            }
          },
          [
            _c("path", {
              staticClass: "path",
              attrs: { d: "M0,0 L10,5 L0,10 z" }
            })
          ]
        ),
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-cross",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "5",
              refY: "5",
              orient: "0"
            }
          },
          [
            _c("path", {
              staticClass: "path",
              attrs: { d: "M0,0 L10,10 M0,10 L10,0 z" }
            })
          ]
        ),
        _c(
          "transition-group",
          { attrs: { tag: "g", name: "nodes" } },
          [
            _vm._l(_vm.node_rects, function(o) {
              return o ? _c("rect", _vm._b({}, "rect", o, false)) : _vm._e()
            }),
            _vm._l(_vm.node_images, function(o) {
              return o ? _c("image", _vm._b({}, "image", o, false)) : _vm._e()
            })
          ],
          2
        ),
        _c(
          "transition-group",
          { staticClass: "edgePath", attrs: { tag: "g", name: "edges" } },
          [
            _vm._l(_vm.edge_paths, function(o) {
              return o
                ? _c(
                    "path",
                    _vm._b(
                      { staticClass: "path", attrs: { fill: "none" } },
                      "path",
                      o,
                      false
                    )
                  )
                : _vm._e()
            }),
            _vm._l(_vm.edge_rects, function(o) {
              return o
                ? _c("rect", _vm._b({ staticClass: "path" }, "rect", o, false))
                : _vm._e()
            }),
            _vm._l(_vm.edge_labels, function(o) {
              return o
                ? _c(
                    "text",
                    _vm._b({ staticClass: "messageText" }, "text", o, false),
                    [_vm._v(_vm._s(o.label))]
                  )
                : _vm._e()
            })
          ],
          2
        )
      ],
      1
    ),
    _vm.graph.errors.length
      ? _c(
          "div",
          { staticClass: "errors" },
          _vm._l(_vm.graph.errors, function(err) {
            return _c("div", { staticClass: "error" }, [_vm._v(_vm._s(err))])
          })
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/pug-plain-loader/index.js!./node_modules/vue-loader/lib/index.js?!./src/marksvg.vue?vue&type=template&id=4b30752e&lang=pug&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader!./node_modules/vue-loader/lib??vue-loader-options!./src/marksvg.vue?vue&type=template&id=4b30752e&lang=pug& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("article", [
    _c(
      "svg",
      _vm._g(
        {
          ref: "root",
          style: "max-width: 100%; width: " + _vm.root.width + "px;",
          attrs: { viewBox: _vm.view_box }
        },
        _vm.movespace()
      ),
      [
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-circle",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "5",
              refY: "5",
              orient: "auto"
            }
          },
          [_c("circle", { attrs: { cx: "5", cy: "5", r: "4" } })]
        ),
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-arrow-start",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "3",
              refY: "5",
              orient: "auto"
            }
          },
          [
            _c("path", {
              staticClass: "fill",
              attrs: { d: "M10,0 L0,5 L10,10 z" }
            })
          ]
        ),
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-arrow-end",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "3",
              refY: "5",
              orient: "auto"
            }
          },
          [
            _c("path", {
              staticClass: "fill",
              attrs: { d: "M0,0 L10,5 L0,10 z" }
            })
          ]
        ),
        _c(
          "marker",
          {
            staticClass: "edgePath",
            attrs: {
              id: "svg-marker-cross",
              viewBox: "0 0 10 10",
              markerUnits: "userSpaceOnUse",
              markerWidth: "20",
              markerHeight: "20",
              refX: "5",
              refY: "5",
              orient: "0"
            }
          },
          [
            _c("path", {
              staticClass: "path",
              attrs: { d: "M0,0 L10,10 M0,10 L10,0 z" }
            })
          ]
        ),
        _c(
          "g",
          [
            _vm._l(_vm.graph.rects, function(o, key) {
              return o
                ? _c(
                    "rect",
                    _vm._g(_vm._b({}, "rect", o, false), _vm.draggable(key, o))
                  )
                : _vm._e()
            }),
            _vm._l(_vm.graph.images, function(o, key) {
              return o
                ? _c(
                    "image",
                    _vm._g(_vm._b({}, "image", o, false), _vm.draggable(key, o))
                  )
                : _vm._e()
            })
          ],
          2
        ),
        _c(
          "g",
          { staticClass: "edgePath" },
          [
            _vm._l(_vm.graph.paths, function(o, key) {
              return o
                ? _c(
                    "path",
                    _vm._b(
                      { staticClass: "path", attrs: { fill: "none" } },
                      "path",
                      o,
                      false
                    )
                  )
                : _vm._e()
            }),
            _vm._l(_vm.graph.labels, function(o, key) {
              return o
                ? _c(
                    "rect",
                    _vm._b({ ref: o.key, refInFor: true }, "rect", o, false)
                  )
                : _vm._e()
            }),
            _vm._l(_vm.graph.texts, function(o, key) {
              return o
                ? _c(
                    "text",
                    _vm._b({ ref: o.key, refInFor: true }, "text", o, false),
                    [_vm._v(_vm._s(o.label))]
                  )
                : _vm._e()
            })
          ],
          2
        ),
        _vm.move.id
          ? _c("g", [
              _c(
                "rect",
                _vm._b({ staticClass: "move" }, "rect", _vm.moved, false)
              )
            ])
          : _vm._e()
      ]
    ),
    _vm.graph.errors.length
      ? _c(
          "div",
          { staticClass: "errors" },
          _vm._l(_vm.graph.errors, function(err) {
            return _c("div", { staticClass: "error" }, [_vm._v(_vm._s(err))])
          })
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./src/dagre-parse.coffee":
/*!********************************!*\
  !*** ./src/dagre-parse.coffee ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse, syntax;
({
  syntax
} = __webpack_require__(/*! ./dagre-regexp */ "./src/dagre-regexp.coffee"));

parse = function (render, src) {
  var $, _, all, cap, depth, edges, end, find_parent, i, idx, j, label, last, len, len1, line, nodes, parent, parents, pl, results, start, tokens, v, vl, vm, w, wl, wm;

  parents = {};
  tokens = [];
  last = {
    v: "",
    depth: 0
  };

  find_parent = function (v, depth) {
    var ref;
    depth = depth.length;

    if (last.depth < depth) {
      parents[depth] = last;
    }

    last = {
      depth,
      v
    };
    return (ref = parents[depth]) != null ? ref.v : void 0;
  };

  results = [];

  while (src) {
    // console.log src
    if (cap = syntax.newline.exec(src)) {
      [all] = cap;
      src = src.slice(all.length); // console.log "newline", cap

      render.newline();
      continue;
    }

    if (cap = syntax.edges.exec(src)) {
      [all, depth, edges, v, $, $, $, label] = cap;
      src = src.slice(all.length); // console.log "edges", cap

      edges = edges.split(syntax._arrow_).map(function (s) {
        return s != null ? s.trim() : void 0;
      });

      if (v) {
        if (find_parent("", depth)) {
          render.error(all);
          continue;
        }
      } else {
        if (!(v = find_parent("", depth))) {
          render.error(all);
          continue;
        }
      }

      edges[0] = v;

      for (idx = i = 0, len = edges.length; i < len; idx = i += 4) {
        v = edges[idx];
        [v, start, line, end, w] = edges.slice(idx, +(idx + 4) + 1 || 9e9);

        if (w) {
          [vm, v, vl] = render.dic(v);
          [wm, w, wl] = render.dic(w);
          render[vm](v, vl);
          render.edge(v, v, "", "", "", vl);
          render[wm](w, wl);
          render.edge(w, w, "", "", "", wl);
          render.edge(v, w, line, start, end, label);
        }
      }

      continue;
    }

    if (cap = syntax.nodes.exec(src)) {
      [all, depth, nodes, label] = cap;
      src = src.slice(all.length); // console.log "nodes", cap

      nodes = nodes.trim().split(/ +/);

      for (idx = j = 0, len1 = nodes.length; j < len1; idx = ++j) {
        v = nodes[idx];
        [vm, v, vl] = render.dic(v);
        render[vm](v, label || vl);

        if (label) {
          render.edge(v, v, "", "", "", label);
        }

        if (parent = find_parent(v, depth)) {
          [_, parent, pl] = render.dic(parent);
          ({
            label
          } = render.is_node(parent));

          if (label) {
            render.cluster(v, parent, label);
          }
        }
      }

      continue;
    }

    if (cap = syntax.error.exec(src)) {
      [all] = cap;
      src = src.slice(all.length);
      render.error(all, "解釈できない文字列です。");
      continue;
    } else {
      results.push(void 0);
    }
  }

  return results;
};

module.exports = parse;

/***/ }),

/***/ "./src/dagre-regexp.coffee":
/*!*********************************!*\
  !*** ./src/dagre-regexp.coffee ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexp_join, syntax;

regexp_join = function (regex, ...names) {
  var flags, i, key, len, name, source, val;
  ({
    flags,
    source
  } = regex);

  for (i = 0, len = names.length; i < len; i++) {
    name = names[i];
    key = new RegExp(name, 'g');
    val = syntax[name];
    val = val.source || val;
    source = source.replace(key, val);
  }

  return new RegExp(source, flags);
};

syntax = {
  edges: /^( *)((_node_)?(?: *_arrow_ *_node_)+) *(?:_comment_)?(?:_eol_)/,
  nodes: /^( *)((?:_node_| )+)(?:_comment_)?(?:_eol_)/,
  newline: /^ *\n|^ +$/,
  error: /^[^\n]*\n|[^\n]+$/,
  _node_: /[^\s:]+/,
  _arrow_: /(<|X|x|O|o)?(-+|=+|\.+)(>|X|x|O|o)?/,
  _comment_: /: *(.*) */,
  _eol_: / *(?:\n|$)/
};
syntax.nodes = regexp_join(syntax.nodes, '_node_', '_arrow_', '_comment_', '_eol_');
syntax.edges = regexp_join(syntax.edges, '_node_', '_arrow_', '_comment_', '_eol_');
module.exports = {
  syntax
};

/***/ }),

/***/ "./src/dagre.vue":
/*!***********************!*\
  !*** ./src/dagre.vue ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dagre_vue_vue_type_template_id_9d15a698_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dagre.vue?vue&type=template&id=9d15a698&lang=pug& */ "./src/dagre.vue?vue&type=template&id=9d15a698&lang=pug&");
/* harmony import */ var _dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dagre.vue?vue&type=script&lang=coffee& */ "./src/dagre.vue?vue&type=script&lang=coffee&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__["default"],
  _dagre_vue_vue_type_template_id_9d15a698_lang_pug___WEBPACK_IMPORTED_MODULE_0__["render"],
  _dagre_vue_vue_type_template_id_9d15a698_lang_pug___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/dagre.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dagre.vue?vue&type=script&lang=coffee&":
/*!****************************************************!*\
  !*** ./src/dagre.vue?vue&type=script&lang=coffee& ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/coffee-loader??ref--0!../node_modules/vue-loader/lib??vue-loader-options!./dagre.vue?vue&type=script&lang=coffee& */ "./node_modules/coffee-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/dagre.vue?vue&type=script&lang=coffee&");
/* harmony import */ var _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dagre.vue?vue&type=template&id=9d15a698&lang=pug&":
/*!***************************************************************!*\
  !*** ./src/dagre.vue?vue&type=template&id=9d15a698&lang=pug& ***!
  \***************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_template_id_9d15a698_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/pug-plain-loader!../node_modules/vue-loader/lib??vue-loader-options!./dagre.vue?vue&type=template&id=9d15a698&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/pug-plain-loader/index.js!./node_modules/vue-loader/lib/index.js?!./src/dagre.vue?vue&type=template&id=9d15a698&lang=pug&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_template_id_9d15a698_lang_pug___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_dagre_vue_vue_type_template_id_9d15a698_lang_pug___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/index.coffee":
/*!**************************!*\
  !*** ./src/index.coffee ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regexp = exports.Dagre = exports.Marked = exports.MarkSVG = undefined;

var _marked = __webpack_require__(/*! ./marked.vue */ "./src/marked.vue");

var _marked2 = _interopRequireDefault(_marked);

var _marksvg = __webpack_require__(/*! ./marksvg.vue */ "./src/marksvg.vue");

var _marksvg2 = _interopRequireDefault(_marksvg);

var _dagre = __webpack_require__(/*! ./dagre.vue */ "./src/dagre.vue");

var _dagre2 = _interopRequireDefault(_dagre);

var _markedRegexp = __webpack_require__(/*! ./marked-regexp.coffee */ "./src/marked-regexp.coffee");

var _markedRegexp2 = _interopRequireDefault(_markedRegexp);

var _marksvgRegexp = __webpack_require__(/*! ./marksvg-regexp.coffee */ "./src/marksvg-regexp.coffee");

var _marksvgRegexp2 = _interopRequireDefault(_marksvgRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regexp;
exports.regexp = regexp = {
  down: _markedRegexp2.default,
  svg: _marksvgRegexp2.default
};
exports.MarkSVG = _marksvg2.default;
exports.Marked = _marked2.default;
exports.Dagre = _dagre2.default;
exports.regexp = regexp;

/***/ }),

/***/ "./src/marked-parse.coffee":
/*!*********************************!*\
  !*** ./src/marked-parse.coffee ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Inline Lexer & Compiler
 */

/*
 * Pedantic grammar
 * not support
 */

/*
 * Helpers
 */
var InlineLexer, Lexer, Parser, baseUrls, block, escape, inline, marked, noop, originIndependentUrl, repl, resolveUrl, splitCells, unescape;
({
  block,
  inline,
  repl,
  noop
} = __webpack_require__(/*! ./marked-regexp */ "./src/marked-regexp.coffee"));

escape = function (html, is_encode) {
  if (escape[is_encode].test(html)) {
    return html.replace(escape[is_encode].replace, function (ch) {
      return escape.replacements[ch];
    });
  }
};

escape[true] = /[&<>"']/g;
escape[false] = /[<>"']|&(?!#?\w+;)/g;
escape.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

unescape = function (html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function (_, n) {
    n = n.toLowerCase();

    switch (false) {
      case n !== 'colon':
        return ':';

      case n.charAt(0) !== '#':
        return String.fromCharCode(n.charAt(1) === 'x' ? parseInt(n.slice(2), 16) : n.slice(1) - 0);

      default:
        return "";
    }
  });
};

resolveUrl = function (base, href) {
  var key;
  key = ' ' + base;

  if (!baseUrls[key]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^\/]*$/.test(base)) {
      baseUrls[key] = base + '/';
    } else {
      baseUrls[key] = base.replace(/[^\/]+$/, ''); // rtrim not /
    }
  }

  base = baseUrls[key];

  switch (false) {
    case href.slice(0, 2) !== '//':
      return base.replace(/:[\s\S]*/, ':');

    case href.charAt(0) !== '/':
      return base.replace(/(:\/*[^\/]*)[\s\S]*/, '$1');

    default:
      return base;
  }
};

baseUrls = {};
originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

splitCells = function (tableRow, max) {
  var cells, i, j, len, o, row;
  row = tableRow.replace(/\|/g, function (match, offset, str) {
    var curr, escaped;
    escaped = false;
    curr = offset;

    while (--curr >= 0 && str[curr] === '\\') {
      escaped = !escaped;
    }

    if (escaped) {
      return '|';
    } else {
      return ' |';
    }
  });
  cells = row.split(/ \|/);

  if (cells.length > max) {
    cells.splice(max);
  } else {
    while (cells.length < max) {
      cells.push('');
    }
  }

  for (i = j = 0, len = cells.length; j < len; i = ++j) {
    o = cells[i];
    cells[i] = o.replace(/\\\|/g, '|').trim();
  }

  return cells;
};

Lexer = function () {
  class Lexer {
    static lex(src, options) {
      return new Lexer(options).lex(src);
    }

    constructor(options1) {
      this.options = options1;
      this.tokens = [];
      this.tokens.notes = [];
      this.tokens.links = {};
      this.tokens.abbrs = {};
      this.tokens.count = {};
      this.rules = block.normal;

      if (this.options.gfm) {
        this.rules = this.options.tables ? block.tables : block.gfm;
      }

      if (!this.options.indentCode) {
        this.rules.code = noop;
      }
    }

    lex(src) {
      src = repl.lexer(src);
      return this.token(src, true);
    }

    token(src, top) {
      var align, b, base1, bull, cap, cells, checkbox, checked, header, i, idx, is_ordered, item, j, k, l, len, len1, loose, mode, next, o, p, ref, ref1, ref2, ref3, space, tag, trim, type;

      while (src) {
        // newline
        if (cap = this.rules.newline.exec(src)) {
          src = src.slice(cap[0].length);

          if (cap[0].length) {
            this.tokens.push({
              type: 'space',
              text: cap[0]
            });
          }
        } // code


        if (cap = this.rules.code.exec(src)) {
          // console.log 'block code', cap
          src = src.slice(cap[0].length);
          cap = cap[0].replace(/^ {4}/gm, '');
          this.tokens.push({
            type: 'code',
            text: cap
          });
          continue;
        } // fences (gfm)


        if (cap = this.rules.fences.exec(src)) {
          // console.log 'block fences', cap
          src = src.slice(cap[0].length);
          mode = cap[1][0];

          switch (mode) {
            case ':':
              this.tokens.push({
                type: 'container_start',
                lang: cap[2]
              });
              this.token(cap[3], false);
              this.tokens.push({
                type: 'container_end',
                lang: cap[2]
              });
              break;

            default:
              this.tokens.push({
                type: 'code',
                lang: cap[2],
                text: cap[3] || ''
              });
          }

          continue;
        } // heading


        if (cap = this.rules.heading.exec(src)) {
          // console.log 'block heading', cap
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'heading',
            depth: cap[1].length,
            text: cap[2]
          });
          continue;
        } // table no leading pipe (gfm)


        if (cap = this.rules.table.exec(src)) {
          src = src.slice(cap[0].length);
          trim = /^\|? *|\ *\|? *$/g;
          header = splitCells(cap[1].replace(trim, ''));
          align = cap[2].replace(trim, '').split(/ *\| */);
          cells = (ref = (ref1 = cap[5]) != null ? ref1.replace(/\n$/, '').split('\n').map(o => {
            return o.replace(trim, '');
          }) : void 0) != null ? ref : [];

          while (header.length && !header[header.length - 1].trim()) {
            header.pop();
          }

          item = {
            type: 'table',
            header,
            align,
            cells,
            top
          };

          for (i = j = 0, len = align.length; j < len; i = ++j) {
            o = align[i];
            align[i] = /^ *-+: *$/.test(o) ? 'right' : /^ *:-+: *$/.test(o) ? 'center' : /^ *:-+ *$/.test(o) ? 'left' : null;
          }

          ref2 = item.cells;

          for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
            o = ref2[i];
            cells[i] = splitCells(o, item.align.length);
          }

          this.tokens.push(item);
          continue;
        } // hr


        if (cap = this.rules.hr.exec(src)) {
          // console.log 'block hr', cap
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'hr'
          });
          continue;
        } // blockquote


        if (cap = this.rules.blockquote.exec(src)) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'blockquote_start',
            mode: '>'
          });
          cap = cap[0].replace(/^ *> ?/gm, '').replace(/\n$/, ''); // Pass `top` to keep the current
          // "toplevel" state. This is exactly
          // how markdown.pl works.

          this.token(cap, false);
          this.tokens.push({
            type: 'blockquote_end'
          });
          continue;
        } // list


        if (cap = this.rules.list.exec(src)) {
          // console.log 'block list', cap
          src = src.slice(cap[0].length);
          bull = cap[2];
          is_ordered = "." === bull.slice(-1);
          this.tokens.push({
            type: 'list_start',
            ordered: is_ordered,
            start: is_ordered ? +bull : ''
          }); // Get each top-level item.

          cap = cap[0].match(this.rules.item);
          next = false;
          l = cap.length;
          i = 0;

          while (i < l) {
            item = cap[i]; // Remove the list item's bullet
            // so it is seen as the next token.

            space = item.length;
            item = item.replace(this.rules.with_bullet, '');

            if (~item.indexOf('\n ')) {
              space -= item.length;
              item = item.replace(RegExp(`^ {1,${space}}`, "gm"), '');
            } // Determine whether the next list item belongs here.
            // Backpedal if it does not belong in this list.


            if (this.options.smartLists && i !== l - 1) {
              b = block.bullet.exec(cap[i + 1])[0];

              if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                src = cap.slice(i + 1).join('\n') + src;
                i = l - 1;
              }
            } // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.


            loose = next || /\n\n(?!\s*$)/.test(item);

            if (i !== l - 1) {
              next = item.charAt(item.length - 1) === '\n';

              if (!loose) {
                loose = next;
              }
            } // Check for task list items


            checkbox = this.rules.checkbox.exec(item);
            checked = checkbox ? (item = item.replace(this.rules.checkbox, ''), checkbox[1] !== ' ') : void 0;
            type = loose ? 'loose_item_start' : 'list_item_start';
            this.tokens.push({
              checked,
              type,
              task: checked != null
            }); // Recurse.

            this.token(item, false);
            this.tokens.push({
              type: 'list_item_end'
            });
            i++;
          }

          this.tokens.push({
            type: 'list_end'
          });
          continue;
        } // html


        if (cap = this.rules.html.exec(src)) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: this.options.sanitize ? 'paragraph' : 'html',
            pre: !this.options.sanitizer && ((ref3 = cap[1]) === 'pre' || ref3 === 'script' || ref3 === 'style'),
            text: cap[0]
          });
          continue;
        } // ruby_heads


        if (cap = this.rules.ruby_heads.exec(src)) {
          // console.log 'ruby', cap
          src = src.slice(cap[0].length);

          for (idx = p = 1; p <= 4; idx = ++p) {
            if (cap[idx]) {
              cap[idx].replace(this.rules.ruby[idx].item, (_, tag, title) => {
                var base1;
                return (base1 = this.tokens.abbrs)[tag] || (base1[tag] = {
                  title
                });
              });
            }
          }

          this.tokens.abbrs_reg = inline.words(Object.keys(this.tokens.abbrs));
          continue;
        } // def


        if (top && (cap = this.rules.def.exec(src))) {
          // console.log 'def', cap
          src = src.slice(cap[0].length);

          if (cap[3]) {
            cap[3] = cap[3].slice(1, -1);
          }

          tag = cap[1].toLowerCase();
          (base1 = this.tokens.links)[tag] || (base1[tag] = {
            href: cap[2],
            title: cap[3]
          });
          continue;
        } // lheading


        if (cap = this.rules.lheading.exec(src)) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'heading',
            depth: cap[2] === '=' ? 1 : 2,
            text: cap[1]
          });
          continue;
        } // top-level paragraph


        if (top && (cap = this.rules.paragraph.exec(src))) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'paragraph',
            text: cap[0]
          });
          continue;
        } // text


        if (cap = this.rules.text.exec(src)) {
          // Top-level should never reach here.
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'text',
            text: cap[0],
            top: top
          });
          continue;
        }

        if (src) {
          throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
      }

      return this.tokens;
    }

  }

  ;
  Lexer.rules = block;
  return Lexer;
}.call(undefined);

InlineLexer = function () {
  class InlineLexer {
    static output(src, options) {
      return new InlineLexer(options, options).output(src);
    }

    static escapes(text) {
      return (text != null ? text.replace(InlineLexer.rules._escapes, '$1') : void 0) || text;
    }

    constructor({
      count: count1,
      notes: notes1,
      links,
      abbrs,
      abbrs_reg
    }, options) {
      this.count = count1;
      this.notes = notes1;
      this.links = links;
      this.abbrs = abbrs;
      this.abbrs_reg = abbrs_reg;
      this.options = options;
      this.rules = inline.normal;
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;

      if (!this.notes) {
        throw new Error('Tokens array requires a `notes` property.');
      }

      if (!this.links) {
        throw new Error('Tokens array requires a `links` property.');
      }

      if (this.options.gfm) {
        this.rules = inline.gfm;
      }

      this.rules.cite = this.options.cite && this.options.context ? this.rules._cite : noop;
      this.rules.em = this.options.em ? this.rules._em : noop;
    }

    output(src) {
      var base1, cap, cite1, cite2, count, href, j, len, link, mark, method, name, num, o, out, ref, ref1, s, text, title;
      out = [];
      out.plain = "";

      while (src) {
        // escape
        if (cap = this.rules.escape.exec(src)) {
          // console.log 'escape', cap
          src = src.slice(cap[0].length);
          text = cap[1];
          out.push(text);
          out.plain += text;
          continue;
        } // cite


        if (cap = this.rules.cite.exec(src)) {
          // console.log 'cite', cap
          src = src.slice(cap[0].length);
          text = cap[0];
          cite1 = cap[1].slice(1).split("-");

          if (cap[2]) {
            cite2 = cap[2].slice(1).split("-");
          }

          out.push(this.renderer.cite(text, ...this.cite_range(cite1, cite2)));
          out.plain += text;
          continue;
        } // autolink


        if (cap = this.rules.autolink.exec(src)) {
          // console.log 'autolink', cap
          src = src.slice(cap[0].length);

          if (cap[2] === '@') {
            text = cap[1];
            href = 'mailto:' + text;
          } else {
            text = cap[1];
            href = text;
          }

          out.push(this.outputLargeBrackets({
            text
          }, {
            href
          }));
          out.plain += text;
          continue;
        }

        if (!this.inLink && (cap = this.rules.url.exec(src))) {
          // console.log 'url (gfm)', cap
          if (cap[2] === '@') {
            text = cap[0];
            href = 'mailto:' + text;
          } else {
            cap[0] = this.rules._backpedal.exec(cap[0])[0];
            text = cap[0];

            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }

          src = src.slice(cap[0].length);
          out.push(this.outputLargeBrackets({
            text
          }, {
            href
          }));
          out.plain += text;
          continue;
        } // strong


        if (cap = this.rules.strong.exec(src)) {
          // console.log 'strong', cap
          src = src.slice(cap[0].length);
          count = (base1 = this.count)[name = cap[0][1]] != null ? base1[name] : base1[name] = 0;
          ++this.count[cap[0][1]];

          method = function () {
            switch (cap[0][1]) {
              case '_':
              case '*':
                return 'strong';

              case '-':
                // strikeout (markdown-it)
                return 'strikeout';

              case ':':
                // span (markdown-it)
                return 'span';

              case '+':
                // ins (markdown-it)
                return 'ins';

              case '[':
                // kbd (markdown-it)
                return 'kbd';

              case '~':
                // del (gfm)
                return 'del';

              case '=':
                // Mark (markdown preview enhanced extended syntax)
                return 'mark';
            }
          }();

          text = this.output(cap[0].slice(2, -2));
          out.push(this.renderer[method](text, count));
          out.plain += text.plain;
          continue;
        } // tag


        if (cap = this.rules.tag.exec(src)) {
          if (!this.inLink && /^<a /i.test(cap[0])) {
            this.inLink = true;
          } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
            this.inLink = false;
          }

          src = src.slice(cap[0].length);
          text = cap[0];
          out.plain += text;
          out.push(this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(text) : text : text);
          continue;
        } // link


        if (cap = this.rules.link.exec(src)) {
          // console.log 'link', cap
          src = src.slice(cap[0].length);
          mark = cap[0].charAt(0);

          if (mark === '!') {
            text = cap[1];
          } else {
            this.inLink = true;
            text = this.output(cap[1]);
            this.inLink = false;
          }

          href = InlineLexer.escapes(cap[2].trim().replace(/^<([\s\S]*)>$/, '$1'));
          title = InlineLexer.escapes(((ref = cap[3]) != null ? ref.slice(1, -1) : void 0) || '');
          out.push(this.outputLargeBrackets({
            mark,
            text
          }, {
            href,
            title
          }));
          out.plain += text.plain;
          continue;
        } // reflink, nolink


        if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
          // console.log 'ref|no link', cap
          src = src.slice(cap[0].length);
          mark = cap[0].charAt(0);
          link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = this.links[link.toLowerCase()];

          if (!(link != null ? link.href : void 0)) {
            out.push(mark);
            out.plain += mark;
            src = cap[0].slice(1) + src;
            continue;
          }

          this.inLink = true;
          text = this.output(cap[1]);
          this.inLink = false;
          out.push(this.outputLargeBrackets({
            mark,
            text
          }, link));
          out.plain += text.plain;
          continue;
        } // note


        if (cap = this.rules.note.exec(src)) {
          // console.log 'note', cap
          src = src.slice(cap[0].length);
          text = this.output(cap[1]);
          this.notes.push(o = {
            text
          });
          o.href = '#' + (num = this.notes.length);
          out.push(this.renderer.note(num, text, text.plain));
          out.plain += text.plain;
          continue;
        } // br


        if (cap = this.rules.br.exec(src)) {
          // console.log 'br', cap
          src = src.slice(cap[0].length);
          out.push(this.renderer.br());
          out.plain += "\n";
          continue;
        } // em


        if (cap = this.rules.em.exec(src)) {
          // console.log 'em', cap
          src = src.slice(cap[0].length);
          text = cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1];
          text = this.output(text, cap[0][0]);
          out.push(this.renderer.em(text));
          out.plain += text.plain;
          continue;
        } // sup, sub


        if (cap = this.rules.supsub.exec(src)) {
          // console.log 'supsub', cap
          src = src.slice(cap[0].length);

          method = function () {
            switch (cap[0][0]) {
              case '^':
                // sup (markdown-it)
                return 'sup';

              case '~':
                // sub (markdown-it)
                return 'sub';
            }
          }();

          text = this.output(cap[0].slice(1, -1));
          out.push(this.renderer[method](text, text.plain));
          out.plain += text.plain;
          continue;
        } // code


        if (cap = this.rules.code.exec(src)) {
          // console.log 'code', cap
          src = src.slice(cap[0].length);
          out.push(this.renderer.codespan(cap[2], true));
          out.plain += cap[2];
          continue;
        } // mdi


        if (cap = this.rules.mdi.exec(src)) {
          // console.log 'mdi', cap
          src = src.slice(cap[0].length);
          out.push(this.renderer.mdi(cap[1]));
          out.plain += "@";
          continue;
        } // ruby (inline)


        if (cap = this.rules.ruby.exec(src)) {
          // console.log 'ruby', cap
          src = src.slice(cap[0].length);
          text = cap[2] || cap[1];
          out.plain += text;
          out.push(this.renderer.abbr(text, cap[3]));
          continue;
        } // text


        if (cap = this.rules.text.exec(src)) {
          // console.log 'text', cap
          src = src.slice(cap[0].length);
          text = cap[0];

          if (this.abbrs_reg) {
            ref1 = text.split(this.abbrs_reg);

            for (j = 0, len = ref1.length; j < len; j++) {
              s = ref1[j];
              o = this.abbrs[s];
              text = this.smartypants(s);
              out.plain += text;

              if (o) {
                out.push(this.renderer.abbr(text, o.title));
              } else {
                out.push(this.renderer.text(text));
              }
            }
          } else {
            text = this.smartypants(text);
            out.plain += text;
            out.push(this.renderer.text(text));
          }

          continue;
        }

        if (src) {
          throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
      }

      return out;
    }

    outputLargeBrackets({
      mark,
      text
    }, {
      href = '',
      title = ''
    }) {
      var base, e, prot, url;

      if (this.options.sanitize) {
        try {
          prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
        } catch (error) {
          e = error;
          return text;
        }

        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return text;
        }
      }

      if (this.options.baseUrl && !originIndependentUrl.test(href)) {
        base = resolveUrl(this.options.baseUrl, href);
      }

      url = this.renderer.url(href, base);

      switch (mark) {
        case '!':
          return this.renderer.image(url, title, text);

        default:
          return this.renderer.link(url, title, text);
      }
    }

    smartypants(text) {
      if (!this.options.smartypants) {
        return text;
      }

      return repl.smartypants(text);
    }

    cite_range(cite1, cite2) {
      var a, b, c, chat_idx1, chat_idx2, part_id, part_idx, phase_idx1, phase_idx2, size1, size2;
      ({
        part_id
      } = this.options.context);

      if (!part_id) {
        return [];
      }

      if (!cite1) {
        return [];
      }

      size1 = cite1.length;

      if (!(2 <= size1 && size1 <= 3)) {
        return [];
      }

      [a, b, c] = part_id.split("-");
      chat_idx1 = cite1.pop();
      phase_idx1 = cite1.pop();
      part_idx = cite1.pop() || c;
      cite1 = [a, b, part_idx, phase_idx1, chat_idx1].join("-");

      if (!this.renderer.cite_exist(cite1)) {
        return [];
      }

      if (!cite2) {
        return [cite1];
      }

      size2 = cite2.length;

      if (!(1 <= size2 && size2 <= 2)) {
        return [cite1];
      }

      chat_idx2 = cite2.pop();
      phase_idx2 = cite2.pop();

      if (phase_idx2 == null) {
        phase_idx2 = phase_idx1;
      }

      cite2 = [a, b, part_idx, phase_idx2, chat_idx2].join("-");

      if (!this.renderer.cite_exist(cite2)) {
        return [cite1];
      }

      return [cite1, cite2];
    }

  }

  ;
  /*
   * Expose Inline Rules
   */

  InlineLexer.rules = inline;
  return InlineLexer;
}.call(undefined); // Parsing & Compiling


Parser = class Parser {
  static parse(src, options, renderer) {
    return new Parser(options, renderer).parse(src);
  }

  constructor(options1) {
    this.options = options1;
    this.tokens = [];
    this.token = null;
    ({
      renderer: this.renderer
    } = this.options);
  }

  parse(src) {
    var j, len, m, notes, out, ref, tag, text;
    ({
      m
    } = this.options);
    this.inline = new InlineLexer(src, this.options);
    this.tokens = src.reverse();
    out = [];

    while (this.next()) {
      out.push(this.tok());
    }

    if (src.notes.length) {
      out.push(this.renderer.hr());
      notes = [];
      ref = src.notes;

      for (j = 0, len = ref.length; j < len; j++) {
        ({
          text
        } = ref[j]);
        notes.push(this.renderer.listitem(text));
      }

      out.push(this.renderer.list(notes, true, 1));
    }

    tag = this.options.tag;

    if (tag) {
      return m(tag, {}, out);
    } else {
      return out.join("");
    }
  }

  next() {
    return this.token = this.tokens.pop();
  }

  peek() {
    return this.tokens[this.tokens.length - 1] || 0;
  }

  parseText() {
    var body;
    body = this.token.text;

    while (this.peek().type === 'text') {
      body += this.next().text;
    }

    return this.inline.output(body);
  }
  /*
   * Parse Current Token
   */


  tok() {
    var body, checked, header, html, i, j, lang, len, mode, ordered, ref, row, start, taskList, tasklist, text, tr;

    switch (this.token.type) {
      case 'space':
        return this.token.text;

      case 'hr':
        return this.renderer.hr();

      case 'heading':
        text = this.inline.output(this.token.text);
        return this.renderer.heading(text, this.token.depth, text.plain);

      case 'code':
        return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);

      case 'table':
        tr = (header, args) => {
          var cell, i, j, len, str;
          cell = [];

          for (i = j = 0, len = args.length; j < len; i = ++j) {
            str = args[i];
            cell.push(this.renderer.tablecell(this.inline.output(str), {
              header,
              align: this.token.align[i]
            }));
          }

          if (cell.length) {
            return this.renderer.tablerow(cell);
          } else {
            return [];
          }
        };

        header = tr(true, this.token.header);
        body = [];
        ref = this.token.cells;

        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          row = ref[i];
          body.push(tr(false, row));
        }

        return this.renderer.table(header, body, this.token.top);

      case 'container_start':
        ({
          lang
        } = this.token);
        body = [];

        while (this.next().type !== 'container_end') {
          body.push(this.tok());
        }

        return this.renderer.container(body, lang);

      case 'blockquote_start':
        ({
          mode
        } = this.token);
        body = [];

        while (this.next().type !== 'blockquote_end') {
          body.push(this.tok());
        }

        return this.renderer.blockquote(body, mode);

      case 'list_start':
        ({
          ordered,
          start
        } = this.token);
        body = [];
        tasklist = false;

        while (this.next().type !== 'list_end') {
          if (this.token.checked != null) {
            taskList = true;
          }

          body.push(this.tok());
        }

        return this.renderer.list(body, ordered, start, taskList);

      case 'list_item_start':
        body = [];
        ({
          checked
        } = this.token);

        while (this.next().type !== 'list_item_end') {
          if (this.token.type === 'text') {
            body = [...body, ...this.parseText()];
          } else {
            body.push(this.tok());
          }
        }

        return this.renderer.listitem(body, checked);

      case 'loose_item_start':
        body = [];
        ({
          checked
        } = this.token);

        while (this.next().type !== 'list_item_end') {
          body.push(this.tok());
        }

        return this.renderer.listitem(body, checked);

      case 'html':
        html = !this.token.pre ? this.inline.output(this.token.text) : this.token.text;
        return this.renderer.html(html);

      case 'paragraph':
        return this.renderer.paragraph(this.inline.output(this.token.text), true);

      case 'text':
        return this.renderer.paragraph(this.parseText(), this.token.top);
    }
  }

}; // Marked

marked = function (src, opt) {
  var e, m, message, tokens, txt; // throw error in case of non string input

  if (!src) {
    throw new Error('marked(): input parameter is undefined or null');
  }

  if (typeof src !== 'string') {
    txt = Object.prototype.toString.call(src);
    throw new Error(`marked(): input parameter is of type ${txt}, string expected`);
  }

  try {
    opt.renderer.options = opt;
    tokens = Lexer.lex(src, opt);
    return Parser.parse(tokens, opt);
  } catch (error) {
    e = error;
    ({
      m
    } = opt);
    e.message += '\nPlease report this to https://github.com/7korobi/vue-markup.';

    if (opt.silent) {
      message = `${e.message}`;
      return m('p', {}, ["An error occured:", m('pre', {}, message)]);
    }

    throw e;
  }
}; // Options


marked.defaults = {}; // Expose

marked.Parser = Parser;
marked.parser = Parser.parse;
marked.Lexer = Lexer;
marked.lexer = Lexer.lex;
marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;
marked.parse = marked;
module.exports = marked;

/***/ }),

/***/ "./src/marked-regexp.coffee":
/*!**********************************!*\
  !*** ./src/marked-regexp.coffee ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Block-Level Grammer
 */

/*
 * Inline-Level Grammar
 */
var a, block, c, edit, inline, list, noop, repl, replacements, z;

edit = function (regex, opt) {
  var self;
  regex = regex.source || regex;
  opt = opt || '';
  return self = function (name, val) {
    if (name) {
      val = val.source || val;
      val = val.replace(/(^|[^\\\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return self;
    } else {
      return new RegExp(regex, opt);
    }
  };
};

noop = function () {};

noop.exec = noop;
block = {
  newline: /^ *\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n|$)/,
  table: noop,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( *)(bull)[\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull)\n*|\s*$)/,
  html: /^ {0,3}(?:<(script|pre|style)[\s>][\s\S]*?(?:<\/\1>[^\n]*\n+|$)|comment[^\n]*(\n+|$)|<\?[\s\S]*?\?>\n*|<![A-Z][\s\S]*?>\n*|<!\[CDATA\[[\s\S]*?\]\]>\n*|<\/?(tag)(?: +|\n|\/?>)[\s\S]*?(?:\n{2,}|$)|<(?!script|pre|style)([a-z][\w-]*)(?:attribute)*? *\/?>(?=\h*\n)[\s\S]*?(?:\n{2,}|$)|<\/(?!script|pre|style)[a-z][\w-]*\s*>(?=\h*\n)[\s\S]*?(?:\n{2,}|$))/,
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n|$)/,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n|$)/,
  checkbox: /^\[([ xX])\] +/,
  paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
  text: /^[^\n]+/,
  ruby: noop
};
block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)('label', block._label)('title', block._title)();
block.with_bullet = /^ *([*+-]|\d+\.) */;
block.bullet = /(?:[*+-] |\d+\.)/;
block.item = /^( *)(bull)[^\n]*(?:\n(?!\1bull)[^\n]*)*/;
block.item = edit(block.item, 'gm')(/bull/g, block.bullet)();
block.list = edit(block.list)(/bull/g, block.bullet)('hr', /\n+(?=\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n|$))/)('def', RegExp(`\\n+(?=${block.def.source})`))();
block._tag = /address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul/;
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit(block.html, 'i')('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)('comment', block._comment)('tag', block._tag)();
block.paragraph = edit(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('tag', block._tag)();
block.blockquote = edit(block.blockquote)('paragraph', block.paragraph)();
block.normal = Object.assign({}, block);
block.gfm = Object.assign({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}|:{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n|$)/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n|$)/,
  _ruby_item: /\s+([^A]+)A([^Z]+)Z/g,
  _ruby_head: /^AZ((?:[^\S\n]+[^A\n]+A[^Z\n]+Z)+[^\S\n]*)(?:\n|$)/
});

block.gfm.ruby = function () {
  var i, len, ref, results;
  ref = ['()', '{}', '[]', '《》'];
  results = [];

  for (i = 0, len = ref.length; i < len; i++) {
    [a, z] = ref[i];
    results.push({
      item: edit(block.gfm._ruby_item, 'g')(/A/g, '\\' + a)(/Z/g, '\\' + z)(),
      head: edit(block.gfm._ruby_head)(/A/g, '\\' + a)(/Z/g, '\\' + z)()
    });
  }

  return results;
}();

block.gfm.ruby_heads = new RegExp(block.gfm.ruby.map(({
  head
}) => {
  return head.source;
}).join("|"));
block.gfm.ruby.unshift({});
block.paragraph = block.gfm.paragraph = edit(block.paragraph)('(?!', `(?!${block.gfm.fences.source.replace('\\1', '\\2')}|${block.list.source.replace('\\1', '\\3')}|`)();
block.tables = Object.assign({}, block.gfm, {
  table: /^ *(.*\|.*) *\n *((\|?) *:?-+:? *(?:\| *:?-+:? *)*(\|?))(?:\n *((?:\3.*[^>\n ].*\4(?:\n|$))*)|$)/
});
inline = {
  _cite: /^((?:-\w+){2,})(?:\s*\.\.\s*((?:-\w+){1,}))?(?![-.])/,
  _attribute: /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,
  _scheme: /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,
  _title: /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,
  _supsub: /^code(?:[^\s]|codecode)+code(?!code)/,
  _escapes: /\\([!"#$%&'()*+,\-.\/:;<=>?@\[\]\\^_`{|}~])/g,
  _strong: /^codecode(?:[^code]|[^code]code|code[^code])+codecode(?!code)/,
  _strong_other: /^\[\[(?:[^\]]|[^\]]\]|\][^\]])+\]\](?!\])/,
  _em: /^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)|^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)/,
  _email: /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,
  _label: /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/,
  _href: /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?)/,
  _url_peice: /^$|^mailto:|:\/\/|^(\.{0,2})[\?\#\/]|^[\w()%+:\/]+$/ig,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
  note: /^\^\[(label)\]/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  mdi: /^:(mdi-[^:]+):(?!:)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,
  url: noop,
  text: /^[\s\S]+?(?=[\-\[\\<!`*~^]|\b_|\[\[|\*\*|\+\+|__|~~|==|::|ruby|https?:\/\/|ftp:\/\/|www\.|[a-zA-Z0-9.!#$%&\'*+\/=?^_`{\\|}~-]+@|\s*\n|$)/,
  tag: /^comment|^<\/[a-zA-Z][\w:-]*\s*>|^<[a-zA-Z][\w-]*(?:attribute)*?\s*\/?>|^<\?[\s\S]*?\?>|^<![a-zA-Z]+\s[\s\S]*?>|^<!\[CDATA\[[\s\S]*?\]\]>/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  ruby: /^([|｜]([^《]+)|(?:\w+)|(?:[\u30A1-\u30FF]+)|(?:[\u3041-\u309F・ー]+)|(?:(?:[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])+))《([^\n》]+)》/
};

list = function () {
  var i, len, ref, results;
  ref = ['_', '~', '=', ':', '\\*', '\\+', '\\-'];
  results = [];

  for (i = 0, len = ref.length; i < len; i++) {
    c = ref[i];
    results.push(edit(inline._strong)(/code/g, c)().source);
  }

  return results;
}();

list.push(inline._strong_other.source);
inline.strong = new RegExp(list.join("|"));

list = function () {
  var i, len, ref, results;
  ref = ['\\^', '~'];
  results = [];

  for (i = 0, len = ref.length; i < len; i++) {
    c = ref[i];
    results.push(edit(inline._supsub)(/code/g, c)().source);
  }

  return results;
}();

inline.supsub = new RegExp(list.join("|"));
inline.escape = new RegExp('^' + inline._escapes.source);
inline.autolink = edit(inline.autolink)('scheme', inline._scheme)('email', inline._email)();
inline.tag = edit(inline.tag)('comment', block._comment)('attribute', inline._attribute)();
inline.link = edit(inline.link)('label', inline._label)('href', inline._href)('title', inline._title)();
inline.reflink = edit(inline.reflink)('label', inline._label)();
inline.note = edit(inline.note)('label', inline._label)();
inline.text = edit(inline.text)('ruby', inline.ruby)();

inline.words = function (list, extra = []) {
  var keys;
  keys = [...extra.map(function (s) {
    return s.source || s;
  }), ...list.map(function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  })];
  return RegExp(`(${keys.join('|')})`, "g");
};

inline.normal = Object.assign({}, inline);
inline.gfm = Object.assign({}, inline.normal, {
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  _url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/
});
inline.gfm.url = edit(inline.gfm._url)('email', inline.gfm._extended_email)();

replacements = function (hash, extra, cb) {
  var key;

  if (cb == null) {
    cb = function (s) {
      return this[s];
    };
  }

  key = inline.words(Object.keys(hash), extra);
  return function (src) {
    return src.replace(key, cb.bind(hash));
  };
};

repl = {
  lexer: replacements({
    '\r\n': '\n',
    '\r': '\n',
    '\t': '    ',
    '\u00a0': ' ',
    '\u2424': '\n'
  }),
  smartypants: replacements({
    '...': '\u2026',
    // ellipses
    '---': '\u2014',
    // em-dashes
    '--': '\u2013',
    // en-dashes
    '+-': '\u00B1',
    // markdown-it replacements
    "'": '\u2019',
    // closing singles & apostrophes
    '"': '\u201d' // closing doubles

  }, [/(^|---|['"\/({\-\s\[])(['"])/], function (__, str, hd, chr) {
    switch (chr) {
      case void 0:
        return this[str];

      case hd:
        return str;

      case "'":
        return `${hd}\u2018`;

      case '"':
        return `${hd}\u201c`;

      default:
        return this[str];
    }
  })
};
module.exports = {
  block,
  inline,
  repl,
  noop
};

/***/ }),

/***/ "./src/marked.vue":
/*!************************!*\
  !*** ./src/marked.vue ***!
  \************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./marked.vue?vue&type=script&lang=coffee& */ "./src/marked.vue?vue&type=script&lang=coffee&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
var render, staticRenderFns




/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  _marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/marked.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/marked.vue?vue&type=script&lang=coffee&":
/*!*****************************************************!*\
  !*** ./src/marked.vue?vue&type=script&lang=coffee& ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/coffee-loader??ref--0!../node_modules/vue-loader/lib??vue-loader-options!./marked.vue?vue&type=script&lang=coffee& */ "./node_modules/coffee-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/marked.vue?vue&type=script&lang=coffee&");
/* harmony import */ var _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marked_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/marksvg-parse.coffee":
/*!**********************************!*\
  !*** ./src/marksvg-parse.coffee ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var do_parse, parse, stringify, syntax;
({
  syntax
} = __webpack_require__(/*! ./marksvg-regexp */ "./src/marksvg-regexp.coffee"));

parse = function (render, src) {
  return do_parse([], render, src);
};

do_parse = function (tokens, render, src) {
  var $, all, cap, edges, end, headpos, i, idx, label, len, line, line2, nodes, rects, ref, ref1, side, start, tailpos, type, v, vid, vl, vm, vs, w, wl, wm, x, y;

  while (src) {
    // console.log src
    if (cap = syntax.newline.exec(src)) {
      [all] = cap;
      src = src.slice(all.length); // console.log "newline", cap

      render.newline();
      type = "newline";
      tokens.push({
        type,
        all
      });
      continue;
    }

    if (cap = syntax.edges.exec(src)) {
      [all, edges, v, $, $, $, $, $, label] = cap;
      src = src.slice(all.length); // console.log "edges", cap

      edges = edges.split(syntax._arrow_).map(function (s) {
        return s != null ? s.trim() : void 0;
      });

      for (idx = i = 0, len = edges.length; i < len; idx = i += 6) {
        v = edges[idx];
        [v, start, line, side, line2, end, w] = edges.slice(idx, +(idx + 6) + 1 || 9e9);

        if (line !== line2) {
          render.error(` ${edges.slice(idx, +(idx + 6) + 1 || 9e9).join("")} 線の前後が異なります。`);
          break;
        }

        if (!w) {
          continue;
        }

        [vm, v, vl] = render.dic(v);
        [wm, w, wl] = render.dic(w);
        ({
          rects
        } = render.data);

        if (rects[v] && rects[w]) {
          headpos = (ref = side != null ? side[0] : void 0) != null ? ref : '>';
          tailpos = (ref1 = side != null ? side[1] : void 0) != null ? ref1 : '<';
          render.edge(v, w, line, start, end, headpos, tailpos, label);
        } else {
          render.error(` ${edges.slice(idx, +(idx + 6) + 1 || 9e9).join("")} 要素が未定義です。`);
        }
      }

      type = "edges";
      tokens.push({
        type,
        all
      });
      continue;
    }

    if (cap = syntax.nodes.exec(src)) {
      [all, label, nodes] = cap;
      src = src.slice(all.length); // console.log "nodes", cap

      nodes = nodes.trim().split(syntax.pick_node);

      vs = function () {
        var j, len1, results;
        results = [];

        for (idx = j = 0, len1 = nodes.length; j < len1; idx = j += 5) {
          $ = nodes[idx];
          [$, x, side, y, v] = nodes.slice(idx, +(idx + 4) + 1 || 9e9);

          if (!v) {
            continue;
          }

          [vm, vid, vl] = render.dic(v);

          if (!render.is_cluster(vid)) {
            render[vm](vid, vl, side, x, y);
            render.node(v, vid);
          }

          results.push(vid);
        }

        return results;
      }();

      if (label) {
        render.cluster(vs, label);
      }

      type = "nodes";
      tokens.push({
        type,
        all
      });
      continue;
    }

    if (cap = syntax.error.exec(src)) {
      [all] = cap;
      src = src.slice(all.length);
      render.error(`${all} 解釈できない文字列です。`);
      type = "error";
      tokens.push({
        type,
        all
      });
      continue;
    }
  }

  return tokens;
};

stringify = function (tokens, data) {
  var all, dest, i, len, type;
  dest = "";

  for (i = 0, len = tokens.length; i < len; i++) {
    ({
      type,
      all
    } = tokens[i]);

    switch (type) {
      case 'nodes':
        dest += all.replace(syntax.pick_node, function ($, x, side, y, v) {
          var key, o;

          if (o = data.nodes[v]) {
            ({
              x,
              y,
              key
            } = o);
            return `<${x}${key[0]}${y}>${v}`;
          } else {
            return v;
          }
        });
        break;

      case 'newline':
        dest += all;
        break;

      case 'edges':
        dest += all;
        break;

      case 'error':
        dest += all;
        break;

      default:
        throw new Error("tokens unimplement.");
    }
  }

  return dest;
};

module.exports = {
  parse,
  stringify
};

/***/ }),

/***/ "./src/marksvg-regexp.coffee":
/*!***********************************!*\
  !*** ./src/marksvg-regexp.coffee ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexp_join, syntax;

regexp_join = function (regex, ...names) {
  var flags, i, key, len, name, source, val;
  ({
    flags,
    source
  } = regex);

  for (i = 0, len = names.length; i < len; i++) {
    name = names[i];
    key = new RegExp(name, 'g');
    val = syntax[name];
    val = val.source || val;
    source = source.replace(key, val);
  }

  return new RegExp(source, flags);
};

syntax = {
  nodes: /^(?:_header_)? *((?:(?:_xy_)?_id__sep_)+)_eol_/,
  edges: /^ *((_id_)?(?: *_arrow_ *_id_)+) *(?:_comment_)?_eol_/,
  newline: /^ *\n|^ +$/,
  error: /^[^\n]*\n|[^\n]+$/,
  pick_node: /(?:<(\d+)(_side_| )?(\d+)>)?(_id_)/g,
  _xy_: /<\d+(?:_side_| )?\d+>/,
  _id_: /[^\n\s<>#]+/,
  _arrow_: /(<|X|x|O|o)?_line_(_side_{2,2})?_line_(>|X|x|O|o)?/,
  _header_: /#{1,3} *(.*) *\n/,
  _comment_: /#{1,3} *(.*) */,
  _line_: /(-|=|\.)+/,
  _side_: /[udlrUDLRv^<>]/,
  _sep_: / *\n? */,
  _eol_: / *(?:\n|$)/
};
syntax._xy_ = regexp_join(syntax._xy_, '_side_');
syntax._arrow_ = regexp_join(syntax._arrow_, '_line_', '_side_');
syntax.pick_node = regexp_join(syntax.pick_node, '_id_', '_side_');
syntax.nodes = regexp_join(syntax.nodes, '_xy_', '_id_', '_header_', '_sep_', '_eol_');
syntax.edges = regexp_join(syntax.edges, '_id_', '_arrow_', '_comment_', '_eol_');
module.exports = {
  syntax
};

/***/ }),

/***/ "./src/marksvg.vue":
/*!*************************!*\
  !*** ./src/marksvg.vue ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _marksvg_vue_vue_type_template_id_4b30752e_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./marksvg.vue?vue&type=template&id=4b30752e&lang=pug& */ "./src/marksvg.vue?vue&type=template&id=4b30752e&lang=pug&");
/* harmony import */ var _marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./marksvg.vue?vue&type=script&lang=coffee& */ "./src/marksvg.vue?vue&type=script&lang=coffee&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_1__["default"],
  _marksvg_vue_vue_type_template_id_4b30752e_lang_pug___WEBPACK_IMPORTED_MODULE_0__["render"],
  _marksvg_vue_vue_type_template_id_4b30752e_lang_pug___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/marksvg.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/marksvg.vue?vue&type=script&lang=coffee&":
/*!******************************************************!*\
  !*** ./src/marksvg.vue?vue&type=script&lang=coffee& ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/coffee-loader??ref--0!../node_modules/vue-loader/lib??vue-loader-options!./marksvg.vue?vue&type=script&lang=coffee& */ "./node_modules/coffee-loader/index.js?!./node_modules/vue-loader/lib/index.js?!./src/marksvg.vue?vue&type=script&lang=coffee&");
/* harmony import */ var _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_coffee_loader_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_script_lang_coffee___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/marksvg.vue?vue&type=template&id=4b30752e&lang=pug&":
/*!*****************************************************************!*\
  !*** ./src/marksvg.vue?vue&type=template&id=4b30752e&lang=pug& ***!
  \*****************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_template_id_4b30752e_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/pug-plain-loader!../node_modules/vue-loader/lib??vue-loader-options!./marksvg.vue?vue&type=template&id=4b30752e&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/pug-plain-loader/index.js!./node_modules/vue-loader/lib/index.js?!./src/marksvg.vue?vue&type=template&id=4b30752e&lang=pug&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_template_id_4b30752e_lang_pug___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_marksvg_vue_vue_type_template_id_4b30752e_lang_pug___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "dagre":
/*!************************!*\
  !*** external "dagre" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dagre");

/***/ }),

/***/ "file-system":
/*!******************************!*\
  !*** external "file-system" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("file-system");

/***/ }),

/***/ "glob":
/*!***********************!*\
  !*** external "glob" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("glob");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "turndown":
/*!***************************!*\
  !*** external "turndown" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("turndown");

/***/ }),

/***/ "turndown-plugin-gfm":
/*!**************************************!*\
  !*** external "turndown-plugin-gfm" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("turndown-plugin-gfm");

/***/ }),

/***/ "vue-test-utils":
/*!*********************************!*\
  !*** external "vue-test-utils" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vue-test-utils");

/***/ })

/******/ })));
//# sourceMappingURL=marked_spec.js.map