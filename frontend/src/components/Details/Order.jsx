import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { setHeaders, url } from "../../slices/api";

const Order = () => {
    const params = useParams();

    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(false);

    // console.log(order);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${url}/orders/findOne/${params.id}`,
                    setHeaders()
                );

                setOrder(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err)
            }
        };
        fetchOrder();
    }, [params.id])


    return (
        <StyledOrder>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <OrdersContainer>
                        <h2>Détails de la commande</h2>
                        <p>
                            Statut du paiement: {" "}
                            {order.payment_status === "pending" ? (
                                <Pending>En attente</Pending>
                            ) : order.payment_status === "failed" ? (
                                <Dispatched>Non payé</Dispatched>
                            ) : order.payment_status === "paid" || "succeeded" ? (
                                <Delivered>Payé</Delivered>
                            ) : (
                                "Erreur"
                            )}
                        </p>

                        <h3>Détail produit</h3>
                        <Items>
                            {order.products?.map((product, index) => (
                                <Item key={index}>
                                    <span>produit: {product.description}</span>
                                    <span>quantité: {product.quantity}</span>
                                    <span>prix: {((product.amount_subtotal) / product.quantity) / 100 + " €"}</span>
                                </Item>
                            ))}
                        </Items>
                        <div>
                            <h3>Prix total</h3>
                            <p>{order.total + " €"}</p>
                        </div>
                        <div>
                            <h3>Détails client</h3>
                            <p>{[order.userFirstName + " " + order.userLastName]}</p>
                        </div>
                    </OrdersContainer>
                </>
            )}
        </StyledOrder>
    );
};

export default Order;

const StyledOrder = styled.div`
    margin: 3rem;
    display: flex;
    justify-content: center;
    h3{
        margin: 1.5rem 0 0.5rem 0;
    }
`;

const OrdersContainer = styled.div`
    max-width: 500px;
    width: 100%;
    heigth: auto;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 5px;
    padding: 2rem;
`;

const Items = styled.li`
    list-style: none;
    span{
        margin-right: 1.5rem;
        &:first-child{
            font-weight: bold;
        }
    }
`;

const Item = styled.div`
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
`;

const Pending = styled.span`
    color: rgb(253, 181, 40);
    bacground: rgba(253, 181, 40, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Dispatched = styled.span`
    color: rgb(38, 198, 249);
    bacground: rgba(38, 198, 249, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Delivered = styled.span`
    color: rgb(102, 108, 255);
    bacground: rgba(102, 108, 255, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;