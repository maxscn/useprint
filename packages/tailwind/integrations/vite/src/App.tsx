import { render } from '@useprint/render';
import { ProjectBriefDocument } from '../documents/project-brief';

function App() {
  const documentHtml = render(<ProjectBriefDocument />);

  return <div dangerouslySetInnerHTML={{ __html: documentHtml }} />;
}

export default App;
