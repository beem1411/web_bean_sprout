import React from "react";
import { Link } from "react-router-dom";
import "./NavigationButton.css";

const NavigationButton = ({ to, label }) => {
  return (
    <Link to={to} className="navigation-button">
      {label}
    </Link>
  );
};

export default NavigationButton;
