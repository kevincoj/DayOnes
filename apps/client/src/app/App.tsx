import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import HabitWizard from "../pages/HabitWizard";
import ProtectedRoute from "../components/ProtectedRoute";
import EditHabitPage from "../pages/EdithabitPage";
import HabitDetailPage from "../pages/HabitDetailPage";
import FeedPage from "../pages/FeedPage";
import PartnersPage from "../pages/PartnersPage";
import ProfilePage from "../pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits/new"
          element={
            <ProtectedRoute>
              <HabitWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits/:id"
          element={
            <ProtectedRoute>
              <HabitDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits/:id/edit"
          element={
            <ProtectedRoute>
              <EditHabitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <ProtectedRoute>
              <PartnersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
