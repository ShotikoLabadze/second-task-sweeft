export type GalleryPhoto = {
  id: string;
  urls: { small: string; full: string };
  alt_description: string | null;
  user: { name: string };
  likes: number;
};

const BASE_URL = "https://api.unsplash.com";
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) throw new Error("Unsplash Access Key is missing!");

// Fetch popular or latest photos
export async function getPhotos(
  page = 1,
  perPage = 20,
  order: "popular" | "latest" = "popular"
): Promise<GalleryPhoto[]> {
  const res = await fetch(
    `${BASE_URL}/photos?page=${page}&per_page=${perPage}&order_by=${order}&client_id=${ACCESS_KEY}`
  );

  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

// Search photos
export async function searchPhotos(
  query: string,
  page = 1,
  perPage = 20
): Promise<GalleryPhoto[]> {
  const res = await fetch(
    `${BASE_URL}/search/photos?query=${query}&page=${page}&per_page=${perPage}&client_id=${ACCESS_KEY}`
  );

  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return data.results;
}

// Get photo statistics
export async function getPhotoStats(photoId: string) {
  const res = await fetch(
    `${BASE_URL}/photos/${photoId}?client_id=${ACCESS_KEY}`
  );
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}
