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

// src/node/render.tsx
import { Suspense } from "react";

// src/node/read-stream.ts
import { Writable } from "node:stream";
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
    const writable = new Writable({
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
import { jsx } from "react/jsx-runtime";
var render = (node) => __async(null, null, function* () {
  const suspendedElement = /* @__PURE__ */ jsx(Suspense, { children: node });
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
export {
  plainTextSelectors,
  render,
  renderAsync
};
