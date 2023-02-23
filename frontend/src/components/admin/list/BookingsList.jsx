import styled from "styled-components";
import React, { useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ordersEditStatusOrder, ordersFetch, ordersEditStatusPayment } from "../../../slices/ordersSlice";
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
            date: moment(order.createdAt).locale('fr').format('dddd DD MMMM YYYY'),
            type: order.type,
            payment: order.payment_status
        }
    })

    const columns = [
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
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'type', headerName: 'Méthode de réservation', width: 170 },
        {
            field: 'payment', headerName: 'Statut du paiement', width: 160,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.payment === "succeeded" || params.row.payment === "propriétaire" ? <Accepted>Payé</Accepted> :
                            params.row.payment === "A régler sur place" ? <Pending>A régler</Pending> :
                                "Erreur"
                        }
                    </>
                )
            }
        },
        {
            field: 'contract', headerName: 'Contrat', width: 150
        },
        {
            field: 'acceptPayment',
            headerName: 'Paiement',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.payment === "A régler sur place" ?
                            <AcceptPayment onClick={() => handleOrderPayment(params.row.id)}>Valider le paiement</AcceptPayment>
                            :
                            null
                        }
                    </>
                )
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 320,
            renderCell: (params) => {
                return (
                    <>
                        <Actions>
                            <AcceptBtn onClick={() => handleOrderDispatch(params.row.id)}>Accepter</AcceptBtn>
                            <RefuseBtn onClick={() => handleOrderRefused(params.row.id)}>Refuser</RefuseBtn>
                            <View onClick={() => navigate(`/order/${params.row.id}`)}>Voir</View>
                            <Contract onClick={() => navigate(`/booking/new-contract/${params.row.id}`)}>Créer contrat</Contract>
                        </Actions>
                    </>
                )
            }
        }
    ];

    const handleOrderDispatch = (id) => {
        dispatch(ordersEditStatusOrder({
            id,
            order_status: "accepted",
        }))
    }

    const handleOrderRefused = (id) => {
        dispatch(ordersEditStatusOrder({
            id,
            order_status: "refused",
        }))
    }

    const handleOrderPayment = (id) => {
        dispatch(ordersEditStatusPayment({
            id,
            payment_status: "succeeded",
        }))
    }

    return (
        <>
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={50}
                    rowsPerPageOptions={[50]}
                    disableSelectionOnClick
                />
            </div>

        </>
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

const Contract = styled.button`
    background-color: rgb(160, 40, 225);
`;

const AcceptPayment = styled.button`
    border: none;
    outline; none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
    background: rgb(75, 112, 226);
`

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