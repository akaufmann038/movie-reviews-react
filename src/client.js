import axios from "axios";

const request = axios.create({
  withCredentials: true,
});

export const UserTypes = {
  reader: "reader",
  reviewer: "reviewer",
};

const BASE_URL = "https://movie-reviews-server.onrender.com";
const MOVIE_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzI4MzQyODAxMWYxYmY0YmY1ODYxN2Y2N2M2YzM3MyIsInN1YiI6IjY1NWY1NTIzMjQ0MTgyMDEwY2IzOTFkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IXvZnxjhvea78gVvNKYVny1ZN3DlEvPDAlDyFnJYP4U";

export const registerUser = async (user) => {
  try {
    const response = await request.post(`${BASE_URL}/register`, user);

    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const loginUser = async (user) => {
  try {
    const response = await request.post(`${BASE_URL}/login`, user);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getProfile = async (userId) => {
  try {
    const response = await request.get(`${BASE_URL}/profile?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getReviewedMovies = async (userId) => {
  try {
    const response = await request.get(
      `${BASE_URL}/reviewed-movies?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const isLoggedIn = async () => {
  try {
    const response = await request.get(`${BASE_URL}/logged-in`);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const logout = async () => {
  try {
    const response = await request.get(`${BASE_URL}/logout`);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getLikedMovies = async (userId) => {
  try {
    const response = await request.get(
      `${BASE_URL}/liked-movies?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const isFollowing = async (userId, otherUserId) => {
  try {
    const response = await request.post(`${BASE_URL}/profile-following`, {
      userId: userId,
      otherUserId: otherUserId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

// returns the new isFollowing value
export const followUser = async (userId, otherUserId) => {
  try {
    const response = await request.put(`${BASE_URL}/follow`, {
      userId: userId,
      otherUserId: otherUserId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

// returns the new isFollowing value
export const unfollowUser = async (userId, otherUserId) => {
  try {
    const response = await request.put(`${BASE_URL}/unfollow`, {
      userId: userId,
      otherUserId: otherUserId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const updateProfile = async (user) => {
  try {
    const response = await request.put(`${BASE_URL}/profile`, user);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getMovie = async (movieId) => {
  try {
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${MOVIE_API_KEY}`,
    };
    const response = await request.get(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      { headers }
    );

    return response;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getReviews = async () => {
  try {
    const response = await request.get(`${BASE_URL}/member-reviews`);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getMovieDetails = async (apiMovieId) => {
  try {
    const response = await request.get(
      `${BASE_URL}/details?apiMovieId=${apiMovieId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const createReview = async (review) => {
  try {
    const response = await request.put(`${BASE_URL}/create-review`, review);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const likeMovie = async (userId) => {
  try {
    const response = await request.post(`${BASE_URL}/like-movie`, userId);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const unlikeMovie = async (userId) => {
  try {
    const response = await request.post(`${BASE_URL}/unlike-movie`, userId);
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

// TODO: this is temporary, get genres from IMDB ideally, or just create a set list
export const GENRES = [
  "action",
  "comedy",
  "horror",
  "sci-fi",
  "fantasy",
  "mystery",
  "romance",
];
