import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../slices/authSlice";
import { toast } from "react-toastify";

import logo from "../assets/images/logo.png";

const NavBar = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link to="/" className="navbar__logo">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        <div className="navbar__menu">
          <span className="navbar__menu-burger" />
        </div>
        {auth._id ? (
          <div className="navbar__items">
            <div className="navbar__items-link">
              <Link to="/cart">
                <span className="bag-quantity">
                  <span>{cartItems.length}</span>
                </span>
              </Link>
            </div>
            <div className="navbar__items-link">
              <Link to={`/account/orders/${auth._id}`}>Mon compte</Link>
            </div>
            {auth.isAdmin ? (
              <div className="navbar__items-link">
                <Link to="/admin/summary">Dashboard</Link>
              </div>
            ) : null}
            <div className="navbar__items-link"
              onClick={() => {
                dispatch(logoutUser(null));
                navigate("/");
                toast.warning("Déconnexion réussie !", { position: "bottom-left" });
              }}
            >
              Déconnexion
            </div>
          </div>
        ) : (
          <AuthLinks>
            <Link to="/login">Connexion</Link>
            <Link to="register">Inscription</Link>
          </AuthLinks>
        )}
      </nav>
    </div>
  );
};

export default NavBar;

const AuthLinks = styled.div`
  a {
    &:last-child {
      margin-left: 2rem;
    }
  }
`;