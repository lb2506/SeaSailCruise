import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../slices/authSlice";
import { StyledForm } from "./StyledForm";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });



  useEffect(() => {
    if (auth._id) {
      navigate("/cart");
    }
  }, [auth._id, navigate]);

  const handleSubmit = (e) => {

    e.preventDefault();
    dispatch(registerUser(user));
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        <input
          type="text"
          placeholder="Prénom"
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Adresse email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Numéro de téléphone"
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button>
          {auth.rigisterStatus === "pending" ? "Submitting..." : "S'inscrire"}
        </button>

        {auth.registerStatus === "rejected" ? (
          <p>{auth.registerError}</p>
        ) : null}
      </StyledForm>
    </>
  );
};

export default Register;
