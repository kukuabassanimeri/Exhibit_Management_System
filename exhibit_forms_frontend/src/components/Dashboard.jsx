import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import "./authForm.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ExhibitHeader from "./ExhibitHeader";
import ExhibitTable from "./ExhibitTable";
import Pagination from "./Pagination";
import SideBar from "./SideBar";
import ExhibitSearch from "./ExhibitSearch";

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

  //* Pending cases
  const [statusFilter, setStatusFilter] = useState("");

  //* All exhibits
  const [totalCases, setTotalCases] = useState(0);

  //* Search Exhibit State
  const [searchExhibit, setSearchExhibit] = useState("");

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
        `http://127.0.0.1:8000/api/exhibits?page=${page}&search=${searchExhibit}&status=${statusFilter}`,
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
      throw new Error("Failed to fetch exhibits:", error);
    } finally {
      setLoading(false);
    }
  };

  //* Search Exhibit Function
  const handleSearch = () => {
    setCurrentPage(1);
    fetchExhibits(1);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchExhibits(1);
  }, [statusFilter, searchExhibit]);

  //* Fetch Pending cases
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(
      `http://127.0.0.1:8000/api/exhibits?status=Pending`,
      {
        headers: {
          Authorization: `Token ${storedUser.token}`,
        },
      },
    );

    const data = await res.json();
    setPendingCount(data.count);
  };

  useEffect(() => {
    fetchPendingCount();
  }, []);

  //* Fetch exploited exhibits (status = "Extracted, Analyzed, Reported, Failed, Collected")
  const [exploitedCount, setExploitedCount] = useState(0);

  const fetchExploitedCount = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(
      `http://127.0.0.1:8000/api/exhibits?status=Extracted,Analyzed,Reported,Failed,Collected`,
      {
        headers: {
          Authorization: `Token ${storedUser.token}`,
        },
      },
    );

    const data = await res.json();
    setExploitedCount(data.count);
  };

  useEffect(() => {
    fetchExploitedCount();
  }, []);

  //* Fetch all exhibits
  const fetchTotalCases = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`http://127.0.0.1:8000/api/exhibits`, {
      headers: {
        Authorization: `Token ${storedUser.token}`,
      },
    });

    const data = await res.json();
    setTotalCases(data.count);
  };

  useEffect(() => {
    fetchTotalCases();
  }, []);

  //* Calculate total Pages
  const totalPages = Math.ceil(count / pageSize);

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 10) {
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
    <div className="d-flex">
      {/* Sidebar */}
      <SideBar setStatusFilter={setStatusFilter} />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100 bg-light">
        <Navbar user={user} handleLogOut={handleLogOut} />

        <div className="container-fluid py-4 flex-grow-1">
          <ExhibitHeader
            searchExhibit={searchExhibit}
            setSearchExhibit={setSearchExhibit}
            handleSearch={handleSearch}
            totalExhibits={totalCases}
            pendingCount={pendingCount}
            setStatusFilter={setStatusFilter}
            exploitedCount={exploitedCount}
          />

          <ExhibitSearch
            searchExhibit={searchExhibit}
            setSearchExhibit={setSearchExhibit}
            handleSearch={handleSearch}
          />
          <ExhibitTable exhibits={exhibits} loading={loading} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            visiblePages={visiblePages}
            fetchExhibits={fetchExhibits}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
