import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { PrimaryButton } from "../admin/CommonStyled";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SignatureCanvas from 'react-signature-canvas'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


const NewContract = () => {

    const { contracts } = useSelector((state) => state.contracts);

    const [value, setValue] = useState("");
    const [picturesContract, setPicturesContract] = useState("");
    const [selectedContract, setSelectedContract] = useState(null);
    const [contractDetails, setContractDetails] = useState(null);
    const [signature, setSignature] = useState(null);
    const [signaturePresente, setSignaturePresente] = useState(false);

    const sigCanvas = useRef(null);
    const popupRef = useRef();

    useEffect(() => {
        if (selectedContract !== null) {
            const contract = contracts.find(item => item._id === selectedContract);
            setContractDetails(contract)
            setValue(contract.content);
        }

    }, [selectedContract])

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
        const pdfDoc = await PDFDocument.create();

        // Ajouter une page au document
        const page = pdfDoc.addPage();

        // Obtenir la taille de la page
        const { width, height } = page.getSize();

        // Ajouter du texte à la page
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 24;
        const text = value;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        page.drawText(text, {
            x: (width - textWidth) / 2,
            y: height - 50 - textHeight,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
        });

        console.log();

        // Ajouter les photos
        if (picturesContract) {
            for (let i = 0; i < picturesContract.length; i++) {
                const imageUrl = picturesContract[i];
                const image = await fetch(imageUrl).then((res) => res.arrayBuffer());
                const embeddedImage = await pdfDoc.embedJpg(image);
                const imageWidth = 280;
                const imageHeight = imageWidth * embeddedImage.height / embeddedImage.width;
                const x = (width / 2) * (i % 2) + (width - 2 * imageWidth) / 2;
                const y = height - 50 - textHeight - 10 - (Math.floor(i / 2) + 1) * (imageHeight + 10);
                page.drawImage(embeddedImage, {
                    x: x,
                    y: y,
                    width: imageWidth,
                    height: imageHeight,
                });
            }
        }


        // Ajouter la signature
        if (signature) {
            const signatureImage = await pdfDoc.embedPng(signature.split(',')[1]);
            const signatureWidth = 150;
            const signatureHeight = signatureWidth * signatureImage.height / signatureImage.width;
            page.drawImage(signatureImage, {
                x: (width - signatureWidth) / 2,
                y: height - 50 - textHeight - signatureHeight - 10,
                width: signatureWidth,
                height: signatureHeight,
            });
        }

        // Télécharger le document PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contrat.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                            trigger={<PrimaryButton>Aperçu</PrimaryButton>}
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
                                        <div dangerouslySetInnerHTML={{ __html: value }} />
                                        {picturesContract && picturesContract.map((item, index) => (
                                            <img key={index}
                                                src={item}
                                                alt="EDL"
                                                className="pictures-edl"
                                            />
                                        ))}
                                    </div>
                                    {signature &&
                                        <div>
                                            <img style={{ maxWidth: '350px' }} src={signature} alt="Signature" />
                                        </div>
                                    }
                                    <div className="actions">
                                        <PrimaryButton
                                            className="button"
                                            onClick={() => {
                                                close();
                                            }}
                                        >
                                            Retour
                                        </PrimaryButton>
                                    </div>
                                </div>
                            )}
                        </Popup>
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
                        <PrimaryButton disabled={!signature} onClick={() => handleValidate()} title={signature ? "" : "Veuillez signer le contrat pour valider"}>Valider</PrimaryButton>
                    </div>
                </div>
            }
        </div>
    )
}

export default NewContract;