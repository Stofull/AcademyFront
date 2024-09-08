import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [newFaculty, setNewFaculty] = useState({ name: '' });
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7097/api/Faculties/GetAll')
      .then(response => setFaculties(response.data))
      .catch(error => console.error('Error fetching faculties:', error));

    axios.get('https://localhost:7097/api/Groups/GetAll')
      .then(response => setGroups(response.data))
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  const addFaculty = () => {
    axios.post('https://localhost:7097/api/Faculties/Add', newFaculty)
      .then(response => {
        setFaculties([...faculties, { ...newFaculty, id: faculties.length + 1 }]); // Добавить временный ID
        setNewFaculty({ name: '' });
      })
      .catch(error => console.error('Error adding faculty:', error));
  };

  const deleteFaculty = (id) => {
    axios.delete(`https://localhost:7097/api/Faculties/Delete/${id}`)
      .then(() => setFaculties(faculties.filter(faculty => faculty.id !== id)))
      .catch(error => console.error('Error deleting faculty:', error));
  };

  const editFaculty = (id) => {
    axios.put('https://localhost:7097/api/Faculties/Edit', { ...newFaculty, id })
      .then(() => {
        setFaculties(faculties.map(faculty =>
          faculty.id === id ? { ...faculty, ...newFaculty } : faculty
        ));
        setEditingFaculty(null);
        setNewFaculty({ name: '' });
      })
      .catch(error => console.error('Error updating faculty:', error));
  };

  const addGroupToFaculty = (facultyId) => {
    axios.post(`https://localhost:7097/api/Faculties/AddGroup/${facultyId}/${selectedGroup}`)
      .then(() => alert('Group added to faculty successfully'))
      .catch(error => console.error('Error adding group to faculty:', error));
  };

  const removeGroupFromFaculty = (facultyId, groupId) => {
    axios.delete(`https://localhost:7097/api/Faculties/RemoveGroup/${facultyId}/${groupId}`)
      .then(() => alert('Group removed from faculty successfully'))
      .catch(error => console.error('Error removing group from faculty:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Faculties Management</h1>

        {/* Form for adding/editing a faculty */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingFaculty) {
                editFaculty(editingFaculty.id);
              } else {
                addFaculty();
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={newFaculty.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
            </button>
          </form>
        </div>

        {/* Table for displaying faculties */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-blue-200 text-left">Name</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Actions</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Add Group</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Remove Group</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.id} className="border-t">
                  <td className="py-2 px-4">{faculty.name}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                      onClick={() => {
                        setEditingFaculty(faculty);
                        setNewFaculty({ name: faculty.name });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => deleteFaculty(faculty.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={selectedGroup || ''}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mt-2"
                      onClick={() => addGroupToFaculty(faculty.id)}
                    >
                      Add
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    {faculty.groups.map(group => (
                      <button
                        key={group.id}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-2 mr-2"
                        onClick={() => removeGroupFromFaculty(faculty.id, group.id)}
                      >
                        Remove {group.name}
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

export default Faculties;
