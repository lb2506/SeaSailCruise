import { AdminHeaders, PrimaryButton } from "./CommonStyled";
import { Outlet, useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  return (
    <>
      <AdminHeaders>
        <h2 style={{ marginBottom: '20px' }}>Réservations</h2>
        <PrimaryButton
          onClick={() => navigate("/admin/orders/create-booking")}
        >
          Créer une réservation
        </PrimaryButton>
      </AdminHeaders>
      <Outlet />
    </>
  )
};

export default Orders;