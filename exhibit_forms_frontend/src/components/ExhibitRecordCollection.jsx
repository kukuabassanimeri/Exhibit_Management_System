import RecordExhibitCollectionModel from "./RecordExhibitCollectionModel";
import { useState } from "react";
const ExhibitRecordCollection = ({
  serial_number,
  showCollectionModal,
  setShowCollectionModal,
  setCollect,
}) => {
  const [exhibitRecordCollection, setExhibitRecordCollection] = useState({
    collected_by: "",
    date_collected: "",
  });

  const url = `http://127.0.0.1:8000/api/exhibits/${serial_number}/collect`;

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setExhibitRecordCollection({
      ...exhibitRecordCollection,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("collected_by", exhibitRecordCollection.collected_by);
    formData.append("date_collected", exhibitRecordCollection.date_collected);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Token ${storedUser.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      //* Retrieve errors from the backend
      const extractError = (data) => {
        if (data.detail) return data.detail;

        return Object.values(data).flat().join(" ");
      };

      if (!response.ok) {
        setError(extractError(data));
        setTimeout(() => {
          setError(null);
          setShowCollectionModal(false);
        }, 2000);
        return;

      }
      //* Update exhibit collection UI automatically.
      setCollect((prev) => [...prev, data]);

      setSuccess("Exhibit Collected Successfully");
      setError(null);

      //* reset form
      setExhibitRecordCollection({
        collected_by: "",
        date_collected: "",
      });

      //* close modal after success
      setTimeout(() => {
        setShowCollectionModal(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError("Could not Collect Exhibit");
    }
  };

  return (
    <>
      <RecordExhibitCollectionModel
        showCollectionModal={showCollectionModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        success={success}
        setShowCollectionModal={setShowCollectionModal}
        exhibitRecordCollection={exhibitRecordCollection}
      />
    </>
  );
};

export default ExhibitRecordCollection;
