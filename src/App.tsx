import { useState } from 'react';
import { DataTable } from './components/DataTable';
import DateRangeFilter from './components/filters/FilterComponents/DateRangeSelector';
import { FiltersToolBar } from './components/filters/Filters';
import { dummyData } from './dummy/data';

function App() {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  return (
    <>
      <div
        style={{
          paddingLeft: '10px',
          paddingTop: '10px',
          paddingRight: '10px',
        }}
      >
        <FiltersToolBar
          title="table library"
          filters={[
            {
              id: 'DateRange',
              customComponent: <DateRangeFilter onChange={() => {}} value={''} />,
              visible: true,
            },
          ]}
          onVisibilityChange={() => {}}
          onReorder={() => {}}
          onSizeChange={() => {}}
          onClear={() => {}}
          maxToolbarUnits={0}
          pageKey={''}
          currentFilters={{}}
          onLoadPreset={() => {}}
          activePresetName={''}
        />
        <DataTable
          data={dummyData}
          pageSize={pageSize}
          page={page}
          onPageChange={(page) => {
            setPage(page);
          }}
          onPageSizeChange={(pageSize) => {
            setPageSize(pageSize);
          }}
        />
      </div>
    </>
  );
}

export default App;

// ('use client');

// import { Combobox, HStack, Portal, useFilter, useListCollection } from '@chakra-ui/react';

// const Demo = () => {
//   const { contains } = useFilter({ sensitivity: 'base' });

//   const { collection, filter } = useListCollection({
//     initialItems: frameworks,
//     filter: contains,
//   });

//   return (
//     <Combobox.Root
//       collection={collection}
//       onInputValueChange={(e) => filter(e.inputValue)}
//       size="sm"
//     >
//       <Combobox.Control>
//         <Combobox.Input placeholder="Type to search" />
//         <Combobox.IndicatorGroup>
//           <Combobox.ClearTrigger />
//           <Combobox.Trigger />
//         </Combobox.IndicatorGroup>
//       </Combobox.Control>
//       <Portal>
//         <Combobox.Positioner>
//           <Combobox.Content>
//             <Combobox.Empty>No items found</Combobox.Empty>
//             {collection.items.map((item) => (
//               <Combobox.Item item={item} key={item.value}>
//                 {item.label}
//                 <Combobox.ItemIndicator />
//               </Combobox.Item>
//             ))}
//           </Combobox.Content>
//         </Combobox.Positioner>
//       </Portal>
//     </Combobox.Root>
//   );
// };

// const frameworks = [
//   { label: 'React', value: 'react' },
//   { label: 'Solid', value: 'solid' },
//   { label: 'Vue', value: 'vue' },
//   { label: 'Angular', value: 'angular' },
//   { label: 'Svelte', value: 'svelte' },
//   { label: 'Preact', value: 'preact' },
//   { label: 'Qwik', value: 'qwik' },
//   { label: 'Lit', value: 'lit' },
//   { label: 'Alpine.js', value: 'alpinejs' },
//   { label: 'Ember', value: 'ember' },
//   { label: 'Next.js', value: 'nextjs' },
// ];

// import { Field, Input } from '@chakra-ui/react';

// const DemoSearch = () => {
//   return (
//     <Field.Root>
//       <Input size={'sm'} placeholder="Search" />
//     </Field.Root>
//   );
// };

// import { Checkbox } from '@chakra-ui/react';

// const DemoCheckbox = () => {
//   return (
//     <HStack>
//       <Checkbox.Root disabled size={'sm'}>
//         <Checkbox.HiddenInput />
//         <Checkbox.Control />
//         <Checkbox.Label>Disabled</Checkbox.Label>
//       </Checkbox.Root>

//       <Checkbox.Root defaultChecked disabled size={'sm'}>
//         <Checkbox.HiddenInput />
//         <Checkbox.Control />
//         <Checkbox.Label>Disabled</Checkbox.Label>
//       </Checkbox.Root>

//       <Checkbox.Root readOnly size={'sm'}>
//         <Checkbox.HiddenInput />
//         <Checkbox.Control />
//         <Checkbox.Label>Readonly</Checkbox.Label>
//       </Checkbox.Root>

//       <Checkbox.Root invalid size={'sm'}>
//         <Checkbox.HiddenInput />
//         <Checkbox.Control />
//         <Checkbox.Label>Invalid</Checkbox.Label>
//       </Checkbox.Root>
//     </HStack>
//   );
// };
