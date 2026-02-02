'use client';

import { Checkbox, IconButton, Menu, Portal } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { StretchHorizontal } from 'lucide-react';
import { withChildren } from '../../utils/chakra-slot';
import { toggleColumn } from './DataTableActions';
import { tableStore } from './tableStore';

interface Props {
  visibility: Record<string, boolean>;
}

const MenuTrigger = withChildren(Menu.Trigger);
const MenuPositioner = withChildren(Menu.Positioner);
const MenuContent = withChildren(Menu.Content);
const MenuItem = withChildren(Menu.Item);
const CheckboxLabel = withChildren(Checkbox.Label);
const CheckboxHiddenInput = withChildren(Checkbox.HiddenInput);
const CheckboxControl = withChildren(Checkbox.Control);

export default function ColumnVisibilityMenu({ visibility }: Props) {
  const { sortableColumns } = useStore(tableStore);
  return (
    <Menu.Root closeOnSelect={false}>
      <MenuTrigger asChild>
        <IconButton aria-label="Toggle columns" variant="ghost" ml="1" size="xs">
          <StretchHorizontal size={18} />
        </IconButton>
      </MenuTrigger>

      <Portal>
        <MenuPositioner>
          <MenuContent minW="220px">
            {sortableColumns.map((col) => {
              const isChecked = Boolean(visibility[col.id]);

              return (
                <MenuItem key={col.id} value={col.id} closeOnSelect={false}>
                  <Checkbox.Root checked={isChecked} onCheckedChange={() => toggleColumn(col.id)}>
                    <CheckboxHiddenInput />
                    <CheckboxControl />
                    <CheckboxLabel>{col.label}</CheckboxLabel>
                  </Checkbox.Root>
                </MenuItem>
              );
            })}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </Menu.Root>
  );
}
