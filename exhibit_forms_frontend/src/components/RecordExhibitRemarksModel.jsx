const RecordExhibitRemarksModel = ({
  setShowRemarkModal,
  showRemarkModal,
  handleChange,
  handleSubmit,
  error,
  success,
  exhibitRemark
}) => {
  return (
    <div>
      {showRemarkModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h6 className="modal-title">Add Remark</h6>
                <button
                  className="btn-close"
                  onClick={() => setShowRemarkModal(false)}
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
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter Remarks..."
                      name="remarks"
                      value={exhibitRemark.remarks}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="date"
                      className="form-control"
                      name="created_at"
                      value={exhibitRemark.created_at}
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

export default RecordExhibitRemarksModel;
