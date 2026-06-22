import { createContext, useState, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext(null);

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

// Provider component
export function AuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });

  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState(() => {
    return localStorage.getItem("isPatientLoggedIn") === "true";
  });

  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    return localStorage.getItem("isDoctorLoggedIn") === "true";
  });

  const [patientData, setPatientData] = useState(() => {
    const stored = localStorage.getItem("patient");
    return stored ? JSON.parse(stored) : null;
  });

  const [doctorData, setDoctorData] = useState(() => {
    const stored = localStorage.getItem("doctor");
    return stored ? JSON.parse(stored) : null;
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("isAdminLoggedIn", String(isAdminLoggedIn));
    localStorage.setItem("isPatientLoggedIn", String(isPatientLoggedIn));
    localStorage.setItem("isDoctorLoggedIn", String(isDoctorLoggedIn));
  }, [isAdminLoggedIn, isPatientLoggedIn, isDoctorLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isPatientLoggedIn,
        setIsPatientLoggedIn,
        isDoctorLoggedIn,
        setIsDoctorLoggedIn,
        patientData,
        setPatientData,
        doctorData,
        setDoctorData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
