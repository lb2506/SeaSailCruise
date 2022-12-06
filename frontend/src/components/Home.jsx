import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { addToCart } from "../slices/cartSlice";

import logoWhite from "../assets/images/logoWhite.png";

const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  
  return (
    <div className="global-container">
      <div className="home-container">
        {status === "success" ? (
          <>
            
            <div className="left-cln">
              <div className="card">
                <div style={{width: "100%", display:"flex", justifyContent:'center'}}>
                  <img src={logoWhite} alt='logo' />
                </div>
                <h2>Locations</h2>
                <p>Sea Sail & Cruise vous présente une flotte diversifiée pour répondre à tous vos besoins, du bateau à moteur de 5m au voilier de 12m au départ des ports de Royan, Meschers et la Palmyre.<br/><br/>
                  Afin de rendre votre expérience nautique la plus agréable possible nous vous proposons en option un service de skipper, la location de matériel de sport nautique et également la possibilité d’embarquer des paniers repas pour votre pique-nique en mer.</p>

              </div>

            </div>
            <div className="products">
              {data &&
                data?.map((product) => (
                  <div key={product._id} className="product">
                    <Link to ={`/product/${product._id}`}>
                      <div className="img-ctn">
                        <img src={product.image.url} alt={product.name} />
                        <div className="price-ctn">A partir de<br/><span>{(product.price).toLocaleString()} €</span></div>
                      </div>
                    
                    <div className="infos-ctn">
                      <div className="details-container">
                        <h3>{product.name}<span  className="dotDivider" style={{marginLeft: 5, marginRight: 5}}>●</span><span>{product.year}</span></h3>
                        <p>{product.localisation}</p>
                        <div className="details-infos">
                          <span>{product.guide}</span><span className="dotDivider">●</span><span>{product.longueur} m</span><span className="dotDivider">●</span><span>{product.tailleMax} pers.</span><span className="dotDivider">●</span><span>{product.power} CV</span>
                        </div>
                      </div>
                      {/* <button onClick={() => handleAddToCart(product)}>
                        Ajouter au panier
                      </button> */}
                    </div>
                    </Link>
                  </div>
                ))}
            </div>
          </>
        ) : status === "pending" ? (
          <p style={{marginTop : "200px"}}>Chargement...</p>
        ) : (
          <p style={{marginTop : "200px"}}>Une erreur inattendue s'est produite. Merci de réessayer.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
