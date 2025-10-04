import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import Card from "../../components/card/Card";
import PhotoModal from "../../components/photoModal/PhotoModal";
import {
  getPhotos,
  searchPhotos,
  getPhotoStats,
  GalleryPhoto,
} from "../../api/api";
import "../history/History.css";

const PHOTOS_PER_PAGE = 20;
const SCROLL_THROTTLE = 300;

export default function History() {
  const { searchHistory, cache, updateCache } = useSearch();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [currentTerm, setCurrentTerm] = useState<string | null>(null);
  const pageRef = useRef(1);
  const scrollTimeout = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [photoStats, setPhotoStats] = useState<{
    downloads: number;
    views: number;
    likes: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load photos from cache or API
  const loadPhotos = useCallback(
    async (term: string, page: number) => {
      if (loading) return;
      setLoading(true);

      try {
        let batch: GalleryPhoto[] = [];
        const cachedPhotos = cache[term] || [];

        const start = (page - 1) * PHOTOS_PER_PAGE;
        const end = start + PHOTOS_PER_PAGE;

        // If cache has enough photos for this page, use it
        if (cachedPhotos.length >= end) {
          batch = cachedPhotos.slice(start, end);
        } else {
          // Fetch more from API
          const fetchedPhotos =
            term === "popular"
              ? await getPhotos(page, PHOTOS_PER_PAGE)
              : await searchPhotos(term, page, PHOTOS_PER_PAGE);

          const updatedCache = [...cachedPhotos, ...fetchedPhotos];
          updateCache(term, updatedCache);
          batch = fetchedPhotos;
        }

        setPhotos((prev) => (page === 1 ? batch : [...prev, ...batch]));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [cache, updateCache, loading]
  );

  // Handle history term click
  const handleHistoryClick = (term: string) => {
    setCurrentTerm(term);
    pageRef.current = 1;
    loadPhotos(term, 1);
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!currentTerm) return;
      if (scrollTimeout.current) return;

      scrollTimeout.current = window.setTimeout(() => {
        scrollTimeout.current = null;
        const nextPage = pageRef.current + 1;
        loadPhotos(currentTerm, nextPage);
        pageRef.current = nextPage;
      }, SCROLL_THROTTLE);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [currentTerm, loadPhotos]);

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
    } catch {
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
        {photos.map((p, idx) => (
          <Card
            key={`${currentTerm}-${p.id}-${idx}`}
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
