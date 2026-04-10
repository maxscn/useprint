# @useprint/preview

[docs](https://useprint.dev/docs/packages/preview)

The internal preview runtime used by the Useprint CLI.

This package powers the browser preview experience behind `@useprint/cli`. It is published so the CLI can bundle and install a matching preview server version when needed.

## Typical usage

Most users should not install this package directly. Instead, install:

- `@useprint/components` to author documents
- `@useprint/cli` to preview and export them

Reach for `@useprint/preview` directly only if you are working on the preview runtime itself.
