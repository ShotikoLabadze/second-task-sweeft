import React, { useEffect, useState } from "react";
import {
  getPhotos,
  getPhotoStats,
  searchPhotos,
  UnsplashPhoto,
} from "../../services/unsplash";
import Card from "../../components/card/Card";
import PhotoModal from "../../components/photoModal/PhotoModal";
import SearchBar from "../../components/searchBar/SearchBar";
import "./Home.css";

export default function Home() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // modal states
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(
    null
  );
  const [photoStats, setPhotoStats] = useState<{
    downloads: number;
    views: number;
    likes: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch photos (popular or search)
  const fetchPhotos = async (pageNumber: number) => {
    setLoading(true);
    try {
      let newPhotos: UnsplashPhoto[] = [];
      if (searchTerm.trim() === "") {
        newPhotos = await getPhotos(pageNumber, 20, "popular"); // popular photos by default
      } else {
        newPhotos = await searchPhotos(searchTerm, pageNumber, 20);
      }

      setPhotos((prev) =>
        pageNumber === 1 ? newPhotos : [...prev, ...newPhotos]
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load first page
  useEffect(() => {
    fetchPhotos(1);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY + 100 >=
          document.body.offsetHeight &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // Fetch when page changes
  useEffect(() => {
    if (page === 1) return;
    fetchPhotos(page);
  }, [page]);

  // Fetch when searchTerm changes (reset page)
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchPhotos(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Open modal
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

  return (
    <div className="home-container">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
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
