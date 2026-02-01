'use client';

import { IconButton, Menu, Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { withChildren } from '../../utils/chakra-slot';
import { tableStore } from './tableStore';
import { ActionHeaderProps, DataTableAction, DataTableRow } from './types';

const MenuItem = withChildren(Menu.Item);
const MenuContent = withChildren(Menu.Content);
const MenuPositioner = withChildren(Menu.Positioner);
const MenuTrigger = withChildren(Menu.Trigger);

// export default function TableRows({
//   data = [] as Array<Record<string, any>>,
//   actions = [],
//   actionConfig,
//   onRowSelect,
//   onRowSelectEvent = 'left',
//   startIndex = 0,
// }: {
//   data: Array<Record<string, any>>;
//   actions?: DataTableAction<T>[];
//   actionConfig?: ActionHeaderProps;
//   onRowSelect?: (row: any, event?: React.MouseEvent) => void;
//   onRowSelectEvent?: 'left' | 'right';
//   startIndex?: number;
// }) {
export default function TableRows<T>({
  data = [] as DataTableRow<T>[],
  actions,
  actionConfig,
  onRowSelect,
  onRowSelectEvent = 'left',
  startIndex = 0,
}: {
  data: DataTableRow<T>[];
  actions?: DataTableAction<T>[];
  actionConfig?: ActionHeaderProps;
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right';
  startIndex?: number;
}) {
  const { columnOrder, visibility, columnWidths } = useStore(tableStore);

  return (
    <Table.Body>
      {data?.map((row, index) => (
        <Table.Row
          key={row.__key || row.id}
          onClick={() => onRowSelectEvent === 'left' && row.__raw && onRowSelect?.(row.__raw)}
          _hover={{
            bg: 'blue.50',
          }}
          onContextMenu={
            onRowSelectEvent === 'right'
              ? (e) => {
                  e.preventDefault();
                  row.__raw && onRowSelect?.(row.__raw, e);
                }
              : undefined
          }
        >
          {actionConfig?.showSNo && (
            <Table.Cell textAlign="center" fontWeight="medium">
              {startIndex + index + 1}
            </Table.Cell>
          )}
          {columnOrder
            .filter((id) => visibility[id.id])
            .map((id) => {
              const minWidth = typeof id.minWidth === 'number' ? `${id.minWidth}px` : id.minWidth;
              return (
                <Table.Cell
                  key={id.id}
                  w={columnWidths[id.id] ? `${columnWidths[id.id]}px` : undefined}
                  minW={`${minWidth}px`}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {row[id.id]}
                </Table.Cell>
              );
            })}

          {actionConfig?.showActionColumn && (
            <Table.Cell textAlign="center" display="flex" gap={2}>
              <Menu.Root>
                <MenuTrigger asChild>
                  <IconButton aria-label="Open" variant="ghost" size="sm">
                    <MoreHorizontal size={16} />
                  </IconButton>
                </MenuTrigger>
                {/* <Portal> */}
                <MenuPositioner>
                  <MenuContent>
                    {actions
                      ?.filter((action) =>
                        typeof action.visible === 'function'
                          ? row.__raw && action.visible(row.__raw)
                          : action.visible !== false,
                      )
                      .map((action) => (
                        <MenuItem
                          key={action.label}
                          onClick={() => row.__raw && action.onClick(row.__raw)}
                          colorScheme={action.colorScheme}
                          value={action.label}
                        >
                          {action.icon}
                          {action.label}
                        </MenuItem>
                      ))}
                  </MenuContent>
                </MenuPositioner>
                {/* </Portal> */}
              </Menu.Root>
            </Table.Cell>
          )}
          {actionConfig?.showColumnVisibilityMenu && <Table.Cell></Table.Cell>}
        </Table.Row>
      ))}
    </Table.Body>
  );
}
