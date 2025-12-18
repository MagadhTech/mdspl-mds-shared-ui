'use client';

import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { Edit, Trash } from 'lucide-react';
import { tableStore } from './tableStore';

export default function TableRows({
  data = [] as Array<Record<string, any>>,
}: {
  data: Array<Record<string, any>>;
}) {
  const { columnOrder, visibility } = useStore(tableStore);

  return (
    <Table.Body>
      {data.map((row) => (
        <Table.Row key={row.id}>
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
