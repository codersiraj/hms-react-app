import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const visitData = [
  { month: "Jan", visits: 120 },
  { month: "Feb", visits: 150 },
  { month: "Mar", visits: 170 },
  { month: "Apr", visits: 130 },
  { month: "May", visits: 190 },
];

const pieData = [
  { name: "General", value: 400 },
  { name: "Emergency", value: 200 },
  { name: "Maternity", value: 100 },
  { name: "Cardiology", value: 300 },
];

const COLORS = ["#00bcd4", "#ff9800", "#4caf50", "#e91e63"];

const appointments = [
  { time: "09:00 AM", name: "Arun Kumar", doctor: "Dr. Meena", status: "Waiting" },
  { time: "10:00 AM", name: "Sara Devi", doctor: "Dr. Anil", status: "Consulted" },
  { time: "11:30 AM", name: "Ravi Teja", doctor: "Dr. Bala", status: "In Consultation" },
];

const feedbacks = [
  { name: "John D.", feedback: "Excellent consultation experience", rating: 5 },
  { name: "Aisha K.", feedback: "Waiting time could be reduced", rating: 3 },
];

const PatientDashboard = () => {
  return (
    <div className="p-4 bg-[#ebf0f4] min-h-screen">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">Patient Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Active Patient Count */}
        <div className="bg-white rounded-2xl shadow p-6 w-full">
          <p className="text-sm text-gray-500 mb-2">Active Patients</p>
          <p className="text-3xl font-bold text-[#1d4e89]">128</p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-6 w-full overflow-x-auto">
          <h3 className="text-lg font-semibold text-[#00575d] mb-4">Patient Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Visits */}
        <div className="bg-white rounded-2xl shadow p-6 w-full overflow-x-auto">
          <h3 className="text-lg font-semibold text-[#00575d] mb-4">Monthly Visits</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visitData}>
              <XAxis dataKey="month" stroke="#003366" />
              <YAxis stroke="#003366" />
              <Tooltip />
              <Bar dataKey="visits" fill="#73d2de" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-[#00575d] mb-4">Today's Appointments</h3>
        <table className="w-full text-sm text-left min-w-[500px]">
          <thead className="text-[#003366] border-b">
            <tr>
              <th className="py-2">Time</th>
              <th className="py-2">Patient Name</th>
              <th className="py-2">Doctor</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, i) => (
              <tr key={i} className="border-b text-[#1d4e89]">
                <td className="py-2">{appt.time}</td>
                <td className="py-2">{appt.name}</td>
                <td className="py-2">{appt.doctor}</td>
                <td
                  className={`py-2 ${
                    appt.status === "Waiting"
                      ? "text-yellow-500"
                      : appt.status === "Consulted"
                      ? "text-green-600"
                      : "text-blue-500"
                  }`}
                >
                  {appt.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.map((f, idx) => (
          <div key={idx} className="bg-white shadow p-4 rounded-2xl">
            <p className="text-[#1d4e89] font-medium">{f.name}</p>
            <p className="text-gray-500 text-sm mb-2">"{f.feedback}"</p>
            <div className="text-yellow-500 text-sm">
              {Array.from({ length: f.rating }, (_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
