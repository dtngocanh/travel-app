import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51SY0BeRQse0atK9O0SWj1h9g3e337arCb58BGAmy7qBpqG5yLWpnOurhkoeY69wWtgvdETAJv2RnoV9Y9Wc0ghMb00qNZFTqeh");

export default function PaymentProvider({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
