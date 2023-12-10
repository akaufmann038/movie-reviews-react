import { useEffect, useContext } from "react";
import Navbar from "../Navbar/navbar";
import { isLoggedIn } from "../client";
import LoginContext from "../context";

const EmptySearch = () => {
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

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default EmptySearch;
