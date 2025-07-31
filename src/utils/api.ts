import { supabase } from './supabase';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Interfaces for API responses
export interface Genre {
  id: number;
  name: string;
}

export interface Media {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  media_type: 'movie' | 'tv';
  popularity: number;
  original_language: string;
  imdb_id?: string | null;
  runtime?: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  status?: string | null;
  tagline?: string | null;
  homepage?: string | null;
  genre_ids: number[];
}

export interface OmdbDetails {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}

export interface MediaDetails extends Media {
    omdbDetails: OmdbDetails | null;
}

export interface UserInteraction {
    user_id: string;
    movie_tv_id: number;
    media_type: 'movie' | 'tv';
    interaction_type: 'like' | 'dislike' | 'comment';
    comment_text?: string | null;
}

export interface Comment {
    comment_text: string;
    created_at: string;
    users: {
        username: string;
    } | null;
}


// Función para manejar errores de forma centralizada
const handleError = (error: any, message: string = "Ocurrió un error inesperado.") => {
  console.error("API Error:", message, error);
  throw new Error(message);
};

// Función para obtener géneros de TMDB y guardarlos en Supabase
export const fetchAndStoreGenres = async (): Promise<Genre[]> => {
  try {
    const [movieGenresRes, tvGenresRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`),
      fetch(`${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=es-ES`)
    ]);

    if (!movieGenresRes.ok || !tvGenresRes.ok) {
      handleError(new Error(`HTTP error! Movie genres: ${movieGenresRes.status}, TV genres: ${tvGenresRes.status}`), "Error al obtener géneros de TMDB.");
    }

    const movieGenresData = await movieGenresRes.json();
    const tvGenresData = await tvGenresRes.json();

    const allGenres: Genre[] = [...movieGenresData.genres, ...tvGenresData.genres];
    const uniqueGenres = Array.from(new Map(allGenres.map(genre => [genre.id, genre])).values());

    const { data, error } = await supabase
      .from('genres')
      .upsert(uniqueGenres, { onConflict: 'id' });

    if (error) handleError(error, "Error al sincronizar géneros con Supabase.");
    console.log('Géneros sincronizados con Supabase:', data);
    return uniqueGenres;
  } catch (error) {
    return handleError(error, "Error en fetchAndStoreGenres.");
  }
};

// Función para obtener géneros desde Supabase
export const getGenresFromSupabase = async (): Promise<Genre[]> => {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*');
    if (error) handleError(error, "Error obteniendo géneros de Supabase.");
    return data || [];
  } catch (error) {
    return handleError(error, "Error en getGenresFromSupabase.");
  }
};

// Función genérica para buscar y almacenar películas/series
const fetchAndStoreMedia = async (endpoint: string, mediaType: 'movie' | 'tv', page: number = 1): Promise<Media[]> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`
    );
    if (!response.ok) {
      handleError(new Error(`HTTP error! status: ${response.status}`), `Error al obtener ${mediaType} de TMDB.`);
    }
    const data = await response.json();
    const items: Media[] = data.results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      original_title: item.original_title || item.original_name,
      overview: item.overview,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      vote_average: item.vote_average,
      vote_count: item.vote_count,
      media_type: mediaType,
      popularity: item.popularity,
      original_language: item.original_language,
      imdb_id: item.imdb_id || null,
      runtime: item.runtime || null,
      number_of_seasons: item.number_of_seasons || null,
      number_of_episodes: item.number_of_episodes || null,
      status: item.status || null,
      tagline: item.tagline || null,
      homepage: item.homepage || null,
      genre_ids: item.genre_ids
    }));

    const { data: insertedData, error } = await supabase
      .from('movies_tv')
      .upsert(items, { onConflict: 'id' });

    if (error) handleError(error, `Error al sincronizar ${mediaType} con Supabase.`);

    for (const item of items) {
      if (item.genre_ids && item.genre_ids.length > 0) {
        const genreRelations = item.genre_ids.map(genre_id => ({
          movie_tv_id: item.id,
          genre_id: genre_id
        }));
        const { error: genreError } = await supabase
          .from('movie_tv_genres')
          .upsert(genreRelations, { onConflict: 'movie_tv_id,genre_id' });
        if (genreError) console.error(`Error insertando géneros para ${item.title}:`, genreError);
      }
    }

    console.log(`Datos de ${mediaType} sincronizados con Supabase.`, insertedData);
    return items;
  } catch (error) {
    return handleError(error, `Error en fetchAndStoreMedia para ${mediaType}.`);
  }
};

// Funciones para obtener y almacenar datos específicos
export const getTrendingMoviesAndStore = async (page: number = 1): Promise<Media[]> => fetchAndStoreMedia('/trending/movie/week', 'movie', page);
export const getPopularMoviesAndStore = async (page: number = 1): Promise<Media[]> => fetchAndStoreMedia('/movie/popular', 'movie', page);
export const getPopularTvShowsAndStore = async (page: number = 1): Promise<Media[]> => fetchAndStoreMedia('/tv/popular', 'tv', page);

