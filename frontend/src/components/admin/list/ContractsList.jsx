import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PrimaryButton } from "../CommonStyled";
import { contractsEdit } from "../../../slices/contractsSlice";


let ContractsList = () => {

    const dispatch = useDispatch();
    const { editStatus } = useSelector((state) => state.contracts);


    const { list } = useSelector((state) => state.contracts)
    const [isOpen, setIsOpen] = useState(false);
    const [contract, setContract] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [isOnEdit, setIsOnEdit] = useState(false);
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(
            contractsEdit({
                id: selectedContract,
                title,
                content: value
            })
        )
    }

    return (
        <div className="contract-container">
            <div>
                {list && list.map(item => {
                    return (
                        <div key={item._id} onClick={() => (setIsOpen(true), setContract(item), setSelectedContract(item._id), setValue(item.content), setTitle(item.title), setIsOnEdit(false))}>
                            <h4 className='list-titles'>{item.title}</h4>
                        </div>
                    )
                })}
            </div>

            {isOpen && contract &&
                <div className="contract-content">
                    <div className="contract-header">
                        <h3>{contract.title}</h3>
                        <p onClick={() => (setIsOpen(false), setIsOnEdit(true))}>(Modifier le contrat)</p>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: contract.content }} />
                </div>
            }

            {isOnEdit && contract &&
                <div>
                    <form className="edit-contract" onSubmit={handleSubmit}>
                        <input className="contract-titleInput" type="text" placeholder="Titre du contrat" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <ReactQuill
                            theme="snow"
                            value={value}
                            onChange={setValue}
                        />

                        <PrimaryButton type="submit">
                            {editStatus === "pending" ? "En cours..." : "Mettre à jour"}
                        </PrimaryButton>
                    </form>
                </div>
            }

        </div>
    )
}

export default ContractsList