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

// src/browser/render.tsx
import { Suspense } from "react";
import { jsx } from "react/jsx-runtime";
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
  const suspendedElement = /* @__PURE__ */ jsx(Suspense, { children: node });
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
export {
  plainTextSelectors,
  render,
  renderAsync
};
