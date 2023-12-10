import { useState, useContext, useEffect } from "react";
import LoginContext from "../context";

import Navbar from "../Navbar/navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import "./index.css";
import {
  getLikedMovies,
  getProfile,
  getReviewedMovies,
  getReviews,
  isLoggedIn,
} from "../client";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_URL = `https://api.themoviedb.org`;

function genreNum(a) {
  switch (a) {
    case "action":
      return 28;
    case "comedy":
      return 35;
    case "horror":
      return 27;
    case "sci-fi":
      return 878;
    case "fantasy":
      return 14;
    case "mystery":
      return 9648;
    case "romance":
      return 10749;
    default:
      return 28;
  }
}

/**
 *  I STILL NEED TO MAKE A SEPARATE PAGE FOR IF YOU ARE LOGGED IN AS A REVIEWER
 */

const Home = () => {
  const { login, setLogin } = useContext(LoginContext);

  useEffect(() => {
    if (Object.keys(login).length === 0) {
      isLoggedIn().then((result) => {
        if (result.session) {
          setLogin({
            id: result.session._id,
            username: result.session.username,
            favoriteGenre: result.session.favoriteGenre,
            userType: result.session.userType,
          });
        }
      });
    }
  }, []);

  return (
    <div>
      <Navbar />
      <>
        {Object.keys(login).length > 0 ? <HomeLoggedIn /> : <HomeLoggedOut />}
      </>
    </div>
  );
};
export default Home;

const InTheaters = {
  method: "GET",
  url: "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U",
  },
};

const LoggedInReader = () => {
  const { login, setLogin } = useContext(LoginContext);
  const [userInfo, setUserInfo] = useState("Liked Movies");

  const [favGenre, setFavGenre] = useState(genreNum(login.favoriteGenre));
  const [favGenreMovies, setFavGenreMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);

  const TopGenreMovies = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${favGenre}`,
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U",
    },
  };
  axios
    .request(TopGenreMovies)
    .then(function (response) {
      setFavGenreMovies(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });

  useEffect(() => {
    const fetchData = async () => {
      const movieIds = await getLikedMovies(login.id);
      console.log(movieIds);
      const liked = await Promise.all(
        movieIds.data.map(async (likedId) => {
          const movieData = await getMovieByID(likedId);
          return movieData;
        })
      );
      setLikedMovies(liked);
    };

    fetchData();
  }, []);

  return (
    <div className="wd-content-margin">
      <h1>From Your Favorite Genre: {login.favoriteGenre}!</h1>
      <div className="container-fluid py-2">
        {/* Add the "overflow-x" style to make the container horizontally scrollable */}
        <div className="card-deck wd-suggested-card-deck d-flex flex-row">
          {/* Remove the unnecessary wrapping div */}
          {favGenreMovies.map((movie, idx) => (
            <Link key={idx} to={`/details/${movie.id}`}>
              <div className="card wd-suggested-card" key={idx}>
                <img
                  className="card-img-top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="card image cap"
                />
                <div className="card-title">{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <h1>Liked Movies:</h1>
      <div className="container-fluid py-2">
        {/* Add the "overflow-x" style to make the container horizontally scrollable */}
        <div className="card-deck wd-suggested-card-deck d-flex flex-row">
          {/* Remove the unnecessary wrapping div */}
          {likedMovies.map((movie, idx) => (
            <Link key={idx} to={`/details/${movie.id}`}>
              <div className="card wd-suggested-card" key={idx}>
                <img
                  className="card-img-top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="card image cap"
                />
                <div className="card-title">{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const getMovieByID = async (id) => {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U",
    },
  };
  const result = await axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  return result;
};

const LoggedInReviewer = () => {
  const { login, setLogin } = useContext(LoginContext);

  const [reviewedMovies, setReviewedMovies] = useState([]);

  const [favGenre, setFavGenre] = useState(genreNum(login.favoriteGenre));
  const [favGenreMovies, setFavGenreMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);

  const TopGenreMovies = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${favGenre}`,
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U",
    },
  };
  axios
    .request(TopGenreMovies)
    .then(function (response) {
      setFavGenreMovies(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });

  useEffect(() => {
    const fetchData = async () => {
      const movieIds = await getReviewedMovies(login.id);
      const reviewed = await Promise.all(
        movieIds.data.map(async (review) => {
          const movieData = await getMovieByID(review);
          return movieData;
        })
      );
      setReviewedMovies(reviewed);
    };

    fetchData();
  }, []);

  return (
    <div className="wd-content-margin">
      <h1>From Your Favorite Genre: {login.favoriteGenre}!</h1>
      <div className="container-fluid py-2">
        {/* Add the "overflow-x" style to make the container horizontally scrollable */}
        <div className="card-deck wd-suggested-card-deck d-flex flex-row">
          {/* Remove the unnecessary wrapping div */}
          {favGenreMovies.map((movie, idx) => (
            <Link key={idx} to={`/details/${movie.id}`}>
              <div className="card wd-suggested-card" key={idx}>
                <img
                  className="card-img-top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="card image cap"
                />
                <div className="card-title">{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <h1>Your Reviewed Movies:</h1>
      <div className="container-fluid py-2">
        {/* Add the "overflow-x" style to make the container horizontally scrollable */}
        <div className="card-deck wd-suggested-card-deck d-flex flex-row">
          {/* Remove the unnecessary wrapping div */}
          {reviewedMovies.map((movie, idx) => (
            <Link key={idx} to={`/details/${movie.id}`}>
              <div className="card wd-suggested-card" key={idx}>
                <img
                  className="card-img-top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="card image cap"
                />
                <div className="card-title">{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeLoggedIn = () => {
  const { login, setLogin } = useContext(LoginContext);
  if (login.userType === "reader") {
    return <LoggedInReader />;
  } else {
    return <LoggedInReviewer />;
  }
};

const HomeLoggedOut = () => {
  const [moviesInTheaters, setInTheaters] = useState([]);
  const [reviewedMovies, setReviewedMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieIds = await getReviews();
      const reviewed = await Promise.all(
        movieIds.data.map(async (review) => {
          const movieData = await getMovieByID(review);
          return movieData;
        })
      );
      setReviewedMovies(reviewed);
    };

    fetchData();
  }, []);
  axios
    .request(InTheaters)
    .then(function (response) {
      setInTheaters(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });

  return (
    <div>
      <h1>In Theaters now!</h1>
      <div className="container-fluid py-2">
        {/* Add the "overflow-x" style to make the container horizontally scrollable */}
        <div className="card-deck wd-suggested-card-deck d-flex flex-row">
          {/* Remove the unnecessary wrapping div */}
          {moviesInTheaters.map((movie, idx) => (
            <Link key={idx} to={`/details/${movie.id}`}>
              <div className="card wd-suggested-card" key={idx}>
                <img
                  className="card-img-top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="card image cap"
                />
                <div className="card-title">{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <h1>Reviewed by our members:</h1>
      <div className="container-fluid py-2">
        {/* Add the "overflow-x" style to make the container horizontally scrollable */}
        <div className="card-deck wd-suggested-card-deck d-flex flex-row">
          {/* Remove the unnecessary wrapping div */}
          {reviewedMovies.map((movie, idx) => (
            <Link key={idx} to={`/details/${movie.id}`}>
              <div className="card wd-suggested-card" key={idx}>
                <img
                  className="card-img-top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="card image cap"
                />
                <div className="card-title">{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
