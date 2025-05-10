import { createContext, useContext, useState, ReactNode } from "react";

interface NotesContextType {
  content: string;
  setContent: (content: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [content, setContent] = useState<string>("");
  
  return (
    <NotesContext.Provider
      value={{
        content,
        setContent,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes(): NotesContextType {
  const context = useContext(NotesContext);
  
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  
  return context;
}
