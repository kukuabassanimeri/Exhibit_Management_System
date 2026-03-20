import { useState } from "react";
import ExhibitRecordCollection from "./ExhibitRecordCollection";
const ExhibitCollection = ({ exhibitDetail }) => {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100 hover-card">
        <div
          className="card-header d-flex justify-content-between align-items-center text-white"
          style={{ backgroundColor: "black" }}
        >
          Collection History
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowCollectionModal(true)}
          >
            Record
          </button>
        </div>

        <div className="card-body">
          {!exhibitDetail.collections || exhibitDetail.collections.length === 0 ? (
            <p className="text-muted">No collection record.</p>
          ) : (
            exhibitDetail.collections.map((collection, index) => (
              <div key={index} className="border-bottom pb-2 mb-2">
                <p className="mb-1 text-muted">
                  <small>By: {collection.collected_by}</small>
                </p>

                <small className="text-muted">
                  Date: {collection.date_collected}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Exhibit Collection Model */}
      <ExhibitRecordCollection
        showCollectionModal={showCollectionModal}
        setShowCollectionModal={setShowCollectionModal}
        serial_number={exhibitDetail.serial_number}
      />
    </div>
  );
};

export default ExhibitCollection;
