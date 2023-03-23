import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url, setHeaders } from "../../slices/api";
import { ordersContract } from "../../slices/ordersSlice";
import { useDispatch, useSelector } from "react-redux";


const ViewContract = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [contract, setContract] = useState()
    const [isLoading, setIsLoading] = useState(false);

    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);

            try {
                const res = await axios.get(`${url}/orders/findOne/${params.id}`, setHeaders());
                if (res.data.contract) {
                    setContract(res.data.contract);
                }
            } catch (err) {
                console.log(err);
            }
            setIsLoading(false)
        }
        fetchData()
    }, [params.id]);

    const handleDelete = async (id) => {
        dispatch(ordersContract({
            id,
            data: {}
        }))
        navigate('/admin/bookings')
    };

    return (
        <>
            {isLoading ? (
                <p>Chargement du contract...</p>
            ) : (
                <>
                    <h3>Détail contrat</h3>
                    {auth._id &&
                        <button onClick={() => handleDelete(params.id)}>Supprimer le contrat</button>
                    }
                    {contract && (
                        <div>
                            <div dangerouslySetInnerHTML={{ __html: contract.value }} />
                            {contract.picturesContract && contract.picturesContract?.map((picture, index) =>
                                <img key={index} src={picture} />
                            )}
                            <img src={contract.signature} />
                        </div>
                    )}
                </>
            )}
        </>
    )
};

export default ViewContract;