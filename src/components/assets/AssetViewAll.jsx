import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { matchSorter } from 'match-sorter';
import '../common/common.css';
import AssetEditModal from './AssetEditModal'; // Import the edit modal component

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

const AssetTable = ({ assets, openEditModal }) => {
  const data = useMemo(() => assets, [assets]);

  const columns = useMemo(
    () => [
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
        Header: 'Image',
        accessor: 'image_path',
        Cell: ({ cell: { value } }) => (value ? <img src={value} alt="Asset" style={{ width: '50px' }} /> : null),
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <button className="standard-btn" onClick={() => openEditModal(row.original)}>Edit</button>
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
  );
};

const AssetViewAll = () => {
  const [assets, setAssets] = useState([]);
  const [editAsset, setEditAsset] = useState(null);

  const fetchAssets = async () => {
    const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT from local storage
    const baseUrl = import.meta.env.VITE_BASE_URL;

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
      console.error('Failed to fetch assets:', data.error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const openEditModal = (asset) => {
    setEditAsset(asset);
  };

  const closeEditModal = () => {
    setEditAsset(null);
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
      closeEditModal();
    } else {
      console.error('Failed to update asset:', data.error);
    }
  };

  return (
    <div id="content">
      <h3>All Assets</h3>
      <AssetTable assets={assets} openEditModal={openEditModal} />
      {editAsset && (
        <AssetEditModal
          asset={editAsset}
          onClose={closeEditModal}
          onSubmit={handleEditSubmit}
          fetchAssets={fetchAssets}
        />
      )}
    </div>
  );
};

export default AssetViewAll;
