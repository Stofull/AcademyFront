import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: '', teacher: '' });
  const [editingGroup, setEditingGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7097/api/Groups/GetAll')
      .then(response => setGroups(response.data))
      .catch(error => console.error('Error fetching groups:', error));

    axios.get('https://localhost:7097/api/Students/GetAll')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const addGroup = () => {
    axios.post('https://localhost:7097/api/Groups/Add', newGroup)
      .then(response => {
        setGroups([...groups, { ...newGroup, id: groups.length + 1 }]); // Добавить временный ID
        setNewGroup({ name: '', teacher: '' });
      })
      .catch(error => console.error('Error adding group:', error));
  };

  const deleteGroup = (id) => {
    axios.delete(`https://localhost:7097/api/Groups/Delete/${id}`)
      .then(() => setGroups(groups.filter(group => group.id !== id)))
      .catch(error => console.error('Error deleting group:', error));
  };

  const editGroup = (id) => {
    axios.put('https://localhost:7097/api/Groups/Edit', { ...newGroup, id })
      .then(() => {
        setGroups(groups.map(group =>
          group.id === id ? { ...group, ...newGroup } : group
        ));
        setEditingGroup(null);
        setNewGroup({ name: '', teacher: '' });
      })
      .catch(error => console.error('Error updating group:', error));
  };

  const addStudentToGroup = (groupId) => {
    axios.post(`https://localhost:7097/api/Groups/AddStudent/${groupId}/${selectedStudent}`)
      .then(() => alert('Student added to group successfully'))
      .catch(error => console.error('Error adding student to group:', error));
  };

  const removeStudentFromGroup = (groupId, studentId) => {
    axios.delete(`https://localhost:7097/api/Groups/RemoveStudent/${groupId}/${studentId}`)
      .then(() => alert('Student removed from group successfully'))
      .catch(error => console.error('Error removing student from group:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Groups Management</h1>

        {/* Form for adding/editing a group */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingGroup ? 'Edit Group' : 'Add New Group'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingGroup) {
                editGroup(editingGroup.id);
              } else {
                addGroup();
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={newGroup.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Teacher:</label>
              <input
                type="text"
                name="teacher"
                value={newGroup.teacher}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingGroup ? 'Update Group' : 'Add Group'}
            </button>
          </form>
        </div>

        {/* Table for displaying groups */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-blue-200 text-left">Name</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Teacher</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Actions</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Add Student</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Remove Student</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-t">
                  <td className="py-2 px-4">{group.name}</td>
                  <td className="py-2 px-4">{group.teacher}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                      onClick={() => {
                        setEditingGroup(group);
                        setNewGroup({ name: group.name, teacher: group.teacher });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => deleteGroup(group.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={selectedStudent || ''}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mt-2"
                      onClick={() => addStudentToGroup(group.id)}
                    >
                      Add
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    {group.students.map(student => (
                      <button
                        key={student.id}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-2 mr-2"
                        onClick={() => removeStudentFromGroup(group.id, student.id)}
                      >
                        Remove {student.name}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Groups;
