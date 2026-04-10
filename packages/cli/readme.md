# @useprint/cli

[docs](https://useprint.dev/docs/packages/cli)

Preview, export, and build Useprint documents from the command line.

## Install

```sh
npm install -D @useprint/cli
```

## Getting started

The CLI expects a `documents/` directory by default.

```text
documents/
  invoice.tsx
  static/
```

Start the local preview app:

```sh
npx useprint dev
```

## Commands

### `useprint dev`

Starts the local preview app and watches your documents.

```sh
npx useprint dev
```

### `useprint export`

Renders your document components to HTML files in `out/`.

```sh
npx useprint export
```

### `useprint build`

Copies the preview app into `.useprint` and runs a production build.

```sh
npx useprint build
```

### `useprint start`

Starts the built preview app from `.useprint`.

```sh
npx useprint start
```

## Notes

- Use `--dir` to point the CLI at a different documents folder.
- Use `--port` with `dev` to change the preview port.
- Use `--outDir` and `--pretty` with `export` to control HTML output.

## See also

- `@useprint/components` for authoring documents in React
- `@useprint/render` for the underlying React-to-HTML step
