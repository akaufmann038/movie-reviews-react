import { useNavigate } from "react-router-dom";
import { loginUser } from "../client";
import { useState, useContext } from "react";
import LoginContext from "../context";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const { login, setLogin } = useContext(LoginContext);

  const handleLogin = async () => {
    const result = await loginUser(loginData);

    if (result.message === "Success") {
      setLogin({
        id: result.data._id,
        username: result.data.username,
        favoriteGenre: result.data.favoriteGenre,
        userType: result.data.userType,
      });
      navigate("/home");
    } else if (result.message === "Incorrect password") {
      alert("Incorrect password entered");
    } else if (result.message === "Username does not exist") {
      alert("Username does not exist");
    } else if (result.message === "Proper fields not included") {
      alert("Please enter all input fields");
    }
  };

  const handleChangeLogin = (event) => {
    setLoginData((prevData) => {
      return {
        ...prevData,
        [event.target.id]: event.target.value,
      };
    });
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h1>Login</h1>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          placeholder="Enter username"
          value={loginData.username}
          onChange={handleChangeLogin}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Enter password"
          value={loginData.password}
          onChange={handleChangeLogin}
        />
      </div>
      <div className="d-flex" style={{ gap: 10 }}>
        <button className="btn btn-success" onClick={handleLogin}>
          Login
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
