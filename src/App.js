import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Groups from './components/Groups';
import Faculties from './components/Faculties';
import Departments from './components/Departments';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
