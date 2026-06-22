import { BrowserRouter } from "react-router-dom";
import MainNavBar from "./main/MainNavBar";
import AdminNavBar from "./admin/AdminNavBar";
import PatientNavBar from "./patient/PatientNavBar";
import DoctorNavBar from "./doctor/DoctorNavBar";
import { AuthProvider, useAuth } from "./contextapi/AuthContext";

function AppContent() {
  const { isAdminLoggedIn, isPatientLoggedIn, isDoctorLoggedIn } = useAuth();

  return (
    <div>
      {isAdminLoggedIn ? (
        <AdminNavBar />
      ) : isPatientLoggedIn ? (
        <PatientNavBar />
      ) : isDoctorLoggedIn ? (
        <DoctorNavBar />
      ) : (
        <MainNavBar />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;