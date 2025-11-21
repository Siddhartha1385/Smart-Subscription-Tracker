import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DemoDashboardLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />

        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-700">
            Demo Dashboard Layout
          </h1>
          <p className="mt-3 text-gray-600">
            If you can see this with sidebar + navbar, your layout works!
          </p>
        </main>
      </div>
    </div>
  );
}
