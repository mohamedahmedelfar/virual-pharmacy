import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
// asynchronously load stripe js and return a promise
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  //stripejs expects the publishable key so we will get it from the backend
  useEffect(() => {
    fetch("/config").then(async (res) => {
      const { publishableKey } = await res.json();

      console.log(publishableKey);

      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (res) => {
      const { clientSecret } = await res.json();

      setClientSecret(clientSecret);
    });
  }, []);
  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;