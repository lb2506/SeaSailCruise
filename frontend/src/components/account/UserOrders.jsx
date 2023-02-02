import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../../slices/api";
import { useSelector } from "react-redux";


const UserOrders = () => {

    const { userId } = useParams();
    const [userOrders, setUserOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const res = await axios.get(`${url}/orders/find/${userId}`, setHeaders());

                setUserOrders(res.data);
            } catch (err) {
                console.log(err);
            }
            setIsLoading(false)
        }
        fetchData()
    }, []);

    return (

        <div>
            {isLoading ? (
                <p>Chargement des réservations...</p>
            ) : (
                <>
                    {userOrders && userOrders.length > 0 ? (
                        userOrders.some(order => order.type !== "Propriétaire") ? (
                            userOrders.map((userOrder) => {
                                if (userOrder.type !== "Propriétaire") {
                                    return (
                                        <div key={userOrder._id} style={{ display: 'flex', gap: '1rem' }}>
                                            {JSON.parse(userOrder.products).map((product, index) => (
                                                <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                                                    <p>{product.name}</p>
                                                    <p>{product.choiceGuide}</p>
                                                    <p>Du : {product.startLocation}</p>
                                                    <p>Au : {product.endLocation}</p>
                                                </div>
                                            ))}
                                            <p>Montant de la location : {userOrder.total} €</p>
                                            <p>Statut de la commande : {userOrder.order_status === "pending" ? "En attente" : userOrder.order_status === "accepted" ? "Acceptée" : userOrder.order_status === "refused" ? "Refusée" : "Erreur"}</p>
                                        </div>
                                    );
                                }
                            })
                        ) : (
                            <p>Vous n'avez aucune réservation</p>
                        )
                    ) : (
                        <p>Vous n'avez aucune réservation</p>
                    )}
                </>
            )}
        </div>
    )
}

export default UserOrders;
