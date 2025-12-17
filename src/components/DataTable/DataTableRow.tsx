'use client';

import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { Edit, Trash } from 'lucide-react';
import { tableStore } from './tableStore';

interface RowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

export default function TableRows({
  data = [],
  page,
  pageSize,
}: {
  data: RowData[];
  page: number;
  pageSize: number;
}) {
  const { columnOrder, visibility } = useStore(tableStore);

  return (
    <Table.Body>
      {data.map((row, index) => (
        <Table.Row key={row.id}>
          <Table.Cell fontWeight="medium">{(page - 1) * pageSize + index + 1}</Table.Cell>

          {columnOrder
            .filter((id) => visibility[id])
            .map((id) => (
              <Table.Cell key={id}>{row[id]}</Table.Cell>
            ))}

          <Table.Cell textAlign="center" display="flex" gap={2}>
            <Edit size={16} />
            <Trash size={16} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
}
