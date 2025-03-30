import { createContext, ReactNode, useContext, useState } from "react";

interface CurrentFolderContextType {
  currentFolderId: string;
  setCurrentFolderId: (id: string) => void;
}

const CurrentFolderContext = createContext<CurrentFolderContextType | undefined>(undefined);

export const CurrentFolderProvider = ({ children }: { children: ReactNode }) => {
  const [currentFolderId, setCurrentFolderId] = useState("defaultFolder");

  return (
    <CurrentFolderContext.Provider value={{ currentFolderId, setCurrentFolderId }}>
      {children}
    </CurrentFolderContext.Provider>
  );
};

export const useCurrentFolder = () => {
  const context = useContext(CurrentFolderContext);
  if (!context) {
    throw new Error("useCurrentFolder must be used within a CurrentFolderProvider");
  }
  return context;
};
