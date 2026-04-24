import { NavLink } from "react-router-dom";
import { useState } from "react";

const SideBar = ({ setStatusFilter }) => {
  const [openCases, setOpenCases] = useState(false);

  return (
    <div className="sidebar d-flex flex-column">
      {/* Header */}
      <div className="sidebar-header text-center py-4">
        <div className="text-center mb-3">
          <img src="src/assets/DCI-logo.jpg" alt="logo" className="logo" />
        </div>

        <h6 className="text-white fw-bold">APTU DFL</h6>
      </div>

      {/* Navigation */}
      <nav className="nav flex-column px-3">
        {/* Dashboard */}
        <div
          className="sidebar-link"
          onClick={() => setStatusFilter("")}
          style={{ cursor: "pointer" }}
        >
          DASHBOARD
        </div>

        {/* CASES */}
        <div
          className="sidebar-link d-flex justify-content-between align-items-center"
          onClick={() => setOpenCases(!openCases)}
          style={{ cursor: "pointer" }}
        >
          CASES
          <span>{openCases ? "-" : "+"}</span>
        </div>

        {/* Submenu */}
        {openCases && (
          <div className="submenu">
            <div
              className="sidebar-sublink"
              style={{ cursor: "pointer" }}
              onClick={() => setStatusFilter("")}
            >
              All Cases
            </div>

            <div
              onClick={() => setStatusFilter("Pending")}
              className="sidebar-sublink"
              style={{ cursor: "pointer" }}
            >
              Pending
            </div>

            <div
              onClick={() =>
                setStatusFilter("Extracted,Analyzed,Reported,Failed,Collected")
              }
              className="sidebar-sublink"
              style={{ cursor: "pointer"}}
            >
              Exploited
            </div>

            <NavLink to="/dashboard/exhibits/add" className="sidebar-sublink">
              Add Case
            </NavLink>
          </div>
        )}

        {/* Reports */}
        <NavLink to="/dashboard/reports" className="sidebar-link">
          REPORT
        </NavLink>
      </nav>
    </div>
  );
};

export default SideBar;
