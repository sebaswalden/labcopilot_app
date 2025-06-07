import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Import your components
import LabConfigurationForm from "./components/views/step1";
import LabMonitoringDashboard from "./components/views/step2"; // You'll need to create this file

// Navigation component
const NavigationHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isStep1 = location.pathname === "/step1" || location.pathname === "/";
  const isStep2 = location.pathname === "/step2";

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-neutral-50">
            Laboratory Copilot
          </h1>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isStep1
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-neutral-300"
              }`}
            >
              1
            </div>
            <span
              className={`text-sm ${isStep1 ? "text-neutral-50" : "text-neutral-400"}`}
            >
              Configuration
            </span>
          </div>

          <div
            className={`w-6 h-0.5 ${isStep2 ? "bg-blue-600" : "bg-neutral-700"}`}
          ></div>

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isStep2
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-neutral-300"
              }`}
            >
              2
            </div>
            <span
              className={`text-sm ${isStep2 ? "text-neutral-50" : "text-neutral-400"}`}
            >
              Monitoring
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          {isStep2 && (
            <Button
              onClick={() => navigate("/step1")}
              variant="outline"
              size="sm"
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Config
            </Button>
          )}

          {isStep1 && (
            <Button
              onClick={() => navigate("/step2")}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Monitoring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-950">
        <NavigationHeader />

        <Routes>
          {/* Redirect root to step1 */}
          <Route path="/" element={<Navigate to="/step1" replace />} />

          {/* Step 1: Configuration */}
          <Route path="/step1" element={<LabConfigurationForm />} />

          {/* Step 2: Monitoring Dashboard */}
          <Route path="/step2" element={<LabMonitoringDashboard />} />

          {/* Catch all - redirect to step1 */}
          <Route path="*" element={<Navigate to="/step1" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
