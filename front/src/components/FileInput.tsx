type Props = React.InputHTMLAttributes<HTMLInputElement> & {}

export const FileInput = (props: Props) => {
    return (
        <input
            type="file"
            {...props}
            className="rounded-xs w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
    );
};
