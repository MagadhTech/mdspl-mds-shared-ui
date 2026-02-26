'use client';

import {
  Button,
  CloseButton,
  Drawer,
  HStack,
  IconButton,
  Portal,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';

import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Bookmark, Delete, Edit2, Filter, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { withChildren } from '../../utils/chakra-slot';
import MDSCheckbox from '../chakra-compo/CheckBox';
import MDSCombobox from '../chakra-compo/Combobox';
import MDSDateRangePicker from '../chakra-compo/DateComponent/DateRangeSelector';
import MDSDatePicker from '../chakra-compo/DateComponent/DateSelector';
import MDSInput from '../chakra-compo/Input';
import MDSSelectBox from '../chakra-compo/SelectBox';
import { IFilterConfig, IFilterDrawerProps } from './FilterTypes';
import { addPreset, deletePreset, getPresets, PresetItem } from './presetStore';
import SortableFilterItem from './SortableFilterItem';

const DrawerRoot = withChildren(Drawer.Root);
const DrawerTrigger = withChildren(Drawer.Trigger);
const DrawerBackdrop = withChildren(Drawer.Backdrop);
const DrawerPositioner = withChildren(Drawer.Positioner);
const DrawerContent = withChildren(Drawer.Content);
const DrawerHeader = withChildren(Drawer.Header);
const DrawerTitle = withChildren(Drawer.Title);
const DrawerBody = withChildren(Drawer.Body);
const DrawerFooter = withChildren(Drawer.Footer);
const DrawerCloseTrigger = withChildren(Drawer.CloseTrigger);
const TabsRoot = withChildren(Tabs.Root);
const TabsList = withChildren(Tabs.List);
const TabsTrigger = withChildren(Tabs.Trigger);
const TabsContent = withChildren(Tabs.Content);

export const renderFilter = (filter: IFilterConfig, drawerOpen?: boolean) => {
  if (filter.customComponent) {
    return filter.customComponent;
  }

  switch (filter.type) {
    case 'text':
      return (
        <MDSInput
          placeholder={filter.label}
          value={filter.value as string}
          onChange={filter.onChange}
          label={filter.label}
          visible={drawerOpen}
        />
      );

    case 'number':
      return (
        <MDSInput label={filter.label} value={filter.value as number} onChange={filter.onChange} />
      );

    case 'checkbox':
      return (
        <MDSCheckbox
          label={filter.label}
          value={filter.value as boolean}
          onChange={filter.onChange}
        />
      );

    case 'select':
      return (
        <MDSSelectBox
          label={filter.label}
          value={filter.value as string}
          onChange={filter.onChange}
          options={filter.options ?? []}
          visible={drawerOpen}
          placeholder={filter.placeholder}
        />
      );

    case 'date':
      return (
        // <DateRangeFilter
        //   value={filter.value as string}
        //   onChange={filter.onChange as (v: string | undefined) => void}
        // />
        <MDSDatePicker
          value={filter.value as Date}
          onChange={filter.onChange as (v: string | Date | null) => void}
          visible={drawerOpen}
          label={filter.label}
        />
      );

    // case 'date-range':
    //   return (
    //     <MDSDateRangePicker
    //       startDate={filter.startDate ? new Date(filter.startDate) : undefined}
    //       endDate={filter.endDate ? new Date(filter.endDate) : undefined}
    //       onChange={filter.onChange as (v: string | Date | null | undefined) => void}
    //       visible={drawerOpen}
    //       label={filter.label}
    //     />
    //   );
case 'date-range':
      // FIX: robustly extract dates. When the component updates, the parent might
      // store the object { startDate, endDate } directly inside filter.value
      const dateRangeValue = filter.value as any;
      const startVal = dateRangeValue?.startDate || filter.startDate;
      const endVal = dateRangeValue?.endDate || filter.endDate;

      return (
        <MDSDateRangePicker
          startDate={startVal ? new Date(startVal) : undefined}
          endDate={endVal ? new Date(endVal) : undefined}
          onChange={(start, end) => {
            // FIX: Package the two arguments into a single object so your
            // DemoFilter's single-argument onChange(v) can receive both!
            if (filter.onChange) {
              (filter.onChange as any)({ startDate: start, endDate: end });
            }
          }}
          visible={drawerOpen}
          label={filter.label}
        />
      );


    case 'combobox':
      return (
        <MDSCombobox
          visible={true}
          label={filter.label}
          // value={filter.value }
          // items={filter.options?.map((item) => ({
          //   ...item,
          //   label: String(item.label),
          // }))}
          itemToString={(i) => String(i.label)}
          itemToValue={(i: { value: string }) => i.value}
          renderItem={(item: { label: string; value: string }) => <span>{item.label}</span>}
        />
      );

    default:
      return null;
  }
};

interface DrawerProps extends IFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: { open: boolean }) => void;
}

