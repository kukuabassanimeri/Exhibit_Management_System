import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExhibitEditForm from "./ExhibitEditForm";

const ExhibitEdit = () => {
  const { serial_number } = useParams();
  const navigate = useNavigate();

  const [exhibitData, setExhibitData] = useState({
    exhibit_copy: null,
    serial_number: "",
    date_received: "",
    investigator: "",
    description: "",
    station: "",
    suspect: "",
    status: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const url = `http://127.0.0.1:8000/api/exhibits/${serial_number}`;

  //* Fetch existing data
  useEffect(() => {
    const fetchExhibit = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${storedUser.token}`,
          },
        });

        const data = await response.json();

        setExhibitData(data); //* PREFILLS FORM
      } catch (err) {
        setError("Failed to load exhibit");
      }
    };

    fetchExhibit();
  }, [url]);

  //* Handle change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "exhibit_copy") {
      setExhibitData({ ...exhibitData, exhibit_copy: files[0] });
    } else {
      setExhibitData({ ...exhibitData, [name]: value });
    }
  };

  //* Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    //* Append file ONLY if user selected new one
    if (exhibitData.exhibit_copy instanceof File) {
      formData.append("exhibit_copy", exhibitData.exhibit_copy);
    }

    //* Append Other Exhibit Fields
    Object.keys(exhibitData).forEach((key) => {
      if (key !== "exhibit_copy") {
        formData.append(key, exhibitData[key]);
      }
    });

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch(url, {
        method: "PATCH",
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
        setTimeout(() => setError(null), 2000);
        return;
      }

      setSuccess("Exhibit updated successfully");

      setTimeout(() => {
        navigate(`/dashboard/exhibits/${data.serial_number}`);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError("Failed to update exhibit");
    }
  };

  return (
    <div>
      <ExhibitEditForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        success={success}
        exhibitData={exhibitData}
      />
    </div>
  );
};

export default ExhibitEdit;
