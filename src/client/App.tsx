import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import FileDetail from "./components/FileDetail";
import Register from "./components/Register";

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/file/:id" element={<FileDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
