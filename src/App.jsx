import '@/assets/styles/index.css';
import SignupForm from '@/components/auth/SignupForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '@/components/Landing';
import LoginForm from './components/auth/LoginForm';

function App() {
  return (
    // 라우터
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
