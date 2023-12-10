import LoginContext from "../context";
import { useContext, useState, useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  GENRES,
  isFollowing,
  unfollowUser,
  followUser,
} from "../client";
import Navbar from "../Navbar/navbar";

const OtherProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { login, setLogin } = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState("Liked Movies");
  const [following, setFollowing] = useState(null);

  useEffect(() => {
    console.log("firing");
    getProfile(userId).then((result) => {
      if (result.message === "Success") {
        if (Object.keys(login).length === 0) {
          // front end is not logged in
          if (result.session) {
            setLogin({
              id: result.session._id,
              username: result.session.username,
              favoriteGenre: result.session.favoriteGenre,
              userType: result.session.userType,
            });
            isFollowing(result.session._id, userId).then((isFollowing) => {
              setFollowing(isFollowing.data);
            });
          }
        } else {
          isFollowing(login.id, userId).then((isFollowing) => {
            setFollowing(isFollowing.data);
          });
        }
        setUser(result.data);
      } else {
        alert(result.message);
      }
    });
  }, [userId]);

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
            onClick={() => {
              if (Object.keys(login).length > 0 && login.id === user._id) {
                navigate("/profile");
              } else {
                navigate(`/profile/${user._id}`);
              }
            }}
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
            onClick={() => {
              if (Object.keys(login).length > 0 && login.id === user._id) {
                navigate("/profile");
              } else {
                navigate(`/profile/${user._id}`);
              }
            }}
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

  const followButton = () => {
    // if not null, then user is logged in
    if (following !== null) {
      if (following) {
        return (
          <button className="btn btn-success" onClick={unfollow}>
            Following
          </button>
        );
      } else {
        return (
          <button className="btn btn-primary" onClick={follow}>
            Follow
          </button>
        );
      }
    }
    return (
      <button className="btn btn-primary" onClick={() => navigate("/login")}>
        Follow
      </button>
    );
  };

  const unfollow = async () => {
    const isFollowing = await unfollowUser(login.id, userId);
    const profile = await getProfile(userId);

    setFollowing(isFollowing.data);
    setUser(profile.data);
  };

  const follow = async () => {
    const isFollowing = await followUser(login.id, userId);
    const profile = await getProfile(userId);

    setFollowing(isFollowing.data);
    setUser(profile.data);
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
                {followButton()}
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={user.username}
                    readOnly
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

export default OtherProfile;
