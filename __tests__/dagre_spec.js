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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(13)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
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
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var marked, options, vm;

marked = __webpack_require__(14);

options = {
  tag: 'article',
  langPrefix: 'lang-',
  ruby: true,
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
  props: ["value"],
  render: function(m) {
    var value;
    ({value} = this);
    if (value) {
      options.m = m;
      options.renderer.options = options;
      return marked(value, options);
    } else {
      return '';
    }
  }
};

module.exports = vm;

module.exports.default = vm;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var dagre, init, options, parse, vm;

dagre = __webpack_require__(19);

parse = __webpack_require__(20);

init = function(options) {
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
  style: {
    edge_label_width: 20,
    border_width: 10
  },
  graph: {
    // acyclicer: 'greedy'
    // ranker: 'network-simplex'
    // ranker: 'tight-tree'
    ranker: 'longest-path',
    rankdir: 'RL', // TB / BT / LR / RL
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
  props: ["value"],
  methods: {
    path_d: function(list) {
      return 'M' + list.map(function({x, y}) {
        return `${x},${y}`;
      // .join('T') # CurveTo Cx1,y1 x2,y2 x,y Sx2y2 x,y Qx1,y1, x,y Tx,y
      }).join('L'); // LineTo Lx,y Hx Vy
    }
  },
  computed: {
    root: function() {
      return this.graph.graph();
    },
    edge_paths: function() {
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
    edge_rects: function() {
      var edge_label_width, i, key, len, o, ref, ref1, results;
      ({edge_label_width} = options.style);
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
    edge_labels: function() {
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
    node_images: function() {
      var border_width, i, key, len, o, ref, renderer, results;
      ({renderer} = options);
      ({border_width} = options.style);
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
    node_rects: function() {
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
    view_box: function() {
      return `0 0 ${this.root.width} ${this.root.height}`;
    },
    graph: function() {
      var g;
      g = init(options);
      parse(options.renderer, this.value);
      dagre.layout(g);
      return g;
    }
  }
};

module.exports = vm;

module.exports.default = vm;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("vue-server-renderer");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("vue-test-utils");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("glob");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("file-system");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Dagre, DagreRenderer, Marked, MarkedRenderer, dic, itself, marker;

Marked = __webpack_require__(10).default;

Dagre = __webpack_require__(16).default;

itself = function (o) {
  return o;
};

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
    return this.graph.edge({ v, w });
  }

  is_node(v) {
    return this.graph.node(v);
  }

  edge(v, w, line, start, end, label) {
    var edge_label_width, weight;
    ({ edge_label_width } = this.options.style);
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
    ({ border_width } = this.options.style);
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
    ({ border_width } = this.options.style);
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

MarkedRenderer = function () {
  class MarkedRenderer {
    code(code, lang) {
      var langPrefix, m;
      ({ m, langPrefix } = this.options);
      switch (lang != null ? lang.toLowerCase() : void 0) {
        case '':
        case null:
        case void 0:
          return m('pre', {}, [m('code', {}, code)]);
        case 'svg':
        case 'dagre':
          return m(Dagre, {}, code);
        default:
          lang = langPrefix + lang;
          return m('pre', {}, [m('code', {
            class: lang
          }, code)]);
      }
    }

    blockquote(quote) {
      var m;
      ({ m } = this.options);
      return m('blockquote', {}, quote);
    }

    heading(text, level, raw) {
      var headerIds, headerPrefix, id, m;
      ({ m, headerIds, headerPrefix } = this.options);
      if (headerIds) {
        id = headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');
        return m(`h${level}`, {
          attrs: { id }
        }, text);
      } else {
        return m(`h${level}`, {}, text);
      }
    }

    hr() {
      var m;
      ({ m } = this.options);
      return m('hr');
    }

    list(body, ordered, start, taskList) {
      var m, type;
      ({ m } = this.options);
      type = ordered ? "ol" : "ul";
      if (!(ordered && start !== 1)) {
        start = void 0;
      }
      return m(type, {
        attrs: { start }
      }, body);
    }

    listitem(text, checked) {
      var m;
      ({ m } = this.options);
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
      ({ m } = this.options);
      return m('table', {}, [m('thead', {}, [header]), m('tbody', {}, body)]);
    }

    tablerow(content) {
      var m;
      ({ m } = this.options);
      return m('tr', {}, content);
    }

    tablecell(content, { header, align }) {
      var m, tag;
      ({ m } = this.options);
      tag = header ? 'th' : 'td';
      return m(tag, {
        class: align != null ? align[0] : void 0
      }, content);
    }

    // span level renderer
    em(text) {
      var m;
      ({ m } = this.options);
      return m('em', {}, text);
    }

    strong(text) {
      var m;
      ({ m } = this.options);
      return m('strong', {}, text);
    }

    codespan(text) {
      var m;
      ({ m } = this.options);
      return m('code', {}, text);
    }

    br() {
      return '\n';
    }

    del(text) {
      var m;
      ({ m } = this.options);
      return m('del', {}, text);
    }

    note(num, text, title) {
      var m;
      ({ m } = this.options);
      return m('sup', {
        attrs: {
          title,
          class: 'note'
        }
      }, num);
    }

    link(href, title, text) {
      var hostname, m, protocol;
      ({ m } = this.options);
      [protocol, hostname] = href.split(/\:\/\/|\/|\?|\#/g);
      text || (text = protocol);
      title || (title = [protocol, hostname].join("\n"));
      switch (href) {
        case null:
        case void 0:
        case "":
        case "#":
          return m("q", {
            attrs: { title }
          }, text);
        default:
          return m("b", {
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
      ({ m } = this.options);
      return m('img', {
        attrs: { src, alt, title }
      });
    }

    url(href) {
      return href;
    }

    // markdown-it
    container(text, lang) {
      var m;
      ({ m } = this.options);
      return m('p', {
        attrs: {
          class: lang
        }
      }, text);
    }

    strikeout(text) {
      var m;
      ({ m } = this.options);
      return m('s', {}, text);
    }

    span(text) {
      var m;
      ({ m } = this.options);
      return m('span', {}, text);
    }

    ins(text) {
      var m;
      ({ m } = this.options);
      return m('ins', {}, text);
    }

    kbd(text) {
      var m;
      ({ m } = this.options);
      return m('kbd', {}, text);
    }

    mdi(name) {
      var m;
      ({ m } = this.options);
      return m('i', {
        attrs: {
          class: `mdi ${name}`
        }
      });
    }

    abbr(text, title) {
      var m;
      ({ m } = this.options);
      return m('ruby', {}, [text, m('rp', {}, ["《"]), m('rt', {}, title), m('rp', {}, ["》"])]);
    }

    mark(text) {
      var m;
      ({ m } = this.options);
      return m('abbr', {}, text);
    }

    sup(text) {
      var m;
      ({ m } = this.options);
      return m('sup', {}, text);
    }

    sub(text) {
      var m;
      ({ m } = this.options);
      return m('sub', {}, text);
    }

  };

  MarkedRenderer.prototype.paragraph = itself;

  MarkedRenderer.prototype.text = itself;

  MarkedRenderer.prototype.html = itself;

  return MarkedRenderer;
}.call(undefined);

Dagre.options.renderer = new DagreRenderer();

Marked.options.renderer = new MarkedRenderer();

dic = { Marked, Dagre };

dic.default = dic;

module.exports = dic;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_marked_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_marked_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_marked_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_marked_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_marked_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(11)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */
var __vue_template__ = null
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-a056081e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_marked_vue___default.a,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "lib\\marked.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a056081e", Component.options)
  } else {
    hotAPI.reload("data-v-a056081e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("2dd6369a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a056081e\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/stylus-loader/index.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./marked.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a056081e\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/stylus-loader/index.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./marked.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"marked.vue","sourceRoot":""}]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 14 */
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
var InlineLexer, Lexer, Parser, baseUrls, block, escape, inline, marked, noop, originIndependentUrl, resolveUrl, splitCells, unescape;

({ block, inline, noop } = __webpack_require__(15));

escape = function (html, is_encode) {
  var r_encode;
  r_encode = is_encode ? /&/g : /&(?!#?\w+;)/g;
  return html.replace(r_encode, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
      this.rules = block.normal;
      if (this.options.gfm) {
        this.rules = this.options.tables ? block.tables : block.gfm;
      }
      if (!this.options.indentCode) {
        this.rules.code = noop;
      }
    }

    lex(src) {
      src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');
      return this.token(src, true);
    }

    token(src, top) {
      var align, b, base1, base2, bull, cap, cells, checkbox, checked, header, i, is_ordered, item, j, k, l, len, len1, loose, mode, next, o, ref, ref1, ref2, ref3, space, tag, trim, type;
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
        }
        // code
        if (cap = this.rules.code.exec(src)) {
          // console.log 'block code', cap
          src = src.slice(cap[0].length);
          cap = cap[0].replace(/^ {4}/gm, '');
          this.tokens.push({
            type: 'code',
            text: cap
          });
          continue;
        }
        // fences (gfm)
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
        }
        // heading
        if (cap = this.rules.heading.exec(src)) {
          // console.log 'block heading', cap
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'heading',
            depth: cap[1].length,
            text: cap[2]
          });
          continue;
        }
        // table no leading pipe (gfm)
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
        }
        // hr
        if (cap = this.rules.hr.exec(src)) {
          // console.log 'block hr', cap
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'hr'
          });
          continue;
        }
        // blockquote
        if (cap = this.rules.blockquote.exec(src)) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'blockquote_start',
            mode: '>'
          });
          cap = cap[0].replace(/^ *> ?/gm, '').replace(/\n$/, '');
          // Pass `top` to keep the current
          // "toplevel" state. This is exactly
          // how markdown.pl works.
          this.token(cap, false);
          this.tokens.push({
            type: 'blockquote_end'
          });
          continue;
        }
        // list
        if (cap = this.rules.list.exec(src)) {
          // console.log 'block list', cap
          src = src.slice(cap[0].length);
          bull = cap[2];
          is_ordered = "." === bull.slice(-1);
          this.tokens.push({
            type: 'list_start',
            ordered: is_ordered,
            start: is_ordered ? +bull : ''
          });
          // Get each top-level item.
          cap = cap[0].match(this.rules.item);
          next = false;
          l = cap.length;
          i = 0;
          while (i < l) {
            item = cap[i];
            // Remove the list item's bullet
            // so it is seen as the next token.
            space = item.length;
            item = item.replace(this.rules.with_bullet, '');
            if (~item.indexOf('\n ')) {
              space -= item.length;
              item = item.replace(RegExp(`^ {1,${space}}`, "gm"), '');
            }
            // Determine whether the next list item belongs here.
            // Backpedal if it does not belong in this list.
            if (this.options.smartLists && i !== l - 1) {
              b = block.bullet.exec(cap[i + 1])[0];
              if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                src = cap.slice(i + 1).join('\n') + src;
                i = l - 1;
              }
            }
            // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.
            loose = next || /\n\n(?!\s*$)/.test(item);
            if (i !== l - 1) {
              next = item.charAt(item.length - 1) === '\n';
              if (!loose) {
                loose = next;
              }
            }
            // Check for task list items
            checkbox = this.rules.checkbox.exec(item);
            checked = checkbox ? (item = item.replace(this.rules.checkbox, ''), checkbox[1] !== ' ') : void 0;
            type = loose ? 'loose_item_start' : 'list_item_start';
            this.tokens.push({
              checked,
              type,
              task: checked != null
            });
            // Recurse.
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
        }
        // html
        if (cap = this.rules.html.exec(src)) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: this.options.sanitize ? 'paragraph' : 'html',
            pre: !this.options.sanitizer && ((ref3 = cap[1]) === 'pre' || ref3 === 'script' || ref3 === 'style'),
            text: cap[0]
          });
          continue;
        }
        // abbr
        if (cap = this.rules.abbr.exec(src)) {
          // console.log 'abbr', cap
          src = src.slice(cap[0].length);
          tag = cap[1];
          (base1 = this.tokens.abbrs)[tag] || (base1[tag] = {
            title: cap[2]
          });
          this.tokens.abbrs_reg = inline.words(Object.keys(this.tokens.abbrs));
          continue;
        }
        // def
        if (top && (cap = this.rules.def.exec(src))) {
          // console.log 'def', cap
          src = src.slice(cap[0].length);
          if (cap[3]) {
            cap[3] = cap[3].slice(1, -1);
          }
          tag = cap[1].toLowerCase();
          (base2 = this.tokens.links)[tag] || (base2[tag] = {
            href: cap[2],
            title: cap[3]
          });
          continue;
        }
        // lheading
        if (cap = this.rules.lheading.exec(src)) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'heading',
            depth: cap[2] === '=' ? 1 : 2,
            text: cap[1]
          });
          continue;
        }

        // top-level paragraph
        if (top && (cap = this.rules.paragraph.exec(src))) {
          src = src.slice(cap[0].length);
          this.tokens.push({
            type: 'paragraph',
            text: cap[0]
          });
          continue;
        }
        // text
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

  };

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
      notes: notes1,
      links,
      abbrs,
      abbrs_reg
    }, options) {
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
        if (this.options.breaks) {
          this.rules = inline.breaks;
        } else {
          this.rules = inline.gfm;
        }
      }
      if (!this.options.em) {
        this.rules.em = noop;
      }
    }

    output(src) {
      var cap, href, j, len, link, mark, method, num, o, out, ref, ref1, s, text, title;
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
        }
        // autolink
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
          out.push(this.outputLargeBrackets({ text }, { href }));
          out.plain += text;
          continue;
        }
        if (!this.inLink && (cap = this.rules.url.exec(src))) {
          // console.log 'url (gfm)', cap
          cap[0] = this.rules._backpedal.exec(cap[0])[0];
          src = src.slice(cap[0].length);
          if (cap[2] === '@') {
            text = cap[0];
            href = 'mailto:' + text;
          } else {
            text = cap[0];
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          out.push(this.outputLargeBrackets({ text }, { href }));
          out.plain += text;
          continue;
        }
        // strong
        if (cap = this.rules.strong.exec(src)) {
          // console.log 'strong', cap
          src = src.slice(cap[0].length);
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
          out.push(this.renderer[method](text));
          out.plain += text.plain;
          continue;
        }
        // tag
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
        }
        // link
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
          out.push(this.outputLargeBrackets({ mark, text }, { href, title }));
          out.plain += text.plain;
          continue;
        }
        // reflink, nolink
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
          out.push(this.outputLargeBrackets({ mark, text }, link));
          out.plain += text.plain;
          continue;
        }
        // note
        if (cap = this.rules.note.exec(src)) {
          // console.log 'note', cap
          src = src.slice(cap[0].length);
          text = this.output(cap[1]);
          this.notes.push(o = { text });
          o.href = '#' + (num = this.notes.length);
          out.push(this.renderer.note(num, text, text.plain));
          out.plain += text.plain;
          continue;
        }
        // br
        if (cap = this.rules.br.exec(src)) {
          // console.log 'br', cap
          src = src.slice(cap[0].length);
          out.push(this.renderer.br());
          out.plain += "\n";
          continue;
        }
        // em
        if (cap = this.rules.em.exec(src)) {
          // console.log 'em', cap
          src = src.slice(cap[0].length);
          text = cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1];
          text = this.output(text, cap[0][0]);
          out.push(this.renderer.em(text));
          out.plain += text.plain;
          continue;
        }
        // sup, sub
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
        }
        // code
        if (cap = this.rules.code.exec(src)) {
          // console.log 'code', cap
          src = src.slice(cap[0].length);
          out.push(this.renderer.codespan(cap[2], true));
          out.plain += cap[2];
          continue;
        }
        // mdi
        if (cap = this.rules.mdi.exec(src)) {
          // console.log 'mdi', cap
          src = src.slice(cap[0].length);
          out.push(this.renderer.mdi(cap[1]));
          out.plain += "@";
          continue;
        }
        // text
        if (cap = this.rules.text.exec(src)) {
          // console.log 'text', cap
          src = src.slice(cap[0].length);
          text = cap[0];
          out.plain += text;
          if (this.abbrs_reg) {
            ref1 = text.split(this.abbrs_reg);
            for (j = 0, len = ref1.length; j < len; j++) {
              s = ref1[j];
              o = this.abbrs[s];
              text = this.smartypants(s);
              if (o) {
                out.push(this.renderer.abbr(text, o.title));
              } else {
                out.push(this.renderer.text(text));
              }
            }
          } else {
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

    outputLargeBrackets({ mark, text }, { href = '', title = '' }) {
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
      // markdown-it replacements
      // markdown-it replacements
      // em-dashes
      // en-dashes
      // opening singles
      // closing singles & apostrophes
      // opening doubles
      // closing doubles
      // ellipses
      return text.replace(/\+\-/g, '\u00B1').replace(/\+\-/g, '\u00B1').replace(/---/g, '\u2014').replace(/--/g, '\u2013').replace(/(^|[-\u2014\/(\[{"\s])'/g, '$1\u2018').replace(/'/g, '\u2019').replace(/(^|[-\u2014\/(\[{\u2018\s])"/g, '$1\u201c').replace(/"/g, '\u201d').replace(/\.{3}/g, '\u2026');
    }

  };

  /*
   * Expose Inline Rules
   */
  InlineLexer.rules = inline;

  return InlineLexer;
}.call(undefined);

// Parsing & Compiling
Parser = class Parser {
  static parse(src, options, renderer) {
    return new Parser(options, renderer).parse(src);
  }

  constructor(options1) {
    this.options = options1;
    this.tokens = [];
    this.token = null;
    ({ renderer: this.renderer } = this.options);
  }

  parse(src) {
    var j, len, m, notes, out, ref, tag, text;
    ({ m } = this.options);
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
        ({ text } = ref[j]);
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
        return this.renderer.table(header, body, top);
      case 'container_start':
        ({ lang } = this.token);
        body = [];
        while (this.next().type !== 'container_end') {
          body.push(this.tok());
        }
        return this.renderer.container(body, lang);
      case 'blockquote_start':
        ({ mode } = this.token);
        body = [];
        while (this.next().type !== 'blockquote_end') {
          body.push(this.tok());
        }
        return this.renderer.blockquote(body, mode);
      case 'list_start':
        ({ ordered, start } = this.token);
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
        ({ checked } = this.token);
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
        ({ checked } = this.token);
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

};

// Marked
marked = function (src, opt) {
  var e, m, message, tokens, txt;
  // throw error in case of non string input
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
    ({ m } = opt);
    e.message += '\nPlease report this to https://github.com/7korobi/vue-markup.';
    if (opt.silent) {
      message = `${e.message}`;
      return m('p', {}, ["An error occured:", m('pre', {}, message)]);
    }
    throw e;
  }
};

// Options
marked.defaults = {};

// Expose
marked.Parser = Parser;

marked.parser = Parser.parse;

marked.Lexer = Lexer;

marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;

marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

module.exports = marked;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Block-Level Grammer
 */
/*
 * Inline-Level Grammar
 */
var block, c, edit, inline, noop;

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
  abbr: noop
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;

block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;

block.def = edit(block.def)('label', block._label)('title', block._title)();

block.with_bullet = /^ *([*+-]|\d+\.) */;

block.bullet = /(?:[*+-] |\d+\.)/;

block.item = /^( *)(bull)[^\n]*(?:\n(?!\1bull)[^\n]*)*/;

block.item = edit(block.item, 'gm')(/bull/g, block.bullet)();

block.list = edit(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n|$))')('def', '\\n+(?=' + block.def.source + ')')();

block._tag = /address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul/;

block._comment = /<!--(?!-?>)[\s\S]*?-->/;

block.html = edit(block.html, 'i')('comment', block._comment)('tag', block._tag)('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)();

block.paragraph = edit(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('tag', block._tag)();

block.blockquote = edit(block.blockquote)('paragraph', block.paragraph)();

/*
 * Normal Block Grammar
 */
block.normal = Object.assign({}, block);

/*
 * GFM Block Grammar
 */
block.gfm = Object.assign({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}|:{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n|$)/,
  abbr: /^\*\[(label)\] *\n? *: *([^\n]+?) *(?:\n|$)/
});

block.gfm.abbr = edit(block.gfm.abbr)('label', block._label)();

block.gfm.paragraph = edit(block.paragraph)('(?!', `(?!${block.gfm.fences.source.replace('\\1', '\\2')}|${block.list.source.replace('\\1', '\\3')}|`)();

/*
 * GFM + Tables Block Grammar
 */
block.tables = Object.assign({}, block.gfm, {
  table: /^ *(.*\|.*) *\n *((\|?) *:?-+:? *(?:\| *:?-+:? *)*(\|?))(?:\n *((?:\3.*[^>\n ].*\4(?:\n|$))*)|$)/
});

inline = {
  escape: /^\\([!"#$%&'()*+,\-.\/:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: /^comment|^<\/[a-zA-Z][\w:-]*\s*>|^<[a-zA-Z][\w-]*(?:attribute)*?\s*\/?>|^<\?[\s\S]*?\?>|^<![a-zA-Z]+\s[\s\S]*?>|^<!\[CDATA\[[\s\S]*?\]\]>/,
  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  _strong: /^codecode(?:[^code]|[^code]code|code[^code])+codecode(?!code)/,
  em: /^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*][\s\S]*?[^\s])\*(?!\*)|^_([^\s_])_(?!_)|^\*([^\s*])\*(?!\*)/,
  mdi: /^:(mdi-[^:]+):(?!:)/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[`*~=+:\-\^]|\b_| {2,}\n|$)/,
  // extended
  note: /^\^\[(label)\]/,
  _supsub: /^code(?:[^\s]|codecode)+code(?!code)/,
  _url_peice: /^$|^mailto:|:\/\/|^(\.{0,2})[\?\#\/]|^[\w()%+:\/]+$/ig
};

inline.words = function (list) {
  var keys;
  keys = list.map(function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  });
  return RegExp(`(${keys.join('|')})`, "g");
};

inline.strong = function () {
  var i, len, ref, results;
  ref = ['_', '~', '=', ':', '\\*', '\\+', '\\-'];
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    c = ref[i];
    results.push(edit(inline._strong)(/code/g, c)().source);
  }
  return results;
}();

inline.strong.push(/^\[\[(?:[^\]]|[^\]]\]|\][^\]])+\]\](?!\])/.source);

inline.strong = new RegExp(inline.strong.join("|"));

inline.supsub = function () {
  var i, len, ref, results;
  ref = ['\\^', '~'];
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    c = ref[i];
    results.push(edit(inline._supsub)(/code/g, c)().source);
  }
  return results;
}();

inline.supsub = new RegExp(inline.supsub.join("|"));

inline._escapes = edit(inline.escape, 'g')('^', '')();

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;

inline._email = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;

inline.autolink = edit(inline.autolink)('scheme', inline._scheme)('email', inline._email)();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag)('comment', block._comment)('attribute', inline._attribute)();

inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;

inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?)/;

inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link)('label', inline._label)('href', inline._href)('title', inline._title)();

inline.reflink = edit(inline.reflink)('label', inline._label)();

inline.note = edit(inline.note)('label', inline._label)();

/*
 * Normal Inline Grammar
 */
inline.normal = Object.assign({}, inline);

/*
 * Pedantic Inline Grammar
 * -- bye --
 */
/*
 * GFM Inline Grammar
 */
inline.gfm = Object.assign({}, inline.normal, {
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)('email', inline._email)(),
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  text: edit(inline.text)('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|')()
});

/*
 * GFM + Line Breaks Inline Grammar
 */
inline.breaks = Object.assign({}, inline.gfm, {
  br: edit(inline.br)('{2,}', '*')(),
  text: edit(inline.gfm.text)('{2,}', '*')()
});

module.exports = { block, inline, noop };

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_42a55e88_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_dagre_vue__ = __webpack_require__(21);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(17)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-42a55e88"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_42a55e88_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_dagre_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "lib\\dagre.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-42a55e88", Component.options)
  } else {
    hotAPI.reload("data-v-42a55e88", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("525402b5", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-42a55e88\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/stylus-loader/index.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./dagre.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-42a55e88\",\"scoped\":true,\"hasInlineConfig\":false}!../node_modules/stylus-loader/index.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./dagre.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.nodes-move:not(.nodes-leave-active) > rect[data-v-42a55e88],\n.nodes-move:not(.nodes-leave-active) > image[data-v-42a55e88] {\n  transition: x 0.5s, y 0.5s;\n}\n.edges-move[data-v-42a55e88]:not(.edges-leave-active) {\n  transition: d 0.5s;\n}\n", "", {"version":3,"sources":["C:/Dropbox/www/vue-markup/lib/lib/dagre.vue","C:/Dropbox/www/vue-markup/lib/dagre.vue"],"names":[],"mappings":";AA0BE;;EAEE,2BAAA;CCzBH;AD0BD;EACE,mBAAA;CCxBD","file":"dagre.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.nodes-move:not(.nodes-leave-active)\n  > rect\n  > image\n    transition: x .5s, y .5s\n.edges-move:not(.edges-leave-active)\n  transition: d .5s\n\n",".nodes-move:not(.nodes-leave-active) > rect,\n.nodes-move:not(.nodes-leave-active) > image {\n  transition: x 0.5s, y 0.5s;\n}\n.edges-move:not(.edges-leave-active) {\n  transition: d 0.5s;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("dagre");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse, regexp_join, syntax;

regexp_join = function (regex, ...names) {
  var flags, i, key, len, name, source, val;
  ({ flags, source } = regex);
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
    last = { depth, v };
    return (ref = parents[depth]) != null ? ref.v : void 0;
  };
  results = [];
  while (src) {
    // console.log src
    if (cap = syntax.newline.exec(src)) {
      [all] = cap;
      src = src.slice(all.length);
      // console.log "newline", cap
      render.newline();
      continue;
    }
    if (cap = syntax.edges.exec(src)) {
      [all, depth, edges, v, $, $, $, label] = cap;
      src = src.slice(all.length);
      // console.log "edges", cap
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
          render[wm](w, wl);
          render.edge(v, w, line, start, end, label);
        }
      }
      continue;
    }
    if (cap = syntax.nodes.exec(src)) {
      [all, depth, nodes, label] = cap;
      src = src.slice(all.length);
      // console.log "nodes", cap
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
          ({ label } = render.is_node(parent));
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-42a55e88", esExports)
  }
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Dagre, createRenderer, fs, glob, shallow;

({ createRenderer } = __webpack_require__(5));

({ shallow } = __webpack_require__(6));

glob = __webpack_require__(7);

fs = __webpack_require__(8);

({ Dagre } = __webpack_require__(9));

glob.sync("./__tests__/**/*.dagre").map(function (path) {
  return describe(path, function () {
    return test('snapshot', function () {
      var value, wrapper;
      value = fs.readFileSync(path, 'utf8');
      wrapper = shallow(Dagre, {
        propsData: { value }
      });
      return createRenderer().renderToString(wrapper.vm, function (err, str) {
        if (err) {
          throw new Error(err);
        }
        return expect(str).toMatchSnapshot();
      });
    });
  });
});

/***/ })
/******/ ])));
//# sourceMappingURL=dagre_spec.js.map