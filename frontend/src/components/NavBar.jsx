import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../slices/authSlice";
import { toast } from "react-toastify";

import logo from "../assets/images/logo.png";

const NavBar = () => {
  const dispatch = useDispatch();
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="navbar-container">
      <nav className="nav-bar">
        <Link to="/" className="logo-ctn">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        
        {auth._id ? (
          <Links>
            <div>
              <Link to="/cart">
                <div className="nav-bag">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    fill="currentColor"
                    className="bi bi-handbag-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2zM5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0V5z" />
                  </svg>
                  <span className="bag-quantity">
                    <span>{cartTotalQuantity}</span>
                  </span>
                </div>
              </Link>
            </div>
            <div>
              <Link to={`/account/orders/${auth._id}`}>Mon compte</Link>
            </div>
            {auth.isAdmin ? (
              <div>
                <Link to="/admin/summary">Dashboard</Link>
              </div>
            ) : null}
            <div
              onClick={() => {
                dispatch(logoutUser(null));
                navigate("/");
                toast.warning("Déconnexion réussie !", { position: "bottom-left" });
              }}
            >
              Déconnexion
            </div>
          </Links>
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

const Links = styled.div`
  color: white;
  display: flex;

  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 2rem;
  }
`;
