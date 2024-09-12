"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
};

const Button = ({ children, label }: ButtonProps) => {
  return (
    <button
      className="bg-secondary-color py-4 px-14 rounded text-white"
      onClick={() => console.log("hello from child")}
    >
      {label}
      {children}
    </button>
  );
};

export default Button;
