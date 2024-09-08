import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: '', head: '' });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7097/api/Departments/GetAll')
      .then(response => setDepartments(response.data))
      .catch(error => console.error('Error fetching departments:', error));

    axios.get('https://localhost:7097/api/Teachers/GetAll')
      .then(response => setTeachers(response.data))
      .catch(error => console.error('Error fetching teachers:', error));
  }, []);

  const addDepartment = () => {
    axios.post('https://localhost:7097/api/Departments/Add', newDepartment)
      .then(response => {
        setDepartments([...departments, { ...newDepartment, id: departments.length + 1 }]); // Добавить временный ID
        setNewDepartment({ name: '', head: '' });
      })
      .catch(error => console.error('Error adding department:', error));
  };

  const deleteDepartment = (id) => {
    axios.delete(`https://localhost:7097/api/Departments/Delete/${id}`)
      .then(() => setDepartments(departments.filter(department => department.id !== id)))
      .catch(error => console.error('Error deleting department:', error));
  };

  const editDepartment = (id) => {
    axios.put('https://localhost:7097/api/Departments/Edit', { ...newDepartment, id })
      .then(() => {
        setDepartments(departments.map(department =>
          department.id === id ? { ...department, ...newDepartment } : department
        ));
        setEditingDepartment(null);
        setNewDepartment({ name: '', head: '' });
      })
      .catch(error => console.error('Error updating department:', error));
  };

  const addTeacherToDepartment = (departmentId) => {
    axios.post(`https://localhost:7097/api/Departments/AddTeacher/${departmentId}/${selectedTeacher}`)
      .then(() => alert('Teacher added to department successfully'))
      .catch(error => console.error('Error adding teacher to department:', error));
  };

  const removeTeacherFromDepartment = (departmentId, teacherId) => {
    axios.delete(`https://localhost:7097/api/Departments/RemoveTeacher/${departmentId}/${teacherId}`)
      .then(() => alert('Teacher removed from department successfully'))
      .catch(error => console.error('Error removing teacher from department:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Departments Management</h1>

        {/* Form for adding/editing a department */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingDepartment ? 'Edit Department' : 'Add New Department'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingDepartment) {
                editDepartment(editingDepartment.id);
              } else {
                addDepartment();
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={newDepartment.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Head:</label>
              <input
                type="text"
                name="head"
                value={newDepartment.head}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingDepartment ? 'Update Department' : 'Add Department'}
            </button>
          </form>
        </div>

        {/* Table for displaying departments */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-blue-200 text-left">Name</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Head</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Actions</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Add Teacher</th>
                <th className="py-2 px-4 bg-blue-200 text-left">Remove Teacher</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id} className="border-t">
                  <td className="py-2 px-4">{department.name}</td>
                  <td className="py-2 px-4">{department.head}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                      onClick={() => {
                        setEditingDepartment(department);
                        setNewDepartment({ name: department.name, head: department.head });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => deleteDepartment(department.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={selectedTeacher || ''}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mt-2"
                      onClick={() => addTeacherToDepartment(department.id)}
                    >
                      Add
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    {department.teachers.map(teacher => (
                      <button
                        key={teacher.id}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-2 mr-2"
                        onClick={() => removeTeacherFromDepartment(department.id, teacher.id)}
                      >
                        Remove {teacher.name}
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

export default Departments;
