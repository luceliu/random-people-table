import { Person } from "../types/Person";

interface ITableProps {
  data: Person[];
  itemsPerPage?: number;
}

const Table: React.FunctionComponent<ITableProps> = ({
  data,
  itemsPerPage = 50,
}) => {
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
          {data.map((person) => (
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
    </div>
  );
};

export default Table;
