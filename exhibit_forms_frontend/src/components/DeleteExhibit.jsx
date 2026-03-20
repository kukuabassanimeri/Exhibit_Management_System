const DeleteExhibit = ({ showDeleteModal, deleteExhibit, setShowDeleteModal}) => {
  return (
    <div>
      {showDeleteModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title text-danger">Confirm Delete</h6>

                <button
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                />
              </div>

              <div className="modal-body">
                Are you sure you want to delete this exhibit?
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-danger w-100"
                  onClick={deleteExhibit}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteExhibit;
