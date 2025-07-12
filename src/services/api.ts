const API_BASE_URL = "https://sky-scrapper.p.rapidapi.com/api";
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

/**
 * Configure headers for RapidAPI
 */
const getHeaders = () => ({
  "X-RapidAPI-Key": API_KEY || "",
  "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
  "Content-Type": "application/json",
});

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error with status: ${response.status}`);
  }

  return response.json();
}

export async function fetchWithCache<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  return handleResponse(response) as Promise<T>;
}

export async function postData<T, R>(endpoint: string, data: T): Promise<R> {
  return fetchWithCache<R>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getData<T>(
  endpoint: string,
  queryParams?: Record<string, string>
): Promise<T> {
  let url = endpoint;

  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, value);
    });
    url = `${endpoint}?${params.toString()}`;
  }

  return fetchWithCache<T>(url);
}
