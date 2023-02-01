import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { ownersCreate } from "../../slices/usersSlice";

const CreateOwner = () => {

    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.products);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [isOpenSelection, setIsOpenSelection] = useState(false)
    const [boats, setBoats] = useState([])

    useEffect(() => {
        setBoats(items.map((item) => ({ name: item.name, isChecked: false, id: item._id })))
    }, [items])


    const handleClickSelection = (e) => {
        e.preventDefault()
        setIsOpenSelection(!isOpenSelection);
    }

    const handleChangeSelection = (e, opt) => {
        const boatsCopy = [...boats];
        const foundboats = boats?.find((o) => o.name === opt);

        if (!foundboats) {
            return;
        }
        foundboats.isChecked = e.currentTarget.checked;
        setBoats(boatsCopy)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(ownersCreate({ firstName, lastName, email, phoneNumber, boats }));
        window.location.reload();

    };

    return (

        <StyledCreateProduct>
            <StyledForm onSubmit={handleSubmit}>
                <small>Nom</small>
                <input
                    className='input'
                    type="text"
                    placeholder="Saisir..."
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <small>Prénom</small>
                <input
                    className='input'
                    type="text"
                    placeholder="Saisir..."
                    onChange={(e) => setFirstName(e.target.value)}
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
                <small>Bateau(x)</small>
                <div className="dropdown">
                    <div className={`menu ${isOpenSelection ? "open" : ""}`} >
                        {boats.map((boat) => (
                            <label key={boat.name}>
                                <input
                                    type="checkbox"
                                    checked={boat.isChecked}
                                    onChange={(e) => handleChangeSelection(e, boat.name)}
                                />
                                {boat.name}
                            </label>
                        ))}
                    </div>
                    <button onClick={handleClickSelection}>
                        {boats.some((o) => o.isChecked) ? (
                            boats
                                .filter((o) => o.isChecked)
                                .map((o, i) => (
                                    <span>{i !== 0 && ", "}{o.name}</span>
                                ))
                        ) : (
                            <span className="placeholder">
                                Sélectionner
                            </span>
                        )}
                    </button>
                </div>
                <button type="submit">Créer</button>
            </StyledForm>
        </StyledCreateProduct>
    );
}

export default CreateOwner;

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