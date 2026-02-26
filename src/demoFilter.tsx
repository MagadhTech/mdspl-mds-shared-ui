import { Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { IFilterConfig } from './components/filters';
import FiltersToolBar from './components/filters/Filters';
import { loadOrder, saveOrder } from './components/filters/reorderStore';

type HeaderProps = {
  search: string;
  onSearchChange: (search: string) => void;
};

export const DemoFilter = ({ search, onSearchChange }: HeaderProps) => {
  const [activePresetName, setActivePresetName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    console.log('running first ');
    setStartDate(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
  }, []);

  const [filters, setFilters] = useState<IFilterConfig[]>([
    {
      id: 'search input',
      visible: true,
      label: 'Search',
      value: search,
      onChange: (v) => {
        onSearchChange(v as string);
        updateFilterValue('search input', v);
      },
      size: 2.5,
      type: 'text',
    },
    {
      id: 'checkbox',
      visible: true,
      label: 'Checkbox',
      value: false,
      onChange: (v) => updateFilterValue('checkbox', v),
      size: 1,
      type: 'checkbox',
    },
    {
      id: 'select',
      visible: true,
      label: 'Select Box',
      value: undefined, // Start undefined
      onChange: (v) => updateFilterValue('select', v),
      size: 1.5,
      type: 'select',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
    {
      id: 'Date',
      visible: true,
      label: 'Date Picker',
      value: new Date(),
      startDate: startDate,
      endDate: endDate,
      onChange: (v) => {
        updateFilterValue('Date', v);
        setStartDate(v.startDate);
        setEndDate(v.endDate);
        console.log(v?.startDate, v?.endDate);
      },
      size: 2.5,
      type: 'date-range',
    },
  ]);

  useEffect(() => {
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        startDate,
        endDate,
      })),
    );
  }, [startDate, endDate]);

  // Helper to update a single filter's value safely
  function updateFilterValue(id: string, value: any) {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  }

  function handleVisibility(id: string, visible: boolean) {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, visible } : f)));
  }

  function handleSize(id: string, size: number) {
    setFilters((prev: any) => prev.map((f) => (f.id === id ? { ...f, size } : f)));
  }

  // Clear all filters to undefined
  function handleClear() {
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        value: undefined,
      })),
    );
    setActivePresetName(null);
  }

  // Load Order (Persist Layout)
  useEffect(() => {
    const order = loadOrder('demo');
    if (!order.length) return;

    setFilters((prev) => {
      const map = Object.fromEntries(prev.map((f) => [f.id, f]));
      return order.map((id) => map[id]).filter(Boolean);
    });
  }, []);

  const activeFilterState = filters.reduce(
    (obj, f) => {
      obj[f.id] = f.value;
      return obj;
    },
    {} as Record<string, any>,
  );

  return (
    <FiltersToolBar
      title={
        <Text>
          <b>District Price History</b>
        </Text>
      }
      filters={filters}
      onVisibilityChange={handleVisibility}
      onReorder={(reordered) => {
        saveOrder(
          'district-price-history-filter',
          reordered.map((f) => f.id),
        );
        setFilters(reordered);
      }}
      onSizeChange={handleSize}
      pageKey="district-price-history-filter"
      onClear={handleClear}
      maxToolbarUnits={5}
      currentFilters={activeFilterState}
      onLoadPreset={(loadedFilters, name) => {
        setFilters(loadedFilters);
        setActivePresetName(name ?? null);
      }}
      activePresetName={activePresetName}
    />
  );
};
