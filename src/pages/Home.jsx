import { Link } from 'react-router-dom';

function Home({ entries }) {
  return (
    <div className="content">
      <h1>Journal Hub</h1>
      <p>Explore my content with photos, songs, and podcasts.</p>
      <div className="entries">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <Link to={`/entry/${entry.id}`} key={entry.id}>
              <div className="entry">
                <h2>{entry.title}</h2>
                <p>{new Date(entry.created_at).toLocaleDateString()}</p>
                <p>{entry.content.substring(0, 50)}...</p>
                {entry.image_urls && entry.image_urls.length > 0 && <img src={entry.image_urls[0]} alt={entry.title} className="preview-image" />}
              </div>
            </Link>
          ))
        ) : (
          <p>No entries yet.</p>
        )}
      </div>
    </div>
  );
}

export default Home;