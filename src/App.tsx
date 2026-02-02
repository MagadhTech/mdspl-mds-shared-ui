import { IconButton, Menu, Portal, Spinner } from '@chakra-ui/react';
import { EllipsisIcon } from 'lucide-react';
import { useState } from 'react';
import MDSConfirmActionDialog from './components/chakra-compo/ConfirmDialogBox';
import MDSConfirmDeleteDialog from './components/chakra-compo/DeleteDialogBox';
import { Column, DataTable } from './components/DataTable';
import { ACTIONS_COLUMN_ID } from './components/DataTable/types';
import { DemoFilter } from './demoFilter';
import { dummyData } from './dummy/data';

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
};

function App() {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const headers: Column<UserRow>[] = [
    {
      id: 'name',
      label: 'User Name',
      minWidth: 400,
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 400,
      render: (row) => <span style={{ color: 'blue', fontSize: 12 }}>{row.email}</span>,
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 300,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 300,
    },
    {
      id: 'joinDate',
      label: 'Join Date',
      minWidth: 300,
    },
    {
      type: 'actions',
      id: ACTIONS_COLUMN_ID,
      label: 'Actions',
      minWidth: 100,
      render: () => (
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton aria-label="Toggle columns" variant="ghost" ml="1" size="xs">
              <EllipsisIcon size={18} />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="new-txt">New Text File</Menu.Item>
                <Menu.Item value="new-file">New File...</Menu.Item>
                <Menu.Item value="new-win">New Window</Menu.Item>
                <Menu.Item value="open-file">Open File...</Menu.Item>
                <Menu.Item value="export">Export</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ),
    },
  ];

  return (
    <div
      style={{
        border: '1px solid red',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        overflow: 'hidden',
      }}
    >
      <DemoFilter search="" onSearchChange={() => {}} />

      <DataTable<UserRow>
        tableId="onslldj"
        headers={headers}
        data={dummyData.map((item, i) => ({
          ...item,
          id: item.id + i,
        }))}
        page={page}
        pageSize={pageSize}
        totalCount={dummyData.length}
        loading={false}
        loadingChildren={<Spinner size="sm" />}
        pageSizeOptions={[5, 8, 10]}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowSelect={(row) => console.log('row clicked', row)}
        enableColumnVisibility={true}
      />

      <MDSConfirmDeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
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
