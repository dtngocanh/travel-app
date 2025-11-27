import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51SVOhWLBVjtGB4OxevZJd2akkpB7wNWJa3eUYNX3EFLK8Eojv6Cp27WYKQJkxAvBxUUdeXQiE8nmA1HQ4HFOcla900cYMzRKyo");

export default function PaymentProvider({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
