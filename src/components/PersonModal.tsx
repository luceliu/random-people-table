import { useEffect, useRef } from "react";
import { Person } from "../types/Person";
import { formatSalary } from "../utils/formatters";

interface IPersonModalProps {
  person: Person;
  onClose: () => void;
}

const PersonModal: React.FunctionComponent<IPersonModalProps> = ({
  person,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("event.target", event.target);
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full pointer-events-auto"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{person.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Basic Information</p>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">ID:</span> {person.id}
              </p>
              <p>
                <span className="font-medium">Date of Birth:</span>{" "}
                {formatDate(person.dob)}
              </p>
              <p>
                <span className="font-medium">Email:</span> {person.email}
              </p>
              <p>
                <span className="font-medium">Verified:</span>
                {person.verified ? " Yes" : " No"}
              </p>
              <p>
                <span className="font-medium">Salary:</span>{" "}
                {formatSalary(person.salary)}
              </p>
              {person.score !== undefined && (
                <p>
                  <span className="font-medium">Score:</span> {person.score}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Contact Information</p>
            <div className="mt-2 space-y-2">
              {person.address && (
                <>
                  <p>
                    <span className="font-medium">Street:</span>{" "}
                    {person.address.street}
                  </p>
                  <p>
                    <span className="font-medium">Town:</span>{" "}
                    {person.address.town}
                  </p>
                  <p>
                    <span className="font-medium">Postcode:</span>{" "}
                    {person.address.postode}
                  </p>
                </>
              )}
              {person.telephone && (
                <p>
                  <span className="font-medium">Telephone:</span>{" "}
                  {person.telephone}
                </p>
              )}
              {person.url && (
                <p>
                  <span className="font-medium">Website:</span> {person.url}
                </p>
              )}
            </div>
          </div>
        </div>

        {person.pets && person.pets.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Pets</p>
            <p className="mt-2">{person.pets.join(", ")}</p>
          </div>
        )}

        {person.description && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-2 text-gray-700">{person.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonModal;
