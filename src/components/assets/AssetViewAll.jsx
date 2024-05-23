// src/components/assets/AssetViewAll.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { matchSorter } from 'match-sorter';

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

const AssetTable = ({ assets }) => {
  const data = useMemo(() => assets, [assets]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Serial Number',
        accessor: 'asset_sn',
      },
      {
        Header: 'Acquired Date',
        accessor: 'acquired_date',
      },
      {
        Header: 'Status',
        accessor: 'asset_status',
      },
      {
        Header: 'Image',
        accessor: 'image_path',
        Cell: ({ cell: { value } }) => (value ? <img src={value} alt="Asset" style={{ width: '50px' }} /> : null),
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
    <table {...getTableProps()} style={{ border: 'solid 1px black' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ borderBottom: 'solid 3px red', background: 'aliceblue', color: 'black', fontWeight: 'bold' }}>
                {column.render('Header')}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
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

  useEffect(() => {
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

    fetchAssets();
  }, []);

  return (
    <div>
      <h3>All Assets</h3>
      <AssetTable assets={assets} />
    </div>
  );
};

export default AssetViewAll;
