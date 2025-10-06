import React, { useEffect, useState } from "react";
import EditMemberForm from "../../pages/EditMemberForm";
import { CheckCircle } from "lucide-react";
import Loader from "../common/Loader";

interface Member {
  memberId: string;
  nric: string;
  fullName1: string;
  dob: string;
  email: string;
  gender: string;
  hasAccess?: boolean;
  userId?: string;
}

interface MemberTableProps {
  refreshTrigger: number;
}

const apiBaseUrl = (window as any)._env_?.API_BASE_URL || 'https://localhost:7181';

export default function MemberTable({ refreshTrigger }: MemberTableProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("local");

  // ✅ Fetch members and check user access
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/member/list`);
      const data = await response.json();

      let membersArray: Member[] = [];
      if (Array.isArray(data)) {
        membersArray = data;
      } else if (Array.isArray(data.data)) {
        membersArray = data.data;
      }

      // Check access for each member
      const withAccessInfo = await Promise.all(
        membersArray.map(async (member) => {
          try {
            // Call API to find userId by memberId
            const res = await fetch(
              `${apiBaseUrl}/api/useraccount/by-member/${member.memberId}`
            );

            if (!res.ok) {
              return { ...member, hasAccess: false };
            }

            const user = await res.json();
            const userId = user.userID;

            // Check full user details
            const fullUserRes = await fetch(
              `${apiBaseUrl}/api/useraccount/${userId}`
            );
            const fullUserData = await fullUserRes.json();

            if (fullUserRes.ok && Object.keys(fullUserData).length > 0) {
              return { ...member, hasAccess: true, userId };
            } else {
              return { ...member, hasAccess: false };
            }
          } catch (err) {
            console.error("Error checking access:", err);
            return { ...member, hasAccess: false };
          }
        })
      );

      setMembers(withAccessInfo);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [refreshTrigger]);

  // ✅ Delete Member
  const handleDeleteMember = async (memberId: string) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const response = await fetch(
        
        `${apiBaseUrl}/api/member/delete/${memberId}?editedBy=adminUser`,
        { method: "DELETE" }
      );
      const result = await response.json();
      setMessage(result.message);
      fetchMembers();
    } catch (error: any) {
      setMessage("❌ " + error.message);
    }
  };

  // ✅ Revoke Access
  const handleRevokeAccess = async (userId: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/useraccount/delete/${userId}?editedBy=adminUser`,
        { method: "DELETE" }
      );
      const result = await response.json();
      setMessage(result.message);
      fetchMembers();
    } catch (error: any) {
      setMessage("❌ " + error.message);
    }
  };

  // ✅ Provide Access Modal
  const openAccessModal = (memberId: string) => {
    setSelectedMemberId(memberId);
    setUserId(memberId + "_login");
    setUserType("local");
    setShowAccessModal(true);
  };

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    try {
      const response = await fetch(`${apiBaseUrl}/api/useraccount/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: userId,
          memberID: selectedMemberId,
          userType: userType,
          pwd: "Default@123",
          createdBy: "adminUser",
        }),
      });
      const result = await response.json();
      setMessage(result.message);
      setShowAccessModal(false);
      fetchMembers();
    } catch (error: any) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="mt-6">
      {/* <h2 className="text-lg font-semibold mb-3 text-gray-800">Member List</h2> */}

      {message && (
        <div className="mb-4 p-2 rounded bg-gray-100 text-center">{message}</div>
      )}

      {loading ? (
        <div className="text-center py-4"><Loader /></div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
            <thead className="bg-cyan-600 text-white">
              <tr>
                <th className="px-4 py-3">Member ID</th>
                <th className="px-4 py-3">NRIC</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3 text-center">Access</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.memberId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{member.memberId}</td>
                    <td className="px-4 py-3">{member.nric}</td>
                    <td className="px-4 py-3">{member.fullName1}</td>
                    <td className="px-4 py-3">
                      {member.dob ? new Date(member.dob).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">{member.gender}</td>

                    {/* ✅ Access column with status check */}
                    <td className="px-4 py-3 text-center">
                      {member.hasAccess ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="text-green-600 w-5 h-5" />
                          <button
                            onClick={() => handleRevokeAccess(member.userId!)}
                            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Revoke
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openAccessModal(member.memberId)}
                          className="px-2 py-1 text-sm bg-cyan-800 text-white rounded hover:bg-cyan-700"
                        >
                          Provide Access
                        </button>
                      )}
                    </td>

                    {/* ✅ Actions column for member edit/delete */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setEditingMemberId(member.memberId)}
                        className="px-3 py-1 mr-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.memberId)}
                        className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Provide Access Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Provide Access
            </h2>

            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">User ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">User Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="admin">Admin</option>
                  <option value="local">Local</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAccessModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Edit Member Modal */}
      {editingMemberId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-3xl">
            <EditMemberForm
              memberId={editingMemberId}
              onClose={() => setEditingMemberId(null)}
              onUpdated={fetchMembers}
            />
          </div>
        </div>
      )}
    </div>
  );
}
