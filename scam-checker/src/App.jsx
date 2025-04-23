import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ScamCheckerCategories from './pages/ScamCheckerCategories';
import Advice from './pages/Advice';
import ScamTrendsPage from './pages/ScamTrends'; // ✅ MATCHES the actual filename

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scam-checker" element={<ScamCheckerCategories />} />
      <Route path="/advice" element={<Advice />} />
      <Route path="/trends" element={<ScamTrendsPage />} /> {/* ✅ Updated reference */}
      <Route path="/contacts" element={<div>Contacts Page (TBD)</div>} />
      <Route path="/report" element={<div>Report Fraud Page (TBD)</div>} />
    </Routes>
  );
}

export default App;
