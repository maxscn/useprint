# @useprint/tailwind

[docs](https://useprint.dev/docs/packages/tailwind)

A React wrapper that applies Tailwind classes to Useprint documents.

## Install

```sh
npm install @useprint/tailwind tailwindcss
```

## Getting started

```tsx
import { Body, Document, Head, Page } from '@useprint/components';
import { Tailwind } from '@useprint/tailwind';

export default function Proposal() {
  return (
    <Tailwind>
      <Document>
        <Head />
        <Body>
          <Page className="bg-white p-10 text-slate-900">
            <h1 className="text-3xl font-semibold">Proposal</h1>
          </Page>
        </Body>
      </Document>
    </Tailwind>
  );
}
```

## Important note

If your Tailwind output contains styles that cannot be fully inlined, the component needs a `<head>` in the tree so it can inject a `<style>` tag. In practice, that usually means rendering the `Head` component inside your document.
