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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return data.slice(startIndex, endIndex);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
            <th>Name</th>
            <th>DOB</th>
            <th>Email</th>
            <th>Verified</th>
            <th>Salary</th>
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
