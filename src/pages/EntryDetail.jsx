import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EntryDetail({ supabase }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', id)
          .single();
        console.log('Fetched entry:', data, 'Error:', fetchError); // Verify image_urls
        if (fetchError) throw fetchError;
        setEntry(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEntry();
  }, [id, supabase]);

  const handleAutoPlay = (url, containerId) => {
    if (url && document.getElementById(containerId)) {
      const iframe = document.createElement('iframe');
      if (url.includes('spotify.com')) {
        iframe.src = `https://open.spotify.com/embed/track/${url.split('/track/')[1].split('?')[0]}?autoplay=1`;
        iframe.height = "80";
      } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.height = "315";
      }
      iframe.width = "100%";
      iframe.frameBorder = "0";
      iframe.allow = "autoplay; encrypted-media";
      iframe.allowFullscreen = true;
      document.getElementById(containerId).innerHTML = '';
      document.getElementById(containerId).appendChild(iframe);
    }
  };

  useEffect(() => {
    if (entry) {
      if (entry.song_url) handleAutoPlay(entry.song_url, `song-${entry.id}`);
      if (entry.podcast_url) handleAutoPlay(entry.podcast_url, `podcast-${entry.id}`);
    }
  }, [entry]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!entry) return <div className="loading">Loading...</div>;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % entry.image_urls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + entry.image_urls.length) % entry.image_urls.length);
  };

  return (
    <div className="content">
      <h1>{entry.title}</h1>
      <p>{new Date(entry.created_at).toLocaleDateString()}</p>
      <p>{entry.content}</p>
      {entry.image_urls && entry.image_urls.length > 0 && (
        <div className="image-slider">
          <button onClick={prevImage} className="slider-button">← Previous</button>
          <div className="slider-image-container">
            {entry.image_urls[currentImageIndex] && (
              <img src={entry.image_urls[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} className="detail-image" />
            )}
          </div>
          <button onClick={nextImage} className="slider-button">Next →</button>
          <p>Image {currentImageIndex + 1} of {entry.image_urls.length}</p>
        </div>
      )}
      {entry.song_url && (
        <div id={`song-${entry.id}`} className="media">
          <p>Song: {entry.song_title || 'Untitled'}</p>
        </div>
      )}
      {entry.podcast_url && (
        <div id={`podcast-${entry.id}`} className="media">
          <p>Podcast: {entry.podcast_title || 'Untitled'}</p>
        </div>
      )}
      <button onClick={() => navigate('/')} className="back-button">Back to Home</button>
      <div className="connect-section">
        <h3>📲 Connect with Me</h3>
        <div className="connect-links">
          <a href="https://linkedin.com/in/manan-sharma-81819a256" target="_blank" rel="noopener noreferrer">📩 LinkedIn</a>
          <a href="mailto:manansharma0073@gmail.com" target="_blank" rel="noopener noreferrer">✉️ Email</a>
          <a href="https://github.com/MananSharma001" target="_blank" rel="noopener noreferrer">👨‍💻 GitHub</a>
        </div>
      </div>
    </div>
  );
}

export default EntryDetail;