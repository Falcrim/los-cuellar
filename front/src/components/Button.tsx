import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  title: string;
  onClick?: () => void;
  variant?: "primary" | "success" | "danger";
  type?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>["type"];
  className?: string;
  disabled?: boolean;  
};

export const Button = ({
  title,
  onClick,
  type,
  variant = "primary",
  className = "",
  disabled = false,  
}: ButtonProps) => {
  const baseClass =
    variant === "primary"
      ? "bg-blue-500 hover:bg-blue-600"
      : variant === "success"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}   
      className={`text-white py-1 px-2 rounded text-sm ${baseClass} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {title}
    </button>
  );
};