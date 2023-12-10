import LoginContext from "../context";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router";
import {
  getProfile,
  GENRES,
  updateProfile,
  isLoggedIn,
  logout,
} from "../client";
import Navbar from "../Navbar/navbar";

const Profile = () => {
  const navigate = useNavigate();
  const { login, setLogin } = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [userToCompare, setUserToCompare] = useState(null);
  const [userInfo, setUserInfo] = useState("Liked Movies");

  useEffect(() => {
    if (Object.keys(login).length > 0) {
      getProfile(login.id).then((result) => {
        if (result.message === "Success") {
          setUser(result.data);
          setUserToCompare(result.data);
        } else {
          alert(result.message);
        }
      });
    } else {
      isLoggedIn().then((result) => {
        if (result.message === "Success") {
          if (result.session) {
            setLogin({
              id: result.session._id,
              username: result.session.username,
              favoriteGenre: result.session.favoriteGenre,
              userType: result.session.userType,
            });
            getProfile(result.session._id).then((result) => {
              if (result.message === "Success") {
                setUser(result.data);
                setUserToCompare(result.data);
              } else {
                alert(result.message);
              }
            });
          } else {
            navigate("/home");
          }
        } else {
          alert(result.message);
        }
      });
    }
  }, []);

  const handleInputChange = (event) => {
    setUser((prevData) => {
      return {
        ...prevData,
        [event.target.id]: event.target.value,
      };
    });
  };

  const handleDropdownClick = (genre) => {
    setUser((prevData) => {
      return {
        ...prevData,
        favoriteGenre: genre,
      };
    });
  };

  const handleUpdateUser = async () => {
    const result = await updateProfile(user);

    if (result.message === "Success") {
      setUser(result.data);
      setUserToCompare(result.data);
      setLogin({
        id: result.data._id,
        username: result.data.username,
        favoriteGenre: result.data.favoriteGenre,
        userType: result.data.userType,
      });
    } else {
      alert("Something went wrong while updating user");
    }
  };

  const isDifferent = () => {
    for (let i = 0; i < Object.keys(user).length; i++) {
      if (user[Object.keys(user)[i]] !== userToCompare[Object.keys(user)[i]]) {
        return true;
      }
    }

    return false;
  };

  const renderUserInfo = () => {
    if (userInfo === "Liked Movies") {
      return user.likes.map((movie, idx) => {
        return (
          <div
            className="d-flex align-items-center"
            style={{
              height: 40,
              width: 300,
              backgroundColor: "lightcoral",
              marginBottom: 5,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/details/${movie.apiMovieId}`)}
            key={idx}
          >
            <span style={{ marginLeft: 5 }}>{movie.movieName}</span>
          </div>
        );
      });
    } else if (userInfo === "Following") {
      return user.following.map((user, idx) => {
        return (
          <div
            className="d-flex align-items-center"
            style={{
              height: 40,
              width: 300,
              backgroundColor: "lightcoral",
              marginBottom: 5,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/profile/${user._id}`)}
            key={idx}
          >
            <span style={{ marginLeft: 5 }}>{user.username}</span>
          </div>
        );
      });
    } else if (userInfo === "Followers") {
      return user.followers.map((user, idx) => {
        return (
          <div
            className="d-flex align-items-center"
            style={{
              height: 40,
              width: 300,
              backgroundColor: "lightcoral",
              marginBottom: 5,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/profile/${user._id}`)}
            key={idx}
          >
            <span style={{ marginLeft: 5 }}>{user.username}</span>
          </div>
        );
      });
    } else if (userInfo === "Reviews") {
      return user.reviews.map((movie, idx) => {
        return (
          <div
            className="d-flex align-items-center"
            style={{
              height: 40,
              width: 300,
              backgroundColor: "lightcoral",
              marginBottom: 5,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/details/${movie.apiMovieId}`)}
            key={idx}
          >
            <span style={{ marginLeft: 5 }}>{movie.movieName}</span>
          </div>
        );
      });
    }
  };

  const handleLogout = async () => {
    logout().then((result) => {
      if (result.message === "Success") {
        setLogin({});
        navigate("/home");
      }
    });
  };

  return (
    <>
      <Navbar />
      <div
        className="d-flex flex-column align-items-center"
        style={{ marginTop: 10 }}
      >
        <div className="d-flex align-items-center" style={{ gap: 50 }}>
          {user ? (
            <div className="d-flex" style={{ gap: 30 }}>
              <div className="d-flex flex-column">
                {isDifferent() && (
                  <button
                    className="btn btn-success"
                    onClick={handleUpdateUser}
                  >
                    Update
                  </button>
                )}
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={user.username}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="username"
                    className="form-label"
                    style={{ marginTop: 10 }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={user.fullName}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="username"
                    className="form-label"
                    style={{ marginTop: 10 }}
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="password"
                    value={user.password}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="username"
                    className="form-label"
                    style={{ marginTop: 10 }}
                  >
                    Favorite Genre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="favoriteGenre"
                    readOnly
                    value={user.favoriteGenre}
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
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
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
                  <label
                    htmlFor="username"
                    className="form-label"
                    style={{ marginTop: 10 }}
                  >
                    User Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    readOnly
                    value={user.userType}
                  />
                </div>
                <button
                  className="btn btn-danger"
                  style={{ marginTop: 10 }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
              <div className="d-flex flex-column">
                {user && (
                  <>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        User Info
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        {[
                          "Liked Movies",
                          "Following",
                          "Followers",
                          "Reviews",
                        ].map((userData, idx) => (
                          <li key={idx}>
                            <a
                              className="dropdown-item"
                              onClick={() => setUserInfo(userData)}
                            >
                              {userData}
                            </a>
                            ;
                          </li>
                        ))}
                      </ul>
                    </div>
                    {userInfo}
                    {renderUserInfo()}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="spinner-border" role="status"></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
