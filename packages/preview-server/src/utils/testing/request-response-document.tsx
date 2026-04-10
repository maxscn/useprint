import React from 'react';

export default function RequestResponseDocument() {
  const request = new Request('https://example.com/documents/project-proposal');
  const response = new Response('ok', { status: 200 });

  return (
    <div>
      <p>{request.url}</p>
      <p>{response.status}</p>
    </div>
  );
}

RequestResponseDocument.PreviewProps = {};