// Funciones para obtener datos directamente de Supabase
export const getMoviesFromSupabase = async (genreId: number | null = null): Promise<Media[]> => {
    try {
        let query = supabase
            .from('movies_tv')
            .select('*, movie_tv_genres(genre_id)')
            .eq('media_type', 'movie')
            .order('popularity', { ascending: false });

        if (genreId) {
            query = query.eq('movie_tv_genres.genre_id', genreId);
        }

        const { data, error } = await query;
        if (error) handleError(error, "Error obteniendo películas de Supabase.");

        return (data as any[])?.map(item => ({
            ...item,
            genre_ids: item.movie_tv_genres.map((g: any) => g.genre_id)
        })) || [];
    } catch (error) {
        return handleError(error, "Error en getMoviesFromSupabase.");
    }
};

export const getTvShowsFromSupabase = async (genreId: number | null = null): Promise<Media[]> => {
    try {
        let query = supabase
            .from('movies_tv')
            .select('*, movie_tv_genres(genre_id)')
            .eq('media_type', 'tv')
            .order('popularity', { ascending: false });

        if (genreId) {
            query = query.eq('movie_tv_genres.genre_id', genreId);
        }

        const { data, error } = await query;
        if (error) handleError(error, "Error obteniendo series de Supabase.");

        return (data as any[])?.map(item => ({
            ...item,
            genre_ids: item.movie_tv_genres.map((g: any) => g.genre_id)
        })) || [];
    } catch (error) {
        return handleError(error, "Error en getTvShowsFromSupabase.");
    }
};

export const getMediaDetailsFromSupabase = async (id: string, mediaType: 'movie' | 'tv'): Promise<MediaDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('movies_tv')
      .select('*, movie_tv_genres(genre_id)')
      .eq('id', id)
      .eq('media_type', mediaType)
      .single();

    if (error) handleError(error, `Error obteniendo detalles de ${mediaType} ${id} de Supabase.`);

    let omdbDetails: OmdbDetails | null = null;
    if (data.imdb_id) {
      omdbDetails = await getOmdbDetails(data.imdb_id);
    }

    const mediaDetails = data as Media;

    return {
      ...mediaDetails,
      genre_ids: (data as any).movie_tv_genres.map((g: any) => g.genre_id),
      omdbDetails: omdbDetails
    };
  } catch (error) {
    return handleError(error, `Error en getMediaDetailsFromSupabase para ${mediaType} ${id}.`);
  }
};

export const searchMediaFromSupabase = async (query: string): Promise<Media[]> => {
    try {
        const { data, error } = await supabase
            .from('movies_tv')
            .select('*, movie_tv_genres(genre_id)')
            .ilike('title', `%${query}%`)
            .order('popularity', { ascending: false })
            .limit(20);

        if (error) handleError(error, "Error buscando medios en Supabase.");

        return (data as any[])?.map(item => ({
            ...item,
            genre_ids: item.movie_tv_genres.map((g: any) => g.genre_id)
        })) || [];
    } catch (error) {
        return handleError(error, "Error en searchMediaFromSupabase.");
    }
};

export const getOmdbDetails = async (imdbId: string): Promise<OmdbDetails | null> => {
  try {
    if (!imdbId) return null;
    const response = await fetch(
      `${OMDB_BASE_URL}/?i=${imdbId}&apikey=${OMDB_API_KEY}`
    );
    if (!response.ok) {
      handleError(new Error(`HTTP error! status: ${response.status}`), `Error al obtener detalles de OMDb para ${imdbId}.`);
    }
    const data = await response.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    return handleError(error, `Error en getOmdbDetails para ${imdbId}.`);
  }
};

// Funciones de autenticación
export const signUpUser = async (email, password, username) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });
    if (error) handleError(error, "Error al registrar usuario.");
    return data;
  } catch (error) {
    return handleError(error, "Error en signUpUser.");
  }
};

export const signInUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) handleError(error, "Error al iniciar sesión.");
    return data;
  } catch (error) {
    return handleError(error, "Error en signInUser.");
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) handleError(error, "Error al cerrar sesión.");
    return true;
  } catch (error) {
    return handleError(error, "Error en signOutUser.");
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) handleError(error, "Error al obtener usuario actual.");
    return user;
  } catch (error) {
    return handleError(error, "Error en getCurrentUser.");
  }
};

// Funciones de interacción (likes/comments)
export const addInteraction = async (userId: string, mediaId: number, mediaType: 'movie' | 'tv', interactionType: 'like' | 'dislike' | 'comment', commentText: string | null = null) => {
  try {
    const { data, error } = await supabase
      .from('user_interactions')
      .upsert({
        user_id: userId,
        movie_tv_id: mediaId,
        media_type: mediaType,
        interaction_type: interactionType,
        comment_text: commentText
      }, { onConflict: 'user_id,movie_tv_id,interaction_type' });

    if (error) handleError(error, "Error al añadir interacción.");
    return data;
  } catch (error) {
    return handleError(error, "Error en addInteraction.");
  }
};

export const getCommentsForMedia = async (mediaId: number, mediaType: 'movie' | 'tv'): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('user_interactions')
      .select(`
        comment_text,
        created_at,
        users(username)
      `)
      .eq('movie_tv_id', mediaId)
      .eq('media_type', mediaType)
      .eq('interaction_type', 'comment')
      .order('created_at', { ascending: false });

    if (error) handleError(error, "Error al obtener comentarios.");
    return data || [];
  } catch (error) {
    return handleError(error, "Error en getCommentsForMedia.");
  }
};
