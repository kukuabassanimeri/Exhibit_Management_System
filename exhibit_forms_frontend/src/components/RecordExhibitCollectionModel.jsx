const RecordExhibitCollectionModel = ({
  setShowCollectionModal,
  showCollectionModal,
  handleChange,
  handleSubmit,
  error,
  success,
  exhibitRecordCollection,
}) => {
  return (
    <div>
      {showCollectionModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h6 className="modal-title">Add Collection</h6>
                <button
                  className="btn-close"
                  onClick={() => setShowCollectionModal(false)}
                />
              </div>

              {/* Body */}
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      rows="3"
                      placeholder="Collected By"
                      name="collected_by"
                      value={exhibitRecordCollection.collected_by}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="date"
                      className="form-control"
                      name="date_collected"
                      value={exhibitRecordCollection.date_collected}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    className="btn w-100 text-white"
                    style={{ background: "#8f0303" }}
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordExhibitCollectionModel;
