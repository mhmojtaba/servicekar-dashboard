"use client";
import React from "react";
import { CircleLoader } from "react-spinners";

function Button({
  children,
  onClick,
  type,
  isLoading = false,
  className,
  error,
  valid = true,
  containerClassName,
  name,
  variant = "primary",
}) {
  const baseStyles = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-md",
    secondary:
      "bg-secondary-50 text-secondary-700 border border-secondary-200 hover:bg-secondary-100",
    accent: "bg-accent-500 text-white hover:bg-accent-600 shadow-md",
    outline:
      "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
  };

  const buttonStyles = `
    ${baseStyles[variant] || baseStyles.primary}
    transition-all duration-300 ease-in-out
    rounded-lg font-medium py-3 px-6
    flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50
    disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
    ${className || ""}
  `;

  return (
    <div className={`${containerClassName || ""}`}>
      <button
        onClick={onClick}
        type={type}
        className={buttonStyles}
        disabled={!valid || isLoading || error}
        name={name}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <CircleLoader
              color={variant === "outline" ? "#4596C3" : "#ffffff"}
              loading={true}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <span className="ml-2 text-sm">در حال پردازش...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center">{children}</span>
        )}
      </button>
    </div>
  );
}

export default Button;
