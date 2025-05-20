import { useState } from "react";

interface UseConfirmModalResult {
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  confirm: () => void;
}

const useConfirmModal = (onConfirm: () => void): UseConfirmModalResult => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);
  const confirm = () => {
    onConfirm();
    closeModal();
  };

  return { isVisible, openModal, closeModal, confirm };
};

export default useConfirmModal;
