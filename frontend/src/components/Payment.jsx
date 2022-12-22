import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { url } from "../slices/api";
import CheckoutForm from "./CheckoutForm";
import { useSelector } from "react-redux";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51LwSYNLLOqQiqXB2B7gfgA6Jbzrv2S0ZQ9MRojhytjb92reNrivu44WZDkYgsbCXpKK7d6FCoP6fr9ILpSScDvOY00kR07qN6o");

export default function App() {
    const [clientSecret, setClientSecret] = useState("");
    const user = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch(`${url}/stripe/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: [{
                    cartItems: cart.cartItems,
                    cartTotal: cart.cartTotalAmount,
                    userId: user._id,
                    userFirstName: user.firstName,
                    userLastName: user.lastName,
                }]
            }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="checkout">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}