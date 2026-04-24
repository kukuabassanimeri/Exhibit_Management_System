const ExhibitHeader = ({
  totalExhibits,
  pendingCount,
  setStatusFilter,
  exploitedCount,
}) => {
  return (
    <div className="d-flex gap-4 flex-wrap mb-4">
      {/* ALL CASES */}
      <div className="dashboard-card" onClick={() => setStatusFilter("")}>
        <div className="card-content">
          <p>ALL CASES</p>
          <h2>{totalExhibits}</h2>
        </div>
        <div className="card-icon bg-primary"></div>
      </div>

      {/* PENDING */}
      <div
        className="dashboard-card"
        onClick={() => setStatusFilter("Pending")}
      >
        <div className="card-content">
          <p>PENDING</p>
          <h2>{pendingCount}</h2>
        </div>
        <div className="bg-warning"></div>
      </div>

      {/* EXPLOITED */}
      <div
        className="dashboard-card"
        onClick={() =>
          setStatusFilter("Extracted,Analyzed,Reported,Failed,Collected")
        }
      >
        <div className="card-content">
          <p>EXPLOITED</p>
          <h2>{exploitedCount}</h2>
        </div>
        <div className="card-icon bg-success"></div>
      </div>
    </div>
  );
};

export default ExhibitHeader;
