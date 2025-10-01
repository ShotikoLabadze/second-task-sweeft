import React, { useEffect, useState } from "react";
import {
  getPhotos,
  getPhotoStats,
  UnsplashPhoto,
  searchPhotos,
} from "../../services/unsplash";
import Card from "../../components/card/Card";
import "./Home.css";
import PhotoModal from "../../components/photoModal/PhotoModal";
import SearchBar from "../../components/searchBar/SearchBar";

export default function Home() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //search
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(
    null
  );
  const [photoStats, setPhotoStats] = useState<{
    downloads: number;
    views: number;
    likes: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPhotos = async (pageNumber: number) => {
    setLoading(true);
    try {
      const newPhotos = await getPhotos(pageNumber, 20);
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(page);
  }, []);

  //infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100 && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  //fetch when page changes
  useEffect(() => {
    if (page === 1) return;
    fetchPhotos(page);
  }, [page]);

  // opening modal
  const handlePhotoClick = async (photo: UnsplashPhoto) => {
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

  //fetch when search changes

  return (
    <div className="home-container">
      {/* search bar */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      {/* photos */}
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
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
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
