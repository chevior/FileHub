import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Favorites from "./pages/Favorites";
import Trash from "./pages/Trash";
import Profile from "./pages/Profile";
import SharedFile from "./pages/SharedFile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const protect = (page: React.ReactNode) => <ProtectedRoute>{page}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={protect(<Dashboard />)} />
          <Route path="/files" element={protect(<Files />)} />
          <Route path="/favorites" element={protect(<Favorites />)} />
          <Route path="/trash" element={protect(<Trash />)} />
          <Route path="/profile" element={protect(<Profile />)} />
          <Route path="/shared/:token" element={<SharedFile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
