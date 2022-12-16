import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { setHeaders, url } from "../../slices/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";
import Slider from './Slider';
import DateRangeComp from "./DatePicker";

import { addDays } from 'date-fns'

const Product = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);

    const [choiceGuide, setChoiceGuide] = useState("");

    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection'
        }
    ])

    var ONE_DAY = 1000 * 60 * 60 * 24;

    var date1_ms = range[0].startDate.getTime();
    var date2_ms = range[0].endDate.getTime();

    var difference_ms = Math.abs(date1_ms - date2_ms);

    const [locStart, setLocStart] = useState();
    const [locEnd, setLocEnd] = useState();
    const [dureeLoc, setDureeLoc] = useState()

    const handleChange = (item) => {
        setRange([item.selection])
    }

    useEffect(() => {
        setLocStart(new Date(date1_ms).toLocaleDateString("fr"))
        setLocEnd(new Date(date2_ms).toLocaleDateString("fr"))
        setDureeLoc(Math.round(difference_ms / ONE_DAY) + 1)
    }, [range])

    useEffect(() => {
        setLoading(true)
        async function fetchData() {
            try {
                const res = await axios.get(`${url}/products/find/${params.id}`, setHeaders())

                setProduct(res.data);
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }
        fetchData()
    }, []);

    const handleAddToCart = ({ product, dureeLoc, locStart, locEnd, choiceGuide }) => {
        dispatch(addToCart({ product, dureeLoc, locStart, locEnd, choiceGuide }))
        navigate("/cart")
    }

    return (
        <StyledProduct>
            <ImageContainer>
                {loading
                    ?
                    <p>Chargement...</p>
                    :
                    <Slider product={product} />
                }
            </ImageContainer>
            <ContainerGlobal>
                <ProductContainer>
                    {loading
                        ?
                        <p>Chargement...</p>
                        :
                        <>
                            <ProductDetails>
                                <div>
                                    <h3>{product.name}</h3>
                                    <p style={{ marginTop: '1rem', marginBottom: '1rem' }}>{product.localisation}</p>
                                </div>
                                <div>
                                    <ul className="caracteristics">
                                        <li>{product.tailleMax} personnes</li>
                                        <li>{product.horaireStart} / {product.horaireEnd}</li>
                                        <li>{product.power} cv</li>
                                        <li>{product.longueur} mètres</li>
                                        <li>{product.guide}</li>
                                    </ul>
                                </div>
                                <div className="about">
                                    <h4>À propos de {product.name} - {product.year}</h4>
                                    <p>{product.desc}</p>
                                </div>
                                <div className="details-global">
                                    <h4>Détails</h4>
                                    <ul className="details">
                                        {product.guide === 'Skipper optionnel' ?
                                            <li style={{ marginBottom: '2rem', marginTop: '2rem' }}>Type de location : <span className="bold">Bateau seul</span> ou <span className="bold">Avec skipper</span></li>
                                            :
                                            <li style={{ marginBottom: '2rem', marginTop: '2rem' }}>Type de location : <span className="bold">Bateau seul</span></li>
                                        }
                                        <li style={{ marginBottom: '1rem', marginTop: '1rem' }}>Horaires indicatives de début et fin de location : <span className="bold">{product.horaireStart}</span> / <span className="bold">{product.horaireEnd}</span></li>
                                        <li className="column">
                                            <p>Modèle : <span className="bold">{product.name}</span></p>
                                            <p>Armement : <span className="bold">{product.armement}</span></p>
                                        </li>
                                        <li className="column">
                                            <p>Emplacement : <span className="bold">{product.emplacement}</span></p>
                                            <p>Longueur (m) : <span className="bold">{product.longueur}</span></p>
                                        </li>
                                        <li className="column">
                                            <p>Largeur (m) : <span className="bold">{product.largeur}</span></p>
                                            <p>Tirant d'eau (m) : <span className="bold">{product.tirant_eau}</span></p>
                                        </li>
                                        <li className="column">
                                            <p>Année de construction : <span className="bold">{product.year}</span></p>
                                            <p>Capacité autorisée (m) : <span className="bold">{product.tailleMax}</span></p>
                                        </li>
                                        <li className="column">
                                            <p>Puissance : <span className="bold">{product.power}cv</span></p>
                                            <p>Type de moteur: <span className="bold">{product.type_moteur}</span></p>
                                        </li>
                                        <li className="column">
                                            <p>Nombre de moteurs : <span className="bold">{product.nbr_moteur}</span></p>
                                            <p>Type de carburant : <span className="bold">{product.carburant}</span></p>
                                        </li>
                                        <li className="column">
                                            <p>Caution : <span className="bold">{product.caution} €</span> (gérée en direct par le propriétaire)</p>
                                            <p>Conditions d'annulation : <span className="bold">{product.annulation}</span></p>
                                        </li>
                                    </ul>
                                    <div>
                                        <p style={{ marginTop: '1rem' }}>Utilisations</p>
                                        <ul className="equipements">
                                            <li className="column">
                                                {product.utilisation && product.utilisation.length > 0 &&
                                                    product.utilisation.map((item, key) => (
                                                        item.isChecked &&
                                                        <p key={key} className="utilisation">{item.name}</p>
                                                    ))
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="equipements-global">
                                    <h4>Équipements</h4>
                                    <div>
                                        <h5>Navigation</h5>
                                        <ul className="equipements">
                                            <li className="column">
                                                {product.navigation && product.navigation.length > 0 &&
                                                    product.navigation.map((item, key) => (
                                                        item.isChecked &&
                                                        <p key={key}>{item.name}</p>
                                                    ))
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5>Sanitaire</h5>
                                        <ul className="equipements">
                                            <li className="column">
                                                {product.sanitaire && product.sanitaire.length > 0 &&
                                                    product.sanitaire.map((item, key) => (
                                                        item.isChecked &&
                                                        <p key={key}>{item.name}</p>
                                                    ))
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5>Confort</h5>
                                        <ul className="equipements">
                                            <li className="column">
                                                {product.confort && product.confort.length > 0 &&
                                                    product.confort.map((item, key) => (
                                                        item.isChecked &&
                                                        <p key={key}>{item.name}</p>
                                                    ))
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5>Loisir</h5>
                                        <ul className="equipements">
                                            <li className="column">
                                                {product.loisir && product.loisir.length > 0 &&
                                                    product.loisir.map((item, key) => (
                                                        item.isChecked &&
                                                        <p key={key}>{item.name}</p>
                                                    ))
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5>Cuisine</h5>
                                        <ul className="equipements">
                                            <li className="column">
                                                {product.cuisine && product.cuisine.length > 0 &&
                                                    product.cuisine.map((item, key) => (
                                                        item.isChecked &&
                                                        <p key={key}>{item.name}</p>
                                                    ))
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    {product.energie && product.energie.length > 0 &&
                                        <div>
                                            <h5>Énergie</h5>
                                            <ul className="equipements">
                                                <li className="column">
                                                    {product.energie && product.energie.length > 0 &&
                                                        product.energie.map((item, key) => (
                                                            item.isChecked &&
                                                            <p key={key}>{item.name}</p>
                                                        ))
                                                    }
                                                </li>
                                            </ul>
                                        </div>
                                    }
                                </div>
                                <div className="options-global">
                                    <h4 style={{ marginBottom: '1rem' }}>Options</h4>
                                    <ul className="equipements">
                                        <li className="column">
                                            {product.options && product.options.length > 0 &&
                                                product.options.map((item, key) => (
                                                    item.isChecked &&
                                                    <div key={key} className="options">
                                                        <p>{item.name}</p>
                                                        <p><span className="bold">{item.prix} €</span> / location</p>
                                                    </div>
                                                ))
                                            }
                                        </li>
                                    </ul>
                                </div>
                            </ProductDetails>
                        </>
                    }
                </ProductContainer>
                <RentContainer>
                    <p style={{ textAlign: 'center', marginBottom: '20px' }}>À partir de <span style={{ fontWeight: 'bold', fontSize: '24px' }}>{product.price?.toLocaleString()} €</span></p>
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
                    <div style={{ marginBottom: '1rem' }}>
                        <p>Choix des dates</p>
                        <DateRangeComp handleChange={handleChange} />
                        <p>Durée sélectionnée : {dureeLoc === 1 ? `${dureeLoc} jour` : `${dureeLoc} jours`}</p>
                    </div>
                    <p>Type de location</p>
                    <form>
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
                    </form>
                    <div className="btn-group">
                        {choiceGuide === "" ?
                            <button className="product-add-to-cart" style={{ backgroundColor: '#8498d3' }} disabled>Sélectionnez une option</button>
                            :
                            <button className="product-add-to-cart" onClick={() => handleAddToCart({ product, dureeLoc, locStart, locEnd, choiceGuide })}>Réserver</button>
                        }
                        <p>- Ou -</p>
                        <button className="product-contact">Contacter</button>
                        <p>✓ Sans engagement</p>
                        <p>Voir la grille tarifaire</p>
                    </div>
                </RentContainer>
            </ContainerGlobal>
        </StyledProduct>
    )
}

export default Product;

const StyledProduct = styled.div`
   
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const ContainerGlobal = styled.div`

    display: flex;
    width: 100%;
    height: auto;
    max-width: 1140px;
    margin: 0 auto;
    margin-top: 50px;
`

const RentContainer = styled.div`

    padding: 24px;
    margin-left: 50px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 5px;
    min-width: 348px;
    height: fit-content;
    position: sticky;
    top: 100px
`

const ProductContainer = styled.div`

    display: flex;
    border-radius: 5px;
    width: 100%;
    background: white
`;

const ImageContainer = styled.div`
    flex: 1;
    display: flex;
    overflow-x: scroll;
    img{
        width: 100%;
        height: 350px;
        margin-top: 10px;
    }

    img:not(:last-child){
        margin-right: 10px;
    }
`;

const ProductDetails = styled.div`
    flex: 2;
    h3{
        font-size: 35px;
    }
    p span{
        font-weigth: bold;
    }
`;