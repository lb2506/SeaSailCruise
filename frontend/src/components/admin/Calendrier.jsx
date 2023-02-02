import React from "react";
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import 'react-calendar-timeline/lib/Timeline.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { setHeaders, url } from "../../slices/api";

const Calendrier = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [item, setItem] = useState({});

    const groups = []
    const items = []

    orders && orders.map((order) => {
        groups.push({
            id: order.name,
            title: order.name,
            height: 50,
        })

        order.reservation.map((reservation, index) => {
            items.push({
                id: order._id + '-' + index,
                group: order.name,
                title: reservation.userFirstName + ' ' + reservation.userLastName,
                start_time: new Date(reservation.startLocation.split("/")[2], reservation.startLocation.split("/")[1] - 1, reservation.startLocation.split("/")[0]).getTime(),
                end_time: new Date(reservation.endLocation.split("/")[2], reservation.endLocation.split("/")[1] - 1, reservation.endLocation.split("/")[0]).getTime() + 86400000,
                description: order._id + '-' + index,
            })
        })
    })

    useEffect(() => {
        orders && selectedItem && orders.map((order) => {
            if (order._id === selectedItem.split("-")[0]) {
                setItem(order.reservation[selectedItem.split("-")[1]])
            }
        })
    }, [selectedItem])

    useEffect(() => {
        setLoading(true)
        async function fetchData() {
            try {
                const res = await axios.get(`${url}/products`, setHeaders());
                setOrders(res.data);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }
        fetchData()
    }, []);

    return (
        <>
            <h2 style={{ marginBottom: '1rem' }}>Calendrier</h2>
            {loading
                ?
                <p>Chargement...</p>
                :
                <>
                    <Timeline
                        groups={groups}
                        items={items}
                        defaultTimeStart={moment()}
                        defaultTimeEnd={moment().add(31, 'day')}
                        onItemSelect={(item) => {
                            setSelectedItem(item)
                        }}
                    />

                    {selectedItem && item &&
                        <div className="overlay" onClick={() => setSelectedItem(null)}>
                            <div className="overlay-details">
                                <h3>Détails de la location</h3>
                                <p>{item.userFirstName + ' ' + item.userLastName}</p>
                                <p>{item.choiceGuide}</p>
                                <p>{item.startLocation}</p>
                                <p>{item.endLocation}</p>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Calendrier;