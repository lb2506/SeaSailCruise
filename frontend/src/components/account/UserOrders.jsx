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
                        userOrders.map((userOrders) => (
                            <div key={userOrders._id} style={{ display: 'flex', gap: '1rem' }}>
                                {JSON.parse(userOrders.products).map((product) => (
                                    <div key={product._id} style={{ display: 'flex', gap: '1rem' }}>
                                        <p>{product.name}</p>
                                        <p>{product.choiceGuide}</p>
                                        <p>Du : {product.startLocation}</p>
                                        <p>Au : {product.endLocation}</p>
                                    </div>
                                ))}
                                <p>Montant de la location : {userOrders.total} €</p>
                                <p>Statut de la commande : {userOrders.order_status === "pending" ? "En attente" : userOrders.order_status === "accepted" ? "Acceptée" : userOrders.order_status === "refused" ? "Refusée" : "Erreur"}</p>
                            </div>
                        ))
                    ) : (
                        <p>Vous n'avez aucune réservation</p>
                    )}
                </>
            )}


        </div>
    )
}

export default UserOrders;
