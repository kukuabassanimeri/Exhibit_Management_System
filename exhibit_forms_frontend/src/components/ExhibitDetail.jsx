import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExhibitInfo from "./ExhibitInfo";
import ExhibitRemarks from "./ExhibitRemarks";
import ExhibitCollection from "./ExhibitCollection";

const ExhibitDetail = () => {
  const { serial_number } = useParams();
  const url = `http://127.0.0.1:8000/api/exhibits/${serial_number}`;

  const navigate = useNavigate();

  const [exhibitDetail, setExhibitDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExhibit = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${storedUser.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch exhibit");
        }

        const data = await response.json();
        setExhibitDetail(data);
      } catch (err) {
        setError("Failed to Load the Exhibit");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibit();
  }, [url]);

  if (isLoading) return <p>Loading Exhibit...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-2">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ color: "#252a61" }}>
          Exhibit {exhibitDetail.serial_number}
        </h5>

        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      <div className="row g-3">
        {/* Exhibit Information */}
        <ExhibitInfo exhibitDetail={exhibitDetail} />

        {/* Remarks History */}
        <ExhibitRemarks exhibitDetail={exhibitDetail} />

        {/* Collection History */}
        <ExhibitCollection exhibitDetail={exhibitDetail} />
      </div>

    </div>
  );
};

export default ExhibitDetail;
