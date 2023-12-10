import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserTypes, registerUser, GENRES } from "../client";

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    password: "",
    genre: "",
    userType: UserTypes["reader"],
  });

  const handleChangeRegister = (event) => {
    setRegisterData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleRegister = async () => {
    const result = await registerUser(registerData);

    if (result === "Proper fields not included") {
      alert("Please input proper fields");
    } else if (result === "Success") {
      console.log("success");
      navigate("/Login");
    } else if (result === "User already exists") {
      alert("This username already exists. Pick another one");
    }
  };

  const handleDropdownClick = (genre) => {
    setRegisterData((prevData) => {
      return {
        ...prevData,
        genre: genre,
      };
    });
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h1>Register</h1>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-control"
          name="fullName"
          placeholder="Enter Full Name"
          value={registerData["fullName"]}
          onChange={handleChangeRegister}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          name="username"
          placeholder="Enter username"
          value={registerData["username"]}
          onChange={handleChangeRegister}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          name="password"
          placeholder="Enter password"
          value={registerData["password"]}
          onChange={handleChangeRegister}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">User Type</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="userType"
            id="reader"
            value="reader"
            checked={registerData["userType"] === UserTypes.reader}
            onChange={handleChangeRegister}
          />
          <label className="form-check-label" htmlFor="reader">
            Reader
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="userType"
            id="reviewer"
            value="reviewer"
            checked={registerData["userType"] === UserTypes.reviewer}
            onChange={handleChangeRegister}
          />
          <label className="form-check-label" htmlFor="reviewer">
            Reviewer
          </label>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Favorite Genre</label>
        <input
          type="text"
          className="form-control"
          value={registerData["genre"]}
          readOnly
        />
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown button
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {GENRES.map((genre, idx) => (
              <li key={idx}>
                <a
                  className="dropdown-item"
                  onClick={() => handleDropdownClick(genre)}
                >
                  {genre}
                </a>
                ;
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="d-flex" style={{ gap: 10 }}>
        <button className="btn btn-success" onClick={handleRegister}>
          Register
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/Login")}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
