import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { userDelete, usersFetch } from "../../../slices/usersSlice";
import EmailContact from "../../Details/EmailContact";

export default function OwnersList() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  const [isOnContact, setIsOnContact] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    dispatch(usersFetch());
  }, [dispatch]);


  const rows = users && users
    .filter((user) => (user.isOwner === true))
    .map((user) => {
      return {
        id: user._id,
        uName: [user.firstName + " " + user.lastName],
        uEmail: user.email,
        uPhone: user.phone,
        isAdmin: user.isAdmin,
      };
    });



  const columns = [
    // { field: "id", headerName: "ID", width: 220 },
    { field: "uName", headerName: "Nom", width: 150 },
    { field: "uEmail", headerName: "Email", width: 200 },
    { field: "uPhone", headerName: "Téléphone", width: 150 },
    {
      field: "isAdmin",
      headerName: "Rôle",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.isAdmin ? (
              <Admin>Admin</Admin>
            ) : (
              <Customer>Utilisateur</Customer>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      renderCell: (params) => {
        return (
          <Actions>
            <Delete onClick={() => handleDelete(params.row.id)}>Supprimer</Delete>
            {/* <View onClick={() => navigate(`/user/${params.row.id}`)}>Voir</View> */}
            <Contact onClick={() => handleContact(params.row)}>Contacter</Contact>
          </Actions>
        );
      },
    },
  ];

  const handleDelete = (id) => {
    dispatch(userDelete(id));
  };

  const handleContact = (user) => {
    setIsOnContact(true);
    setUser(user);
  }


  return (
    <>
      <div className="popUp-overlay mail" style={{ display: isOnContact ? 'block' : 'none' }}>
        <div className="contact-popup">
          <h1>Formulaire de contact</h1>
          <EmailContact user={user} />
          <div className="action-buttons">
            <button className="cancel-boat" onClick={() => setIsOnContact(false)}>Annuler</button>
          </div>
        </div>
      </div>
      <div style={{ height: 800, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          rowsPerPageOptions={[50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </>
  );
}

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  button {
    border: none;
    outline: none;

    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const Delete = styled.button`
  background-color: rgb(255, 77, 73);
`;
const View = styled.button`
  background-color: rgb(114, 225, 40);
`;

const Contact = styled.button`
  background-color: rgb(114, 225, 40);
`;

const Admin = styled.div`
  color: rgb(253, 181, 40);
  background: rgb(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Customer = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgb(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const NotOwner = styled.div`
color: rgb(209, 0, 246);
background-color: rgb(209, 0, 246, 0.12);
padding: 3px 5px;
border-radius: 3px;
font-size: 14px;
`

const Owner = styled.div`
color: rgb(69, 246, 0);
background-color: rgb(69, 246, 0, 0.12);
padding: 3px 5px;
border-radius: 3px;
font-size: 14px;
`