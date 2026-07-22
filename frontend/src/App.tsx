import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import Shared from "./pages/Shared";
import Favorites from "./pages/Favorites";
import Trash from "./pages/Trash";
import Profile from "./pages/Profile";
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
          <Route path="/files" element={protect(<MyFiles />)} />
          <Route path="/shared" element={protect(<Shared />)} />
          <Route path="/favorites" element={protect(<Favorites />)} />
          <Route path="/trash" element={protect(<Trash />)} />
          <Route path="/profile" element={protect(<Profile />)} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
