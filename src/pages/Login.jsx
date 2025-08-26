import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser, supabase }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input name="email" type="email" value={loginData.email} onChange={handleChange} placeholder="Email" />
        <input name="password" type="password" value={loginData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;