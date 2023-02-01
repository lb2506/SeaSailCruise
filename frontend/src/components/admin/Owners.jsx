import { AdminHeaders, PrimaryButton } from "./CommonStyled";
import { Outlet, useNavigate } from "react-router-dom";

const Owners = () => {
    const navigate = useNavigate();
    return (
        <>
            <AdminHeaders>
                <h2 style={{ marginBottom: '20px' }}>Propriétaires</h2>
                <PrimaryButton
                    onClick={() => navigate("/admin/owners/create-owner")}
                >
                    Ajouter un propriétaire
                </PrimaryButton>
            </AdminHeaders>
            <Outlet />
        </>
    )
};

export default Owners;