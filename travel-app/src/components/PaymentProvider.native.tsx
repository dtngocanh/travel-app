import { StripeProvider } from "@stripe/stripe-react-native";

export default function PaymentProvider({ children }) {
  return (
    <StripeProvider
      publishableKey="pk_test_51SVOhWLBVjtGB4OxevZJd2akkpB7wNWJa3eUYNX3EFLK8Eojv6Cp27WYKQJkxAvBxUUdeXQiE8nmA1HQ4HFOcla900cYMzRKyo"
      merchantIdentifier="merchant.identifier"
    >
      {children}
    </StripeProvider>
  );
}
