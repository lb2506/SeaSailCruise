import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import axios from "axios";
import { setHeaders, url } from "../../slices/api";
import { toast } from "react-toastify";

const UserProfileData = () => {

    const auth = useSelector((state) => state.auth);

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        isAdmin: false,
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${url}/users/find/${auth._id}`,
                    setHeaders()
                );
                setUser({ ...res.data, password: "" });
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchUser();
    }, [auth._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.", {
                position: "bottom-left",
            });
            return;
        }
        try {
            setUpdating(true);
            const res = await axios.put(
                `${url}/users/${auth._id}`,
                {
                    ...user,
                },
                setHeaders()
            );

            setUser({ ...res.data, password: "", confirmPassword: "" });
            toast.success("Profil mis à jour...", {
                position: "bottom-left",
            });

            setUpdating(false);
        } catch (err) {
            console.log(err);
            setUpdating(false);
            toast.error(err.response.data, {
                position: "bottom-left",
            });
        }
    };



    if (!auth.isAdmin) return <p>Accès refusé.</p>;

    return (
        <StyledProfile>
            <ProfileContainer>
                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3>Informations personnelles</h3>
                        <label htmlFor="firstName">Prénom:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={user.firstName}
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        />
                        <label htmlFor="lastName">Nom:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={user.lastName}
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                        <label htmlFor="password">Nouveau mot de passe :</label>
                        <input
                            type="password"
                            value={user.password}
                            id="password"
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                        <label htmlFor="password">Confirmez le mot de passe :</label>
                        <input
                            type="password"
                            value={user.confirmPassword}
                            id="confirmPassword"
                            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                        />
                        <button>{updating ? "Mise à jour..." : "Mettre à jour"}</button>
                    </form>
                )}
            </ProfileContainer>
        </StyledProfile>
    );
};

export default UserProfileData;

const StyledProfile = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
`;

const ProfileContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: auto;
  display: flex;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 5px;
  padding: 2rem;

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h3 {
      margin-bottom: 0.5rem;
    }

    label {
      margin-bottom: 0.2rem;
      color: gray;
    }
    input {
      margin-bottom: 1rem;
      outline: none;
      border: none;
      border-bottom: 1px solid gray;
    }
  }
`;