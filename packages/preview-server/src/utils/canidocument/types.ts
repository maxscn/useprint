import type { Node } from '@babel/traverse';

export type AST = Node;

export type DocumentClient = string;

export type Platform = string;

export type SupportEntry = {
  notes_by_num?: Record<number, string>;
  stats: Record<string, Record<string, Record<string, string>[]>>;
};
