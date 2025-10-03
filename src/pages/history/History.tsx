import React, { useState } from "react";
import { useSearch } from "../../context/SearchContext";
import Card from "../../components/card/Card";
import PhotoModal from "../../components/photoModal/PhotoModal";
import { getPhotoStats, GalleryPhoto } from "../../services/api";
import "../history/History.css";

export default function History() {
  const { searchHistory, cache } = useSearch();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [photoStats, setPhotoStats] = useState<{
    downloads: number;
    views: number;
    likes: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleHistoryClick = (term: string) => {
    setPhotos(cache[term] || []);
  };

  const handlePhotoClick = async (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setModalOpen(true);

    try {
      const stats = await getPhotoStats(photo.id);
      setPhotoStats({
        downloads: stats.downloads,
        views: stats.views,
        likes: stats.likes,
      });
    } catch (err) {
      console.error(err);
      setPhotoStats(null);
    }
  };

  return (
    <div className="history-container">
      <h2>Search History</h2>
      <div className="history-buttons">
        {searchHistory.map((term, index) => (
          <React.Fragment key={term}>
            <button onClick={() => handleHistoryClick(term)}>{term}</button>
            {index < searchHistory.length - 1 && (
              <span className="separator">&gt;</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="image-grid">
        {photos.map((p) => (
          <Card
            key={p.id}
            id={p.id}
            imageUrl={p.urls.small}
            alt={p.alt_description}
            author={p.user.name}
            likes={p.likes}
            onClick={() => handlePhotoClick(p)}
          />
        ))}
      </div>

      {modalOpen && selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          stats={photoStats}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
