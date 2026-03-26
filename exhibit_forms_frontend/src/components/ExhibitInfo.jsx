import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteExhibit from "./DeleteExhibit";

const ExhibitInfo = ({ exhibitDetail }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const url = `http://127.0.0.1:8000/api/exhibits/${exhibitDetail.serial_number}`;

  const deleteExhibit = async () => {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${storedUser.token}`,
        },
      });

      if (response.ok) {
        setSuccess("Exhibit Deleted Successfully");
        setError(null);

        setTimeout(() => {
          setShowDeleteModal(false);
          navigate("/dashboard");
          setSuccess(false);
        }, 2000);
      } else {
        throw new Error("Deleting exhibit failed");
      }
    } catch (err) {
      setError("Failed to delete exhibit");
    }
  };
  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100 hover-card">
        <div
          className="card-header d-flex justify-content-between align-items-center text-white"
          style={{ backgroundColor: "#252a61" }}
        >
          Exhibit Information
          <div>
            <button
              className="btn btn-sm btn-light me-2"
              onClick={() => navigate(`/dashboard/exhibits/${exhibitDetail.serial_number}/edit`)}
            >
              Edit
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="card-body">
          {exhibitDetail.exhibit_copy && (
            <img
              src={exhibitDetail.exhibit_copy}
              alt={exhibitDetail.serial_number}
              className="img-fluid rounded mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => window.open(exhibitDetail.exhibit_copy, "_blank")}
            />
          )}

          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              <strong>Serial Number</strong>
              <span className="text-muted">{exhibitDetail.serial_number}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <strong>Date Received</strong>
              <span className="text-muted">{exhibitDetail.date_received}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <strong>Examiner</strong>
              <span className="text-muted">{exhibitDetail.examiner}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <strong>Investigator</strong>
              <span className="text-muted">{exhibitDetail.investigator}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <strong>Station</strong>
              <span className="text-muted">{exhibitDetail.station}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <strong>Suspect</strong>
              <span className="text-muted">{exhibitDetail.suspect}</span>
            </li>

            <li className="list-group-item">
              <strong>Description</strong>
              <div className="text-muted small mt-1">
                <ol className="mb-0">
                  {exhibitDetail.description?.split(/\r\n/).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <strong>Status</strong>
              <span className="text-muted">{exhibitDetail.status}</span>
            </li>
          </ul>
        </div>
      </div>

      <DeleteExhibit
        showDeleteModal={showDeleteModal}
        deleteExhibit={deleteExhibit}
        setShowDeleteModal={setShowDeleteModal}
        success={success}
        error={error}
      />

      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default ExhibitInfo;
