import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '' });
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7097/api/Teachers/GetAll')
      .then(response => setTeachers(response.data))
      .catch(error => console.error('Error fetching teachers:', error));
  }, []);

  const addTeacher = () => {
    axios.post('https://localhost:7097/api/Teachers/Add', newTeacher)
      .then(response => {
        setTeachers([...teachers, { ...newTeacher, id: teachers.length + 1 }]); // Добавить временный ID
        setNewTeacher({ name: '', subject: '' });
      })
      .catch(error => console.error('Error adding teacher:', error));
  };

  const deleteTeacher = (id) => {
    axios.delete(`https://localhost:7097/api/Teachers/Delete/${id}`)
      .then(() => setTeachers(teachers.filter(teacher => teacher.id !== id)))
      .catch(error => console.error('Error deleting teacher:', error));
  };

  const editTeacher = (id) => {
    axios.put('https://localhost:7097/api/Teachers/Edit', { ...newTeacher, id })
      .then(() => {
        setTeachers(teachers.map(teacher =>
          teacher.id === id ? { ...teacher, ...newTeacher } : teacher
        ));
        setEditingTeacher(null);
        setNewTeacher({ name: '', subject: '' });
      })
      .catch(error => console.error('Error updating teacher:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Teachers Management</h1>

        {/* Form for adding/editing a teacher */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingTeacher) {
                editTeacher(editingTeacher.id);
              } else {
                addTeacher();
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={newTeacher.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subject:</label>
              <input
                type="text"
                name="subject"
                value={newTeacher.subject}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </form>
        </div>

        {/* Table for displaying teachers */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-blue-200 text-left">Name</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Subject</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-t">
                  <td className="py-2 px-4">{teacher.name}</td>
                  <td className="py-2 px-4">{teacher.subject}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                      onClick={() => {
                        setEditingTeacher(teacher);
                        setNewTeacher({ name: teacher.name, subject: teacher.subject });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => deleteTeacher(teacher.id)}
                    >
                      Delete
                    </button>
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

export default Teachers;
