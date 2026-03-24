import { useState } from "react";
import RecordExhibitRemarksModel from "./RecordExhibitRemarksModel";
const RecordExhibitRemark = ({
  serial_number,
  showRemarkModal,
  setShowRemarkModal,
  setRemarks,
}) => {
  const [exhibitRemark, setExhibitRemark] = useState({
    remarks: "",
    created_at: "",
  });

  const url = `http://127.0.0.1:8000/api/exhibits/${serial_number}/remarks`;

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setExhibitRemark({ ...exhibitRemark, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("remarks", exhibitRemark.remarks);
    formData.append("created_at", exhibitRemark.created_at);

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

      if (!response.ok) {
        setError(data?.detail || "Failed to record remark");
        return;
      }

      //* Update Remarks UI
      setRemarks((prev) => [...prev, data]);

      setSuccess("Remark added successfully");
      setError(null);

      //* reset form
      setExhibitRemark({
        remarks: "",
        created_at: "",
      });

      //* close modal after success
      setTimeout(() => {
        setShowRemarkModal(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError("Could not record remark");
    }
  };

  return (
    <>
      <RecordExhibitRemarksModel
        showRemarkModal={showRemarkModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        success={success}
        setShowRemarkModal={setShowRemarkModal}
        exhibitRemark={exhibitRemark}
      />
    </>
  );
};

export default RecordExhibitRemark;
