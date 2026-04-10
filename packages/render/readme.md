# @useprint/render

[docs](https://useprint.dev/docs/packages/render)

Transform React components into printable HTML documents.

## Install

```sh
npm install @useprint/render react react-dom
```

## Getting started

```tsx
import { render } from '@useprint/render';
import { Body, Document, Head, Page } from '@useprint/components';

function Quote() {
  return (
    <Document>
      <Head />
      <Body>
        <Page style={{ padding: 40 }}>
          <h1>Quote</h1>
          <p>Render this tree to HTML, then hand it to your PDF pipeline.</p>
        </Page>
      </Body>
    </Document>
  );
}

const html = await render(<Quote />);
```

## API

- `render(node)` renders a React node to a full HTML document string.
- `renderAsync(node)` is a deprecated alias for `render`.

## Typical usage

- author documents with `@useprint/components`
- render them to HTML with `@useprint/render`
- send that HTML through `useprint-js` or your own Chromium setup
