import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../../slices/api";


const UserOrders = () => {

    const { userId } = useParams(); 
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData(){
            setIsLoading(true);
            try{
                const res = await axios.get(`${url}/orders/find/${userId}`, setHeaders());

                setOrders(res.data);
            } catch(err){
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
                { orders && orders.length > 0 ? (
                orders.map((order) => (
                <div key={order._id}>
                    <h3>{order._id}</h3>
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
