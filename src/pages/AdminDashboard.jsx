import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ supabase }) {
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    image_urls: '',
    song_url: '',
    song_title: '',
    podcast_url: '',
    podcast_title: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { data, error } = await supabase.storage
        .from('journal-images')
        .upload(`public/${Date.now()}_${file.name}`, file, { upsert: true });
      console.log('Upload data:', data, 'Upload error:', error); // Debug
      if (error) throw error;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/journal-images/${data.path}`;
      setNewEntry((prev) => ({
        ...prev,
        image_urls: prev.image_urls ? `${prev.image_urls},${url}` : url,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrlsArray = newEntry.image_urls.split(',').map(url => url.trim()).filter(url => url);
      const { error } = await supabase.from('journal_entries').insert({
        title: newEntry.title,
        content: newEntry.content,
        image_urls: imageUrlsArray.length ? imageUrlsArray : null,
        song_url: newEntry.song_url || null,
        song_title: newEntry.song_title || null,
        podcast_url: newEntry.podcast_url || null,
        podcast_title: newEntry.podcast_title || null,
        created_at: new Date().toISOString(),
      });
      console.log('Insert error:', error); // Debug
      if (error) throw error;
      setNewEntry({
        title: '',
        content: '',
        image_urls: '',
        song_url: '',
        song_title: '',
        podcast_url: '',
        podcast_title: '',
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content">
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" value={newEntry.title} onChange={handleChange} placeholder="Title" />
        <textarea name="content" value={newEntry.content} onChange={handleChange} placeholder="Content" />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <input name="image_urls" value={newEntry.image_urls} onChange={handleChange} placeholder="Image URLs (comma-separated)" />
        <input name="song_url" value={newEntry.song_url} onChange={handleChange} placeholder="Song URL (Spotify/YouTube)" />
        <input name="song_title" value={newEntry.song_title} onChange={handleChange} placeholder="Song Title" />
        <input name="podcast_url" value={newEntry.podcast_url} onChange={handleChange} placeholder="Podcast URL (YouTube)" />
        <input name="podcast_title" value={newEntry.podcast_title} onChange={handleChange} placeholder="Podcast Title" />
        <button type="submit">Create Entry</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default AdminDashboard;