import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '' });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7097/api/Students/GetAll')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const addStudent = () => {
    axios.post('https://localhost:7097/api/Students/Add', newStudent)
      .then(response => {
        setStudents([...students, { ...newStudent, id: students.length + 1 }]); // Добавить временный ID
        setNewStudent({ name: '', age: '' });
      })
      .catch(error => console.error('Error adding student:', error));
  };

  const deleteStudent = (id) => {
    axios.delete(`https://localhost:7097/api/Students/Delete/${id}`)
      .then(() => setStudents(students.filter(student => student.id !== id)))
      .catch(error => console.error('Error deleting student:', error));
  };

  const editStudent = (id) => {
    axios.put('https://localhost:7097/api/Students/Edit', { ...newStudent, id })
      .then(() => {
        setStudents(students.map(student =>
          student.id === id ? { ...student, ...newStudent } : student
        ));
        setEditingStudent(null);
        setNewStudent({ name: '', age: '' });
      })
      .catch(error => console.error('Error updating student:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Students Management</h1>

        {/* Form for adding/editing a student */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingStudent) {
                editStudent(editingStudent.id);
              } else {
                addStudent();
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Age:</label>
              <input
                type="number"
                name="age"
                value={newStudent.age}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </form>
        </div>

        {/* Table for displaying students */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-blue-200 text-left">Name</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Age</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.age}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                      onClick={() => {
                        setEditingStudent(student);
                        setNewStudent({ name: student.name, age: student.age });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => deleteStudent(student.id)}
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

export default Students;
