import React from "react";
import "../../pages/home/Home.css";

type CardProps = {
  id: string;
  imageUrl: string;
  alt?: string | null;
  author?: string;
  likes?: number;
  onClick?: () => void;
};

export default function Card({
  id,
  imageUrl,
  alt,
  author,
  likes,
  onClick,
}: CardProps) {
  return (
    <div className="image-card" onClick={onClick}>
      <img src={imageUrl} alt={alt || "Unsplash"} />
      {author || likes ? (
        <div className="image-info">
          {author && <div className="image-author">{author}</div>}
          {likes !== undefined && <div className="image-likes">{likes} ❤</div>}
        </div>
      ) : null}
    </div>
  );
}
