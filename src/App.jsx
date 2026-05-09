import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage.jsx';
import SessionPage from './pages/SessionPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session/:id" element={<SessionPage />} />
      </Routes>
    </BrowserRouter>
  );
}