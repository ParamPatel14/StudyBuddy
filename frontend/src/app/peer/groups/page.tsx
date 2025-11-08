'use client';

import { useState, useEffect } from 'react';
import { UsersRound, Users, Target, ArrowRight, Check } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  room_type: string;
  goal: string;
  current_members: number;
  max_members: number;
  members: string[];
}

export default function StudyGroups() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/peer/groups');
      const data = await response.json();
      setGroups(data.groups);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/peer/groups/${groupId}/join`, {
        method: 'POST'
      });
      const data = await response.json();
      alert(data.message);
      loadGroups();
    } catch (error: any) {
      alert(error.message || 'Failed to join group');
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'placement_prep': return 'from-purple-500 to-purple-600';
      case 'dsa_prep': return 'from-blue-500 to-blue-600';
      case 'subject_prep': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'placement_prep': return '💼 Placement Prep';
      case 'dsa_prep': return '💻 DSA Practice';
      case 'subject_prep': return '📚 Subject Study';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <UsersRound className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Groups</h1>
          <p className="text-gray-600">Join focused prep rooms • Max 6 members per group</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className={`h-2 bg-linear-to-r ${getRoomTypeColor(group.room_type)}`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-600 mb-2 block">
                      {getRoomTypeLabel(group.room_type)}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      {group.goal}
                    </p>
                  </div>
                </div>

                {/* Members */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Members</span>
                    <span className="text-sm text-gray-600">
                      {group.current_members}/{group.max_members}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full bg-linear-to-r ${getRoomTypeColor(group.room_type)}`}
                      style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.members.map((member, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={group.current_members >= group.max_members}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center ${
                    group.current_members >= group.max_members
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : `bg-linear-to-r ${getRoomTypeColor(group.room_type)} text-white hover:opacity-90`
                  }`}
                >
                  {group.current_members >= group.max_members ? (
                    <>Group Full</>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Join Group
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
