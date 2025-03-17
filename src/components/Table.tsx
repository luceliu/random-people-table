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
    <div>
      {isModalOpen && selectedPerson && (
        <PersonModal person={selectedPerson} onClose={handleCloseModal} />
      )}
      <table>
        <thead>
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
              <td>{person.name}</td>
              <td>{person.dob}</td>

              <td>{person.email}</td>
              <td>
                <span>{person.verified ? "Yes" : "No"}</span>
              </td>
              <td>${person.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* footer */}
      <div className="flex justify-between items-center">
        <div>
          <span>
            Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span>{Math.min(currentPage * itemsPerPage, data.length)}</span> of{" "}
            <span>{data.length}</span> entries
          </span>
        </div>
        <div>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="border cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="border cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
