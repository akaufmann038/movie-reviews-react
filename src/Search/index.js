import { useParams } from "react-router";
import Navbar from "../Navbar/navbar";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./index.css";
import { isLoggedIn } from "../client";
import LoginContext from "../context";

function Search() {
  const { searchTerms } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  const { login, setLogin } = useContext(LoginContext);

  useEffect(() => {
    if (Object.keys(login).length === 0) {
      isLoggedIn().then((result) => {
        if (result.message === "Success" && result.session) {
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

  const searchOptions = {
    method: "GET",
    url: `https://api.themoviedb.org/3/search/movie?query=${searchTerms}&include_adult=false&language=en-US&page=1`,
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U",
    },
  };

  axios
    .request(searchOptions)
    .then(function (response) {
      setSearchResults(response.data.results);
    })
    .catch(function (error) {
      console.error(error);
    });

  return (
    <div>
      <Navbar />
      <div className="card-deck">
        {/* Remove the unnecessary wrapping div */}
        {searchResults.map((movie, idx) => (
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
  );
}
export default Search;
