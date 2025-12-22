import { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import DateRangeFilter from './components/filters/FilterComponents/DateRangeSelector';
import { FiltersToolBar } from './components/filters/Filters';
import { dummyData } from './dummy/data';

const headers = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'User Name' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
];

function App() {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<IFilterConfig[]>([
    {
      id: 'DateRange',
      customComponent: (
        <DateRangeFilter onChange={(v) => updateFilterValue('DateRange', v)} value={''} />
      ),
      visible: true,
      label: 'Date Range',
      value: '',
      onChange: (v: string | number | boolean | undefined) => updateFilterValue('DateRange', v),
      size: 1.5,
      type: 'date',
    },

    {
      id: 'select',
      customComponent: <Demo />,
      visible: true,
      label: 'Select',
      value: '',
      onChange: (v: string | number | boolean | undefined) => updateFilterValue('select', v),
      size: 1.5,
      type: 'select',
    },

    {
      id: 'checkbox',
      customComponent: <DemoCheckbox />,
      visible: true,
      label: 'Checkbox',
      value: '',
      onChange: (v: boolean | undefined | number | string) => updateFilterValue('checkbox', v),
      size: 1.5,
      type: 'checkbox',
    },

    {
      id: 'search input',
      customComponent: <DemoSearch />,
      visible: true,
      label: 'Search',
      value: '',
      onChange: (v: string | number | boolean | undefined) => updateFilterValue('search input', v),
      size: 1.5,
      type: 'text',
    },
  ]);

  function updateFilterValue(id: string, value: any) {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  }

  function handleVisibility(id: string, visible: boolean) {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, visible } : f)));
  }

  function handleSize(id: string, size: number) {
    type UpdatedFilter = IFilterConfig & { size: number };

    setFilters((prev: IFilterConfig[]) =>
      prev.map((f) => (f.id === id ? ({ ...f, size } as UpdatedFilter) : f)),
    );
  }

  function handleClear() {
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        value: '',
      })),
    );
  }

  const activeFilterState = filters.reduce((obj, f) => {
    obj[f.id] = f.value;
    return obj;
  }, {} as Record<string, any>);

  useEffect(() => {
    const order = loadOrder('demo');
    if (!order.length) return;

    setFilters((prev) => {
      const map = Object.fromEntries(prev.map((f) => [f.id, f]));
      return order.map((id) => map[id]).filter(Boolean);
    });
  }, []);

  return (
    <div
      style={{
        border: '1px solid red',
        height: '100vh',
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <FiltersToolBar
        title={<Text color={'red'}>Filters</Text>}
        filters={filters}
        onVisibilityChange={handleVisibility}
        onReorder={(reordered) => {
          saveOrder(
            'demo',
            reordered.map((f) => f.id),
          );
          setFilters(reordered);
        }}
        onSizeChange={handleSize}
        onClear={handleClear}
        maxToolbarUnits={5}
        pageKey="demo"
        currentFilters={activeFilterState}
        onLoadPreset={(filters, name) => {
          console.log('Loaded preset:', name, filters);
        }}
        activePresetName={null}
      />

      <DataTable
        data={dummyData}
        pageSize={pageSize}
        page={page}
        onPageChange={(page) => setPage(page)}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        headers={headers}
        actions={[
          {
            icon: <Edit size={14} />,
            label: 'Edit',
            onClick: () => console.log('Edit'),
            colorScheme: 'blue',
          },
          {
            icon: <Trash size={14} />,
            label: 'Delete',
            onClick: () => console.log('Edit'),
            colorScheme: 'red',
          },
        ]}
      />
    </div>
  );
}

export default App;

('use client');

import { Combobox, HStack, Text, useFilter, useListCollection } from '@chakra-ui/react';

const ComboboxRoot = withChildren(Combobox.Root);
const ComboboxControl = withChildren(Combobox.Control);
const ComboboxInput = withChildren(Combobox.Input);
const ComboboxIndicatorGroup = withChildren(Combobox.IndicatorGroup);
const ComboboxClearTrigger = withChildren(Combobox.ClearTrigger);
const ComboboxTrigger = withChildren(Combobox.Trigger);
const ComboboxPositioner = withChildren(Combobox.Positioner);
const ComboboxContent = withChildren(Combobox.Content);
const ComboboxEmpty = withChildren(Combobox.Empty);
const ComboboxItem = withChildren(Combobox.Item);
const ComboboxItemIndicator = withChildren(Combobox.ItemIndicator);

const Demo = () => {
  const { contains } = useFilter({ sensitivity: 'base' });

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  });

  return (
    <ComboboxRoot
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      size="sm"
    >
      <ComboboxControl>
        <ComboboxInput placeholder="Type to search" />
        <ComboboxIndicatorGroup>
          <ComboboxClearTrigger />
          <ComboboxTrigger />
        </ComboboxIndicatorGroup>
      </ComboboxControl>
      {/* <Portal> */}
      <ComboboxPositioner>
        <ComboboxContent>
          <ComboboxEmpty>No items found</ComboboxEmpty>
          {collection.items.map((item) => (
            <ComboboxItem item={item} key={item.value}>
              {item.label}
              <ComboboxItemIndicator />
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </ComboboxPositioner>
      {/* </Portal> */}
    </ComboboxRoot>
  );
};

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Preact', value: 'preact' },
  { label: 'Qwik', value: 'qwik' },
  { label: 'Lit', value: 'lit' },
  { label: 'Alpine.js', value: 'alpinejs' },
  { label: 'Ember', value: 'ember' },
  { label: 'Next.js', value: 'nextjs' },
];

import { Field, Input } from '@chakra-ui/react';
const FieldRoot = withChildren(Field.Root);

const DemoSearch = () => {
  return (
    <FieldRoot>
      <Input size={'sm'} placeholder="Search" />
    </FieldRoot>
  );
};

import { Checkbox } from '@chakra-ui/react';
import { Edit, Trash } from 'lucide-react';
import { IFilterConfig } from './components/filters/FilterTypes';
import { loadOrder, saveOrder } from './components/filters/reorderStore';
import { withChildren } from './utils/chakra-slot';

const CheckboxRoot = withChildren(Checkbox.Root);
const CheckboxHiddenInput = withChildren(Checkbox.HiddenInput);
const CheckboxControl = withChildren(Checkbox.Control);
const CheckboxLabel = withChildren(Checkbox.Label);

const DemoCheckbox = () => {
  return (
    <HStack>
      <CheckboxRoot size={'sm'}>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>open</CheckboxLabel>
      </CheckboxRoot>

      <CheckboxRoot defaultChecked size={'sm'}>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Close</CheckboxLabel>
      </CheckboxRoot>

      <CheckboxRoot size={'sm'}>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Readonly</CheckboxLabel>
      </CheckboxRoot>

      <CheckboxRoot invalid size={'sm'}>
        <CheckboxHiddenInput />
        <CheckboxControl />
        <CheckboxLabel>Invalid</CheckboxLabel>
      </CheckboxRoot>
    </HStack>
  );
};
