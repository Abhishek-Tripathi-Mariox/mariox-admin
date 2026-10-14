// import { debounce } from "lodash";
// import { useCallback, useEffect, useState } from "react";
// import Pagination from "react-js-pagination";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { inquiresList } from "./inquiresSlice";

// const InquiresList = () => {
//   const dispatch = useDispatch();
//   const [filters, setFilters] = useState({ page: 1, limit: 10, search: "" });

//   const data = useSelector((state) => state.inquires?.inquiresList);
//   const total = useSelector((state) => state.inquires?.total);

//   const getInquiresListing = useCallback(() => {
//     dispatch(inquiresList(filters));
//   }, [dispatch, filters]);

//   useEffect(() => {
//     getInquiresListing();
//   }, [getInquiresListing]);

//   const handlePageChange = (page) => {
//     setFilters({ ...filters, page });
//   };

//   const handleSearch = debounce((e) => {
//     setFilters({ ...filters, page: 1, search: e.target.value });
//   }, 300);

//   return (
//     <article className="col-lg-9">
//       <div className="article-body store-bd-gy">
//         <div className="row align-items-center">
//           <div className="col-md-6 mb-3">
//             <div className="link-active">
//               <img src="assets/images/Users-selected.png" alt="" />
//               <span>
//                 <p>{total || 0}</p>
//                 <p>Total Inquiries</p>
//               </span>
//             </div>
//           </div>
//           <div className="col-md-6 mb-3 d-flex justify-content-end">
//             <form className="has-search mr-3">
//               <input
//                 type="search"
//                 className="form-control"
//                 placeholder="Search Inquiries by Name"
//                 onChange={handleSearch}
//               />
//             </form>
//             <Link to="/admin/manage-inquires/add" className="add-new">
//               + Add New
//             </Link>
//           </div>
//         </div>

//         <hr />

//         <div className="row">
//           <div className="col-12">
//             <div className="table-responsive">
//               <table className="table text-center small">
//                 <thead>
//                   <tr>
//                     <th>Full Name</th>
//                     <th>Email</th>
//                     <th>Phone Number</th>
//                     <th>Specialization</th>
//                     <th>City</th>
//                     <th>Message</th>
//                     <th>Slug</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data && data.length > 0 ? (
//                     data.map((inq) => {
//                       const createdDate = new Date(inq.createdAt);
//                       const date = createdDate.toLocaleDateString("en-IN"); // format: dd/mm/yyyy
//                       const time = createdDate.toLocaleTimeString("en-IN"); // format: hh:mm:ss AM/PM

//                       return (
//                         <tr key={inq._id}>
//                           <td>{inq.fullName || "-"}</td>
//                           <td>{inq.email || "-"}</td>
//                           <td>{inq.phoneNumber || "-"}</td>
//                           <td>{inq.specialization || "-"}</td>
//                           <td>{inq.city || "-"}</td>
//                           <td>{inq.message || "-"}</td>
//                           <td>{inq.slug || "-"}</td>
//                           <td>{date}</td>
//                           <td>{time}</td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan={9}>No inquiries found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {total > filters.limit && (
//               <Pagination
//                 activePage={filters.page}
//                 itemsCountPerPage={filters.limit}
//                 totalItemsCount={total}
//                 pageRangeDisplayed={5}
//                 onChange={handlePageChange}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// };

// export default InquiresList;

// src/pages/Inquires/InquiresList.jsx
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { inquiresList, fetchCampaignIds, storeFilters } from "./inquiresSlice";

