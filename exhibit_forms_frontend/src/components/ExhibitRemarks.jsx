import { useState } from "react";
import RecordExhibitRemark from "./RecordExhibitRemark";

const ExhibitRemarks = ({ exhibitDetail }) => {
  const [showRemarkModal, setShowRemarkModal] = useState(false);

  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100 hover-card">
        <div
          className="card-header d-flex justify-content-between align-items-center text-white"
          style={{ backgroundColor: "#8f0303" }}
        >
          Remarks History
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowRemarkModal(true)}
          >
            Add
          </button>
        </div>

        <div className="card-body">
          {!exhibitDetail.remarks || exhibitDetail.remarks.length === 0 ? (
            <p className="text-muted">No remarks recorded.</p>
          ) : (
            [...exhibitDetail.remarks].reverse().map((remark, index) => (
              <div
                key={`${remark.created_at}-${index}`}
                className="border-bottom pb-2 mb-2"
              >
                <small className="mb-1 text-muted">
                  By: {remark.examiner_name}
                </small>

                <p className="mb-1 text-muted">{remark.remarks}</p>

                <small className="text-muted">Date: {remark.created_at}</small>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Record ExhibitModal component */}
      <RecordExhibitRemark
        showRemarkModal={showRemarkModal}
        setShowRemarkModal={setShowRemarkModal}
        serial_number={exhibitDetail.serial_number}
      />
    </div>
  );
};

export default ExhibitRemarks;
