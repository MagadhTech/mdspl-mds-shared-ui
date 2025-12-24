'use client';

import { IconButton, Menu, Portal, Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { MoreHorizontal } from 'lucide-react';
import { withChildren } from '../../utils/chakra-slot';
import { tableStore } from './tableStore';
import { DataTableAction } from './types';

const MenuItem = withChildren(Menu.Item);
const MenuContent = withChildren(Menu.Content);
const MenuPositioner = withChildren(Menu.Positioner);
const MenuTrigger = withChildren(Menu.Trigger);

export default function TableRows({
  data = [] as Array<Record<string, any>>,
  actions = [],
}: {
  data: Array<Record<string, any>>;
  actions?: DataTableAction<any>[];
}) {
  const { columnOrder, visibility } = useStore(tableStore);

  return (
    <Table.Body>
      {data.map((row) => (
        <Table.Row key={row.id}>
          {columnOrder
            .filter((id) => visibility[id.id])
            .map((id) => (
              <Table.Cell key={id.id}>{row[id.id]}</Table.Cell>
            ))}

          <Table.Cell textAlign="center" display="flex" gap={2}>
            <Menu.Root>
              <MenuTrigger asChild>
                <IconButton aria-label="Open" variant="ghost" size="sm">
                  <MoreHorizontal size={16} />
                </IconButton>
              </MenuTrigger>
              <Portal>
                <MenuPositioner>
                  <MenuContent>
                    {actions.map((action) => (
                      <MenuItem
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        colorScheme={action.colorScheme}
                        value={action.label}
                      >
                        {action.icon}
                        {action.label}
                      </MenuItem>
                    ))}
                  </MenuContent>
                </MenuPositioner>
              </Portal>
            </Menu.Root>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
}
