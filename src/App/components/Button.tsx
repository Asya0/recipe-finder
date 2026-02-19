import React from "react";
import "./Button.css";

/** Данный тип описывает пропсы компонента */
export type ButtonProps = {
  // "?" означает, что пропс необязательный
  // e: React.MouseEvent – объект события
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode; // реакт-элемент
};

// указываем тип пропсов комопнента в дженерике React.FC<>
const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button className="button" onClick={onClick}>
    {children}
  </button>
);

export default Button;
