// src/pages/admin/ManageLogs/LogsList.jsx
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecializationCityLogs, storeLogFilters } from "./LogsSlice";

const LogsList = () => {
  const dispatch = useDispatch();

  // --- persisted filters from redux (state.logs not state.specializationCityLogs) ---
  const persisted = useSelector((s) => s.logs?.filters) || {};

  // --- local filters ---
  const [filters, setFilters] = useState({
    page: persisted.page || 1,
    limit: persisted.limit || 10,
    search: persisted.search || "",
    serviceCityId: persisted.serviceCityId || "",
    startDate: persisted.startDate || "",
    endDate: persisted.endDate || "",
  });

  // --- redux state ---
  const {
    logsList: data = [],
    total = 0,
    isLoading: loading = false,
  } = useSelector((s) => s.logs || {});

  // persist filters
  useEffect(() => {
    dispatch(storeLogFilters(filters));
  }, [dispatch, filters]);

  // debounce search
  const debouncedSetSearch = useMemo(
    () =>
      debounce(
        (value) => setFilters((prev) => ({ ...prev, page: 1, search: value })),
        300
      ),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  // const onSearchChange = (e) => debouncedSetSearch(e.target.value);

  // fetch logs
  const getLogs = useCallback(() => {
    dispatch(fetchSpecializationCityLogs(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  // handlers
  const handlePageChange = (page) => setFilters((f) => ({ ...f, page }));
  const handlePageSizeChange = (e) =>
    setFilters((f) => ({ ...f, page: 1, limit: Number(e.target.value) }));

  // const clearSearch = () => {
  //   setFilters((f) => ({ ...f, page: 1, search: "" }));
  //   debouncedSetSearch.cancel();
  // };

  // helpers
  const renderCell = (text, max = 28) => {
    if (!text) return "-";
    const str = String(text);
    const truncated = str.length > max ? str.slice(0, max) + "…" : str;
    return (
      <span className="nd-ellipsis" title={str}>
        {truncated}
      </span>
    );
  };

  const createdDisplay = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} • ${d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <article className="col-lg-9">
      <div className="article-body nd-card">
        <div className="nd-topbar">
          <h4>Specialization City Logs</h4>

          <div className="nd-toolbar">
            <div className="nd-limit">
              <span>Rows:</span>
              <select value={filters.limit} onChange={handlePageSizeChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* <form
              className="nd-search"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                className="form-control"
                placeholder="Search by slug, cityId…"
                defaultValue={filters.search}
                onChange={onSearchChange}
              />
              {filters.search?.length > 0 && (
                <button
                  type="button"
                  className="nd-clear"
                  onClick={clearSearch}
                >
                  ×
                </button>
              )}
            </form> */}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table text-center small">
                <thead>
                  <tr>
                    <th>Service City Slug</th>
                    <th>Action</th>
                    <th>Updated At</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array.from({ length: Math.min(filters.limit, 10) }).map(
                      (_, i) => (
                        <tr key={`sk-${i}`}>
                          {Array.from({ length: 4 }).map((__, j) => (
                            <td key={`sk-${i}-${j}`}>
                              <span className="placeholder col-8" />
                            </td>
                          ))}
                        </tr>
                      )
                    )
                  ) : data && data.length > 0 ? (
                    data.map((log) => (
                      <tr key={log._id}>
                        <td>{renderCell(log?.serviceCityId?.slug)}</td>
                        <td>{renderCell(log?.action || "Updated")}</td>
                        {/* <td>{renderCell(log?.user || "-")}</td> */}
                        <td>{createdDisplay(log.updatedAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <div className="nd-empty">
                          <div className="nd-title">No logs found</div>
                          <div>Try changing filters or search.</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {total > filters.limit && (
              <Pagination
                activePage={filters.page}
                itemsCountPerPage={filters.limit}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default LogsList;
