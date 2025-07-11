type TableProps = {
  children: React.ReactNode;
};

export const Table = ({ children }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-4">
      <table className="min-w-full text-sm text-center text-gray-700 bg-white"> 
        {children}
      </table>
    </div>
  );
};
