import React from 'react';
import { Unbreakable } from '../dist';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isHeader?: boolean;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isHeader?: boolean;
}

export const Table: React.FC<TableProps> = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <table
      className={`useprint-table ${className}`}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        ...style
      }}
      data-useprint-table="true"
      {...props}
    >
      {children}
    </table>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <thead
      className={`useprint-table-header ${className}`}
      style={style}
      data-useprint-table-header="true"
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <tbody
      className={`useprint-table-body ${className}`}
      style={style}
      data-useprint-table-body="true"
      {...props}
    >
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = '',
  style = {},
  isHeader = false,
  ...props
}) => {
  return (
    <tr
      className={`useprint-table-row useprint-unbreakable ${isHeader ? 'useprint-table-header-row' : ''} ${className}`}
      style={style}
      data-useprint-table-row="true"
      data-is-header={isHeader}
      data-unbreakable="true"
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  style = {},
  isHeader = false,
  ...props
}) => {
  const Tag = isHeader ? 'th' : 'td';

  return (
    <Tag
      className={`useprint-table-cell ${isHeader ? 'useprint-table-header-cell' : ''} ${className}`}
      style={{
        padding: isHeader ? "unset" : '8px',
        border: '1px solid #e5e7eb',
        textAlign: 'left',
        ...style
      }}
      data-useprint-table-cell="true"
      data-is-header={isHeader}
      {...props}
    >
      {children}
    </Tag>
  );
};
