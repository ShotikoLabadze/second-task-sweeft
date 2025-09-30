import React, { useEffect, useState } from "react";
import { getPhotos, UnsplashPhoto } from "../../services/unsplash";
import Card from "../../components/card/Card";
import "./Home.css";

export default function Home() {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    // fetch first 20 popular photos
    fetchPhotos(page);
  }, []);

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

  useEffect(() => {
    if (page === 1) return;
    fetchPhotos(page);
  }, [page]);

  return (
    <div className="home-container">
      <h1 className="home-title">Unsplash Photos</h1>
      <div className="image-grid">
        {photos.map((p) => (
          <Card
            key={p.id}
            id={p.id}
            imageUrl={p.urls.small}
            alt={p.alt_description}
            author={p.user.name}
            likes={p.likes}
          />
        ))}
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
    </div>
  );
}
