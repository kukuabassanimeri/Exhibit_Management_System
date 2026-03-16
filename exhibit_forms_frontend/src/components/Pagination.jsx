const Pagination = ({
  currentPage,
  totalPages,
  visiblePages,
  fetchExhibits,
}) => {
  return (
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
  );
};

export default Pagination;
