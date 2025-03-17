interface IRowsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: number[];
}

const ItemsPerPageSelect: React.FunctionComponent<IRowsPerPageSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="block w-16 p-2 rounded-md cursor-pointer border text-blue-600 border-blue-600 focus:border-indigo-600 focus:ring-indigo-500 focus:outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default ItemsPerPageSelect;
