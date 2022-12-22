import axios from "axios";
import { useSelector } from "react-redux";
import { url } from "../slices/api";
import { useNavigate } from "react-router-dom";

const PayButton = ({ cartItems }) => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // axios
    //   .post(`${url}/stripe/create-checkout-session`, {
    //     cartItems,
    //     userId: user._id,
    //     userFirstName: user.firstName,
    //     userLastName: user.lastName,
    //   })
    //   .then((response) => {
    //     if (response.data.url) {
    //       window.location.href = response.data.url;
    //     }
    //   })
    //   .catch((err) => console.log(err.message));

    navigate("/checkout");
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Payer</button>
    </>
  );
};

export default PayButton;
