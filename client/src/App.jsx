import { useAuth } from "./context/AuthProvider";
import { LoaderMain } from "./components/Loader";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ItemPage from "./pages/ItemPage";

const App = () => {
  const { isLoading, isAuthenticated, user } = useAuth();
  if (isLoading) return <LoaderMain />;
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <Signup /> : <Navigate to={"/dashboard"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to={"/dashboard"} />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to={"/login"} />}
        />
        <Route path="/item/:itemId" element={<ItemPage />} />{" "}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors />
    </div>
  );
};

export default App;
