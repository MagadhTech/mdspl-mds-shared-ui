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
import { useStore } from '@tanstack/react-store';
import { Bookmark, Delete, Edit2, Filter, Settings } from 'lucide-react';
import { withChildren } from '../../utils/chakra-slot';
import { IFilterDrawerProps } from './FilterTypes';
import { addPreset, deletePreset, getPresets, presetStore } from './presetStore';
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

export const FiltersDrawer = ({
  filterDrawerSize = 'sm',
  onVisibilityChange,
  onSizeChange,
  onClear,
  filters,
  pageKey = 'default',
  currentFilters = {},
  onLoadPreset,
  activePresetName,
  onReorder,
}: IFilterDrawerProps) => {
  // 👇 THIS IS THE SECRET
  const state = useStore(presetStore);
  const presets = state[pageKey] ?? getPresets(pageKey);

  const handleSave = () => {
    const name = prompt('Preset name?');
    if (!name) return;
    addPreset(pageKey, {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      filters: currentFilters,
    });
  };

  return (
    <HStack wrap="wrap">
      <DrawerRoot size={filterDrawerSize}>
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
                          rounded="md"
                          p={3}
                          mb={3}
                        >
                          <Text fontWeight="bold">{f.label}</Text>
                          {f.customComponent}
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

                        // saveOrder(pageKey, reordered);
                        console.log(reordered);

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
                      <Button size="sm" colorScheme="blue" onClick={handleSave}>
                        Save Current Filters
                      </Button>

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
                              onClick={() => onLoadPreset?.(p.filters, p.name)}
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
                    </VStack>
                  </TabsContent>
                </TabsRoot>
              </DrawerBody>

              <DrawerFooter justify="space-between">
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onClear && onClear()}
                >
                  Clear All
                </Button>

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
