import { HStack } from '@chakra-ui/react';
import { useState } from 'react';
import FiltersDrawer, { renderFilter } from './FilterDrawer';
import { IMainFilterType } from './FilterTypes';

export const FiltersToolBar = ({
  title,
  filters,
  onVisibilityChange,
  onReorder,
  onSizeChange,
  onClear,
  maxToolbarUnits, // The user passes 10 here
  pageKey,
  onLoadPreset,
  activePresetName,
  filterDrawerSize = 'sm',
}: IMainFilterType) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  let currentUnits = 0;

  return (
    <HStack wrap="wrap" pl={2} pr={2} width="100%" justify="space-between" alignItems="center">
      {title}

      <HStack gapX={1} align={'center'}>
        {filters
          .filter((filter) => filter.visible !== false)
          .map((filter) => {
            const filterSize = filter.size ?? 1;

            const isOverLimit =
              maxToolbarUnits !== undefined && currentUnits + filterSize > maxToolbarUnits;

            if (!isOverLimit) {
              currentUnits += filterSize;
            }

            return (
              <HStack
                flex={filterSize}
                minW={`${filterSize * 100}px`}
                key={filter.id}
                // alignItems={'center'}
                opacity={isOverLimit ? 0.4 : 1}
                pointerEvents={isOverLimit ? 'none' : 'auto'}
                cursor={isOverLimit ? 'not-allowed' : 'auto'}
              >
                {renderFilter(filter)}
              </HStack>
            );
          })}

        <FiltersDrawer
          filterDrawerSize={filterDrawerSize}
          onVisibilityChange={onVisibilityChange}
          onReorder={onReorder}
          onSizeChange={onSizeChange}
          onClear={onClear}
          maxToolbarUnits={maxToolbarUnits}
          pageKey={pageKey}
          filters={filters}
          onLoadPreset={onLoadPreset}
          activePresetName={activePresetName}
          open={drawerOpen}
          onOpenChange={(e: { open: boolean }) => {
            setDrawerOpen(e.open);
          }}
        />
      </HStack>
    </HStack>
  );
};

export default FiltersToolBar;
