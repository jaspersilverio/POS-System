


const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Add sections: */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <StatsCard title="Total Sales" value="$1,234" />
        <StatsCard title="Active Users" value="15" />
      </div>
      <UserTable /> {/* Example sub-component */}
    </div>
  );
};

export default AdminDashboard;