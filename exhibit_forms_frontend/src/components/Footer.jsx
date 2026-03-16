const Footer = () => {
  return (
    <footer
      className="px-3 py-2 text-center text-white"
      style={{
        backgroundColor: "#8F0303",
        borderTopStyle: "solid",
        borderTopColor: "#252a61",
        borderTopWidth: "1px",
      }}
    >
      <small>
        © {new Date().getFullYear()} Digital Forensic Lab | Exhibit Management
        System
      </small>
    </footer>
  );
};

export default Footer;
