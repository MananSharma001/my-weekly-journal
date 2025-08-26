import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EntryDetail from './pages/EntryDetail';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import About from './pages/About';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('journal_entries')
          .select('*')
          .order('created_at', { ascending: false });
        console.log('Fetched data:', data, 'Error:', fetchError); // Debug
        if (fetchError) throw fetchError;
        setEntries(data || []);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session data:', session, 'Session Error:', sessionError); // Debug
        if (sessionError) throw sessionError;
        setUser(session?.user || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user); // Debug
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home entries={entries} />} />
        <Route path="/entry/:id" element={<EntryDetail supabase={supabase} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setUser={setUser} supabase={supabase} />} />
        <Route path="/admin" element={user ? <AdminDashboard supabase={supabase} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App; // Ensure default export