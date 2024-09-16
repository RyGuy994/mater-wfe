import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { matchSorter } from 'match-sorter';
import '../common/common.css';
import '../common/Modal.css';
import DeleteModal from '../common/DeleteModal';
import GenericModal from '../common/Modal'; // Adjust the path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
};

fuzzyTextFilterFn.autoRemove = val => !val;

const AssetTable = ({ assets, openEditModal, fetchAssets }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const data = useMemo(() => assets, [assets]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  const handleDownload = async (downloadAsset) => {
    try {
      const response = await fetch(`${baseUrl}/assets/generate_zip/${downloadAsset.id}`);
      if (!response.ok) {
        throw new Error('Failed to download ZIP file');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `asset_${downloadAsset.id}_files.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ZIP file:', error);
      toast.error('Failed to download ZIP file');
    }
  };
  

  const handleDelete = (asset) => {
    console.log('handleDelete called with asset:', asset);
    setAssetToDelete(asset);
    setShowDeleteModal(true);
    console.log('showDeleteModal:', showDeleteModal);
    console.log('assetToDelete:', assetToDelete);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false); // Close the modal
    try {
        const deleteUrl = `${baseUrl}/assets/asset_delete/${assetToDelete.id}`;
        const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage

        const response = await fetch(deleteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jwt: jwtToken // Include JWT token in the body
            }),
        });

        const responseData = await response.json();

        if (response.ok) {
            toast.success(responseData.message || 'Asset deleted successfully');
            setShowDeleteModal(false);
            setAssetToDelete(null);
            setConfirmText('');
            await fetchAssets();
        } else {
            throw new Error(responseData.error || 'Failed to delete asset');
        }
    } catch (error) {
        console.error('Failed to delete asset:', error.message);
        toast.error('Failed to delete asset');
    }
};

  const columns = useMemo(
    () => [
      {
        Header: 'Image',
        accessor: 'image_path',
        Cell: ({ cell: { value }, row }) => (value ? <img src={`${baseUrl}/static/assets/${row.original.id}/image/${value.split('/').pop()}`} alt="Asset" style={{ width: '50px' }} /> : <img src={`${baseUrl}/static/images/default.png`} alt="Asset" style={{ width: '50px' }} />),
        disableFilters: true,
        disableSortBy: true,        
      },
      {
        Header: 'Name',
        accessor: 'name',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Description',
        accessor: 'description',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Serial Number',
        accessor: 'asset_sn',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Acquired Date',
        accessor: 'acquired_date',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Status',
        accessor: 'asset_status',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button className="standard-btn" onClick={() => placeholder}>Asset Page</button>
            <button className="standard-btn" onClick={() => openEditModal(row.original)}>Edit</button>
            <button className="standard-btn" onClick={() => handleDownload(row.original)}>Download</button>
            <button className="standard-del-btn" onClick={() => handleDelete(row.original)}>Delete</button>
          </div>
        ),
        disableFilters: true,
        disableSortBy: true,
      },
    ],
    []
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes: {
        fuzzyText: fuzzyTextFilterFn,
      },
    },
    useFilters,
    useSortBy
  );

  return (
    <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)} // Close modal on cancel
        onConfirm={confirmDelete} // Confirm delete on modal confirm button
      />
      <ToastContainer />
      <table {...getTableProps()} className="standard-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} style={{ position: 'relative' }}>
                  <div {...column.getSortByToggleProps()} style={{ display: 'inline-block', cursor: 'pointer' }}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </div>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ padding: '10px', border: 'solid 1px gray' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AssetViewAll = () => {
  const [assets, setAssets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'asset' or 'service'
  const [editAsset, setEditAsset] = useState(null); // Asset to edit

  const fetchAssets = async () => {
    const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage
    const baseUrl = import.meta.env.VITE_BASE_URL;
  
    try {
      const response = await fetch(`${baseUrl}/assets/asset_all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jwt: jwtToken }) // Send JWT in the body
      });
  
      const data = await response.json();
      if (response.ok) {
        setAssets(data);
      } else {
        throw new Error(data.error || 'Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error fetching assets:', error.message);
      toast.error('Failed to fetch assets');
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const openEditModal = (asset) => {
    setEditAsset(asset);   // Pass the asset to be edited
    setModalType('asset'); // Set modal type to 'asset'
    setModalOpen(true);    // Open modal
  };

  const closeModal = () => {
    setModalOpen(false);   // Close modal
    setEditAsset(null);    // Clear edit asset
    setModalType(null);    // Reset modal type
  };

  const handleEditSubmit = async (updatedAsset) => {
    const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage
    const baseUrl = import.meta.env.VITE_BASE_URL;
  
    const response = await fetch(`${baseUrl}/assets/asset_edit/${updatedAsset.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...updatedAsset,
        jwt: jwtToken // Include JWT token
      })
    });
  
    const data = await response.json();
    if (response.ok) {
      await fetchAssets(); // Re-fetch the assets data after the edit
      closeModal();
    } else {
      console.error('Failed to update asset:', data.error);
    }
  };

  return (
    <div id="content">
      <h3>All Assets</h3>
      <AssetTable assets={assets} openEditModal={openEditModal} fetchAssets={fetchAssets} />
      {modalOpen && (
        <GenericModal
          type={modalType}      // 'asset' or 'service'
          mode="edit"           // Set mode to 'edit'
          item={editAsset}      // Pass the asset to be edited
          onClose={closeModal}  // Function to close modal
          onSubmit={handleEditSubmit} // Function to handle submit
          fetchAssets={fetchAssets}
        />
)}
    </div>
  );
};

export default AssetViewAll;
