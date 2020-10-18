import { useTable, usePagination, useFilters } from 'react-table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ProjectsTable, TextFilter, fuzzyTextFilterFn } from '../components';
import {
  filterActiveProjects,
  getBaseApiUrl,
  getProjectsFromBrigadeData,
} from '../utils';
import Select from '../components/Select/Select';
import TopicsFilter, {
  filterByTopics,
} from '../components/ProjectsTable/TopicsFilter';

const ACTIVE_THRESHOLDS = {
  // key: user-facing string that represents the threshold
  // value: array of values for `last_pushed_within` that match the threshold
  'all time': ['month', 'week', 'year', 'over_a_year'],
  year: ['month', 'week', 'year'],
  month: ['month', 'week'],
  week: ['week'],
};

function Projects() {
  const [brigadeData, setBrigadeData] = useState();
  const [projects, setProjects] = useState();
  const [activeThreshold, setActiveThreshold] = useState('year');

  // eslint-disable-next-line import/prefer-default-export
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      filterByTopics,
    }),
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Project',
        accessor: (project) => (
          // TODO: CHANGE THIS WHEN WE HAVE A PROJECT DETAIL PAGE TO GO TO
          // <NavLink to={`/projects/${slugify(project.slug)}`}>{project.name}</NavLink>
          <a href={project.code_url}>{project.name}</a>
        ),
        Filter: TextFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Description',
        accessor: 'description',
        Filter: TextFilter,
        filter: 'fuzzyText',
      },
      {
        id: 'Topics',
        Header: <span className="sr-only">Topics</span>,
        accessor: (project) => (project.topics || []).join(', '),
        Filter: TopicsFilter,
        filter: 'filterByTopics',
      },
      {
        Header: 'Brigade',
        accessor: 'brigade.name',
        Filter: TextFilter,
        filter: 'fuzzyText',
      },
    ],
    []
  );

  const tableAttributes = useTable(
    {
      columns,
      data: projects || [],
      initialState: {
        pageIndex: 0,
        pageSize: projects ? projects.length : 50,
      },
      filterTypes,
    },
    useFilters,
    usePagination
  );

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(brigades.data);
    };
    getData();
  }, []);

  useEffect(() => {
    setProjects(
      filterActiveProjects(
        getProjectsFromBrigadeData(brigadeData),
        ACTIVE_THRESHOLDS[activeThreshold]
      )
    );
  }, [brigadeData, activeThreshold]);

  return (
    <>
      <h1>Active projects</h1>
      <div>
        {projects && (
          <Select
            label={`Showing ${projects.length} projects with changes on Github in the last`}
            id="active_time_range"
            onChange={(e) => setActiveThreshold(e.target.value)}
            selected={activeThreshold}
            options={Object.keys(ACTIVE_THRESHOLDS)}
            inline
          />
        )}
      </div>
      <br />
      {/* This is just a stand-in-- we should probably make it so that we can pass column props to the table */}
      <ProjectsTable projects={projects} tableAttributes={tableAttributes} />
    </>
  );
}

export default Projects;
