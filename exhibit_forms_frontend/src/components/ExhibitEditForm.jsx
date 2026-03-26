import { useNavigate } from "react-router-dom";

const ExhibitEditForm = ({
  handleSubmit,
  handleChange,
  error,
  success,
  exhibitData,
}) => {
  const navigate = useNavigate();

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            {/* Header */}
            <div
              className="card-header text-white"
              style={{ backgroundColor: "#252a61" }}
            >
              <h4 className="mb-0">Edit Exhibit</h4>
            </div>

            {/* Body */}
            <div className="card-body">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Exhibit Copy */}
                <div className="mb-2">
                  <label className="form-label">Exhibit Copy</label>
                  <input
                    type="file"
                    name="exhibit_copy"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                {/* Serial Number */}
                <div className="mb-2">
                  <label className="form-label">Serial Number</label>
                  <input
                    type="text"
                    name="serial_number"
                    value={exhibitData.serial_number}
                    className="form-control"
                    disabled
                  />
                </div>

                {/* Date Received */}
                <div className="mb-2">
                  <label className="form-label">Date Received</label>
                  <input
                    type="date"
                    name="date_received"
                    value={exhibitData.date_received}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Investigator */}
                <div className="mb-2">
                  <label className="form-label">Investigator</label>
                  <input
                    type="text"
                    name="investigator"
                    value={exhibitData.investigator}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Description */}
                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={exhibitData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                  />
                </div>

                {/* Station */}
                <div className="mb-2">
                  <label className="form-label">Station</label>
                  <input
                    type="text"
                    name="station"
                    value={exhibitData.station}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Suspect */}
                <div className="mb-2">
                  <label className="form-label">Suspect</label>
                  <textarea
                    name="suspect"
                    rows={3}
                    value={exhibitData.suspect}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Status */}
                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={exhibitData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Extracted">Extracted</option>
                    <option value="Analyzed">Analyzed</option>
                    <option value="Reported">Reported</option>
                    <option value="Failed">Failed</option>
                    <option value="Collected">Collected</option>
                  </select>
                </div>

                <div className="d-flex justify-content-between mt-3">
                  {/* Update Buttons */}
                  <button type="submit" className="btn btn-outline-dark">
                    Update
                  </button>

                  {/* Back to Exhibit Detail */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      navigate(
                        `/dashboard/exhibits/${exhibitData.serial_number}`,
                      )
                    }
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitEditForm;
