import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { PrimaryButton } from "../admin/CommonStyled";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SignatureCanvas from 'react-signature-canvas'
import ContractToPrint from "./ContractToPrint";
import JsPDF from 'jspdf';
import { useParams } from "react-router-dom";


const NewContract = () => {

    // const params = useParams();
    // const { list } = useSelector((state) => state.orders);
    const { contracts } = useSelector((state) => state.contracts);

    const [value, setValue] = useState("");
    const [picturesContract, setPicturesContract] = useState("");
    const [selectedContract, setSelectedContract] = useState(null);
    const [contractDetails, setContractDetails] = useState(null);
    const [signature, setSignature] = useState(null);
    const [signaturePresente, setSignaturePresente] = useState(false);
    // const [order, setOrder] = useState(null);


    const sigCanvas = useRef(null);
    const popupRef = useRef();

    useEffect(() => {
        if (selectedContract !== null) {
            const contract = contracts.find(item => item._id === selectedContract);
            setContractDetails(contract)
            setValue(contract.content);
        }

    }, [selectedContract])

    // useEffect(() => {
    //     if (params.id) {
    //         const order = list.find(item => item._id === params.id);
    //         setOrder(order);
    //     }
    // }, [params.id])

    const handlePicturesContract = (e) => {
        const files = e.target.files;
        const filesArray = Array.from(files);

        filesArray.forEach((file) => {
            TransformFileData(file);
        });
    };

    const TransformFileData = (file) => {
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPicturesContract((prev) => [...prev, reader.result]);
            };
        } else {
            setPicturesContract("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sigCanvas.current) {
            const dataUrl = sigCanvas.current.toDataURL();
            setSignature(dataUrl);
            popupRef.current.close();
        }
    }

    function handleOnEnd() {
        if (!sigCanvas.current.isEmpty()) {
            setSignaturePresente(true);
        }
    }

    const handleClear = () => {
        sigCanvas.current.clear()
    };

    const handleValidate = async () => {
        var doc = new JsPDF("p", "pt", "a4");
        var source = document.querySelector("#contract-to-print");
        var margins = [50, 0, 50, 0]; // top, right, bottom, left
        var options = {
            // Options pour la conversion HTML en PDF
            callback: function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF
                //          this allow the insertion of new lines after html
                doc.save("Test.pdf");
            },
            margin: margins,
        };
        doc.html(source, options);
    };



    return (
        <div className="newContract-container">
            <h2>Création d'un nouveau contrat</h2>
            <div>
                <small>Sélectionner un contrat :</small>
                <select defaultValue={""} required onChange={(e) => (setSelectedContract(e.target.value), setPicturesContract(''))}>
                    <option value="" disabled>Sélectionner</option>
                    {contracts && contracts.map((item) => (
                        <option key={item._id} value={item._id}>{item.title}</option>
                    ))}
                </select>
            </div>
            {contractDetails &&
                <div className="edit-contract" onSubmit={handleSubmit}>
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <small>Ajouter des photos</small>
                        <input
                            id="imgUpload"
                            accept="image/*"
                            type="file"
                            multiple
                            onChange={handlePicturesContract}
                        />
                    </div>
                    {picturesContract && picturesContract.map((item, index) => (
                        <div key={index} style={{ position: 'relative' }} className="pictures-edl">
                            <img
                                src={item}
                                alt="EDL"

                                onClick={() => {
                                    const newPicturesContract = [...picturesContract];
                                    newPicturesContract.splice(index, 1);
                                    setPicturesContract(newPicturesContract);
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.nextSibling.classList.add('remove-imageContract--visible');
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.nextSibling.classList.remove('remove-imageContract--visible');
                                }}
                            />
                            <div className="remove-imageContract">Supprimer</div>
                        </div>
                    ))}
                    {signature &&
                        <div>
                            <img style={{ maxWidth: '350px' }} src={signature} alt="Signature" />
                        </div>
                    }
                    <div className="actions-btn">
                        <Popup
                            ref={popupRef}
                            trigger={<PrimaryButton>Signer</PrimaryButton>}
                            modal
                            nested
                        >
                            {close => {
                                return (
                                    <div className="modal">
                                        <button className="close" onClick={close}>
                                            &times;
                                        </button>
                                        <div className="header"> Signature du contrat </div>
                                        <div className="content">
                                            <SignatureCanvas
                                                ref={sigCanvas}
                                                canvasProps={{ className: 'signature', height: 300, defaultValue: signature }}
                                                onEnd={handleOnEnd}
                                            />
                                        </div>
                                        <div className="actions">
                                            <PrimaryButton
                                                className="button"
                                                onClick={handleSubmit}
                                                disabled={!signaturePresente}
                                            >
                                                Valider
                                            </PrimaryButton>
                                            <PrimaryButton
                                                className="button"
                                                onClick={handleClear}
                                            >
                                                Retour
                                            </PrimaryButton>
                                            <PrimaryButton
                                                className="button"
                                                onClick={() => {
                                                    sigCanvas.current.clear();
                                                }}
                                            >
                                                Effacer
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                );
                            }}
                        </Popup>
                        <Popup
                            trigger={<PrimaryButton
                                disabled={!signature}
                                title={signature ? "" : "Veuillez signer le contrat pour valider"}>
                                Aperçu
                            </PrimaryButton>}
                            modal
                            nested
                        >
                            {close => (
                                <div className="modal">
                                    <button className="close" onClick={close}>
                                        &times;
                                    </button>
                                    <div className="header"> Création d'un nouveau contrat </div>
                                    <div className="content">
                                        <div id="contract-to-print">
                                            <ContractToPrint
                                                texte={value}
                                                signature={signature}
                                                picturesContract={picturesContract}
                                            // name={order.userFistName + " " + order.userLastName}
                                            />
                                        </div>
                                    </div>
                                    <div className="actions">
                                        <PrimaryButton
                                            className="button"
                                            onClick={() => {
                                                close();
                                            }}
                                        >
                                            Retour
                                        </PrimaryButton>
                                        <PrimaryButton
                                            onClick={handleValidate}>
                                            Valider
                                        </PrimaryButton>

                                    </div>
                                </div>
                            )}
                        </Popup>

                    </div>
                </div>
            }
        </div >
    )
}

export default NewContract;