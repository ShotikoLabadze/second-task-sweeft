import React, { useState, useEffect, useRef } from "react";
import {
  getPhotos,
  searchPhotos,
  getPhotoStats,
  GalleryPhoto,
} from "../../api/api";
import Card from "../../components/card/Card";
import PhotoModal from "../../components/photoModal/PhotoModal";
import SearchBar from "../../components/searchBar/SearchBar";
import { useSearch } from "../../context/SearchContext";
import "./Home.css";

const PHOTOS_PER_PAGE = 20;

export default function Home() {
  const { addSearchTerm, cache, updateCache } = useSearch();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [photoStats, setPhotoStats] = useState<{
    downloads: number;
    views: number;
    likes: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const currentTermRef = useRef<string>("popular");

  // Fetch photos (popular or search)
  const fetchPhotos = async (term: string, pageNumber: number) => {
    if (loading) return;
    setLoading(true);
    try {
      let newPhotos: GalleryPhoto[] = [];

      // Use cache if first page
      if (cache[term] && pageNumber === 1) {
        newPhotos = cache[term];
      } else {
        if (term === "popular") {
          newPhotos = await getPhotos(pageNumber, PHOTOS_PER_PAGE);
        } else {
          newPhotos = await searchPhotos(term, pageNumber, PHOTOS_PER_PAGE);
        }

        // Update cache
        const prev = pageNumber === 1 ? [] : cache[term] || [];
        updateCache(term, [...prev, ...newPhotos]);
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

  // Initial load
  useEffect(() => {
    currentTermRef.current = "popular";
    fetchPhotos("popular", 1);
    setPage(1);
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

  // Fetch next page
  useEffect(() => {
    if (page === 1) return;
    fetchPhotos(currentTermRef.current, page);
  }, [page]);

  // Search term changes
  useEffect(() => {
    const delay = setTimeout(() => {
      const term = searchTerm.trim() === "" ? "popular" : searchTerm;
      currentTermRef.current = term;
      setPage(1);
      fetchPhotos(term, 1);

      if (term !== "popular") addSearchTerm(term);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

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
    <div className="home-container">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div className="image-grid">
        {photos.map((p, idx) => (
          <Card
            key={`${currentTermRef.current}-${p.id}-${idx}`}
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
