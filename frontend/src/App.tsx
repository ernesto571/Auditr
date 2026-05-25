import { Routes, Route, Navigate} from "react-router-dom";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AuthListener from "./hooks/AuthListener";
import { useAuthStore } from "./store/AuthStore";
import type React from "react";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";

interface RouteProps {
  children: React.ReactNode;
}

// const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
//   const { user, isLoading } = useAuthStore();

//   if (isLoading) return null;
//   if (!user) {
//       toast.error("Sign in to view this page.");
//       return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// };


function App() {
  // const { isLoading, user } = useAuthStore();

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <Loader className="size-10 animate-spin textprimary[#9D174D]" />
  //     </div>
  //   );
  // }

  return (
    <>
      <AuthListener />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <><Navbar /><SignUpPage /></>} /> */}
        {/* <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} /> */}
        {/* <Route path="/auth/callback" element={<AuthCallback />} /> */}
        {/* <Route path="/dashboard" element={<><Topbar /><Dashboard /></>} /> */}
        {/* <Route path="/dashboard/history" element={<ProtectedRoute><Topbar /><History /></ProtectedRoute>} /> */}
        {/* <Route path="/dashboard/my-documents" element={<ProtectedRoute><Topbar /><SavedDocs /></ProtectedRoute>} /> */}
        {/* <Route path="/dashboard/profile" element={<ProtectedRoute><Topbar /><ProfilePage /></ProtectedRoute>} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: { background: "#1f2937", color: "#fff", borderRadius: "10px" },
        }}
      />
    </>
  );
}

export default App;