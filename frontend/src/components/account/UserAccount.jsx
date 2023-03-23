import styled from "styled-components";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const UserAccount = () => {
    const auth = useSelector((state) => state.auth);

    if (!auth._id) return <p>Accès refusé.</p>;

    return (
        <div>
            <NavbarAccount>
                <NavLink className={({ isActive }) => isActive ? "link-active" : "link-inactive"} to={`/account/orders/${auth._id}`}>Mes commandes</NavLink>
                <NavLink className={({ isActive }) => isActive ? "link-active" : "link-inactive"} to="/account/profile">Mes informations</NavLink>
                {auth.isOwner === true &&
                    <NavLink className={({ isActive }) => isActive ? "link-active" : "link-inactive"} to="/account/owner-space">Espace professionnel</NavLink>
                }
            </NavbarAccount>

            <Content>
                <Outlet />
            </Content>
        </div>

    );
};

export default UserAccount;

const NavbarAccount = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    background-color: #f5f5f5;
    padding: 1.5rem 0;

    a {
        text-decoration: none;
        border-left: none;
        padding-left: 0;
    }

    .link-active {
        color: #000;
        font-weight: bold;
        position: relative;

        ::after {
            content: "";
            height: 3px;
            width: 100%;
            position: absolute;
            background-color: #0265a7;
            bottom: -1.5rem;
            left: 0;
        }
    }
`;


const Content = styled.div`
  padding: 2rem 3rem;
`;
