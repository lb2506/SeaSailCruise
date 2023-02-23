import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PrimaryButton } from "../CommonStyled";
import { contractsEdit, contractsDelete } from "../../../slices/contractsSlice";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

let ContractsList = () => {

    const dispatch = useDispatch();
    const { contracts, editStatus, status } = useSelector((state) => state.contracts);

    const [isOpen, setIsOpen] = useState(false);
    const [contract, setContract] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [isOnEdit, setIsOnEdit] = useState(false);
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const [isOnDelete, setIsOnDelete] = useState(false);

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

    const handleDelete = async () => {
        setIsOnDelete(true);
    }

    useEffect(() => {
        editStatus === "success" &&
            setTimeout(() => {
                setIsOnEdit(false)
            }, 500)
    }, [editStatus])

    return (
        <div className="contract-container">
            {status === "success" ? (
                <>
                    <div>
                        {contracts && contracts.map(item => {
                            return (
                                <div key={item._id} onClick={() => { setIsOpen(true); setContract(item); setSelectedContract(item._id); setValue(item.content); setTitle(item.title); setIsOnEdit(false) }}>
                                    <h4 className='list-titles'>{item.title}</h4>
                                </div>
                            )
                        })}
                    </div>

                    {isOpen && contract &&
                        <div className="contract-content">
                            <div className="contract-header">
                                <h3>{contract.title}</h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <p onClick={() => { setIsOpen(false); setIsOnEdit(true) }}>Modifier</p>
                                    <Popup
                                        trigger={<p>Supprimer</p>}
                                        modal
                                        nested
                                    >
                                        {close => (
                                            <div className="modal">
                                                <button className="close" onClick={close}>
                                                    &times;
                                                </button>
                                                <div className="header">Supprimer le contrat</div>
                                                <div style={{ textAlign: 'center' }} className="content">
                                                    Cette action est irréversible
                                                </div>

                                                <div className="actions">
                                                    <PrimaryButton
                                                        className="button"
                                                        onClick={() => {
                                                            dispatch(contractsDelete({ id: selectedContract }));
                                                            setIsOpen(false);
                                                            close();
                                                        }}
                                                    >
                                                        Confirmer
                                                    </PrimaryButton>
                                                    <PrimaryButton
                                                        className="button"
                                                        onClick={() => {
                                                            close();
                                                        }}
                                                    >
                                                        Annuler
                                                    </PrimaryButton>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </div>
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
                                    {editStatus === "pending" ? "En cours..." : 'Mettre à jour'}
                                </PrimaryButton>
                            </form>
                        </div>
                    }
                </>
            ) : status === "pending" ? (
                <p>Chargement...</p>
            ) : (
                <p>Une erreur inattendue s'est produite. Merci de réessayer.</p>
            )}
        </div>
    )
}

export default ContractsList