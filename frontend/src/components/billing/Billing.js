import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./Billing.css"
import {Elements} from 'react-stripe-elements';
import InjectedCheckoutForm from './CheckoutForm';


class Billing extends Component {
    render() {
        return (
            <div className="billing">
                <div className="menu">
                    <Link to="/decisions">Decisions</Link>
                    <Link to="/billing">Billing</Link>
                    <Link to="/settings">Settings</Link>
                </div>
                <Elements>
                    <InjectedCheckoutForm />
                </Elements>
                <div className="plans">
                </div>
            </div>
        )
    }
}

export default Billing