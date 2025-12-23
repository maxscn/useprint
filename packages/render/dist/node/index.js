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

// src/node/index.ts
var index_exports = {};
__export(index_exports, {
  plainTextSelectors: () => plainTextSelectors,
  render: () => render,
  renderAsync: () => renderAsync
});
module.exports = __toCommonJS(index_exports);

// src/node/render.tsx
var import_react = require("react");

// src/node/read-stream.ts
var import_node_stream = require("stream");
var decoder = new TextDecoder("utf-8");
var readStream = (stream) => __async(null, null, function* () {
  let result = "";
  if ("pipeTo" in stream) {
    const writableStream = new WritableStream({
      write(chunk) {
        result += decoder.decode(chunk);
      }
    });
    yield stream.pipeTo(writableStream);
  } else {
    const writable = new import_node_stream.Writable({
      write(chunk, _encoding, callback) {
        result += decoder.decode(chunk);
        callback();
      }
    });
    stream.pipe(writable);
    yield new Promise((resolve, reject) => {
      writable.on("error", reject);
      writable.on("close", () => {
        resolve();
      });
    });
  }
  return result;
});

// src/node/render.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var render = (node) => __async(null, null, function* () {
  const suspendedElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { children: node });
  const reactDOMServer = yield import("react-dom/server").then(
    // This is beacuse react-dom/server is CJS
    (m) => m.default
  );
  let html;
  if (Object.hasOwn(reactDOMServer, "renderToReadableStream")) {
    html = yield readStream(
      yield reactDOMServer.renderToReadableStream(suspendedElement)
    );
  } else {
    yield new Promise((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(suspendedElement, {
        onAllReady() {
          return __async(this, null, function* () {
            html = yield readStream(stream);
            resolve();
          });
        },
        onError(error) {
          reject(error);
        }
      });
    });
  }
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

// src/node/index.ts
var renderAsync = (element) => {
  return render(element);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  plainTextSelectors,
  render,
  renderAsync
});
