import { SelectorDefinition } from 'html-to-text';

declare const plainTextSelectors: SelectorDefinition[];

declare const render: (node: React.ReactNode) => Promise<string>;

/**
 * @deprecated use {@link render}
 */
declare const renderAsync: (element: React.ReactElement) => Promise<string>;

export { plainTextSelectors, render, renderAsync };
