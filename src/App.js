import { useState } from "react";
import "./App.css";
import "./bootstrap.css";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";
import Profile from "./Profile";
import Search from "./Search";
import EmptySearch from "./EmptySearch";
import OtherProfile from "./OtherProfile/index.js";
import LoginContext from "./context.js";
import Details from "./Details/index.js";

function App() {
  // when logged out, is {}
  // when logged in, is { id: ..., username: ... } holds this userdata
  // to fetch userdata for profile page
  const [login, setLogin] = useState({});

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:userId" element={<OtherProfile />} />
          <Route path="details/:apiMovieId" element={<Details />} />
          <Route path="search/:searchTerms" element={<Search />} />
          <Route path="search/" element={<EmptySearch />} />
        </Routes>
      </HashRouter>
    </LoginContext.Provider>
  );
}

export default App;
