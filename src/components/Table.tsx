import { useState } from "react";
import { Person } from "../types/Person";
import PersonModal from "./PersonModal";
import ItemsPerPageSelect from "./ItemsPerPageSelect";
import { formatDate, formatSalary } from "../utils/formatters";

interface ITableProps {
  data: Person[];
}

const Table: React.FunctionComponent<ITableProps> = ({ data }) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Sorting
  const [sortField, setSortField] = useState<keyof Person | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let sortedData = [...data];
    if (sortField) {
      sortedData.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        // A, B, or A & B are missing:
        if (!aValue && !bValue) return 0; // if both values are missing, they're equivalent
        if (!aValue) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (!bValue) {
          return sortDirection === "asc" ? 1 : -1;
        }
        // both A & B have values:
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;

          // if aValue === bValue:
          return 0;
        }
      });
    }
    return sortedData.slice(startIndex, endIndex);
  };

  const handleSort = (field: keyof Person) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Person details modal
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (person: Person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  // # items per page
  const handleItemsPerPageChange = (rows: number) => {
    setItemsPerPage(rows);
    setCurrentPage(1);
  };

  const currentData = getCurrentPageData();

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden">
      {isModalOpen && selectedPerson && (
        <PersonModal person={selectedPerson} onClose={handleCloseModal} />
      )}
      <div className="w-[90%] flex m-4 justify-end items-baseline space-x-2">
        <ItemsPerPageSelect
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          options={[10, 25, 50, 100]}
        />
        <span>people per page</span>
      </div>
      <div className="w-[90%] overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200 lg:text-sm"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortField === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200 lg:text-sm"
                onClick={() => handleSort("dob")}
              >
                DOB{" "}
                {sortField === "dob" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200 lg:text-sm"
                onClick={() => handleSort("email")}
              >
                Email{" "}
                {sortField === "email" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200 lg:text-sm"
                onClick={() => handleSort("verified")}
              >
                Verified{" "}
                {sortField === "verified" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200 lg:text-sm"
                onClick={() => handleSort("salary")}
              >
                Salary{" "}
                {sortField === "salary" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((person) => (
              <tr
                key={person.id}
                onClick={() => handleRowClick(person)}
                className="cursor-pointer hover:bg-gray-200"
              >
                <td className="py-2 px-4 border-b lg:text-sm">{person.name}</td>
                <td className="py-2 px-4 border-b lg:text-sm">
                  {formatDate(person.dob)}
                </td>

                <td className="py-2 px-4 border-b lg:text-sm">
                  {person.email}
                </td>
                <td className="py-2 px-4 border-b lg:text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      person.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {person.verified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-2 px-4 border-b lg:text-sm">
                  {formatSalary(person.salary)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* footer */}
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
        <div className="flex space-x-2">
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
};

export default Table;