export const FiltersDrawer = ({
  filterDrawerSize = 'sm',
  onVisibilityChange,
  onSizeChange,
  onClear,
  filters,
  pageKey = 'default',
  onLoadPreset,
  activePresetName,
  onReorder,
  open,
  onOpenChange,
}: DrawerProps) => {
  const [presets, setPresets] = useState<PresetItem[]>([]);

  useEffect(() => {
    const refreshPresets = () => {
      setPresets(getPresets(pageKey));
    };

    refreshPresets();

    // Listen for changes in the same window or other tabs
    window.addEventListener('storage', refreshPresets);
    window.addEventListener('storage_updated', refreshPresets);

    return () => {
      window.removeEventListener('storage', refreshPresets);
      window.removeEventListener('storage_updated', refreshPresets);
    };
  }, [pageKey]);

  const handleSave = () => {
    const name = prompt('Preset name?');
    if (!name) return;

    const values = filters.reduce(
      (acc, f) => {
        acc[f.id] = f.value;
        return acc;
      },
      {} as Record<string, any>,
    );

    addPreset(pageKey, {
      id: uuidv4(),
      name,
      date: new Date().toISOString(),
      values,
    });
  };

  return (
    <HStack wrap="wrap">
      <DrawerRoot size={filterDrawerSize} open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <IconButton aria-label="Open filters" variant="outline" size="xs" ml={2} p={2}>
            <Filter size={16} />
            Filters
          </IconButton>
        </DrawerTrigger>

        <Portal>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>

              <DrawerBody overflowY="auto" pt={1}>
                <TabsRoot defaultValue="view">
                  <TabsList mb={4}>
                    <TabsTrigger value="view">
                      <Edit2 size={16} />
                      Edit
                    </TabsTrigger>

                    <TabsTrigger value="settings">
                      <Settings size={16} />
                      Settings
                    </TabsTrigger>

                    <TabsTrigger value="presets">
                      <Bookmark size={16} />
                      Presets
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="view">
                    {filters
                      .filter((f) => f.visible)
                      .map((f) => (
                        <VStack
                          key={f.id}
                          align="stretch"
                          border="1px solid"
                          borderColor="gray.200"
                          flex={f.size ?? 1}
                          minW={`${(f.size ?? 1) * 100}px`}
                          rounded="md"
                          p={3}
                          mb={3}
                        >
                          {renderFilter(f, open)}
                        </VStack>
                      ))}
                  </TabsContent>

                  <TabsContent value="settings">
                    <DndContext
                      sensors={useSensors(useSensor(PointerSensor))}
                      collisionDetection={closestCenter}
                      onDragEnd={({ active, over }) => {
                        if (!over || active.id === over.id) return;

                        const oldIndex = filters.findIndex((f) => f.id === active.id);
                        const newIndex = filters.findIndex((f) => f.id === over.id);
                        const reordered = arrayMove(filters, oldIndex, newIndex);
                        onReorder?.(reordered);
                      }}
                    >
                      <SortableContext
                        items={filters.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {filters.map((f) => (
                          <SortableFilterItem
                            key={f.id}
                            filter={f}
                            onVisibilityChange={onVisibilityChange}
                            onSizeChange={onSizeChange}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </TabsContent>

                  {/* PRESETS */}
                  <TabsContent value="presets">
                    <VStack align="stretch" mb={3}>
                      {presets.length === 0 && (
                        <Text fontSize="xs" color="gray.500">
                          No presets saved yet.
                        </Text>
                      )}

                      {presets.map((p) => (
                        <HStack
                          key={p.id}
                          justify="space-between"
                          border="1px solid"
                          borderColor={activePresetName === p.name ? 'blue.300' : 'gray.200'}
                          rounded="md"
                          p={2}
                        >
                          <VStack align="start" gap={0}>
                            <Text fontWeight="bold" fontSize="sm">
                              {p.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(p.date).toLocaleDateString()}
                            </Text>
                          </VStack>

                          <HStack>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => {
                                const updatedFilters = filters.map((f) => ({
                                  ...f,
                                  value: p.values[f.id] ?? f.value,
                                }));

                                onLoadPreset?.(updatedFilters, p.name);
                              }}
                            >
                              Load
                            </Button>

                            <IconButton
                              size="xs"
                              aria-label="Delete preset"
                              variant="ghost"
                              onClick={() => deletePreset(pageKey, p.id)}
                            >
                              <Delete size={14} />
                            </IconButton>
                          </HStack>
                        </HStack>
                      ))}

                      <Button size="sm" colorScheme="blue" onClick={handleSave}>
                        Save Current Filters
                      </Button>
                    </VStack>
                  </TabsContent>
                </TabsRoot>
              </DrawerBody>

              <DrawerFooter justify="space-between">
                {/* <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onClear && onClear()}
                >
                  Clear All
                </Button> */}

                <DrawerCloseTrigger asChild>
                  <CloseButton />
                </DrawerCloseTrigger>
              </DrawerFooter>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </HStack>
  );
};

export default FiltersDrawer;
