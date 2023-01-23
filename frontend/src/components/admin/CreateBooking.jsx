import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import DateRangeComp from "../Details/DatePicker";
import { addDays } from 'date-fns'
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import axios from 'axios';
import { setHeaders, url } from '../../slices/api';
import { ordersCreate } from '../../slices/ordersSlice';


let CreateBooking = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.products);
    const { createStatus } = useSelector((state) => state.orders);
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection'
        }
    ])

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [boatSelection, setBoatSelection] = useState("");
    const [choiceGuide, setChoiceGuide] = useState("");
    const [product, setProduct] = useState([]);
    const [dateBooked, setDateBooked] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dureeLoc, setDureeLoc] = useState()
    const [reservationType, setReservationType] = useState("");


    let ONE_DAY = 1000 * 60 * 60 * 24;

    var date1_ms = range[0].startDate.getTime();
    var date2_ms = range[0].endDate.getTime();

    var difference_ms = Math.abs(date1_ms - date2_ms);

    useEffect(() => {
        setDureeLoc(Math.round(difference_ms / ONE_DAY) + 1)
    }, [range, ONE_DAY, difference_ms])


    const handleChange = (item) => {
        setRange([item.selection])
    }

    useEffect(() => {
        if (boatSelection !== "") {
            setLoading(true)
            async function fetchData() {
                try {
                    const res = await axios.get(`${url}/products/find/${boatSelection}`, setHeaders())
                    setProduct(res.data)
                    setDateBooked(res.data.reservation)
                } catch (err) {
                    console.log(err)
                }
                setLoading(false)
            }
            fetchData()

        }
    }, [boatSelection]);

    useEffect(() => {
        dateBooked && dateBooked.map((date) => {
            const dateStart = date.startLocation;
            const dateEnd = date.endLocation;

            // convertir dd//mm/yyyy pour trouver les dates entre les deux dates
            const dateStartSplit = dateStart.split("/");
            const dateEndSplit = dateEnd.split("/");
            const dateStartConvert = new Date(dateStartSplit[2], dateStartSplit[1] - 1, dateStartSplit[0]);
            const dateEndConvert = new Date(dateEndSplit[2], dateEndSplit[1] - 1, dateEndSplit[0]);

            // trouver les dates entre les deux dates
            const dateStartConvert_ms = dateStartConvert.getTime();
            const dateEndConvert_ms = dateEndConvert.getTime();

            var difference_ms = Math.abs(dateStartConvert_ms - dateEndConvert_ms);
            var difference_days = Math.round(difference_ms / ONE_DAY);

            for (let i = 0; i <= difference_days; i++) {
                disabledDates.push(new Date(dateStartConvert_ms + (i * ONE_DAY)))
            }

            setDisabledDates([...disabledDates])
        })

    }, [dateBooked])

    const line_items = [
        {
            id: product._id,
            name: product.name,
            dureeLocation: dureeLoc,
            startLocation: range[0].startDate.toLocaleDateString(),
            endLocation: range[0].endDate.toLocaleDateString(),
            choiceGuide: choiceGuide,
        }
    ];


    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(
            ordersCreate({
                userId: "",
                userFirstName: firstName,
                userLastName: lastName,
                products: line_items,
                subtotal: product.price * dureeLoc,
                total: product.price * dureeLoc,
                payment_status: "A régler sur place",
                type: reservationType,
            })
        )
    }

    return (
        <StyledCreateProduct>
            <StyledForm onSubmit={handleSubmit}>
                <small>Méthode de réservation</small>
                <select className='select' onChange={(e) => (setReservationType(e.target.value))} defaultValue={""} required>
                    <option value="" disabled >Sélectionner</option>
                    <option value="Téléphone">Téléphone</option>
                    <option value="En direct">En direct</option>
                    <option value="Autre">Autre</option>
                </select>
                <small>Prénom</small>
                <input
                    className='input'
                    type="text"
                    placeholder="Saisir..."
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <small>Nom</small>
                <input
                    className='input'
                    type="text"
                    placeholder="Saisir..."
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <small>Email</small>
                <input
                    className='input'
                    type="text"
                    placeholder="Saisir..."
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <small>Numéro de téléphone</small>
                <input
                    className='input'
                    type="text"
                    placeholder="Saisir..."
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                <small>Choix du bateau</small>
                <select className='select' onChange={(e) => { setDateBooked([]); setDisabledDates([]); setBoatSelection(e.target.value) }} defaultValue={""} required>
                    <option value="" disabled >Sélectionner</option>
                    {items.map((item) => (
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
                {product.guide === "Skipper optionnel" ?
                    <div className="inputOptions-group">
                        <div>
                            <input type="radio" value="Avec Skipper" name="option" onChange={() => setChoiceGuide('Avec skipper')} /> Avec Skipper
                        </div>
                        <div>
                            <input type="radio" value="Bateau seul" name="option" onChange={() => setChoiceGuide('Bateau seul')} /> Bateau seul
                        </div>
                    </div>
                    :
                    <div className="inputOptions-group">
                        <div>
                            <input type="radio" value="Bateau seul" name="option" onChange={() => setChoiceGuide('Bateau seul')} /> Bateau seul
                        </div>
                    </div>
                }
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Informations</h3>
                    <div className='guide-infos'>
                        <h4>Montant de la location</h4>
                        <h4>{boatSelection !== "" ? product.price?.toLocaleString() * dureeLoc : "0"} €</h4>

                    </div>
                    {choiceGuide === 'Avec skipper' ?
                        <>
                            <div className="guide-infos">
                                <h4>Supplément skipper</h4>
                                <h4>{dureeLoc * 250} €</h4>
                            </div>
                            <p className="text-muted">À regler sur place</p>
                        </>
                        :
                        null
                    }
                </div>

                {choiceGuide === "" || firstName === "" || lastName === "" || email === "" || phoneNumber === "" || boatSelection === "" ?
                    <button className="product-add-to-cart" style={{ backgroundColor: '#8498d3', marginTop: '1rem' }} disabled>Veuillez remplir tous les champs</button>
                    :
                    <PrimaryButton type="submit">
                        {createStatus === "pending" ? "En cours..." : "Valider"}
                    </PrimaryButton>
                }
            </StyledForm>
        </StyledCreateProduct>
    )
}
export default CreateBooking;

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