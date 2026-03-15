import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/UserContext.jsx";
import AuthForm from "./components/AuthForm.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AddExhibit from "./components/AddExhibit.jsx";

//* Router Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AuthForm />, //* Default Landing Page.
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      //* ADD EXHIBIT
      {
        path: "dashboard/exhibits/add",
        element: (
          <ProtectedRoute>
            <AddExhibit />
          </ProtectedRoute>
        ),
      },

      {
        path: "auth",
        element: (
          <GuestRoute>
            <AuthForm />
          </GuestRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
);
