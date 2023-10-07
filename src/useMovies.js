import { useEffect, useState } from 'react';

const KEY = '99cf342a';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // very important, this fix the problem with network request on inspect mode.
  useEffect(
    function () {
      //  abort controller for use on our cleanup function.
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              'something went wrong with fetching movies request.'
            );

          const data = await res.json();
          if (data.Response === 'False')
            throw new Error(' Movie not found!...Try again.');

          setMovies(data.Search);
          console.log(data);
        } catch (err) {
          console.error(err.message);
          // condition for the abort controller error message. This will hepl stop showing the error message "The user aborted a request".
          if (err.name !== 'AbortError') {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
