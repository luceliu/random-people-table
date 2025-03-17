import { useState } from "react";

interface UseTableProps<T> {
  data: T[];
  initialSortField?: keyof T | null;
  initialSortDirection?: "asc" | "desc";
  initialItemsPerPage?: number;
}

export function useTable<T>({
  data,
  initialSortField = null,
  initialSortDirection = "asc",
  initialItemsPerPage = 10,
}: UseTableProps<T>) {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Sorting
  const [sortField, setSortField] = useState<keyof T | null>(initialSortField);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSortDirection
  );

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Items per page
  const handleItemsPerPageChange = (rows: number) => {
    setItemsPerPage(rows);
    setCurrentPage(1);
  };

  // get current page data with sorting applied
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

  return {
    // Pagination
    currentPage,
    itemsPerPage,
    totalPages,
    handlePreviousPage,
    handleNextPage,

    // Sorting
    sortField,
    sortDirection,
    handleSort,

    // Items per page
    handleItemsPerPageChange,

    // Data
    currentData: getCurrentPageData(),
  };
}
