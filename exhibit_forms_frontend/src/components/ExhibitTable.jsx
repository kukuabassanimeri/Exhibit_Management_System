//* Exhibit Status Color Codes
const statusColors = {
  Pending: "gray",
  Extracted: "#007bff",
  Analyzed: "orange",
  Reported: "green",
  Failed: "#8F0303",
  Collected: "#005200",
};

const ExhibitTable = ({ exhibits, loading }) => {
  if (loading) {
    return <p>Loading exhibits...</p>;
  }

  if (exhibits.length === 0) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-2">
          <p className="text-muted mb-0">No exhibit found.</p>
        </div>
      </div>
    );
  }

  return (
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
                    onClick={() => window.open(exhibit.exhibit_copy, "_blank")}
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
                  {exhibit.description?.split(/\r\n/).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </td>

              <td>{exhibit.station}</td>

              <td>
                <ol className="mb-0">
                  {exhibit.suspect?.split(/\r\n/).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </td>

              <td>
                <span
                  style={{
                    padding: "4px 4px",
                    borderRadius: "5px",
                    color: "white",
                    backgroundColor: statusColors[exhibit.status] || "black",
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
  );
};

export default ExhibitTable;
