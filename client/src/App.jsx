import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BookList from "./pages/BookList";
import BookForm from "./pages/BookForm";
import BorrowList from "./pages/BorrowList";
import BorrowForm from "./pages/BorrowForm";
import EquipmentList from "./pages/EquipmentList";
import EquipmentForm from "./pages/EquipmentForm";
import RegistrationList from "./pages/RegistrationList";
import RegistrationForm from "./pages/RegistrationForm";
import ScheduleList from "./pages/ScheduleList";
import ScheduleForm from "./pages/ScheduleForm";
import ActivityPlanList from "./pages/ActivityPlanList";
import ActivityPlanForm from "./pages/ActivityPlanForm";
import BroadcastManager from "./pages/BroadcastManager";
import UserList from "./pages/UserList";
import UserForm from "./pages/UserForm";
import ReportDashboard from "./pages/ReportDashboard";
import AdminLayout from "./components/AdminLayout";
import { useEffect, useState } from "react";
import authService from "./services/authService";

const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/new"
          element={
            <ProtectedRoute>
              <BookForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/edit/:id"
          element={
            <ProtectedRoute>
              <BookForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrows"
          element={
            <ProtectedRoute>
              <BorrowList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrows/new"
          element={
            <ProtectedRoute>
              <BorrowForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <EquipmentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment/new"
          element={
            <ProtectedRoute>
              <EquipmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment/edit/:id"
          element={
            <ProtectedRoute>
              <EquipmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrations"
          element={
            <ProtectedRoute>
              <RegistrationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrations/new"
          element={
            <ProtectedRoute>
              <RegistrationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <ProtectedRoute>
              <ScheduleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules/new"
          element={
            <ProtectedRoute>
              <ScheduleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-plans"
          element={
            <ProtectedRoute>
              <ActivityPlanList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-plans/new"
          element={
            <ProtectedRoute>
              <ActivityPlanForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/broadcasts"
          element={
            <ProtectedRoute>
              <BroadcastManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
