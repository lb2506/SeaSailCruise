import styled from "styled-components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { url, setHeaders } from "../../../slices/api";
import axios from "axios";


const Chart = () => {

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);

    function compare(a, b){
        if(a._id < b._id){
          return -1
        }
        if(a._id > b._id){
          return 1
        }
        return 0;
      }

    useEffect(() => {
        async function fetchData(){
            setLoading(true)
            try{
                const res = await axios.get(`${url}/orders/week-sales`, setHeaders())
                res.data.sort(compare)
 
                const newData = res.data.map((item) => {
                    const date = new Date(item._id).toLocaleDateString("fr")

                    return{
                        date: date.slice(0, 5),
                        CA: item.total
                    }
                })
                setSales(newData);
                setLoading(false)
            } catch(err){
                console.log(err)
                setLoading(false)
            }
        }
        fetchData()
    }, [])



    return(
    <>
        {loading ? (
            <Loader>Chargement du graphique...</Loader> 
        ) : (
            <StyledChart>
                <h3>Récapitulatif des 7 derniers jours (en €)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={sales}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="CA" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </StyledChart>
        )} 
    </>
)};

export default Chart;

const StyledChart = styled.div`
    width: 100%;
    height: 300px;
    margin-top: 2rem;
    padding: 1rem;
    border: 2px solid rgba(48, 51, 78, 0.2);
    border-radius: 5px;
    h3{
        margin-bottom: 1rem;
    }
`;

const Loader = styled.div`
    margin-top: 2rem;
`;