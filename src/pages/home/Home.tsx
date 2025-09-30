import React, { useEffect, useState } from "react";
import { getPhotos } from "../../services/unsplash";

type Photo = {
  id: string;
  urls: { small: string };
  alt_description: string | null;
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    getPhotos().then(setPhotos).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Unsplash Photos</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {photos.map((p) => (
          <img
            key={p.id}
            src={p.urls.small}
            alt={p.alt_description || "Unsplash"}
          />
        ))}
      </div>
    </div>
  );
}