const InquiresList = () => {
  const dispatch = useDispatch();

  // Pull persisted filters (if any) from store
  const persisted = useSelector((s) => s.inquires?.filters) || {};

  // Local UI filters state
  const [filters, setFilters] = useState({
    page: persisted.page || 1,
    limit: persisted.limit || 10,
    search: persisted.search || "",
    campaignId: persisted.campaignId || "",
  });

  // Global state
  const {
    inquiresList: data = [],
    total = 0,
    isLoading: loading = false, // uses your slice's isLoading
    campaignIds = [],
    campaignIdsLoading = false,
    campaignIdsError = null,
  } = useSelector((state) => state.inquires || {});

  // -------- Fetch campaign IDs on mount --------
  useEffect(() => {
    dispatch(fetchCampaignIds());
  }, [dispatch]);

  // -------- Persist filters in store (and localStorage via reducer) --------
  useEffect(() => {
    dispatch(storeFilters(filters));
  }, [dispatch, filters]);

  // -------- Debounced search handler --------
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setFilters((prev) => ({ ...prev, page: 1, search: value }));
      }, 300),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const onSearchChange = (e) => debouncedSetSearch(e.target.value);

  // -------- Fetch list whenever filters change --------
  const getInquiresListing = useCallback(() => {
    dispatch(inquiresList(filters)); // your getData("admin/inquires", object) passes all filters
  }, [dispatch, filters]);

  useEffect(() => {
    getInquiresListing();
  }, [getInquiresListing]);

  // -------- Handlers --------
  const handlePageChange = (page) => setFilters((f) => ({ ...f, page }));
  const handlePageSizeChange = (e) =>
    setFilters((f) => ({ ...f, page: 1, limit: Number(e.target.value) }));

  const handleCampaignChange = (e) => {
    const value = e.target.value; // "" = all
    setFilters((f) => ({ ...f, page: 1, campaignId: value }));
  };

  const clearSearch = () => {
    setFilters((f) => ({ ...f, page: 1, search: "" }));
    debouncedSetSearch.cancel();
  };

  // -------- Helpers --------
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

  // -------- Modal state --------
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const openDetails = (inq) => {
    setSelected(inq);
    setOpenModal(true);
  };
  const closeDetails = () => {
    setOpenModal(false);
    setSelected(null);
  };

  // Esc to close modal
  useEffect(() => {
    if (!openModal) return;
    const onKey = (e) => e.key === "Escape" && closeDetails();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openModal]);

  return (
    <article className="col-lg-9">
      {/* Scoped styles */}
      <style>{`
        .nd-card { background:#fff; border:1px solid #eef0f4; border-radius:12px; padding:16px; }
        .nd-stat { display:flex; align-items:center; gap:12px; background:#f8fafc; padding:12px 16px; border-radius:12px; border:1px solid #eef0f4; }
        .nd-stat img { width:36px; height:36px; object-fit:contain; }
        .nd-stat p { margin:0; line-height:1.1; }
        .nd-stat .nd-stat-num { font-weight:700; font-size:20px; }
        .nd-topbar { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
        .nd-toolbar { display:flex; gap:12px; justify-content:flex-end; align-items:center; flex-wrap:wrap; }
        .nd-limit { display:flex; align-items:center; gap:8px; color:#475569; }
        .nd-limit select, .nd-select { height:36px; border-radius:8px; border:1px solid #e2e8f0; padding:0 10px; background:#fff; }
        .nd-select { min-width:220px; }
        .nd-search { position:relative; min-width:260px; }
        .nd-search input { padding-right:34px; }
        .nd-search .nd-clear { position:absolute; right:8px; top:50%; transform:translateY(-50%); border:none; background:transparent; font-size:18px; line-height:1; cursor:pointer; color:#64748b; }
        .table-responsive { border-radius:12px; border:1px solid #eef0f4; }
        thead th { position:sticky; top:0; z-index:1; background:#f8fafc; border-bottom:1px solid #e5e7eb; white-space:nowrap; }
        tbody td { vertical-align:middle; }
        .nd-ellipsis { display:inline-block; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; vertical-align:bottom; }
        .nd-badge { display:inline-block; padding:2px 8px; border-radius:999px; border:1px solid #e5e7eb; background:#f1f5f9; font-size:12px; }
        .nd-empty { text-align:center; padding:48px 16px; color:#64748b; }
        .nd-empty .nd-title { font-weight:600; margin-bottom:4px; }
        .pagination { display:flex; justify-content:center; margin-top:16px; }

        /* clickable cells */
        .nd-link { color:#2563eb; cursor:pointer; text-decoration:none; background:none; border:none; padding:0; }
        .nd-link:hover { text-decoration:underline; }

        /* Modal */
        .nd-modal-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,0.4);
          display:flex; align-items:center; justify-content:center; z-index:1050;
        }
        .nd-modal { width:min(720px,92vw); background:#fff; border-radius:14px;
          box-shadow:0 10px 30px rgba(0,0,0,0.15); overflow:hidden; animation:nd-pop 120ms ease-out; }
        @keyframes nd-pop { from { transform:scale(.98); opacity:.6; } to { transform:scale(1); opacity:1; } }
        .nd-modal-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #eef0f4; background:#f8fafc; }
        .nd-modal-title { margin:0; font-size:16px; font-weight:700; }
        .nd-modal-close { border:none; background:transparent; font-size:22px; line-height:1; cursor:pointer; color:#475569; }
        .nd-modal-body { padding:16px 18px; max-height:70vh; overflow:auto; }
        .nd-dl { display:grid; grid-template-columns:160px 1fr; gap:8px 12px; align-items:baseline; }
        .nd-dt { color:#64748b; }
        .nd-dd { color:#0f172a; word-break:break-word; }
        .nd-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .nd-copy { margin-left:8px; font-size:12px; border:1px solid #e2e8f0; background:#fff; border-radius:6px; padding:2px 6px; cursor:pointer; }
      `}</style>

      <div className="article-body nd-card">
        <div className="nd-topbar">
          <div className="nd-stat">
            <img src="/assets/images/Users-selected.png" alt="inquiries" />
            <span>
              <p className="nd-stat-num">{total || 0}</p>
              <p>Total Inquiries</p>
            </span>
          </div>

          <div className="nd-toolbar">
            {/* Rows per page */}
            <div className="nd-limit">
              <span>Rows:</span>
              <select value={filters.limit} onChange={handlePageSizeChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Campaign filter */}
            <div className="nd-limit">
              <span>Campaign:</span>
              <select
                className="nd-select"
                value={filters.campaignId}
                onChange={handleCampaignChange}
                disabled={campaignIdsLoading}
                title="Filter by Campaign ID"
              >
                <option value="">All Campaigns</option>
                {campaignIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <form
              className="nd-search"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                className="form-control"
                placeholder="Search by name, email, phone, city…"
                defaultValue={filters.search}
                onChange={onSearchChange}
                aria-label="Search inquiries"
              />
              {filters.search?.length > 0 && (
                <button
                  type="button"
                  className="nd-clear"
                  onClick={clearSearch}
                  title="Clear"
                >
                  ×
                </button>
              )}
            </form>

            <Link to="/admin/manage-inquires/add" className="add-new">
              + Add New
            </Link>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table text-center small">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>City</th>
                    <th>Campaign</th>
                    <th>Message</th>
                    <th>Slug</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array.from({ length: Math.min(filters.limit, 10) }).map(
                      (_, i) => (
                        <tr key={`sk-${i}`}>
                          {Array.from({ length: 9 }).map((__, j) => (
                            <td key={`sk-${i}-${j}`}>
                              <span className="placeholder col-8" />
                            </td>
                          ))}
                        </tr>
                      )
                    )
                  ) : data && data.length > 0 ? (
                    data.map((inq) => {
                      const serviceOrSpec =
                        inq?.service || inq?.specialization || "-";
                      return (
                        <tr key={inq._id}>
                          <td>{renderCell(inq.fullName)}</td>
                          <td>
                            {inq.email ? (
                              <a href={`mailto:${inq.email}`} title={inq.email}>
                                {renderCell(inq.email)}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {inq.phoneNumber ? (
                              <a
                                href={`tel:${inq.phoneNumber}`}
                                title={inq.phoneNumber}
                              >
                                {renderCell(inq.phoneNumber)}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{renderCell(serviceOrSpec)}</td>
                          <td>{renderCell(inq.city)}</td>
                          <td>
                            {inq.campaignId ? (
                              <span
                                className="nd-badge"
                                title={`Campaign ID: ${inq.campaignId}`}
                              >
                                {renderCell(inq.campaignId, 16)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>

                          {/* CLICKABLE: Message */}
                          <td>
                            {inq.message ? (
                              <button
                                type="button"
                                className="nd-link"
                                title="View full message"
                                onClick={() => openDetails(inq)}
                              >
                                {renderCell(inq.message, 40)}
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>

                          {/* CLICKABLE: Slug */}
                          <td>
                            {inq.slug ? (
                              <button
                                type="button"
                                className="nd-link nd-mono"
                                title={inq.slug}
                                onClick={() => openDetails(inq)}
                              >
                                {renderCell(inq.slug, 30)}
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td title={inq.createdAt || ""}>
                            {createdDisplay(inq.createdAt)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9}>
                        <div className="nd-empty">
                          <div className="nd-title">No inquiries found</div>
                          <div>Try changing campaign or search.</div>
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

      {/* MODAL */}
      {openModal && selected && (
        <div
          className="nd-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inq-modal-title"
          onClick={(e) => {
            if (e.target.classList.contains("nd-modal-backdrop"))
              closeDetails();
          }}
        >
          <div className="nd-modal">
            <div className="nd-modal-header">
              <h3 id="inq-modal-title" className="nd-modal-title">
                Inquiry Details
              </h3>
              <button
                className="nd-modal-close"
                onClick={closeDetails}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="nd-modal-body">
              <dl className="nd-dl">
                <dt className="nd-dt">Full Name</dt>
                <dd className="nd-dd">{selected.fullName || "-"}</dd>

                <dt className="nd-dt">Email</dt>
                <dd className="nd-dd">
                  {selected.email ? (
                    <a href={`mailto:${selected.email}`} className="nd-mono">
                      {selected.email}
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>

                <dt className="nd-dt">Phone</dt>
                <dd className="nd-dd">
                  {selected.phoneNumber ? (
                    <a href={`tel:${selected.phoneNumber}`} className="nd-mono">
                      {selected.phoneNumber}
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>

                <dt className="nd-dt">Service / Spec</dt>
                <dd className="nd-dd">
                  {selected.service || selected.specialization || "-"}
                </dd>

                <dt className="nd-dt">City</dt>
                <dd className="nd-dd">{selected.city || "-"}</dd>

                <dt className="nd-dt">Campaign ID</dt>
                <dd className="nd-dd">
                  {selected.campaignId ? (
                    <span className="nd-mono">{selected.campaignId}</span>
                  ) : (
                    "-"
                  )}
                </dd>

                <dt className="nd-dt">Slug</dt>
                <dd className="nd-dd">
                  {selected.slug ? (
                    <>
                      <span className="nd-mono">{selected.slug}</span>
                      <button
                        className="nd-copy"
                        onClick={() =>
                          navigator.clipboard?.writeText(selected.slug)
                        }
                        title="Copy slug"
                      >
                        Copy
                      </button>
                    </>
                  ) : (
                    "-"
                  )}
                </dd>

                <dt className="nd-dt">Message</dt>
                <dd className="nd-dd">
                  {selected.message ? (
                    <>
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {selected.message}
                      </div>
                      <button
                        className="nd-copy"
                        onClick={() =>
                          navigator.clipboard?.writeText(selected.message)
                        }
                        title="Copy message"
                      >
                        Copy
                      </button>
                    </>
                  ) : (
                    "-"
                  )}
                </dd>

                <dt className="nd-dt">Created</dt>
                <dd className="nd-dd">{createdDisplay(selected.createdAt)}</dd>

                <dt className="nd-dt">Updated</dt>
                <dd className="nd-dd">{createdDisplay(selected.updatedAt)}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default InquiresList;
