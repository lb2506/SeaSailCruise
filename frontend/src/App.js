import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./templates/Home/Home";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import Cart from "./components/Cart";

import "react-toastify/dist/ReactToastify.css";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./slices/authSlice";
import CheckoutSuccess from "./components/CheckoutSuccess";
import Dashboard from "./components/admin/Dashboard";
import Products from "./components/admin/Products";
import Users from "./components/admin/Users";
import Bookings from "./components/admin/Bookings";
import Summary from "./components/admin/Summary";
import CreateProduct from "./components/admin/CreateProduct";
import ProductsList from "./components/admin/list/ProductsList";
import Product from "./components/Details/Product";
import Booking from "./components/Details/Booking";
import UserProfile from "./components/Details/UserProfile";
import UserAccount from "./components/account/UserAccount";
import UserOrders from "./components/account/UserOrders";
import UserProfileData from "./components/account/UserProfileData";
import Payment from "./components/Payment";
import Calendrier from "./components/admin/Calendrier";
import Contrat from "./components/admin/Contrat";
import BookingsList from "./components/admin/list/BookingsList";
import CreateBooking from "./components/admin/CreateBooking";
import CreateContract from "./components/admin/CreateContract";
import ContractsList from "./components/admin/list/ContractsList";
import Owners from "./components/admin/Owners";
import OwnersList from "./components/admin/list/OwnersList";
import CreateOwner from "./components/admin/CreateOwner";
import OwnerSpace from "./components/account/OwnerSpace";
import NewContract from "./components/Details/NewContract";
import ViewContract from "./components/Details/ViewContract";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser(null));
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/admin" element={<Dashboard />}>
              <Route path="booking/:id" element={<Booking />} />
              <Route path="booking/new-contract/:id" element={<NewContract />} />
              <Route path="booking/view-contract/:id" element={<ViewContract />} />
              <Route path="summary" element={<Summary />} />
              <Route path="products" element={<Products />}>
                <Route index element={<ProductsList />} />
                <Route path="create-product" element={<CreateProduct />} />
              </Route>
              <Route path="users" element={<Users />} />
              <Route path="owners" element={<Owners />}>
                <Route index element={<OwnersList />} />
                <Route path="create-owner" element={<CreateOwner />} />
              </Route>
              <Route path="bookings" element={<Bookings />} >
                <Route index element={<BookingsList />} />
                <Route path="create-booking" element={<CreateBooking />} />
              </Route>
              <Route path="calendar" element={<Calendrier />} />
              <Route path="contract" element={<Contrat />} >
                <Route index element={<ContractsList />} />
                <Route path="create-contract" element={<CreateContract />} />
              </Route>
            </Route>
            <Route path="/account" element={<UserAccount />}>
              <Route path="orders/:userId" element={<UserOrders />} />
              <Route path="profile" element={<UserProfileData />} />
              <Route path="owner-space" element={<OwnerSpace />} />
            </Route>
            <Route path="/checkout" element={<Payment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
