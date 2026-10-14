import { useState } from "react";

const CollapsibleSection = ({
  title,
  children,
  className = "",
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`mb-3 border ${className} rounded`}>
      <div
        className="bg-light p-2 px-3 border-bottom d-flex justify-content-between align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <strong className="fw-semibold">{title}</strong>
        <span>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
