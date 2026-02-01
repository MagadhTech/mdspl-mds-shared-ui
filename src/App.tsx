import { Spinner } from '@chakra-ui/react';
import { Trash, View } from 'lucide-react';
import { useState } from 'react';
import MDSConfirmActionDialog from './components/chakra-compo/ConfirmDialogBox';
import MDSConfirmDeleteDialog from './components/chakra-compo/DeleteDialogBox';
import { DataTable } from './components/DataTable';
import { DemoFilter } from './demoFilter';
import { dummyData } from './dummy/data';

const headers = [
  { id: 'name', label: 'User Name', minWidth: 400 },
  { id: 'email', label: 'Email', minWidth: 400 },
  { id: 'role', label: 'Role', minWidth: 400 },
  { id: 'status', label: 'Status', minWidth: 400 },
  { id: 'joinDate', label: 'Join Date', minWidth: 400 },
];

function App() {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

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
        padding: '16px',
      }}
    >
      <DemoFilter search="" onSearchChange={() => console.log('sdakfj')} />

      <DataTable
        data={dummyData.map((item, i) => ({
          ...item,
          id: item.id + i,
          __raw: item,
          __key: item.id,
        }))}
        pageSize={pageSize}
        tableId="onslldj"
        loading={false}
        // skeletonLoading
        loadingChildren={<Spinner size={'sm'} />}
        page={page}
        totalCount={dummyData.length}
        onPageChange={(page) => setPage(page)}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        headers={headers}
        key={'something'}
        pageSizeOptions={[5, 8, 10]}
        onRowSelect={(row) => console.log('click')}
        onRowSelectEvent="left"
        actionConfig={{
          showSNo: true,
          showActionColumn: true,
          width: '100px',
          showColumnVisibilityMenu: true,
        }}
        actions={[
          {
            icon: <View size={14} />,
            label: 'Confirm',
            onClick: () => setOpenConfirm(true),
            colorScheme: 'blue',
            // visible: true,
          },
          {
            icon: <Trash size={14} />,
            label: 'Delete',
            onClick: () => setOpen(true),
            colorScheme: 'red',
            // visible: (row) => row.__key % 2 === 0,
          },
        ]}
      />

      <MDSConfirmDeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete Company"
        entityName="Company"
        confirmText="DELETE"
        confirmLabel="Delete"
        isLoading={false}
      />
      <MDSConfirmActionDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => setOpenConfirm(false)}
        title="Confirm Action"
        description="Are you sure you want to continue?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        isLoading={false}
      />
    </div>
  );
}

export default App;
