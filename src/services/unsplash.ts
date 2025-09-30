const BASE_URL = "https://api.unsplash.com";
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export async function getPhotos(page = 1, perPage = 20) {
  if (!ACCESS_KEY) {
    throw new Error(
      "Unsplash Access Key is missing! Did you set REACT_APP_UNSPLASH_ACCESS_KEY in .env?"
    );
  }

  const url = `${BASE_URL}/photos?page=${page}&per_page=${perPage}&client_id=${ACCESS_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
