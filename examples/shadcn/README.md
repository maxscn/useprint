# shadcn-invoice

[docs](https://useprint.dev/docs)

UsePrint document example built with local shadcn/ui components.

It includes a generated shadcn `Button` plus `Badge`, `Card`, and `Table`
components used in `documents/shadcn-invoice.tsx`. The document injects
`src/styles/globals.css` into `<Head>` and passes a small Tailwind config into
`<Tailwind>` so shadcn token classes such as `bg-primary`, `border-border`, and
`text-muted-foreground` are available when styles are inlined for PDF
rendering.

To install dependencies from the repository root:

```bash
bun install
```

To preview:

```bash
bun run dev
```

To export HTML:

```bash
bun run export
```
