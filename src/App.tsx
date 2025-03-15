import { useEffect, useState } from "react";
import Table from "./components/Table";
import { PeopleData, Person } from "./types/Person";

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/random-people-data.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: PeopleData = await response.json();
        setPeople(data.ctRoot);
      } catch (err) {
        setError("Error loading data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto p-4 w-screen overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">People Directory</h1>
      <Table data={people} itemsPerPage={100} />
    </div>
  );
}

export default App;
