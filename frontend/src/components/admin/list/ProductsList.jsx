import styled from "styled-components";
import * as React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { productsDelete } from "../../../slices/productsSlice";
import EditProduct from "../EditProduct";
import { useState } from "react";
import { productsEdit } from '../../../slices/productsSlice';


export default function ProductsList() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);

  const [isOnDelete, setIsOnDelete] = useState(false);
  const [deleteChoice, setDeleteChoice] = useState(false);

  const rows = items && items.map(item => {
    return {
      id: item._id,
      visible: item.visible,
      imageUrl: item.image.url,
      pName: item.name,
      pDesc: item.desc,
      price: item.price.toLocaleString(),
    }
  })

  const columns = [
    // { field: 'id', headerName: 'ID', width: 220 },
    {
      field: 'imageUrl', headerName: 'Image', width: 80,
      renderCell: (params) => {
        return (
          <ImageContainer>
            <img src={params.row.imageUrl} alt='' />
          </ImageContainer>
        )
      }
    },
    { field: 'pName', headerName: 'Nom', width: 130 },
    { field: 'pDesc', headerName: 'Description', width: 230 },
    { field: 'price', headerName: 'Prix', width: 80 },

    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 300,
      renderCell: (params) => {
        return (
          <Actions>
            <Delete onClick={() => handleDelete(params.row.id)}>Supprimer</Delete>
            <EditProduct productId={params.row.id} />
            <View onClick={() => navigate(`/product/${params.row.id}`)}>Voir</View>
            <Show onClick={() => handleEdit(params.row.id)}>{params.row.visible ? 'Masquer' : 'Afficher'}</Show>
          </Actions>
        )
      }
    },
  ];

  const handleDelete = (id) => {
    setIsOnDelete(true);
    setDeleteChoice(id)
  }

  const handleEdit = async (id) => {
    const currentProd = items.find(item => item._id === id);
    dispatch(
      productsEdit({
        product: {
          ...currentProd,
          visible: !currentProd.visible,
        }
      })
    );

  };


  return (
    <>
      <div className="popUp-overlay" style={{ display: isOnDelete ? 'block' : 'none' }}>
        <div className="delete-popup">
          <h2>Supprimer le produit ?</h2>
          <p>Cette action est irréversible</p>
          <div className="action-buttons">
            <button className="cancel-boat" onClick={() => setIsOnDelete(false)}>Annuler</button>
            <button className="delete-boat" onClick={() => {
              dispatch(productsDelete(deleteChoice));
              setIsOnDelete(false);
              window.location.reload();
            }}>Supprimer</button>
          </div>
        </div>
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rowHeight={60}
          rows={rows}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          disableSelectionOnClick
        />
      </div>
    </>

  );
}


const ImageContainer = styled.div`
    img{
        height: 40px;
    }
`;

const Actions = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    button{
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
    background-color: rgb(114, 225, 40)
`;

const Show = styled.button`
    background-color: rgb(105, 0, 109)
`;