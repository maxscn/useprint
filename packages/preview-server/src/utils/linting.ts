import { loadStream } from './load-stream';

type CheckingResult = {
  status: 'error' | 'warning' | 'success';
  checks: {
    type: string;
    passed: boolean;
    metadata: {
      fetchStatusCode?: number;
      byteCount?: number;
    };
  }[];
  codeLocation: {
    line: number;
    column: number;
  };
};

export type LintingRow =
  | {
      source: 'image';
      result: CheckingResult & { source: string };
    }
  | {
      source: 'link';
      result: CheckingResult & { link: string };
    };

export interface LintingSource<T> {
  getStream(): Promise<ReadableStream<T>>;
  mapValue(value: NoInfer<T>): LintingRow | undefined;
}

function createSource<T>(source: LintingSource<T>): LintingSource<T> {
  return source;
}

export function getLintingSources(
  _markup: string,

  _urlBase: string,
): LintingSource<unknown>[] {
  return [];
}

export async function* loadLintingRowsFrom(sources: LintingSource<unknown>[]) {
  for await (const source of sources) {
    const stream = await source.getStream();
    for await (const value of loadStream(stream)) {
      const row = source.mapValue(value);
      if (row) {
        yield row;
      }
    }
  }
}
