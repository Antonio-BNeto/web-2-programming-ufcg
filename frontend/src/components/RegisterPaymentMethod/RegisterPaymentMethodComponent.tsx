import { useState } from "react";
import "./RegisterPaymentMethodComponent.css";

function RegisterPaymentMethodComponent() {
  const [paymentType, setPaymentType] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentType(event.target.value);
  };

  return (
    <div className="payment-container">
      <select
        value={paymentType}
        onChange={handleChange}
        className="payment-dropdown"
      >
        <option value="" disabled>
          Selecione o tipo de método de pagamento
        </option>

        <option value="credit-card">Cartão de crédito</option>
        <option value="bank-account">Conta bancária</option>
        <option value="pix">Pix</option>
      </select>
    </div>
  );
}

export default RegisterPaymentMethodComponent;