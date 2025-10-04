import { GalleryPhoto } from "../../api/api";
import "./PhotoModal.css";

type PhotoModalProps = {
  photo: GalleryPhoto;
  stats: { downloads: number; views: number; likes: number } | null;
  onClose: () => void;
};

export default function PhotoModal({ photo, stats, onClose }: PhotoModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={photo.urls.full} alt={photo.alt_description || "araris"} />
        {stats && (
          <div className="photo-stats">
            <p>Downloads: {stats.downloads}</p>
            <p>Views: {stats.views}</p>
            <p>Likes: {stats.likes}</p>
          </div>
        )}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
