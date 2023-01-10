import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeaders, PrimaryButton } from "./CommonStyled";

const Contrat = () => {

    const navigate = useNavigate();



    return (
        <>
            <AdminHeaders>
                <h2>Contrats</h2>
                <PrimaryButton
                    onClick={() => navigate("/admin/contract/create-contract")}
                >
                    Nouveau contrat
                </PrimaryButton>
            </AdminHeaders>
            <Outlet />
        </>
    );
}

export default Contrat;
