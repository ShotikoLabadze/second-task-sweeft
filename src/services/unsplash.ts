import axios from "axios";

const BASE_URL = "https://api.unsplash.com";
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) throw new Error("Unsplash Access Key is missing!");

export type UnsplashPhoto = {
  id: string;
  urls: { small: string; full: string };
  alt_description: string | null;
  user: { name: string };
  likes: number;
};

// Fetch popular or latest photos
export async function getPhotos(
  page = 1,
  perPage = 20,
  order: "popular" | "latest" = "popular"
): Promise<UnsplashPhoto[]> {
  const res = await axios.get(`${BASE_URL}/photos`, {
    params: { page, per_page: perPage, order_by: order },
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  return res.data;
}

// Search photos
export async function searchPhotos(
  query: string,
  page = 1,
  perPage = 20
): Promise<UnsplashPhoto[]> {
  const res = await axios.get(`${BASE_URL}/search/photos`, {
    params: { query, page, per_page: perPage },
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  return res.data.results;
}

// Get photo statistics
export async function getPhotoStats(photoId: string) {
  const res = await axios.get(`${BASE_URL}/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  return res.data;
}
