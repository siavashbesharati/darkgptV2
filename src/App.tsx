/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { EditorPage } from "@/pages/EditorPage";
import { PricingPage } from "@/pages/PricingPage";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/editor/:sessionId?",
    element: (
      <ProtectedRoute>
        <EditorPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" theme="dark" richColors closeButton />
    </ErrorBoundary>
  );
}
