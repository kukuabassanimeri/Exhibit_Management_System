import { useNavigate } from "react-router-dom";
const ExhibitHeader = ({ searchExhibit, setSearchExhibit, handleSearch }) => {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      {/* Title */}
      <h4 className="fw-semibold mb-0">All Exhibits</h4>

      {/* Search Section */}
      <div className="d-flex align-items-center gap-2">
        {/* Serial Number Search */}
        <input
          type="text"
          placeholder="Search Exhibit Serial Number"
          className="form-control"
          style={{ width: "300px" }}
          value={searchExhibit}
          onChange={(e) => setSearchExhibit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        {/* Search Button */}
        <button className="btn btn-dark" onClick={handleSearch}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {/* Add Exhibit */}
      <button
        className="btn text-white"
        style={{ backgroundColor: "#8F0303" }}
        onClick={() => navigate("/dashboard/exhibits/add")}
      >
        Add Exhibit
      </button>
    </div>
  );
};

export default ExhibitHeader;
