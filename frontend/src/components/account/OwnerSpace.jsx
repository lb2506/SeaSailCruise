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
import { ordersCreate } from '../../slices/ordersSlice';
import styled from "styled-components";




const OwnerSpace = () => {

    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const auth = useSelector((state) => state.auth)
    const { items } = useSelector((state) => state.products);

    const [loading, setLoading] = useState(false);

    const [userBoats, setUserBoats] = useState([])
    const [infosBoats, setInfosBoats] = useState([])
    const [boatSelection, setBoatSelection] = useState("");
    const [dateBooked, setDateBooked] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);
    const [dureeLoc, setDureeLoc] = useState()


    const groups = []
    const boats = []

    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection'
        }
    ])


    let ONE_DAY = 1000 * 60 * 60 * 24;

    var date1_ms = range[0].startDate.getTime();
    var date2_ms = range[0].endDate.getTime();

    var difference_ms = Math.abs(date1_ms - date2_ms);

    useEffect(() => {
        setDureeLoc(Math.round(difference_ms / ONE_DAY) + 1)
    }, [range, ONE_DAY, difference_ms])


    useEffect(() => {
        setLoading(true)
        if (auth._id) {
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
        if (boatSelection) {
            const boat = infosBoats.find((boat) => boat._id === boatSelection);
            const dates = boat.reservation.map((reservation) => {
                return {
                    startDate: new Date(reservation.startLocation.split("/")[2], reservation.startLocation.split("/")[1] - 1, reservation.startLocation.split("/")[0]),
                    endDate: new Date(reservation.endLocation.split("/")[2], reservation.endLocation.split("/")[1] - 1, reservation.endLocation.split("/")[0]),
                    key: 'selection'
                }
            })
            setDateBooked(dates);
        }
    }, [boatSelection, infosBoats])

    useEffect(() => {
        dateBooked && dateBooked.map((date) => {
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
        })

    }, [dateBooked])

    console.log(disabledDates);

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(
            ordersCreate({
                userId: auth._id,
                userFirstName: auth.firstName,
                userLastName: auth.lastName,
                products: "",
                subtotal: "",
                total: "",
                payment_status: "A régler sur place",
                type: "réservation propriétaire",
            })
        )
    }

    console.log(auth);

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
                            <StyledForm onSubmit={handleSubmit}>
                                <h2 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Ajouter dates d'indisponibilités pour un bateau</h2>
                                <small>Choix du bateau</small>
                                <select defaultValue={""} required onChange={(e) => setBoatSelection(e.target.value)}>
                                    <option value="" disabled>Sélectionner</option>
                                    {infosBoats && infosBoats.map((item) => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                                {boatSelection === "" || loading === true ?
                                    <></>
                                    :
                                    <DateRangeComp
                                        handleChange={handleChange}
                                        disabledDates={disabledDates}
                                    />
                                }
                            </StyledForm>
                        </StyledCreateProduct>
                    </div>
                    <div>
                        <h2 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Dates d'indisponibilités</h2>
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
  width: 300px;
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