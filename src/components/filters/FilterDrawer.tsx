import { Button, CloseButton, Drawer, HStack, IconButton, Kbd, Portal } from '@chakra-ui/react';
import { Filter } from 'lucide-react';
import { withChildren } from '../../utils/chakra-slot';
import { IFilterDrawerProps } from './FilterTypes';

const DrawerRoot = withChildren(Drawer.Root);
const DrawerTrigger = withChildren(Drawer.Trigger);
const DrawerBackdrop = withChildren(Drawer.Backdrop);
const DrawerPositioner = withChildren(Drawer.Positioner);
const DrawerContent = withChildren(Drawer.Content);
const DrawerHeader = withChildren(Drawer.Header);
const DrawerTitle = withChildren(Drawer.Title);
const DrawerBody = withChildren(Drawer.Body);
const DrawerFooter = withChildren(Drawer.Footer);
const DrawerActionTrigger = withChildren(Drawer.ActionTrigger);
const DrawerCloseTrigger = withChildren(Drawer.CloseTrigger);

export const FiltersDrawer = ({
  filterDrawerSize = 'sm',
  onVisibilityChange,
  onReorder,
  onSizeChange,
  onClear,
  maxToolbarUnits,
  filters,
  pageKey,
}: IFilterDrawerProps) => {
  return (
    <HStack wrap="wrap">
      <DrawerRoot key={'filter-drawer'} size={filterDrawerSize}>
        <DrawerTrigger asChild>
          <IconButton aria-label="Toggle columns" variant="outline" size="xs" ml="1" p={2}>
            <Filter size={18} />
            Filter
          </IconButton>
        </DrawerTrigger>
        <Portal>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer Title</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                Press the <Kbd>esc</Kbd> key to close the drawer.
              </DrawerBody>
              <DrawerFooter>
                <DrawerActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerActionTrigger>
                <Button>Save</Button>
              </DrawerFooter>
              <DrawerCloseTrigger asChild>
                <CloseButton size="sm" />
              </DrawerCloseTrigger>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </HStack>
  );
};

export default FiltersDrawer;
