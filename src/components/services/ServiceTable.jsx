import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { matchSorter } from 'match-sorter';
import '../common/common.css';
import './Modal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
  const count = preFilteredRows.length;
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder={`Search ${count} records...`}
    />
  );
};

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
};

fuzzyTextFilterFn.autoRemove = val => !val;

const ServiceTable = ({ services, openEditModal, handleDownload, fetchServices }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [confirmText, setConfirmText] = useState('');

  const data = useMemo(() => services, [services]);

  const handleDelete = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (confirmText !== 'del') {
      toast.error('Please type "del" to confirm');
      return;
    }

    try {
      const deleteUrl = `/services/service_delete/${serviceToDelete.id}`;
      const response = await fetch(deleteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || 'Service deleted successfully');
        setShowDeleteModal(false);
        setServiceToDelete(null);
        setConfirmText('');
        await fetchServices();
      } else {
        throw new Error(responseData.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Failed to delete service:', error.message);
      toast.error('Failed to delete service');
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Asset Name',
        accessor: 'asset_name',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Service Type',
        accessor: 'service_type',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Service Date',
        accessor: 'service_date',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Service Cost',
        accessor: 'service_cost',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Service Status',
        accessor: 'service_status',
        Filter: DefaultColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
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
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Please type "del" to confirm the deletion of this service:</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="modal-actions">
              <button className="standard-del-btn" onClick={confirmDelete}>Delete</button>
              <button className="standard-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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

export default ServiceTable;
