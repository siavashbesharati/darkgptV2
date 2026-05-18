/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { HomePage } from "@/pages/HomePage";
import { EditorPage } from "@/pages/EditorPage";
import { PricingPage } from "@/pages/PricingPage";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
  const fetchPublicConfig = useStore((state) => state.fetchPublicConfig);
  const setAuth = useStore((state) => state.setAuth);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    fetchPublicConfig();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        // The store's setAuth needs User object. 
        // refreshUser will fetch the full profile from backend.
        setAuth({
          id: user.uid,
          email: user.email || '',
          tier: 'Free', // Initial guess, refreshUser will correct it
          credits: 0,
          isAdmin: false
        }, token);
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [fetchPublicConfig, setAuth, logout]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" theme="dark" richColors closeButton />
    </ErrorBoundary>
  );
}
