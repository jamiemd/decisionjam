// CardSection.js
import "../../css/Billing.css";
import React, { Component } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from "react-stripe-elements";

const handleBlur = () => {
  console.log("[blur]");
};

const handleFocus = () => {
  console.log("[focus]");
};

class CardSection extends Component {
  render() {
    return (
      <div>
        <label>
          Card Number
          <CardNumberElement onBlur={handleBlur} onFocus={handleFocus} />
        </label>
        <label>
          Expiration
          <CardExpiryElement />
        </label>
        <label>
          CVC
          <CardCVCElement />
        </label>
      </div>
    );
  }
}

export default CardSection;
