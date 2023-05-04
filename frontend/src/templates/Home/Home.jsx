import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


import './Home.scss';

const Home = () => {
  const { items, status } = useSelector((state) => state.products);

  return (
    <div className="home">
      {status === "success" ? (
        <>
          <div className="home__player">
            <video
              className="home__player-video"
              playsInline
              src="https://www.seasailcruise.com/images/site/slider/SSC-Demoreal-2021.mp4"
              muted
              autoPlay
              loop
            />
            <div className="home__infos">
              <div>
                <h2 className="home__infos-title">Locations</h2>
              </div>
              <div className="home__infos-content">
                <p>Sea Sail & Cruise vous présente une flotte diversifiée pour répondre à tous vos besoins, du bateau à moteur de 5m au voilier de 12m au départ des ports de Royan, Meschers et la Palmyre.</p>
                <p>Afin de rendre votre expérience nautique la plus agréable possible nous vous proposons en option un service de skipper, la location de matériel de sport nautique et également la possibilité d’embarquer des paniers repas pour votre pique-nique en mer.</p>
              </div>
              <button className="home__infos-btn">
                Voir la flotte
              </button>
            </div>
          </div>

          <div className="home__products">
            {items &&
              items?.map((product) => (
                (product.visible === true &&
                  <div key={product._id} className="home__item">
                    <Link to={`/product/${product._id}`}>
                      <div className="home__item-img">
                        <img src={product.image.url} alt={product.name} />
                      </div>

                      <div className="home__details">
                        <div className="home__details-title">
                          <h3>{product.name}</h3>
                          <span>{product.year}</span>
                        </div>
                        <div className="home__details-infos">
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
