import { StripeProvider } from "@stripe/stripe-react-native";

export default function PaymentProvider({ children }) {
  return (
    <StripeProvider
      publishableKey="pk_test_51SY0BeRQse0atK9O0SWj1h9g3e337arCb58BGAmy7qBpqG5yLWpnOurhkoeY69wWtgvdETAJv2RnoV9Y9Wc0ghMb00qNZFTqeh"
      merchantIdentifier="merchant.identifier"
    >
      {children}
    </StripeProvider>
  );
}
