import styled from "styled-components";
import * as React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ordersEdit, ordersFetch } from "../../../slices/ordersSlice";
import moment from "moment";

export default function OrdersList() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(ordersFetch())
    }, [dispatch]);

    const rows = list && list.map(order => {
        return {
            id: order._id,
            cName: [order.userFirstName + " " + order.userLastName],
            amount: order.total.toLocaleString(),
            oStatus: order.order_status,
            date: moment(order.createdAt).fromNow(),
            type: order.type,
        }
    })

    const columns = [
        // { field: 'id', headerName: 'ID', width: 120 },
        { field: 'cName', headerName: 'Client', width: 150 },
        { field: 'amount', headerName: 'Montant (€)', width: 100 },
        {
            field: 'oStatus', headerName: 'Etat de la commande', width: 160,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.oStatus === "pending" ? <Pending>En attente</Pending> :
                            params.row.oStatus === "accepted" ? <Accepted>Acceptée</Accepted> :
                                params.row.oStatus === "refused" ? <Refused>Refusée</Refused> :
                                    "Erreur"
                        }
                    </>
                )
            }
        },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'type', headerName: 'Type de réservation', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 220,
            renderCell: (params) => {
                return (
                    <>
                        <Actions>
                            <AcceptBtn onClick={() => handleOrderDispatch(params.row.id)}>Accepter</AcceptBtn>
                            <RefuseBtn onClick={() => handleOrderDeliver(params.row.id)}>Refuser</RefuseBtn>
                            <View onClick={() => navigate(`/order/${params.row.id}`)}>Voir</View>
                        </Actions>
                    </>
                )
            }
        },
    ];


    const handleOrderDispatch = (id) => {
        dispatch(ordersEdit({
            id,
            order_status: "accepted",
        }))
    }

    const handleOrderDeliver = (id) => {
        dispatch(ordersEdit({
            id,
            order_status: "refused",
        }))
    }


    return (
        <div style={{ height: 800, width: '100%' }}>

            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                disableSelectionOnClick
            />
        </div>
    );
}


const AcceptBtn = styled.button`
    background-color: rgb(38, 198, 249);
`;

const RefuseBtn = styled.button`
    background-color: red;
`;

const View = styled.button`
    background-color: rgb(114, 225, 40);
`;

const Pending = styled.div`
    color: rgb(253, 181, 40);
    background: rgba(253, 181, 40, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Accepted = styled.div`
    color: rgb(38, 198, 249);
    background: rgba(38, 198, 249, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Refused = styled.div`
    color: rgb(255, 0, 0);
    background: rgba(255, 0, 0, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Actions = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    button{
        border: none;
        outline; none;
        padding: 3px 5px;
        color: white;
        border-radius: 3px;
        cursor: pointer;
    }
`;