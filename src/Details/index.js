import { useNavigate, useParams, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import LoginContext from "../context";
import axios from "axios";
import "./MovieDetails.css";
import Navbar from "../Navbar/navbar";
import {
  getMovieDetails,
  createReview,
  likeMovie,
  unlikeMovie,
  isLoggedIn,
} from "../client";

function MovieDetails() {
  const { apiMovieId } = useParams();
  const { login, setLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState({
    title: "",
    director: "",
    actors: [],
    averageScore: "",
    author: "",
    liked: false,
  });

  const [reviews, setReviews] = useState([]);
  const [likes, setLikes] = useState([]);
  const [newReview, setNewReview] = useState({ text: "", score: 0 });
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cast, setCast] = useState({ cast: [], crew: [] });
  const [movieInfo, setMovieInfo] = useState("Reviews");
  const [reviewModal, setReviewModal] = useState(false);

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
    /*
    // Fetch movie details based on the apiMovieId
    fetch(`/api/movies/${apiMovieId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch movie details');
        }
      })
      .then((data) => {
        setMovieDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });*/

    const details = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${apiMovieId}?language=en-US`,
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U",
      },
    };

    axios
      .request(details)
      .then(function (response) {
        setMovieDetails(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });

    const movieCast = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${apiMovieId}/credits?language=en-US`,
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U",
      },
    };

    axios
      .request(movieCast)
      .then(function (response) {
        setCast(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });

    getMovieDetails(apiMovieId).then((result) => {
      console.log(result);
      if (result.message === "Success") {
        setReviews(result.data.reviews);
        setLikes(result.data.likers);
      } else {
        console.log(
          "An error occurred while retrieving movie details from api"
        );
      }
    });
  }, [apiMovieId]);

  const handleReviewChange = (event) => {
    setNewReview((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmitReview = async () => {
    createReview({
      text: newReview.text,
      score: newReview.score,
      apiMovieId: apiMovieId,
      userId: login.id,
    }).then((result) => {
      if (result.message === "Success") {
        setReviews(result.data.reviews);
        setReviewModal(false);
        setNewReview({ text: "", score: 0 });
      }
    });
  };

  // const handleSubmitReview = () => {
  //   // Assuming that I have access to userId, score, text, and apiMovieId
  //   const reviewData = {
  //     userId,
  //     score: 4, // Replace with the actual review score
  //     text: newReview, // Assuming newReview is the review text from state
  //     movieId: apiMovieId, // Assuming apiMovieId is accessible here
  //   };

  //   fetch(`/api/movies/${apiMovieId}/reviews`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(reviewData),
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         throw new Error("Failed to submit review");
  //       }
  //     })
  //     .then((data) => {
  //       console.log("Review submitted successfully:", data);
  //       // Optionally, We can update the state or perform other actions upon successful review submission
  //     })
  //     .catch((error) => {
  //       console.error("Error submitting review:", error);
  //       // Handle error scenario or display an error message to the user
  //     });
  // };

  const handleSearch = () => {
    // Fetch data based on searchQuery
    fetch(`/api/movies/search?query=${searchQuery}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch search results");
        }
      })
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  };

  const renderMovieData = () => {
    if (movieInfo === "Reviews" && reviews) {
      return reviews.map((review, index) => (
        <div
          key={index}
          onClick={() => navigate(`/profile/${review.userId}`)}
          style={{ cursor: "pointer" }}
        >
          <p>Score: {review.score}/5</p>
          <p>By: {review.username}</p>
          <p>{review.text}</p>
        </div>
      ));
    } else if (movieInfo === "Likes" && likes) {
      return likes.map((review, index) => (
        <div
          key={index}
          onClick={() => navigate(`/profile/${review._id}`)}
          style={{ cursor: "pointer" }}
        >
          <p>Liked By: {review.username}</p>
        </div>
      ));
    } else {
      return <></>;
    }
  };

  const handleLikeMovie = () => {
    likeMovie({ userId: login.id, movieId: apiMovieId }).then((result) => {
      if (result.message === "Success") {
        setLikes(result.data.likers);
      }
    });
  };

  const handleDislikeMovie = async () => {
    unlikeMovie({ userId: login.id, movieId: apiMovieId }).then((result) => {
      if (result.message === "Success") {
        setLikes(result.data.likers);
      }
    });
  };

  const renderWriteReview = () => {
    if (login.userType === "reviewer") {
      return (
        <button
          className="btn btn-primary"
          onClick={() => setReviewModal(true)}
        >
          Write Review
        </button>
      );
    } else if (login.userType === "reader") {
      return <></>;
    }

    return <></>;
  };

  const renderLikeButton = () => {
    if (Object.keys(login).length === 0) {
      return (
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Like
        </button>
      );
    } else if (likes.filter((liker) => liker._id === login.id).length === 0) {
      return (
        <button className="btn btn-primary" onClick={handleLikeMovie}>
          Like
        </button>
      );
    } else {
      return (
        <button className="btn btn-success" onClick={handleDislikeMovie}>
          Unlike
        </button>
      );
    }

    return <></>;
  };

  return (
    <div>
      {reviewModal && (
        <div className="modal-backdrop d-flex flex-column">
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleSubmitReview}>
              Create Review
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setReviewModal(false)}
            >
              Cancel
            </button>
          </div>
          <textarea
            value={newReview.text}
            placeholder="Write your review here..."
            name="text"
            onChange={handleReviewChange}
            className="form-control"
            style={{ marginBottom: 10, height: 200 }}
          />
          <input
            type="number"
            value={newReview.score}
            onChange={handleReviewChange}
            placeholder="0"
            name="score"
            className="form-control"
            min={0}
            max={5}
          />
        </div>
      )}
      <Navbar />
      <div className="movie-details-container">
        {/*<div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="profile-button">
        <Link to="/profile">Profile</Link>
  </div>*/}

        <img
          className="img-thumbnail"
          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
        />
        <div className="movie-details">
          <h2>{movieDetails.title}</h2>
          <p>
            Director:{" "}
            {cast.crew.find((member) => member.job === "Director")?.name}
          </p>
          <p>
            Actors:{" "}
            {cast.cast
              .filter((castMember) => castMember.order < 4)
              .map((actor) => actor.name)
              .join(", ")}
          </p>
          <div className="d-flex justify-content-between">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle movie-details"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {movieInfo}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {["Reviews", "Likes"].map((movieInfo, idx) => (
                  <li key={idx}>
                    <a
                      className="dropdown-item"
                      onClick={() => setMovieInfo(movieInfo)}
                    >
                      {movieInfo}
                    </a>
                    ;
                  </li>
                ))}
              </ul>
            </div>
            <div className="d-flex" style={{ gap: 10 }}>
              {renderWriteReview()}
              {renderLikeButton()}
            </div>
          </div>
          <div className="reviews">{renderMovieData()}</div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
