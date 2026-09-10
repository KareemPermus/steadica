import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import HabitDetail from "./pages/HabitDetail";
import Checkins from "./pages/Checkins";
import Analytics from "./pages/Analytics";
import Reminders from "./pages/Reminders";
import Categories from "./pages/Categories";
import Tags from "./pages/Tags";

// Page imports will be injected by the build system

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Routes injected by page modules */}
                  <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/habits/:id" element={<HabitDetail />} />
          <Route path="/checkins" element={<Checkins />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tags" element={<Tags />} />
</Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;