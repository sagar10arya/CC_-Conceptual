import React from "react";

const Input = React.forwardRef(function Input(
  { label, id, type = "text", className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label
          className="inline-block mb-1 pl-1 text-gray-700 dark:text-gray-300"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-3 rounded-lg bg-white dark:bg-gray-800 
                text-black dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-gray-700 duration-200 
                border border-gray-200 dark:border-gray-600 w-full 
                ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;