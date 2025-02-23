import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Menu from "./Menu.jsx";
import System from "./System.jsx";
import Connection from "./Connection.jsx";
import Settings from "./Settings.jsx";
import Account from "./Account.jsx";
import History from "./History.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* เส้นทางหลัก */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/System" element={<System />} />
        <Route path="/Connection" element={<Connection />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/History" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
