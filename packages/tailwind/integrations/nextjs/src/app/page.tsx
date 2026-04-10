'use client';

import { render } from '@useprint/render';
import { useEffect, useState } from 'react';
import { ProjectBriefDocument } from '../../documents/project-brief';

export default function Home() {
  const [documentHtml, setDocumentHtml] = useState('');

  useEffect(() => {
    void render(<ProjectBriefDocument />).then(setDocumentHtml);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: documentHtml }} />;
}
