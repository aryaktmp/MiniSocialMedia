import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Index from "./pages";
import AuthLayout from "./components/layout/AuthLayout";
import GuestLayout from "./components/layout/GuestLayout";
import DetailLayout from "./components/layout/DetailLayout";
import YourStatus from "./pages/status/yourStatus";
import AllStatus from "./pages/status/allStatus";
import DetailStatus from "./pages/status/detailStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/rekin/"
          element={
            <GuestLayout>
              <Index />
            </GuestLayout>
          }
        >
          <Route path="all" element={<AllStatus />} />
          <Route path="your-status" element={<YourStatus />} />
        </Route>
        <Route
          path="/rekin/:username/status/:id"
          element={
            <DetailLayout>
              <DetailStatus />
            </DetailLayout>
          }
        />
        <Route
          path="/rekin/home/"
          element={
            <AuthLayout>
              <Index />
            </AuthLayout>
          }
        >
          <Route path="all" element={<AllStatus />} />
          <Route path="your-status" element={<YourStatus />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
