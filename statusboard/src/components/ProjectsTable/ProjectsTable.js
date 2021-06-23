// TODO: DEAL WITH ALL OF THESE
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
import { useTable } from 'react-table';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { parse, stringify } from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '../Button/Button';
import ColumnHeader from './ColumnHeader';
import './ProjectsTable.scss';

export default function ProjectsTable({ projects, tableAttributes }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    setPageSize,
    state: { filters, pageSize },
  } = useTable(...tableAttributes);

  const query = useLocation().search;
  const history = useHistory();

  const queries = useCallback(
    () =>
      parse(query, {
        arrayFormat: 'comma',
      }),
    [query]
  );

  const setFilters = useCallback(
    (newFilter) => {
      const { timeRange, topics, brigades } = queries();
      const _newFilter = { timeRange, topics, brigades, ...newFilter };
      history.replace(`?${stringify(_newFilter, { arrayFormat: 'comma' })}`);
    },
    [queries, history]
  );

  React.useEffect(() => {
    // Todo: include all filters, otherwise they can't be deleted
    const simple = filters.reduce((acc, next) => {
      return { ...acc, [next.id]: next.value };
    }, {});
    setFilters(simple);
  }, [filters, setFilters]);

  return (
    <div className="projects-table">
      <PerfectScrollbar>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <ColumnHeader
                    column={column}
                    key={column.id}
                    disableSort={!projects || projects.length === 0}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {!projects && (
              <tr>
                <td colSpan="3">
                  <span>Loading...</span>
                </td>
              </tr>
            )}
            {projects && projects.length === 0 && (
              <tr>
                <td colSpan="3">
                  <span>No projects</span>
                </td>
              </tr>
            )}
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {projects && pageSize < rows.length && (
          <div className="load-projects-button">
            <Button
              text="Load next 50 projects"
              onClick={() => setPageSize(pageSize + 50)}
            />
          </div>
        )}
      </PerfectScrollbar>
    </div>
  );
}
