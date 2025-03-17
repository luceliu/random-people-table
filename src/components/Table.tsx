import { useTable } from "../hooks/useTable";
import ItemsPerPageSelect from "./ItemsPerPageSelect";

export interface TableColumn<T> {
  header: string;
  field: keyof T;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  itemsPerPageOptions?: number[];
  initialItemsPerPage?: number;
}

function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  itemsPerPageOptions = [10, 25, 50, 100],
  initialItemsPerPage = 10,
}: TableProps<T>) {
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    handlePreviousPage,
    handleNextPage,
    sortField,
    sortDirection,
    handleSort,
    handleItemsPerPageChange,
    currentData,
  } = useTable<T>({ data, initialItemsPerPage });

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden">
      <div className="w-[90%] flex m-4 justify-end items-baseline space-x-2">
        <ItemsPerPageSelect
          value={itemsPerPage}
          handleOptionSelect={handleItemsPerPageChange}
          options={itemsPerPageOptions}
        />
        <span>items per page</span>
      </div>
      <div className="w-[90%] overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 table-auto">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.field)}
                  className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200 lg:text-sm"
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  {column.header}{" "}
                  {sortField === column.field &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick && onRowClick(item)}
                className={`${
                  onRowClick ? "cursor-pointer" : ""
                } hover:bg-gray-200`}
              >
                {columns.map((column) => (
                  <td
                    key={`${keyExtractor(item)}-${String(column.field)}`}
                    className="py-2 px-4 border-b lg:text-sm"
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.field] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex w-[90%] m-4 justify-between items-start">
        <div>
          <span className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * itemsPerPage, data.length)}
            </span>{" "}
            of <span className="font-semibold">{data.length}</span> entries
          </span>
        </div>
        <div className="flex space-x-3 items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 border cursor-pointer rounded ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
          >
            Previous
          </button>
          <span className="w-16 text-center">
            Page{" "}
            <span className="text-blue-600 font-semibold">{currentPage}</span>
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border cursor-pointer rounded ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
