const ExhibitSearch = ({
  searchExhibit,
  setSearchExhibit,
  handleSearch,
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center mb-3">

      <div className="d-flex align-items-center gap-2">
        <input
          type="text"
          placeholder="Search Exhibit Serial Number"
          className="form-control"
          style={{ width: "300px" }}
          value={searchExhibit}
          onChange={(e) => setSearchExhibit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <button className="btn btn-dark" onClick={handleSearch}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

    </div>
  );
};

export default ExhibitSearch;
