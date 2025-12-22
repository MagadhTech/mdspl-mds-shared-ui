'use client';

import { Checkbox, IconButton, Menu, Portal } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { Columns } from 'lucide-react';
import { withChildren } from '../../utils/chakra-slot';
import { tableStore } from './tableStore';

interface Props {
  visibility: Record<string, boolean>;
  onToggle: (column: string) => void;
}

const MenuTrigger = withChildren(Menu.Trigger);
const MenuPositioner = withChildren(Menu.Positioner);
const MenuContent = withChildren(Menu.Content);
const MenuItem = withChildren(Menu.Item);
const CheckboxLabel = withChildren(Checkbox.Label);
const CheckboxHiddenInput = withChildren(Checkbox.HiddenInput);
const CheckboxControl = withChildren(Checkbox.Control);

export default function ColumnVisibilityMenu({ visibility, onToggle }: Props) {
  const { sortableColumns } = useStore(tableStore);
  return (
    <Menu.Root closeOnSelect={false}>
      <MenuTrigger asChild>
        <IconButton aria-label="Toggle columns" variant="outline" size="sm" ml="1">
          <Columns size={18} />
        </IconButton>
      </MenuTrigger>

      <Portal>
        <MenuPositioner>
          <MenuContent minW="220px">
            {sortableColumns.map((col) => {
              const isChecked = Boolean(visibility[col.id]);

              return (
                <MenuItem key={col.id} value={col.id} closeOnSelect={false}>
                  <Checkbox.Root checked={isChecked} onCheckedChange={() => onToggle(col.id)}>
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
