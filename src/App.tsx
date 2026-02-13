import { IconButton, Menu, Portal, Spinner } from '@chakra-ui/react';
import { EllipsisIcon } from 'lucide-react';
import { useState } from 'react';
import MDSConfirmActionDialog from './components/chakra-compo/ConfirmDialogBox';
import MDSConfirmDeleteDialog from './components/chakra-compo/DeleteDialogBox';
import usePagination from './components/customHooks/Pagination.hook';
import { Column, DataTable } from './components/DataTable';
import { ACTIONS_COLUMN_ID } from './components/DataTable/types';
import { DemoFilter } from './demoFilter';
import { dummyData } from './dummy/data';
import { withChildren } from './utils/chakra-slot';

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
};

const MenuRoot = withChildren(Menu.Root);
const MenuItem = withChildren(Menu.Item);
const MenuPositioner = withChildren(Menu.Positioner);
const MenuContent = withChildren(Menu.Content);
const MenuTrigger = withChildren(Menu.Trigger);

function App() {
  // const [pageSize, setPageSize] = useState(50);
  // const [page, setPage] = useState(1);
  const [openDelete, setOpenDelete] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { page, limit, setLimit, setPage } = usePagination({
    initialPage: 1,
    initialLimit: 20,
  });

  const headers: Column<UserRow>[] = [
    {
      id: 'status',
      label: '#',
    },
    {
      id: 'name',
      label: 'User Name',
      minWidth: 300,
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 300,
      render: (row) => <span style={{ color: 'blue', fontSize: 12 }}>{row.email}</span>,
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 400,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 400,
    },
    {
      id: 'joinDate',
      label: 'Join Date',
      minWidth: 200,
    },
    {
      type: 'actions',
      id: ACTIONS_COLUMN_ID,
      label: 'Actions',
      minWidth: 200,
      render: (row) => (
        <MenuRoot>
          <MenuTrigger asChild>
            <IconButton aria-label="Toggle columns" variant="ghost" ml="1" size="xs">
              <EllipsisIcon size={18} />
            </IconButton>
          </MenuTrigger>
          <Portal>
            <MenuPositioner>
              <MenuContent>
                <MenuItem value="new-txt">New Text File</MenuItem>
                <MenuItem value="new-file">New File...</MenuItem>
                <MenuItem value="new-win">New Window</MenuItem>
                <MenuItem value="open-file">Open File...</MenuItem>
                <MenuItem value="export">Export</MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRoot>
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
        pageSize={limit}
        totalCount={dummyData.length}
        loading={false}
        loadingChildren={<Spinner size="sm" />}
        pageSizeOptions={[50, 100, 200, 500, 1000]}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
        onRowSelect={(row) => console.log('row clicked', row)}
        enableColumnVisibility={true}
        dataType="pagination"
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
