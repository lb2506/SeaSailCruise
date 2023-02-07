import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { setHeaders, url } from "../../slices/api";
import { FaUsers, FaChartBar, FaClipboard } from "react-icons/fa";
import Widget from "./summary-components/Widget";
import Chart from "./summary-components/Chart";
import Transactions from "./summary-components/Transactions";
import AllTimeData from "./summary-components/AllTimeData";
import PaymentPending from "./summary-components/PaymentsPending";

const Summary = () => {

  const [users, setUsers] = useState([]);
  const [usersPerc, setUsersPerc] = useState(0);
  const [orders, setOrders] = useState([]);
  const [ordersPerc, setOrdersPerc] = useState(0);
  const [income, setIncome] = useState([]);
  const [incomePerc, setIncomePerc] = useState(0);

  function compare(a, b) {
    if (a._id < b._id) {
      return 1
    }
    if (a._id > b._id) {
      return -1
    }
    return 0;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/users/stats`, setHeaders())
        res.data.sort(compare)
        setUsers(res.data);
        setUsersPerc(
          ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100
        );
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/stats`, setHeaders())
        res.data.sort(compare)
        setOrders(res.data);
        setOrdersPerc(
          ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100
        );
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${url}/orders/income`, setHeaders());
        res.data.sort(compare)
        setIncome(res.data);
        setIncomePerc(
          ((res.data[0].total - res.data[1].total) / res.data[1].total) * 100
        );
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, []);

  const data = [
    {
      icon: <FaUsers />,
      digits: users[0]?.total,
      isMoney: false,
      title: "Client(s)",
      color: "rgb(102, 108, 255)",
      bgColor: "rgba(102, 108, 255, 0.12)",
      percentage: usersPerc,
    },
    {
      icon: <FaClipboard />,
      digits: orders[0]?.total,
      isMoney: false,
      title: "Réservation(s)",
      color: "rgb(38, 198, 249)",
      bgColor: "rgba(38, 198, 249, 0.12)",
      percentage: ordersPerc,
    },
    {
      icon: <FaChartBar />,
      digits: income[0]?.total ? income[0]?.total : "",
      isMoney: true,
      title: "CA",
      color: "rgb(253, 181, 40)",
      bgColor: "rgbA(253, 181, 40, 0.12)",
      percentage: incomePerc,
    },
  ]

  return <StyledSummary>
    <MainStats>
      <OverView>
        <Title>
          <h2>Vue générale</h2>
          <p>Statistiques du site par rapport au mois précédent.</p>
        </Title>
        <WidgetWrapper>
          {data?.map((data, index) => <Widget key={index} data={data} />)}
        </WidgetWrapper>
      </OverView>
      <Chart />
    </MainStats>
    <SideStats>
      <Transactions />
      <PaymentPending />
      <AllTimeData />
    </SideStats>
  </StyledSummary>
};

export default Summary;

const StyledSummary = styled.div`
  width: 100%;
  display: flex;
`;

const MainStats = styled.div`
  flex: 2;
  width: 100%;
`;

const SideStats = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  width: 100%;
`;

const OverView = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  width: 100%;
  padding: 1.5rem;
  heigth: 170px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  p{
    font-size: 14px;
    color: rgba(234, 234, 255, 0.8);
  }
`;

const WidgetWrapper = styled.div`
  display: flex;
  width: 1OO%;
  justify-content: space-between;
  margin-top: 1.5rem;
`;