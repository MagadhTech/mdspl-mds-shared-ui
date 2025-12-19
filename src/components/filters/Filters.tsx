import { HStack } from '@chakra-ui/react';
import FiltersDrawer from './FilterDrawer';
import { IMainFilterType } from './FilterTypes';

export const FiltersToolBar = ({
  title,
  filters,
  onVisibilityChange,
  onReorder,
  onSizeChange,
  onClear,
  maxToolbarUnits,
  pageKey,
  currentFilters,
  onLoadPreset,
  activePresetName,
  filterDrawerSize = 'sm',
}: IMainFilterType) => {
  return (
    <HStack wrap="wrap" pl={2} pr={2} width="100%" justify="space-between">
      {title}
      <HStack>
        {filters.length > 0 &&
          filters
            .filter((filter) => filter.visible)
            .map((filter) => <HStack key={filter.id}>{filter.customComponent}</HStack>)}
        <FiltersDrawer
          filterDrawerSize={filterDrawerSize}
          onVisibilityChange={
            onVisibilityChange
              ? (id: string, visible: boolean) => onVisibilityChange(id, visible)
              : undefined
          }
          onReorder={onReorder}
          onSizeChange={
            onSizeChange ? (id: string, size: number) => onSizeChange(id, size) : undefined
          }
          onClear={onClear}
          maxToolbarUnits={maxToolbarUnits}
          pageKey={pageKey}
          filters={filters}
          currentFilters={currentFilters}
          onLoadPreset={onLoadPreset}
          activePresetName={activePresetName}
        />
      </HStack>
    </HStack>
  );
};

export default FiltersToolBar;
