import { checkImages, type ImageCheckingResult } from './check-images';

test('checkImages()', async () => {
  const results: ImageCheckingResult[] = [];
  const html = `<div>
  <img src="https://useprint.com/static/brand/useprint-icon-white.png" />,
  <img src="/static/codepen-challengers.png" alt="codepen challenges" />,
</div>`;
  const stream = await checkImages(html, 'https://demo.useprint.dev');
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      results.push(value);
    }
    if (done) {
      break;
    }
  }
  expect(results).toMatchSnapshot();
});
