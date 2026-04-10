# @useprint/components

[docs](https://useprint.dev/docs/packages/components)

React primitives for building printable documents.

## Install

```sh
npm install @useprint/components
```

## Getting started

```tsx
import { Body, Document, Head, Page } from '@useprint/components';

export default function Invoice() {
  return (
    <Document pageSize="A4">
      <Head>
        <title>Invoice</title>
      </Head>
      <Body>
        <Page style={{ padding: 48 }}>
          <h1>Invoice</h1>
          <p>Author this as React, render it later as HTML.</p>
        </Page>
      </Body>
    </Document>
  );
}
```

## Included primitives

- `Document`
- `Head`
- `Body`
- `Page`
- `NewPage`
- `Unbreakable`

## Re-exports

This package also re-exports:

- `@useprint/render`
- `@useprint/tailwind`

That makes `@useprint/components` a convenient starting point when you want the main document primitives and the HTML rendering helpers in one place.
