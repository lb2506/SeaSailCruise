import { useNavigate } from "react-router-dom";

const PayButton = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Payer</button>
    </>
  );
};

export default PayButton;
