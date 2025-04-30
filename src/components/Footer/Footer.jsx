import "./Footer.css";
function Footer() {
  return (
    <footer className="footer">
      <p>Developed by Name Surname</p>
      <p>{new Date().getFullYear()}</p>
    </footer>
  );
}
export default Footer;
