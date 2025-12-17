'use client';

import { Checkbox, IconButton, Menu, Portal } from '@chakra-ui/react';
import { Columns } from 'lucide-react';
import { withChildren } from '../../utils/chakra-slot';
import type { ColumnId } from './Column';
import { COLUMNS } from './Column';

interface Props {
  visibility: Record<ColumnId, boolean>;
  onToggle: (column: ColumnId) => void;
}

const MenuTrigger = withChildren(Menu.Trigger);
const MenuPositioner = withChildren(Menu.Positioner);
const MenuContent = withChildren(Menu.Content);
const MenuItem = withChildren(Menu.Item);
const CheckboxLabel = withChildren(Checkbox.Label);
const CheckboxHiddenInput = withChildren(Checkbox.HiddenInput);
const CheckboxControl = withChildren(Checkbox.Control);

export default function ColumnVisibilityMenu({ visibility, onToggle }: Props) {
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
            {COLUMNS.map((col) => {
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
