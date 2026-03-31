// Import necessary router components
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./services/supabase";

// Import necessary pages
import { LoginPage } from "./features/auth/pages/LoginPage";
import { InventoryPage } from "./features/inventory/pages/InventoryPage";

// Import necessary UI components
import { Spinner } from "./components/ui/spinner";
import ItemDetailsPage from "./features/items/pages/ItemDetailsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initial check for a saved state
    const checkInitialLogin = async () => {
      const response = await supabase.auth.getSession();
      setSession(response.data.session);
      setIsChecking(false);
    };

    checkInitialLogin();

    // To create a new session, in case user logs out
    const listener = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // To prevent creation of multiple listeners, once user navigates away from the login page
    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  // Check 1, If ischecking is ON, the loading speinner is triggered
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/50">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  // Check 2, if the user is not logged in, the user is teleported to login screen, the backdoor is shut
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
  // Upon reaching this point, the user is authenticated
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:id"
          element={<ItemDetailsPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}