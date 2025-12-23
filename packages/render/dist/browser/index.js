"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/browser/index.ts
var index_exports = {};
__export(index_exports, {
  plainTextSelectors: () => plainTextSelectors,
  render: () => render,
  renderAsync: () => renderAsync
});
module.exports = __toCommonJS(index_exports);

// src/browser/render.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var decoder = new TextDecoder("utf-8");
var readStream = (stream) => __async(null, null, function* () {
  const chunks = [];
  const writableStream = new WritableStream({
    write(chunk) {
      chunks.push(chunk);
    },
    abort(reason) {
      throw new Error("Stream aborted", {
        cause: {
          reason
        }
      });
    }
  });
  yield stream.pipeTo(writableStream);
  let length = 0;
  chunks.forEach((item) => {
    length += item.length;
  });
  const mergedChunks = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((item) => {
    mergedChunks.set(item, offset);
    offset += item.length;
  });
  return decoder.decode(mergedChunks);
});
var render = (node) => __async(null, null, function* () {
  const suspendedElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { children: node });
  const reactDOMServer = yield import("react-dom/server.browser").then(
    // This is beacuse react-dom/server is CJS
    (m) => m.default
  );
  const html = yield new Promise((resolve, reject) => {
    reactDOMServer.renderToReadableStream(suspendedElement, {
      onError(error) {
        reject(error);
      }
    }).then(readStream).then(resolve).catch(reject);
  });
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, "")}`;
  return document;
});

// src/shared/plain-text-selectors.ts
var plainTextSelectors = [
  { selector: "img", format: "skip" },
  { selector: "[data-skip-in-text=true]", format: "skip" },
  {
    selector: "a",
    options: { linkBrackets: false }
  }
];

// src/browser/index.ts
var renderAsync = (element) => {
  return render(element);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  plainTextSelectors,
  render,
  renderAsync
});
