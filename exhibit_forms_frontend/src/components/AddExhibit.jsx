import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddExhibit = () => {
  const navigate = useNavigate();

  const [exhibitData, setExhibitData] = useState({
    serial_number: "",
    date_received: "",
    investigator: "",
    description: "",
    station: "",
    suspect: "",
    status: "Pending",
  });

  const [exhibitCopy, setExhibitCopy] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setExhibitData({ ...exhibitData, [e.target.name]: e.target.value });
  };

  const handleExhibitCopy = (e) => {
    setExhibitCopy(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("exhibit_copy", exhibitCopy);
    Object.keys(exhibitData).forEach((key) => {
      formData.append(key, exhibitData[key]);
    });

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch("http://127.0.0.1:8000/api/exhibits", {
        method: "POST",
        headers: {
          Authorization: `Token ${storedUser.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      const extractError = (data) => {
        if (data.detail) return data.detail;

        return Object.values(data).flat().join(" ");
      };

      if (!response.ok) {
        setError(extractError(data));
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      setSuccess("Exhibit added successfully");
      setError(null);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      setExhibitData({
        serial_number: "",
        date_received: "",
        investigator: "",
        description: "",
        station: "",
        suspect: "",
        status: "Pending",
      });
      setExhibitCopy(null);
    } catch (err) {
      setError("Could not save Exhibit.");
      setSuccess(null);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div
              className="card-header text-white"
              style={{ backgroundColor: "#8F0303" }}
            >
              <h4 className="mb-0">Add Exhibit</h4>
            </div>
            <div className="card-body">
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Exhibit Copy */}
                <div className="mb-2">
                  <label className="form-label">Exhibit Copy</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleExhibitCopy}
                    required
                  />
                </div>

                {/* Serial Number */}
                <div className="mb-2">
                  <label className="form-label">Serial Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="serial_number"
                    placeholder="Exhibit Serial Number"
                    value={exhibitData.serial_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date Received */}
                <div className="mb-2">
                  <label className="form-label">Date Received</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_received"
                    value={exhibitData.date_received}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Investigator */}
                <div className="mb-2">
                  <label className="form-label">Investigator</label>
                  <input
                    type="text"
                    className="form-control"
                    name="investigator"
                    placeholder="Investigator"
                    value={exhibitData.investigator}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    placeholder="Description"
                    rows={3}
                    value={exhibitData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Station */}
                <div className="mb-2">
                  <label className="form-label">Station</label>
                  <input
                    type="text"
                    className="form-control"
                    name="station"
                    placeholder="Station"
                    value={exhibitData.station}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Suspect */}
                <div className="mb-2">
                  <label className="form-label">Suspect</label>
                  <textarea
                    className="form-control"
                    name="suspect"
                    placeholder="Suspect"
                    rows={3}
                    value={exhibitData.suspect}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Status */}
                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={exhibitData.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Extracted">Extracted</option>
                    <option value="Analyzed">Analyzed</option>
                    <option value="Reported">Reported</option>
                    <option value="Failed">Failed</option>
                    <option value="Collected">Collected</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-outline-dark">
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => navigate("/dashboard")}
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

export default AddExhibit;
