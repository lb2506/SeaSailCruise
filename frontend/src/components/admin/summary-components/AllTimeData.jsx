import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { usersFetch } from "../../../slices/usersSlice";
import { ordersFetch } from "../../../slices/ordersSlice";


const AllTimeData = () => {

    const dispatch = useDispatch();

    const { items } = useSelector(state => state.products);
    const { users } = useSelector((state) => state.users);
    const { list } = useSelector((state) => state.orders);
    const orders = list && list.filter(order => order.payment_status === "paid" || order.payment_status === "succeeded" || order.payment_status === "A régler sur place");
    const CATotal = list && list.filter(order => order.payment_status === "paid" || order.payment_status === "succeeded").reduce((acc, order) => acc + order.total, 0);
    const ownerOrders = list && list.filter(order => order.type === "Propriétaire");

    useEffect(() => {
        dispatch(usersFetch());
        dispatch(ordersFetch());
    }, [dispatch]);

    return (
        <Main>
            <h3>Global</h3>
            <Info>
                <Title>Utilisateurs</Title>
                <Data>{users && users.length}</Data>
            </Info>
            <Info>
                <Title>Produits</Title>
                <Data>{items && items.length}</Data>
            </Info>
            <Info>
                <Title>Réservations</Title>
                <Data>{orders && orders.length} <span style={{ fontSize: '12px', fontStyle: 'italic' }}>( + {ownerOrders && ownerOrders.length} propriétaire(s))</span></Data>
            </Info>
            <Info>
                <Title>Chiffre d'affaires</Title>
                <Data>{CATotal?.toLocaleString()} €</Data>
            </Info>
        </Main>
    )
}

export default AllTimeData;


const Main = styled.div`
    background: rgb(48, 51, 78);
    color: rgba(234, 234, 255, 0.87);
    margin-top: 1.5rem;
    border-radius: 5px;
    padding: 1rem;
    font-size: 14px;
`;

const Info = styled.div`
    display: flex;
    margin-top: 1rem;
    padding: 0.3rem;
    border-radius: 3px;
    background: rgba(38, 198, 249, 0.12)
    &:nth-child(even){
        background: rgba(102, 108, 255, 0.12)
    }
`;

const Title = styled.div`
    flex: 1;
`;

const Data = styled.div`
    flex: 1;
    font-weight: 700;
`;