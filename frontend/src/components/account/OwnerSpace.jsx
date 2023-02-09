import React from "react";
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import 'react-calendar-timeline/lib/Timeline.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { setHeaders, url } from "../../slices/api";
import { useDispatch, useSelector } from "react-redux";
import DateRangeComp from "../Details/DatePicker";
import { addDays } from 'date-fns'
import { ordersCreate, ordersDelete } from '../../slices/ordersSlice';
import styled from "styled-components";
import { PrimaryButton } from "../admin/CommonStyled";

const OwnerSpace = () => {

    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const auth = useSelector((state) => state.auth)
    const { items } = useSelector((state) => state.products);
    const { createStatus } = useSelector((state) => state.orders);


    const [loading, setLoading] = useState(false);

    const [userBoats, setUserBoats] = useState([])
    const [infosBoats, setInfosBoats] = useState([])
    const [boatSelected, setBoatSelected] = useState("");
    const [dateBooked, setDateBooked] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);
    const [dureeLoc, setDureeLoc] = useState();
    const [userOrders, setUserOrders] = useState([]);


    const groups = []
    const boats = []

    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection'
        }
    ])

    const ONE_DAY = 1000 * 60 * 60 * 24;

    useEffect(() => {
        range[0].startDate && range[0].endDate && setDureeLoc(Math.round((range[0].endDate - range[0].startDate) / ONE_DAY) + 1)
    }, [range])


    useEffect(() => {

        if (auth._id) {
            setLoading(true)
            const user = users.find((user) => user._id === auth._id);
            if (user) {
                const boats = user.boats.filter((boat) => boat.isChecked === true);
                const boatsId = boats.map((boat) => boat.id);
                setUserBoats(boatsId);
                setLoading(false)
            }
        }
    }, [users, auth._id])

    useEffect(() => {
        setLoading(true)
        if (userBoats.length > 0) {
            const boats = items.filter((item) => userBoats.includes(item._id));
            setInfosBoats(boats);
            setLoading(false)
        }
    }, [userBoats, items])

    useEffect(() => {

        if (boatSelected) {
            setLoading(true)
            const boat = infosBoats.find((boat) => boat._id === boatSelected._id);
            const dates = boat.reservation.map((reservation) => {
                return {
                    startDate: new Date(reservation.startLocation.split("/")[2], reservation.startLocation.split("/")[1] - 1, reservation.startLocation.split("/")[0]),
                    endDate: new Date(reservation.endLocation.split("/")[2], reservation.endLocation.split("/")[1] - 1, reservation.endLocation.split("/")[0]),
                    key: 'selection'
                }
            })
            setDateBooked(dates);
            setLoading(false)
        }
    }, [boatSelected, infosBoats])

    useEffect(() => {

        dateBooked && dateBooked.map((date) => {
            setLoading(true)
            const dateStart = date.startDate;
            const dateEnd = date.endDate;

            const dateStartConvert_ms = dateStart.getTime();
            const dateEndConvert_ms = dateEnd.getTime();

            var difference_ms = Math.abs(dateStartConvert_ms - dateEndConvert_ms);
            var difference_days = Math.round(difference_ms / ONE_DAY);

            for (let i = 0; i <= difference_days; i++) {
                disabledDates.push(new Date(dateStartConvert_ms + (i * ONE_DAY)))
            }

            setDisabledDates([...disabledDates])
            setLoading(false)
        })

    }, [dateBooked])


    infosBoats && infosBoats.map((order) => {
        groups.push({
            id: order.name,
            title: order.name,
            height: 50,
        })

        order.reservation.map((reservation, index) => {
            boats.push({
                id: order._id + '-' + index,
                group: order.name,
                title: "Réservé",
                start_time: new Date(reservation.startLocation.split("/")[2], reservation.startLocation.split("/")[1] - 1, reservation.startLocation.split("/")[0]).getTime(),
                end_time: new Date(reservation.endLocation.split("/")[2], reservation.endLocation.split("/")[1] - 1, reservation.endLocation.split("/")[0]).getTime() + 86400000,
                description: order._id + '-' + index,
            })
        })
    })

    const handleChange = (item) => {
        setRange([item.selection])
    }

    const line_items = [
        {
            id: boatSelected._id,
            name: boatSelected.name,
            dureeLocation: dureeLoc,
            startLocation: range[0].startDate.toLocaleDateString(),
            endLocation: range[0].endDate.toLocaleDateString(),
            choiceGuide: "",
        }
    ];

    const handleCreate = async (e) => {
        e.preventDefault()
        dispatch(
            ordersCreate({
                userId: auth._id,
                userFirstName: auth.firstName,
                userLastName: auth.lastName,
                products: line_items,
                subtotal: 0,
                total: 0,
                payment_status: "propriétaire",
                type: "Propriétaire",
            })
        )
        window.location.reload()
    }

    const handleDelete = async (userOrdersId) => {
        dispatch(ordersDelete(userOrdersId))
        window.location.reload()
    }


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await axios.get(`${url}/orders/find/${auth._id}`, setHeaders());

                setUserOrders(res.data);
            } catch (err) {
                console.log(err);
            }
            setLoading(false)
        }
        fetchData()
    }, []);

    return (
        <>
            {loading
                ?
                <p>Chargement...</p>
                :
                <>
                    <div>
                        <h2 style={{ marginBottom: '1rem' }}>Calendrier des réservations</h2>
                        <Timeline
                            groups={groups}
                            items={boats}
                            defaultTimeStart={moment()}
                            defaultTimeEnd={moment().add(31, 'day')}
                        />
                    </div>
                    <div>
                        <StyledCreateProduct>
                            <StyledForm onSubmit={handleCreate}>
                                <h2 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Ajouter dates d'indisponibilités pour un bateau</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                                    <small>Choix du bateau</small>
                                    <select defaultValue={""} required onChange={(e) => { setDateBooked([]); setDisabledDates([]); setBoatSelected(JSON.parse(e.target.value)) }}>
                                        <option value="" disabled>Sélectionner</option>
                                        {infosBoats && infosBoats.map((item) => (
                                            <option key={item._id} value={JSON.stringify(item)}>{item.name}</option>
                                        ))}
                                    </select>
                                    {boatSelected === "" || loading === true ?
                                        <></>
                                        :
                                        <DateRangeComp
                                            handleChange={handleChange}
                                            disabledDates={disabledDates}
                                        />
                                    }
                                    <PrimaryButton type="submit">
                                        {createStatus === "pending" ? "En cours..." : "Valider"}
                                    </PrimaryButton>
                                </div>
                            </StyledForm>
                        </StyledCreateProduct>
                    </div>
                    <div>
                        <h2 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Dates d'indisponibilités</h2>
                        <div>
                            {loading ? (
                                <p>Chargement des réservations...</p>
                            ) : (
                                <>
                                    {userOrders && userOrders.length > 0 ? (
                                        userOrders.map((userOrders) => {
                                            if (userOrders.type === "Propriétaire") {
                                                return (
                                                    <div key={userOrders._id} style={{ display: 'flex', gap: '1rem' }}>
                                                        {userOrders.products.map((product, index) => (
                                                            <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                                                                <p>{product.name}</p>

                                                                <p>Du : {product.startLocation}</p>
                                                                <p>Au : {product.endLocation}</p>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => handleDelete(userOrders._id)}>Supprimer</button>
                                                    </div>
                                                );
                                            }
                                        })

                                    ) : (
                                        <p>Vous n'avez bloqué aucune date.</p>
                                    )}
                                </>
                            )}


                        </div>
                    </div>
                </>
            }
        </>

    )

}

export default OwnerSpace;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 2rem;

  .select,
  .input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledCreateProduct = styled.div`
  display: flex;
  justify-content: space-between;

  textarea{
    min-height: 300px;
    resize: none;
    overflow-y: scroll;
    padding: 20px
  }
`;