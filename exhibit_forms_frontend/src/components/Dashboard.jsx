import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import "./authForm.css";

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  //* State for exhibits and loading
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);

  //* Pagination
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  //* Logout the examiner
  const handleLogOut = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    await fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${storedUser.token}`,
      },
    });

    //* Clear Examiner Logout Frontend Session
    localStorage.removeItem("user");
    setUser(null);

    //* Redirect to Login
    navigate("/auth");
  };

  //* Fetch exhibits from API
  const fetchExhibits = async (page = 1) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(
        `http://127.0.0.1:8000/api/exhibits?page=${page}`,
        {
          headers: {
            Authorization: `Token ${storedUser.token}`,
          },
        },
      );

      const data = await response.json();

      setExhibits(data.results);
      setCount(data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch exhibits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibits(1);
  }, []);

  //* Calculate total Pages
  const totalPages = Math.ceil(count / pageSize);

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg px-3 shadow-sm"
        style={{
          backgroundColor: "#8F0303",
          borderBottomStyle: "solid",
          borderBottomColor: "#252a61",
          borderBottomWidth: "1px",
        }}
      >
        {/* System Title */}
        <div className="navbar-brand text-white fw-bold">
          Digital Forensic Lab
          <span className="ms-2 fw-semibold text-black">
            Exhibit Management
          </span>
        </div>

        {/* Right side */}
        <div className="ms-auto">
          {/* User Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              👤 {user?.first_name} {user?.last_name}
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Dashboard Body */}
      <div className="container-fluid py-4 flex-grow-1">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-semibold mb-0">All Exhibits</h4>
          </div>

          {/* Search Exhibit by serial_number & date_received */}
          
          <button
            className="btn px-2 text-white"
            style={{ backgroundColor: "#8F0303" }}
          >
            Add Exhibit
          </button>
        </div>

        {/* Exhibits Table */}
        {loading ? (
          <p>Loading exhibits...</p>
        ) : exhibits.length === 0 ? (
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-2">
              <p className="text-muted mb-0">No exhibits found.</p>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered shadow-sm text-start">
              <thead className="exhibitTable">
                <tr>
                  <th>Copy</th>
                  <th>S/No</th>
                  <th>Date</th>
                  <th>Examiner</th>
                  <th>Investigator</th>
                  <th>Description</th>
                  <th>Station</th>
                  <th>Suspect</th>
                  <th>Status</th>
                  <th>Signature</th>
                </tr>
              </thead>
              <tbody>
                {exhibits.map((exhibit) => (
                  <tr key={exhibit.serial_number}>
                    <td>
                      {exhibit.exhibit_copy ? (
                        <img
                          src={exhibit.exhibit_copy}
                          alt={exhibit.serial_number}
                          style={{
                            width: "60px",
                            height: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            window.open(exhibit.exhibit_copy, "_blank")
                          }
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{exhibit.serial_number}</td>
                    <td>{exhibit.date_received}</td>
                    <td>{exhibit.examiner}</td>
                    <td>{exhibit.investigator}</td>
                    <td>
                      <ol className="mb-0">
                        {exhibit.description.split(/\r\n/).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ol>
                    </td>
                    <td>{exhibit.station}</td>
                    <td>{exhibit.suspect}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 4px",
                          borderRadius: "5px",
                          color: "white",
                          backgroundColor:
                            exhibit.status === "Pending"
                              ? "gray"
                              : exhibit.status === "Extracted"
                                ? "#007bff"
                                : exhibit.status === "Analyzed"
                                  ? "orange"
                                  : exhibit.status === "Reported"
                                    ? "green"
                                    : exhibit.status === "Failed"
                                      ? "#8F0303"
                                      : exhibit.status === "Collected"
                                        ? "#005200"
                                        : "black",
                        }}
                      >
                        {exhibit.status}
                      </span>
                    </td>
                    <td>{exhibit.signature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          {/* Previous */}
          <i
            className={`fa-solid fa-chevron-left page-arrow ${
              currentPage === 1 ? "disabled-arrow" : ""
            }`}
            onClick={() => currentPage > 1 && fetchExhibits(currentPage - 1)}
          ></i>

          {/* Page Numbers */}
          {visiblePages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-1">
                ...
              </span>
            ) : (
              <span
                key={index}
                className={`page-number ${
                  currentPage === page ? "active-page" : ""
                }`}
                onClick={() => fetchExhibits(page)}
              >
                {page}
              </span>
            ),
          )}

          {/* Next */}
          <i
            className={`fa-solid fa-chevron-right page-arrow ${
              currentPage === totalPages ? "disabled-arrow" : ""
            }`}
            onClick={() =>
              currentPage < totalPages && fetchExhibits(currentPage + 1)
            }
          ></i>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-3 py-2 text-center text-white"
        style={{
          backgroundColor: "#8F0303",
          borderTopStyle: "solid",
          borderTopColor: "#252a61",
          borderTopWidth: "1px",
        }}
      >
        <small>
          © {new Date().getFullYear()} Digital Forensic Lab | Exhibit Management
          System
        </small>
      </footer>
    </div>
  );
};

export default Dashboard;
