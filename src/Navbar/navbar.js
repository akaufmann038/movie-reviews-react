import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import LoginContext from "../context";

function Navbar() {
  const navigate = useNavigate();
  const [searchTerms, setSearchTerms] = useState("");
  const { login, setLogin } = useContext(LoginContext);

  const navToProfile = () => {
    navigate("/profile");
  }
  const navToSearch = () => {
    navigate(`/search/${searchTerms}`);;
  }
  const navToLogin = () => {
    navigate("/login");
  }

  const handleSearchInputChange = (event) => {
    setSearchTerms(event.target.value);
  }
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
    <div className="container">
        <a className="navbar-brand" href="#">Movie Reviews!</a>
    <form className=" form-inline justify-content-center d-flex" value={searchTerms} onChange={handleSearchInputChange}>
    <input className="form-control w-100" type="search" placeholder="Search"/>
    <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={navToSearch}>Search</button>
    </form>
    
    <>{Object.keys(login).length > 0 ? 
    <button className = "btn btn-secondary" onClick={navToProfile}>Profile</button> : 
    <button className = "btn btn-secondary" onClick={navToLogin}>Login</button>}</>
    
    </div>
  </nav>
  );
}
export default Navbar;