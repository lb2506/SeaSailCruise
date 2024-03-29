import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getTotals,
  removeFromCart,
} from "../slices/cartSlice";

import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  // const handleRemoveFromCart = (product) => {
  //   dispatch(removeFromCart(product));
  // };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {

    // Vérifier si les dates sont encore dispo
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h2>Récapitulatif de votre réservation</h2>
      {cart.cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Votre panier est actuellement vide</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Retour aux produits</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="titles">
            <h3 className="product-title">Détails de la location</h3>
            <h3 className="price">Prix à la jounrée</h3>
            <h3 className="quantity">Nombre de jours</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            {cart.cartItems &&
              cart.cartItems.map((cartItem) => (
                <div className="cart-item" key={cartItem._id}>
                  <div className="cart-product">
                    <img src={cartItem.image.url} alt={cartItem.name} />
                    <div>
                      <h3>{cartItem.name}</h3>
                      <p>Type de location : {cartItem.choiceGuide}</p>
                      {cartItem.choiceGuide === 'Avec skipper' ?
                        <p>Supplément skipper : {cartItem.dureeLocation * 250} € (à régler sur place) </p>
                        :
                        null
                      }
                      <p>Début de la location : {cartItem.startLocation} </p>
                      <p>Fin de la location : {cartItem.endLocation}</p>
                      <p>Durée totale de location : {cartItem.dureeLocation === 1 ? `${cartItem.dureeLocation} jour` : `${cartItem.dureeLocation} jours`}</p>
                      {/* <button onClick={() => handleRemoveFromCart(cartItem)}>
                        Supprimer
                      </button> */}
                    </div>
                  </div>
                  <div className="cart-product-price">{cartItem.price} €</div>
                  <div className="cart-product-quantity">
                    <div className="count">{cartItem.dureeLocation}</div>
                  </div>
                  <div className="cart-product-total-price">
                    {cartItem.price * cartItem.dureeLocation} €
                  </div>
                </div>
              ))}
          </div>
          <div className="cart-summary">
            <button className="clear-btn" onClick={() => handleClearCart()}>
              Vider le panier
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Sous-total</span>
                <span className="amount">{cart.cartTotalAmount} €</span>
              </div>
              {auth._id ? (
                <button onClick={() => handleCheckout()}>Payer</button>
              ) : (
                <button
                  className="cart-login"
                  onClick={() => navigate("/login")}
                >
                  Connectez-vous pour continuer
                </button>
              )}

              <div className="continue-shopping">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continuer les achats</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
