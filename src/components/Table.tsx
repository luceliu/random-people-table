import { useState } from "react";
import { Person } from "../types/Person";

interface ITableProps {
  data: Person[];
  itemsPerPage?: number;
}

const Table: React.FunctionComponent<ITableProps> = ({
  data,
  itemsPerPage = 50,
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

  const currentData = getCurrentPageData();

  return (
    <div>
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
            <tr key={person.id}>
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
            className="border"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="border"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
