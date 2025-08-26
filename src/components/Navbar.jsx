import { useNavigate } from 'react-router-dom';

function Navbar({ user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <button onClick={() => navigate('/')} className="nav-button">Home</button>
        <button onClick={() => navigate('/about')} className="nav-button">About</button>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <button onClick={handleLogout} className="nav-button">Logout</button>
            <button onClick={() => navigate('/admin')} className="nav-button">Admin</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="nav-button">Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;