import { useState } from "react";

export function useModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = (item: T) => {
    setData(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setData(null);
  };

  return {
    isOpen,
    data,
    openModal,
    closeModal,
  };
}
