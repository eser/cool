// Copyright 2023-present Eser Ozvataf and other contributors. All rights reserved. Apache-2.0 license.

// This file contains code from preact (https://github.com/preactjs/preact),
// which is a React alternative, licensed under the MIT license.

// Copyright (c) 2023 Eser Ozvataf and other contributors
// Copyright (c) 2015-present Jason Miller

import { encodeEntities } from "./encoder.js";

export const elements = {
  Fragment: null,
};

export const options = {
  attr: null,
  tagHelperHook: null,
};

export const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

let vnodeId = 0;

/**
 * @fileoverview
 * This file exports various methods that implement Babel's "automatic" JSX runtime API:
 * - jsx(type, props, key)
 * - jsxs(type, props, key)
 * - jsxDEV(type, props, key, __source, __self)
 *
 * The implementation of createVNode here is optimized for performance.
 * Benchmarks: https://esbench.com/bench/5f6b54a0b4632100a7dcd2b3
 */

/**
 * JSX.Element factory used by Babel's {runtime:"automatic"} JSX transform
 * @param {VNode['type']} type
 * @param {VNode['props']} props
 * @param {VNode['key']} [key]
 * @param {unknown} [_isStaticChildren]
 * @param {unknown} [__source]
 * @param {unknown} [__self]
 */
export const jsx = (type, props, key, _isStaticChildren, __source, __self) => {
  // We'll want to preserve `ref` in props to get rid of the need for
  // forwardRef components in the future, but that should happen via
  // a separate PR.
  const normalizedProps = {};
  let ref, i;

  for (i in props) {
    if (i == "ref") {
      ref = props[i];
      continue;
    }

    normalizedProps[i] = props[i];
  }

  /** @type {VNode & { __source: any; __self: any }} */
  const vnode = {
    type,
    props: normalizedProps,
    key,
    ref,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    _nextDom: undefined,
    _component: null,
    constructor: undefined,
    _original: --vnodeId,
    _index: -1,
    _flags: 0,
    __source,
    __self,
  };

  // If a Component VNode, check for and apply defaultProps.
  // Note: `type` is often a String, and can be `undefined` in development.
  if (typeof type === "function" && (ref = type.defaultProps)) {
    for (i in ref) {
      if (typeof normalizedProps[i] === "undefined") {
        normalizedProps[i] = ref[i];
      }
    }
  }

  if (options.tagHelperHook) {
    options.tagHelperHook(vnode);
  }

  return vnode;
};

export const jsxs = jsx;
export const jsxDEV = jsx;

/**
 * Create a template vnode. This function is not expected to be
 * used directly, but rather through a precompile JSX transform
 * @param {string[]} templates
 * @param  {Array<string | null | VNode>} exprs
 * @returns {VNode}
 */
export const jsxTemplate = (templates, ...exprs) => {
  const vnode = createVNode(elements.Fragment, { tpl: templates, exprs });
  // Bypass render to string top level Fragment optimization
  vnode.key = vnode._vnode;

  return vnode;
};

const JS_TO_CSS = {};
const CSS_REGEX = /[A-Z]/g;

/**
 * Serialize an HTML attribute to a string. This function is not
 * expected to be used directly, but rather through a precompile
 * JSX transform
 * @param {string} name The attribute name
 * @param {*} value The attribute value
 * @returns {string}
 */
export const jsxAttr = (name, value) => {
  if (options.attr) {
    const result = options.attr(name, value);

    if (typeof result === "string") {
      return result;
    }
  }

  if (name === "ref" || name === "key") {
    return "";
  }

  if (name === "style" && typeof value === "object") {
    let str = "";

    for (const prop in value) {
      const val = value[prop];

      if (val != null && val !== "") {
        const name = prop[0] == "-" ? prop : JS_TO_CSS[prop] ||
          (JS_TO_CSS[prop] = prop.replace(CSS_REGEX, "-$&").toLowerCase());

        let suffix = ";";
        if (
          typeof val === "number" &&
          // Exclude custom-attributes
          !name.startsWith("--") &&
          !IS_NON_DIMENSIONAL.test(name)
        ) {
          suffix = "px;";
        }

        str = `${str}${name}:${val}${suffix}`;
      }
    }

    return `${name}="${str}"`;
  }

  if (
    value == null ||
    value === false ||
    typeof value === "function" ||
    typeof value === "object"
  ) {
    return "";
  }

  if (value === true) {
    return name;
  }

  return `${name}="${encodeEntities(value)}"`;
};

/**
 * Escape a dynamic child passed to `jsxTemplate`. This function
 * is not expected to be used directly, but rather through a
 * precompile JSX transform
 * @param {*} value
 * @returns {string | null | VNode | Array<string | null | VNode>}
 */
export const jsxEscape = (value) => {
  if (
    value == null ||
    typeof value === "boolean" ||
    typeof value === "function"
  ) {
    return null;
  }

  if (typeof value === "object") {
    // Check for VNode
    if (value.constructor === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        value[i] = jsxEscape(value[i]);
      }

      return value;
    }
  }

  return encodeEntities("" + value);
};
