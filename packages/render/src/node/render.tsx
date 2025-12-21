import { Suspense } from 'react';
import { readStream } from './read-stream';

export const render = async (node: React.ReactNode) => {
  const suspendedElement = <Suspense>{node}</Suspense>;
  const reactDOMServer = await import('react-dom/server').then(
    // This is beacuse react-dom/server is CJS
    (m) => m.default,
  );

  let html!: string;
  if (Object.hasOwn(reactDOMServer, 'renderToReadableStream')) {
    html = await readStream(
      await reactDOMServer.renderToReadableStream(suspendedElement),
    );
  } else {
    await new Promise<void>((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(suspendedElement, {
        async onAllReady() {
          html = await readStream(stream);
          resolve();
        },
        onError(error) {
          reject(error as Error);
        },
      });
    });
  }


  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, '')}`;

  return document;
};
