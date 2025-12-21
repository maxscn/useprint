import { render } from '@useprint/components';
import { VercelInviteUserDocument } from '../documents/vercel-invite-user';

function App() {
  const documentHtml = render(<VercelInviteUserDocument />);

  return <div dangerouslySetInnerHTML={{ __html: documentHtml }} />;
}

export default App;
