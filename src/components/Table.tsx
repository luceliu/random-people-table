import { useState } from "react";
import { Person } from "../types/Person";
import PersonModal from "./PersonModal";

interface ITableProps {
  data: Person[];
  itemsPerPage: number;
}

const Table: React.FunctionComponent<ITableProps> = ({
  data,
  itemsPerPage,
}) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
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

  const currentData = getCurrentPageData();

  return (
    <div className="flex flex-col items-center justify-center">
      {isModalOpen && selectedPerson && (
        <PersonModal person={selectedPerson} onClose={handleCloseModal} />
      )}
      <table className="w-[80%] m-4 bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("name")}
            >
              Name{" "}
              {sortField === "name" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("dob")}
            >
              DOB {sortField === "dob" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("email")}
            >
              Email{" "}
              {sortField === "email" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("verified")}
            >
              Verified{" "}
              {sortField === "verified" &&
                (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("salary")}
            >
              Salary{" "}
              {sortField === "salary" && (sortDirection === "asc" ? "▲" : "▼")}
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
              <td className="py-2 px-4 border-b">{person.name}</td>
              <td className="py-2 px-4 border-b">{person.dob}</td>

              <td className="py-2 px-4 border-b">{person.email}</td>
              <td className="py-2 px-4 border-b">
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
              <td className="py-2 px-4 border-b">
                ${person.salary.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* footer */}
      <div className="flex w-[80%] justify-between items-start">
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
