type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ title, children, className = "" }: CardProps) => {
  return (
    <div
      className={`
        bg-white 
        shadow-lg 
        rounded-3xl 
        border 
        border-gray-300 
        overflow-hidden
        ${className}
      `}
    >
      <div className="px-8 py-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-3">
          {title}
        </h2>
        <div className="text-gray-800 text-base leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
