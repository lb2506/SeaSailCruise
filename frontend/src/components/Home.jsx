import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const { items, status } = useSelector((state) => state.products);

  return (

    <div className="home-container">
      {status === "success" ? (
        <>
          <div className="text-info">
            <div className="card-title">
              <h2>Locations</h2>
            </div>
            <p>Sea Sail & Cruise vous présente une flotte diversifiée pour répondre à tous vos besoins, du bateau à moteur de 5m au voilier de 12m au départ des ports de Royan, Meschers et la Palmyre.<br /><br />
              Afin de rendre votre expérience nautique la plus agréable possible nous vous proposons en option un service de skipper, la location de matériel de sport nautique et également la possibilité d’embarquer des paniers repas pour votre pique-nique en mer.</p>
          </div>
          <div className="products">
            {items &&
              items?.map((product) => (
                (product.visible === true &&
                  <div key={product._id} className="product">
                    <Link to={`/product/${product._id}`}>
                      <div className="img-ctn">
                        <img src={product.image.url} alt={product.name} />
                      </div>

                      <div className="details-container">
                        <div className="details-title">
                          <h3>{product.name}</h3>
                          <span>{product.year}</span>
                        </div>
                        <div className="details-infos">
                          <p>{product.localisation}</p>
                          <p>{product.guide}</p>
                          <p>A partir de {(product.price).toLocaleString()} €</p>
                        </div>
                      </div>

                    </Link>
                  </div>
                )
              ))}
          </div>
        </>
      ) : status === "pending" ? (
        <p style={{ marginTop: "200px" }}>Chargement...</p>
      ) : (
        <p style={{ marginTop: "200px" }}>Une erreur inattendue s'est produite. Merci de réessayer.</p>
      )}
    </div>
  );
};

export default Home;
