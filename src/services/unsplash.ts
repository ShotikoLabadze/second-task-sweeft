const BASE_URL = "https://api.unsplash.com";
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

//fetch list of photos, popular ones by default
export async function getPhotos(page = 1, perPage = 20) {
  if (!ACCESS_KEY) {
    throw new Error(
      "Unsplash Access Key is missing! Did you set REACT_APP_UNSPLASH_ACCESS_KEY in .env?"
    );
  }

  const url = `${BASE_URL}/photos?page=${page}&per_page=${perPage}&order_by=popular&client_id=${ACCESS_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

//ty type for photo
export type UnsplashPhoto = {
  id: string;
  urls: { small: string; full: string };
  alt_description: string | null;
  user: { name: string };
  likes: number;
};

//return photo with stats
export async function getPhotoStats(photoId: string) {
  if (!ACCESS_KEY) {
    throw new Error(
      "Unsplash Access Key is missing! Did you set REACT_APP_UNSPLASH_ACCESS_KEY in .env?"
    );
  }

  const url = `${BASE_URL}/photos/${photoId}?client_id=${ACCESS_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

//search photos

export async function searchPhotos(query: string, page = 1, perPage = 20) {
  if (!ACCESS_KEY)
    throw new Error(
      "Unsplash Access Key is missing! Did you set REACT_APP_UNSPLASH_ACCESS_KEY in .env?"
    );

  const url = `${BASE_URL}/search/photos?query=${query}&page=${page}&per_page=${perPage}&client_id=${ACCESS_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  return data.results;
}
