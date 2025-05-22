import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import POSForm from "./features/transactions/POSForm"; // ✅ Add this import

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/transactions" element={<POSForm />} /> {/* ✅ Add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
