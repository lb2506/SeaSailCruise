import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import { productsCreate } from "../../slices/productsSlice";

const CreateProduct = () => {

  const dispatch = useDispatch();
  const { createStatus } = useSelector((state) => state.products);

  const [productImg, setProductImg] = useState("");
  const [productCarousel1, setProductCarousel1] = useState("");
  const [productCarousel2, setProductCarousel2] = useState("");
  const [productCarousel3, setProductCarousel3] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [power, setPower] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [tailleMax, setTailleMax] = useState("");
  const [longueur, setLongueur] = useState("");
  const [largeur, setLargeur] = useState("");
  const [tirant_eau, setTirant_eau] = useState("");
  const [guide, setGuide] = useState("");
  const [horaireStart, setHoraireStart] = useState("");
  const [horaireEnd, setHoraireEnd] = useState("");
  const [emplacement, setEmplacement] = useState("");
  const [armement, setArmement] = useState("");
  const [type_moteur, setType_moteur] = useState("");
  const [nbr_moteur, setNbr_moteur] = useState("");
  const [carburant, setCarburant] = useState("");
  const [caution, setCaution] = useState("");
  const [annulation, setAnnulation] = useState("");

  const [isOpenNavigation, setIsOpenNavigation] = useState(false)
  const [navigation, setNavigation] = useState([
    { name: "GPS", isChecked: false },
    { name: "Sondeur", isChecked: false },
    { name: "Guindeau électrique", isChecked: false },
    { name: "VHF", isChecked: false },
    { name: "Speedomètre", isChecked: false },
    { name: "Compas", isChecked: false },
    { name: "Sonar", isChecked: false },
    { name: "Lazy Jacks", isChecked: false },
    { name: "Safety Harness", isChecked: false },
    { name: "Lazy Bag", isChecked: false },
    { name: "Anemometer", isChecked: false },
  ])

  const handleClickNavigation = (e) => {
    e.preventDefault()
    setIsOpenNavigation(!isOpenNavigation);
  }

  const handleChangeNavigation = (e, nav) => {
    const navigationCopy = [...navigation];
    const foundNavigation = navigation?.find((n) => n.name === nav);

    if (!foundNavigation) {
      return;
    }
    foundNavigation.isChecked = e.currentTarget.checked;
    setNavigation(navigationCopy)
  }

  const [isOpenSanitaire, setIsOpenSanitaire] = useState(false)
  const [sanitaire, setSanitaire] = useState([
    { name: "WC", isChecked: false },
    { name: "Eau douche", isChecked: false },
    { name: "Salle d'eau", isChecked: false },


  ])

  const handleClickSanitaire = (e) => {
    e.preventDefault()
    setIsOpenSanitaire(!isOpenSanitaire);
  }

  const handleChangeSanitaire = (e, san) => {
    const sanitaireCopy = [...sanitaire];
    const foundSanitaire = sanitaire?.find((s) => s.name === san);

    if (!foundSanitaire) {
      return;
    }
    foundSanitaire.isChecked = e.currentTarget.checked;
    setSanitaire(sanitaireCopy)
  }

  const [isOpenConfort, setIsOpenConfort] = useState(false)
  const [confort, setConfort] = useState([
    { name: "Table", isChecked: false },
    { name: "Bain de soleil", isChecked: false },
    { name: "Connexion Bluetooth", isChecked: false },
    { name: "Douche de pont", isChecked: false },
    { name: "Pont arrière", isChecked: false },
    { name: "Convertible square", isChecked: false },
    { name: "Teak cockpit", isChecked: false },
    { name: "Sprayhood", isChecked: false },
  ])

  const handleClickConfort = (e) => {
    e.preventDefault()
    setIsOpenConfort(!isOpenConfort);
  }

  const handleChangeConfort = (e, con) => {
    const confortCopy = [...confort];
    const foundConfort = confort?.find((c) => c.name === con);

    if (!foundConfort) {
      return;
    }
    foundConfort.isChecked = e.currentTarget.checked;
    setConfort(confortCopy)
  }

  const [isOpenLoisir, setIsOpenLoisir] = useState(false)
  const [loisir, setLoisir] = useState([
    { name: "Echelle", isChecked: false },
    { name: "Haut-parleurs extérieurs", isChecked: false },
    { name: "Wakeboard", isChecked: false },
    { name: "Bouée tractée", isChecked: false },
  ])

  const handleClickLoisir = (e) => {
    e.preventDefault()
    setIsOpenLoisir(!isOpenLoisir);
  }

  const handleChangeLoisir = (e, loi) => {
    const loisirCopy = [...loisir];
    const foundLoisir = loisir?.find((l) => l.name === loi);

    if (!foundLoisir) {
      return;
    }
    foundLoisir.isChecked = e.currentTarget.checked;
    setLoisir(loisirCopy)
  }

  const [isOpenCuisine, setIsOpenCuisine] = useState(false)
  const [cuisine, setCuisine] = useState([
    { name: "Réfrigérateur", isChecked: false },
    { name: "Evier", isChecked: false },
    { name: "Plaque de cuisson", isChecked: false },
    { name: "Plancha", isChecked: false },
    { name: "Plaque de gaz", isChecked: false },


  ])

  const handleClickCuisine = (e) => {
    e.preventDefault()
    setIsOpenCuisine(!isOpenCuisine);
  }

  const handleChangeCuisine = (e, cui) => {
    const cuisineCopy = [...cuisine];
    const foundCuisine = cuisine?.find((c) => c.name === cui);

    if (!foundCuisine) {
      return;
    }
    foundCuisine.isChecked = e.currentTarget.checked;
    setCuisine(cuisineCopy)
  }

  const [isOpenEnergie, setIsOpenEnergie] = useState(false)
  const [energie, setEnergie] = useState([
    { name: "Prise USB", isChecked: false },
    { name: "Prise 220V", isChecked: false },

  ])

  const handleClickEnergie = (e) => {
    e.preventDefault()
    setIsOpenEnergie(!isOpenEnergie);
  }

  const handleChangeEnergie = (e, eng) => {
    const energieCopy = [...energie];
    const foundEnergie = energie?.find((e) => e.name === eng);

    if (!foundEnergie) {
      return;
    }
    foundEnergie.isChecked = e.currentTarget.checked;
    setEnergie(energieCopy)
  }

  const [isOpenUtilisation, setIsOpenUtilisation] = useState(false)
  const [utilisation, setUtilisation] = useState([
    { name: "Journée d'excursion", isChecked: false },
    { name: "Croisière", isChecked: false },
    { name: "Sport nautique", isChecked: false },
    { name: "Pêche", isChecked: false },
  ])

  const handleClickUtilisation = (e) => {
    e.preventDefault()
    setIsOpenUtilisation(!isOpenUtilisation);
  }

  const handleChangeUtilisation = (e, uti) => {
    const utilisationCopy = [...utilisation];
    const foundUtilisation = utilisation?.find((u) => u.name === uti);

    if (!foundUtilisation) {
      return;
    }
    foundUtilisation.isChecked = e.currentTarget.checked;
    setUtilisation(utilisationCopy)
  }

  const [isOpenOptions, setIsOpenOptions] = useState(false)
  const [options, setOptions] = useState([
    { name: "Wakeboard", prix: "45", isChecked: false },
    { name: "Ski nautique", prix: "45", isChecked: false },
    { name: "Bouée", prix: "30", isChecked: false },
  ])

  const handleClickOptions = (e) => {
    e.preventDefault()
    setIsOpenOptions(!isOpenOptions);
  }

  const handleChangeOptions = (e, opt) => {
    const optionsCopy = [...options];
    const foundOptions = options?.find((o) => o.name === opt);

    if (!foundOptions) {
      return;
    }
    foundOptions.isChecked = e.currentTarget.checked;
    setOptions(optionsCopy)
  }


  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];

    TransformFileData(file);
  };

  const TransformFileData = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
      };
    } else {
      setProductImg("");
    }
  };

  const handleProductCarousel1 = (e) => {
    const file = e.target.files[0];

    TransformFileData1(file);
  };

  const TransformFileData1 = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductCarousel1(reader.result);
      };
    } else {
      setProductCarousel1("");
    }
  };


  const handleProductCarousel2 = (e) => {
    const file = e.target.files[0];

    TransformFileData2(file);
  };

  const TransformFileData2 = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductCarousel2(reader.result);
      };
    } else {
      setProductCarousel2("");
    }
  };


  const handleProductCarousel3 = (e) => {
    const file = e.target.files[0];

    TransformFileData3(file);
  };

  const TransformFileData3 = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductCarousel3(reader.result);
      };
    } else {
      setProductCarousel3("");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(
      productsCreate({
        name,
        year,
        localisation,
        tailleMax,
        emplacement,
        horaireStart,
        horaireEnd,
        longueur,
        largeur,
        tirant_eau,
        type_moteur,
        nbr_moteur,
        carburant,
        caution,
        annulation,
        utilisation,
        options,
        armement,
        guide,
        power,
        navigation,
        sanitaire,
        confort,
        loisir,
        cuisine,
        energie,
        desc,
        price,
        image: productImg,
        carousel1: productCarousel1,
        carousel2: productCarousel2,
        carousel3: productCarousel3,
        reservation: []
      })
    );
  };

  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <small>Image principale du bateau (page d'accueil)</small>
        <input
          id="imgUpload"
          accept="image/*"
          type="file"
          onChange={handleProductImageUpload}
          required
        />
        <small>Images carousel (3 obligatoires pour le moment)</small>
        <input
          id="imgUpload"
          accept="image/*"
          type="file"
          onChange={handleProductCarousel1}
        />
        <input
          id="imgUpload"
          accept="image/*"
          type="file"
          onChange={handleProductCarousel2}
        />
        <input
          id="imgUpload"
          accept="image/*"
          type="file"
          onChange={handleProductCarousel3}
        />
        <small>Modèle</small>
        <input
          type="text"
          placeholder="Saisir..."
          onChange={(e) => setName(e.target.value)}
          required
        />
        <small>Année de construction</small>
        <input
          type="text"
          placeholder="Saisir..."
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <small>Localisation du bateau</small>
        <input
          type="text"
          placeholder="Saisir..."
          onChange={(e) => setLocalisation(e.target.value)}
          required
        />
        <small>Puissance du moteur (en cv)</small>
        <input
          type="text"
          placeholder="Saisir"
          onChange={(e) => setPower(e.target.value)}
          required
        />
        <small>Capacité max. (en passagers)</small>
        <input
          type="text"
          placeholder="Saisir"
          onChange={(e) => setTailleMax(e.target.value)}
          required
        />
        <small>Longueur du bateau (en m)</small>
        <input
          type="text"
          placeholder="Saisir..."
          onChange={(e) => setLongueur(e.target.value)}
          required
        />
        <small>Largeur du bateau (en m)</small>
        <input
          type="text"
          placeholder="Saisir..."
          onChange={(e) => setLargeur(e.target.value)}
          required
        />
        <small>Tirant d'eau du bateau (en m)</small>
        <input
          type="text"
          placeholder="Saisir..."
          onChange={(e) => setTirant_eau(e.target.value)}
          required
        />
        <small>Type du moteur</small>
        <select onChange={(e) => setType_moteur(e.target.value)} defaultValue={""} required>
          <option value="" disabled >Sélectionner</option>
          <option value="4 temps">4 temps</option>
          <option value="2 temps">2 temps</option>
        </select>
        <small>Nombre de moteurs</small>
        <select onChange={(e) => setNbr_moteur(e.target.value)} defaultValue={""} required>
          <option value="" disabled >Sélectionner</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <small>Carburant</small>
        <select onChange={(e) => setCarburant(e.target.value)} defaultValue={""} required>
          <option value="" disabled >Sélectionner</option>
          <option value="Sans plomb">Sans plomb</option>
          <option value="Gasoil">Gasoil</option>
        </select>
        <small>Caution (en €)</small>
        <input
          type="text"
          placeholder="Saisir..."
          onChange={(e) => setCaution(e.target.value)}
          required
        />
        <small>Conditions d'annulation</small>
        <select onChange={(e) => setAnnulation(e.target.value)} defaultValue={""} required>
          <option value="" disabled >Sélectionner</option>
          <option value="Souple">Souple</option>
          <option value="Rigide">Rigide</option>
        </select>
        <small>Armement</small>
        <select onChange={(e) => setArmement(e.target.value)} defaultValue={""} required>
          <option value="" disabled >Sélectionner</option>
          <option value="Côtier">Côtier</option>
        </select>
        <small>Accompagnement</small>
        <select onChange={(e) => setGuide(e.target.value)} defaultValue={""} required>
          <option value="" disabled>Sélectionner</option>
          <option value="Bateau seul">Bateau seul</option>
          <option value="Skipper optionnel">Skipper optionnel</option>
        </select>
        <small>Emplacemement</small>
        <select onChange={(e) => setEmplacement(e.target.value)} defaultValue={""} required>
          <option value="" disabled>Sélectionner</option>
          <option value="Port">Port</option>
        </select>
        <small>Prix à partir de ... (en €)</small>
        <input
          type="number"
          placeholder="Saisir..."
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <small>Horaires indicatives de début de location</small>
        <input
          type="time"
          min="10:00"
          max="20:00"
          onChange={(e) => setHoraireStart(e.target.value)}
          required
        />
        <small>Horaires indicatives de fin de location</small>
        <input
          type="time"
          min="10:00"
          max="20:00"
          onChange={(e) => setHoraireEnd(e.target.value)}
          required
        />
        <p>Equipements</p>
        <small>Navigation</small>
        <div className="dropdown">
          <div className={`menu ${isOpenNavigation ? "open" : ""}`} >
            {navigation.map((nav) => (
              <label key={nav.name}>
                <input type="checkbox" onClick={(e) => handleChangeNavigation(e, nav.name)} />
                <span>{nav.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickNavigation}>
            {navigation.some((n) => n.isChecked) ? (
              navigation
                .filter((n) => n.isChecked)
                .map((n, i) => (
                  <span>{i !== 0 && ", "}{n.name}</span>
                ))
            ) : (
              <span className="placeholder">
                Sélectionner
              </span>
            )}
          </button>
        </div>
        <small>Sanitaire</small>
        <div className="dropdown">
          <div className={`menu ${isOpenSanitaire ? "open" : ""}`} >
            {sanitaire.map((san) => (
              <label key={san.name}>
                <input type="checkbox" onClick={(e) => handleChangeSanitaire(e, san.name)} />
                <span>{san.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickSanitaire}>
            {sanitaire.some((s) => s.isChecked) ? (
              sanitaire
                .filter((s) => s.isChecked)
                .map((s, i) => (
                  <span>{i !== 0 && ", "}{s.name}</span>
                ))
            ) : (
              <span className="placeholder">
                Sélectionner
              </span>
            )}
          </button>
        </div>
        <small>Confort</small>
        <div className="dropdown">
          <div className={`menu ${isOpenConfort ? "open" : ""}`} >
            {confort.map((con) => (
              <label key={con.name}>
                <input type="checkbox" onClick={(e) => handleChangeConfort(e, con.name)} />
                <span>{con.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickConfort}>
            {confort.some((c) => c.isChecked) ? (
              confort
                .filter((c) => c.isChecked)
                .map((c, i) => (
                  <span>{i !== 0 && ", "}{c.name}</span>
                ))
            ) : (
              <span className="placeholder">
                Sélectionner
              </span>
            )}
          </button>
        </div>
        <small>Loisir</small>
        <div className="dropdown">
          <div className={`menu ${isOpenLoisir ? "open" : ""}`} >
            {loisir.map((loi) => (
              <label key={loi.name}>
                <input type="checkbox" onClick={(e) => handleChangeLoisir(e, loi.name)} />
                <span>{loi.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickLoisir}>
            {loisir.some((l) => l.isChecked) ? (
              loisir
                .filter((l) => l.isChecked)
                .map((l, i) => (
                  <span>{i !== 0 && ", "}{l.name}</span>
                ))
            ) : (
              <span className="placeholder">
                Sélectionner
              </span>
            )}
          </button>
        </div>
        <small>Cuisine</small>
        <div className="dropdown">
          <div className={`menu ${isOpenCuisine ? "open" : ""}`} >
            {cuisine.map((cui) => (
              <label key={cui.name}>
                <input type="checkbox" onClick={(e) => handleChangeCuisine(e, cui.name)} />
                <span>{cui.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickCuisine}>
            {cuisine.some((c) => c.isChecked) ? (
              cuisine
                .filter((c) => c.isChecked)
                .map((c, i) => (
                  <span>{i !== 0 && ", "}{c.name}</span>
                ))
            ) : (
              <span className="placeholder">
                Sélectionner
              </span>
            )}
          </button>
        </div>
        <small>Energie</small>
        <div className="dropdown">
          <div className={`menu ${isOpenEnergie ? "open" : ""}`} >
            {energie.map((eng) => (
              <label key={eng.name}>
                <input type="checkbox" onClick={(e) => handleChangeEnergie(e, eng.name)} />
                <span>{eng.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickEnergie}>
            {energie.some((e) => e.isChecked) ? (
              energie
                .filter((e) => e.isChecked)
                .map((e, i) => (
                  <span>{i !== 0 && ", "}{e.name}</span>
                ))
            ) : (
              <span className="placeholder">
                Sélectionner
              </span>
            )}
          </button>
        </div>
        <small>Utilisation</small>
        <div className="dropdown">
          <div className={`menu ${isOpenUtilisation ? "open" : ""}`} >
            {utilisation.map((uti) => (
              <label key={uti.name}>
                <input type="checkbox" onClick={(e) => handleChangeUtilisation(e, uti.name)} />
                <span>{uti.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickUtilisation}>
            {utilisation.some((u) => u.isChecked) ? (
              utilisation
                .filter((u) => u.isChecked)
                .map((u, i) => (
                  <span>{i !== 0 && ", "}{u.name}</span>
                ))
            ) : (
              <span className="placeholder">
                Sélectionner
              </span>
            )}
          </button>
        </div>
        <small>Options</small>
        <div className="dropdown">
          <div className={`menu ${isOpenOptions ? "open" : ""}`} >
            {options.map((opt) => (
              <label key={opt.name}>
                <input type="checkbox" onClick={(e) => handleChangeOptions(e, opt.name)} />
                <span>{opt.name}</span> - <span>{opt.prix} €</span>
              </label>
            ))}
          </div>
          <button onClick={handleClickOptions}>
            {options.some((o) => o.isChecked) ? (
              options
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
        <textarea
          placeholder="A propos du bateau"
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <PrimaryButton type="submit">
          {createStatus === "pending" ? "En cours..." : "Valider"}
        </PrimaryButton>
      </StyledForm>
      <ImagePreview>
        {productImg ? (
          <>
            <img src={productImg} alt="boat" />
          </>
        ) : (
          <p>L'aperçu de l'image apparaîtra ici !</p>
        )}
      </ImagePreview>
    </StyledCreateProduct>
  );
};

export default CreateProduct;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-top: 2rem;

  select,
  input {
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

const ImagePreview = styled.div`
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 600px;
  max-height: 600px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(78, 78, 78);

  img {
    max-width: 100%;
    min-width: 80%;
  }
`;
