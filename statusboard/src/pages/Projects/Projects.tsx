import React, { useMemo, useContext } from 'react';
import { usePagination, useFilters } from 'react-table';
import { ProjectsTable, fuzzyTextFilter } from '../../components';
import { getTopicsFromProjects } from '../../utils/utils';
import Select from '../../components/Select/Select';
import { ACTIVE_THRESHOLDS, getTableColumns } from './utils';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import BrigadeDataContext from '../../contexts/BrigadeDataContext';
import { LoadingIndicator } from '../../components/LoadingIndicator/LoadingIndicator';
import { useProjectFilters } from '../../utils/useProjectFilters';

function Projects() {
  const { allTopics, loading } = useContext(BrigadeDataContext);

  const {
    topics,
    timeRange,
    setFilters,
    projectsFilteredByTime,
    projectsFilteredByAllParams: filteredProjects,
  } = useProjectFilters();

  // Topics
  const availableTopics = useMemo(() => {
    if (!filteredProjects) return allTopics;
    return getTopicsFromProjects(projectsFilteredByTime);
  }, [projectsFilteredByTime]);

  // eslint-disable-next-line import/prefer-default-export
  const filterTypes = useMemo(
    () => ({
      fuzzyTextFilter,
    }),
    []
  );

  const columns = useMemo(
    () =>
      getTableColumns(topics, (newTopics) => setFilters({ topics: newTopics })),
    [topics]
  );

  const tableAttributes = [
    {
      columns,
      data: filteredProjects || [],
      initialState: {
        pageIndex: 0,
        pageSize: filteredProjects?.length || 50,
      },
      filterTypes,
    },
    useFilters,
    usePagination,
  ];

  return (
    <>
      <h1>Active projects</h1>
      <LoadingIndicator loading={loading}>
        <>
          <div>
            {filteredProjects && (
              <Select
                label={`Showing ${filteredProjects.length} projects with changes on Github in the last`}
                id="active_time_range"
                onChange={(e) => setFilters({ timeRange: e.target.value })}
                selected={timeRange}
                options={Object.keys(ACTIVE_THRESHOLDS)}
                inline
              />
            )}
          </div>
          <br />
          {availableTopics && (
            <MultiSelect
              selectedItems={topics}
              setSelectedItems={(newTopics: string[]) =>
                setFilters({ topics: newTopics })
              }
              items={availableTopics}
              labelText="Topics"
              onSelectionItemsChange={(newFilterTopics: string[] | undefined) =>
                setFilters({ topics: newFilterTopics })
              }
            />
          )}
          <br />
          <ProjectsTable
            projects={filteredProjects || []}
            tableAttributes={tableAttributes}
          />
        </>
      </LoadingIndicator>
    </>
  );
}

export default Projects;
