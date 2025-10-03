import React, { useEffect, useState } from "react";
import {
  getPhotos,
  getPhotoStats,
  searchPhotos,
  GalleryPhoto,
} from "../../services/api";
import Card from "../../components/card/Card";
import PhotoModal from "../../components/photoModal/PhotoModal";
import SearchBar from "../../components/searchBar/SearchBar";
import { useSearch } from "../../context/SearchContext";
import "./Home.css";

export default function Home() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // modal states
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [photoStats, setPhotoStats] = useState<{
    downloads: number;
    views: number;
    likes: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Context for caching and history
  const { addSearchTerm, cache, updateCache } = useSearch();

  // Fetch photos (popular or search)
  const fetchPhotos = async (pageNumber: number) => {
    setLoading(true);
    try {
      let newPhotos: GalleryPhoto[] = [];

      if (searchTerm.trim() === "") {
        if (cache["popular"] && pageNumber === 1) {
          setPhotos(cache["popular"]);
          setLoading(false);
          return;
        }
        newPhotos = await getPhotos(pageNumber, 20);
        if (pageNumber === 1) updateCache("popular", newPhotos);
      } else {
        if (cache[searchTerm] && pageNumber === 1) {
          setPhotos(cache[searchTerm]);
          setLoading(false);
          return;
        }
        newPhotos = await searchPhotos(searchTerm, pageNumber, 20);
        if (pageNumber === 1) {
          updateCache(searchTerm, newPhotos);
          addSearchTerm(searchTerm);
        }
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

  // Fetch when searchTerm changes
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchPhotos(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Open modal
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
    <div className="home-container">
      {/* Search bar */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {/* Photos Grid */}
      <div className="image-grid">
        {photos.map((p, index) => (
          <Card
            key={`${p.id}-${index}`}
            id={p.id}
            imageUrl={p.urls.small}
            alt={p.alt_description}
            author={p.user.name}
            likes={p.likes}
            onClick={() => handlePhotoClick(p)}
          />
        ))}
      </div>

      {/* loading indicator */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* modal */}
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
