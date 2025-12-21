![UsePrint button cover](https://useprint.app/static/covers/render.png)

<div align="center"><strong>@useprint/render</strong></div>
<div align="center">Transform React components into HTML document templates.</div>
<br />
<div align="center">
<a href="https://useprint.app">Website</a> 
<span> · </span>
<a href="https://github.com/maxscn/useprint">GitHub</a> 
<span> · </span>
<a href="https://useprint.app/discord">Discord</a>
</div>

## Install

Install component from your command line.

#### With yarn

```sh
yarn add @useprint/render -E
```

#### With npm

```sh
npm install @useprint/render -E
```

## Getting started

Convert React components into a HTML string.

```jsx
import { MyTemplate } from "../components/MyTemplate";
import { render } from "@useprint/render";

const html = await render(<MyTemplate firstName="Jim" />);
```

## License

MIT License
