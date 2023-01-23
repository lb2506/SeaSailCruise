import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PrimaryButton } from "./CommonStyled";
import { contractsCreate } from "../../slices/contractsSlice";
import { useNavigate } from "react-router-dom";


let CreateContract = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { createStatus } = useSelector((state) => state.contracts);
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(
            contractsCreate({
                title,
                content: value
            })
        )
    }

    createStatus === "success" &&
        setTimeout(() => {
            navigate("/admin/contract")
        }, 1000)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input className="contract-titleInput" type="text" placeholder="Titre du contrat" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                />

                <PrimaryButton type="submit">
                    {createStatus === "pending" ? "En cours..." : "Ajouter"}
                </PrimaryButton>
            </form>
        </div>
    )
}

export default CreateContract