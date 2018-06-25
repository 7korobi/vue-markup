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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("glob");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var listToStyles = __webpack_require__(4)

module.exports = function (parentId, list, isProduction, context) {
  if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
    context = __VUE_SSR_CONTEXT__
  }
  if (context) {
    if (!context.hasOwnProperty('styles')) {
      Object.defineProperty(context, 'styles', {
        enumerable: true,
        get: function() {
          return renderStyles(context._styles)
        }
      })
      // expose renderStyles for vue-server-renderer (vuejs/#6353)
      context._renderStyles = renderStyles
    }

    var styles = context._styles || (context._styles = {})
    list = listToStyles(parentId, list)
    if (isProduction) {
      addStyleProd(styles, list)
    } else {
      addStyleDev(styles, list)
    }
  }
}

// In production, render as few style tags as possible.
// (mostly because IE9 has a limit on number of style tags)
function addStyleProd (styles, list) {
  for (var i = 0; i < list.length; i++) {
    var parts = list[i].parts
    for (var j = 0; j < parts.length; j++) {
      var part = parts[j]
      // group style tags by media types.
      var id = part.media || 'default'
      var style = styles[id]
      if (style) {
        if (style.ids.indexOf(part.id) < 0) {
          style.ids.push(part.id)
          style.css += '\n' + part.css
        }
      } else {
        styles[id] = {
          ids: [part.id],
          css: part.css,
          media: part.media
        }
      }
    }
  }
}

// In dev we use individual style tag for each module for hot-reload
// and source maps.
function addStyleDev (styles, list) {
  for (var i = 0; i < list.length; i++) {
    var parts = list[i].parts
    for (var j = 0; j < parts.length; j++) {
      var part = parts[j]
      styles[part.id] = {
        ids: [part.id],
        css: part.css,
        media: part.media
      }
    }
  }
}

function renderStyles (styles) {
  var css = ''
  for (var key in styles) {
    var style = styles[key]
    css += '<style data-vue-ssr-id="' + style.ids.join(' ') + '"' +
        (style.media ? ( ' media="' + style.media + '"' ) : '') + '>' +
        style.css + '</style>'
  }
  return css
}


/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports) {

module.exports = require("vue-server-renderer");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("vue-test-utils");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Renderer, border_width, dagre, edge_label_width, init, marker, options, parse, vm;

dagre = __webpack_require__(14);

parse = __webpack_require__(15);

marker = function(key) {
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

Renderer = class Renderer {
  newline() {}

  error(line) {
    return this.graph.errors.push(line);
  }

  dic(v) {
    return {
      id: v,
      name: v
    };
  }

  node(v, label) {
    var chr, id, name, o;
    chr = this.dic(v);
    console.log(chr);
    if (chr != null ? chr.face : void 0) {
      ({id, name} = chr.face);
      o = this.graph.node(id);
      if (!o) {
        this.icon(id, label || name);
      }
      return id;
    } else {
      o = this.graph.node(v);
      if (!o) {
        this.box(v, label);
      }
      return v;
    }
  }

  edge(v, w, line, start, end, label) {
    var weight;
    weight = line.length;
    start = marker(start);
    end = marker(end);
    line = (function() {
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
    })();
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
    return this.graph.setNode(v, {
      label: label,
      class: 'box',
      width: 90,
      height: 90,
      rx: 10,
      ry: 10
    });
  }

  icon(v, label) {
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

edge_label_width = 20;

border_width = 10;

init = function() {
  var g;
  g = new dagre.graphlib.Graph({
    directed: true,
    compound: true,
    multigraph: false
  });
  return g.setGraph({
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
  });
};

options = {
  renderer: new Renderer
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
      var i, key, len, o, ref, ref1, results;
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
      var i, key, len, o, ref, results;
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
          href: href(key)
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
      g = init();
      options.renderer.options = options;
      options.renderer.graph = g;
      options.renderer.graph.errors = [];
      parse(options.renderer, this.value);
      dagre.layout(options.renderer.graph);
      return g;
    }
  }
};

module.exports = vm;

module.exports.default = vm;


/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Dagre, createRenderer, fs, glob, shallow;

glob = __webpack_require__(0);

fs = __webpack_require__(1);

Dagre = __webpack_require__(11);

({ createRenderer } = __webpack_require__(6));

({ shallow } = __webpack_require__(7));

glob.sync("./__tests__/**/*.dagre").map(function (path) {
  return describe(path, function () {
    return test('snapshot', function () {
      var value, wrapper;
      value = fs.readFileSync(path, 'utf8');
      wrapper = shallow(Dagre.default, {
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

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_42a55e88_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_dagre_vue__ = __webpack_require__(16);
function injectStyle (ssrContext) {
var i
;(i=__webpack_require__(12),i.__inject__&&i.__inject__(ssrContext),i)
}
var normalizeComponent = __webpack_require__(5)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-42a55e88"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = "4021bf88"
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__coffee_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dagre_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_42a55e88_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_template_compiler_preprocessor_engine_pug_node_modules_vue_loader_lib_selector_type_template_index_0_dagre_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "lib\\dagre.vue"

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(3)
module.exports.__inject__ = function (context) {
  add("525402b5", content, false, context)
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(true);
// imports


// module
exports.push([module.i, "\n.nodes-move:not(.nodes-leave-active) > rect[data-v-42a55e88],\n.nodes-move:not(.nodes-leave-active) > image[data-v-42a55e88] {\n  transition: x 0.5s, y 0.5s;\n}\n.edges-move[data-v-42a55e88]:not(.edges-leave-active) {\n  transition: d 0.5s;\n}\n", "", {"version":3,"sources":["C:/Dropbox/www/vue-blog/lib/lib/dagre.vue","C:/Dropbox/www/vue-blog/lib/dagre.vue"],"names":[],"mappings":";AA2BE;;EAEE,2BAAA;CC1BH;AD2BD;EACE,mBAAA;CCzBD","file":"dagre.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.nodes-move:not(.nodes-leave-active)\n  > rect\n  > image\n    transition: x .5s, y .5s\n.edges-move:not(.edges-leave-active)\n  transition: d .5s\n\n",".nodes-move:not(.nodes-leave-active) > rect,\n.nodes-move:not(.nodes-leave-active) > image {\n  transition: x 0.5s, y 0.5s;\n}\n.edges-move:not(.edges-leave-active) {\n  transition: d 0.5s;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("dagre");

/***/ }),
/* 15 */
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
  var $, all, cap, depth, edges, end, find_parent, i, idx, j, label, last, len, len1, line, nodes, parent, parents, results, start, tokens, v, w;
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
          v = render.node(v);
          w = render.node(w);
          console.log({ v, w });
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
        render.node(v, label);
        if (label) {
          render.edge(v, v, "", "", "", label);
        }
        if (parent = find_parent(v, depth)) {
          ({ label } = render.graph.node(parent));
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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("no-ssr", [
    _c("article", [
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
                refX: "2",
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
                  ? _c(
                      "rect",
                      _vm._b({ staticClass: "path" }, "rect", o, false)
                    )
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
      _c(
        "div",
        { staticClass: "errors" },
        _vm._l(_vm.graph.errors, function(err) {
          return _c("div", { staticClass: "error" }, [_vm._v(_vm._s(err))])
        })
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })
/******/ ])));
//# sourceMappingURL=dagre_spec.js.map