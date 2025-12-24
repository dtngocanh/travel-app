import PaymentProvider from "../../src/components/PaymentProvider";
import PaymentScreenContent from "./PaymentScreenContent";

export default function PaymentScreen() {
  return (
    <PaymentProvider>
      <PaymentScreenContent />
    </PaymentProvider>
  );
}
