import React from "react";
import { Person } from "../types/Person";
import Table, { TableColumn } from "./Table";
import { formatDate, formatSalary } from "../utils/formatters";
import { useModal } from "../hooks/useModal";
import PersonModal from "./PersonModal";

interface PersonTableProps {
  data: Person[];
}

const PersonTable: React.FC<PersonTableProps> = ({ data }) => {
  // Person details modal
  const {
    isOpen,
    data: selectedPerson,
    openModal,
    closeModal,
  } = useModal<Person>();

  const handleRowClick = (person: Person) => {
    openModal(person);
  };

  const columns: TableColumn<Person>[] = [
    {
      header: "Name",
      field: "name",
      sortable: true,
    },
    {
      header: "DOB",
      field: "dob",
      sortable: true,
      render: (person) => formatDate(person.dob),
    },
    {
      header: "Email",
      field: "email",
      sortable: true,
    },
    {
      header: "Verified",
      field: "verified",
      sortable: true,
      render: (person) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            person.verified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {person.verified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Salary",
      field: "salary",
      sortable: true,
      render: (person) => formatSalary(person.salary),
    },
  ];

  return (
    <>
      {isOpen && selectedPerson && (
        <PersonModal person={selectedPerson} onClose={closeModal} />
      )}
      <Table
        data={data}
        columns={columns}
        keyExtractor={(person) => person.id}
        onRowClick={handleRowClick}
        itemsPerPageOptions={[10, 25, 50, 100]}
        initialItemsPerPage={10}
      />
    </>
  );
};

export default PersonTable;
