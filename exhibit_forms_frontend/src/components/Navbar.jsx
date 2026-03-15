const Navbar = ({ user, handleLogOut }) => {
  return (
    <nav
      className="navbar navbar-expand-lg px-3 shadow-sm"
      style={{
        backgroundColor: "#8F0303",
        borderBottomStyle: "solid",
        borderBottomColor: "#252a61",
        borderBottomWidth: "1px",
      }}
    >
      {/* System Title */}
      <div className="navbar-brand text-white fw-bold">
        Digital Forensic Lab
        <span className="ms-2 fw-semibold text-black">
          Exhibit Management
        </span>
      </div>

      {/* Right side */}
      <div className="ms-auto">
        <div className="dropdown">
          <button
            className="btn btn-light dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            👤 {user?.first_name} {user?.last_name}
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow">
            <li>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;