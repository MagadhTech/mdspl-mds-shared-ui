import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';
import { sortByColumn, toggleColumn } from './DataTableActions';
import SortableHeaderCell from './SortableHeaderCell';
import { tableStore } from './tableStore';

export default function TableHeader() {
  const { columnOrder, visibility, sortColumn, sortDirection, sortableColumns, actionsConfig } =
    useStore(tableStore);

  const visibleOrderedColumns = columnOrder
    .map((col) => sortableColumns.find((c) => c.id === col.id))
    .filter((c) => c !== undefined)
    .filter((c) => visibility[c!.id]);

  return (
    <Table.Header background={'blue.200'} position="sticky" top={0} p="0" zIndex={1}>
      <Table.Row height={'28px'}>
        {actionsConfig?.showSNo && (
          <Table.ColumnHeader
            width="80px"
            minW={80}
            maxW={80}
            textAlign="center"
            backgroundColor={actionsConfig.backgroundColor}
            borderRight="2px solid #dcdcdc"
          >
            {actionsConfig.indexChildren || 'S.No'}
          </Table.ColumnHeader>
        )}

        {visibleOrderedColumns.map((col) => {
          const isSorted = sortColumn === col?.id;
          const minW = col.minWidth;
          return (
            <SortableHeaderCell
              key={col?.id}
              id={col?.id}
              onClick={() => col?.sortable && sortByColumn(col?.id)}
              borderRight="2px solid #dcdcdc"
              backgroundColor={col?.backgroundColor}
              minW={minW}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  userSelect: 'none',
                }}
              >
                {col.label}

                {col?.sortable &&
                  (isSorted ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUpDown size={14} opacity={0.4} />
                  ))}
              </span>
            </SortableHeaderCell>
          );
        })}

        {actionsConfig?.showActionColumn && (
          <Table.ColumnHeader
            width={actionsConfig.width}
            backgroundColor={actionsConfig.backgroundColor}
            borderRight="2px solid #dcdcdc"
          >
            {actionsConfig.children || 'Actions'}
          </Table.ColumnHeader>
        )}
        {actionsConfig?.showColumnVisibilityMenu && (
          <Table.ColumnHeader
            boxSize={'0.5'}
            backgroundColor={actionsConfig.backgroundColorColumnVisibilityMenu}
            width="50px"
          >
            <ColumnVisibilityMenu visibility={visibility} onToggle={toggleColumn} />
          </Table.ColumnHeader>
        )}
      </Table.Row>
    </Table.Header>
  );
}
