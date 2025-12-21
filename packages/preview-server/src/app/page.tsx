import path from 'node:path';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Text } from '../components';
import CodeSnippet from '../components/code-snippet';
import { Shell } from '../components/shell';
import { documentsDirectoryAbsolutePath } from './env';

const Home = () => {
  const baseDocumentsDirectoryName = path.basename(documentsDirectoryAbsolutePath);

  return (
    <Shell>
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="-mt-10 relative max-w-lg flex flex-col items-center gap-3 text-center">
          <Heading as="h2" size="6" weight="medium">
            Welcome to UsePrint
          </Heading>
          <Text as="p">
            To start developing your documents, you can create a<br />
            <CodeSnippet>.jsx</CodeSnippet> or <CodeSnippet>.tsx</CodeSnippet>{' '}
            file under your <CodeSnippet>{baseDocumentsDirectoryName}</CodeSnippet>{' '}
            folder.
          </Text>
          <Button asChild className="mt-3" size="3">
            <Link href="https://useprint.dev/docs">Check the docs</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
};

export default Home;
