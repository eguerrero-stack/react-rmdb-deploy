import { useState, useEffect, useCallback } from "react";
import { API_URL, API_KEY } from "../../config";

export const useMovieFetch = (movieId) => {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  //this makes it so it only changes if the movie Id changes, prevents infinity loop
  const fetchData = useCallback(async () => {
    setError(false);
    setLoading(true);

    try {
      //can come back to refactor
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;
      const result = await (await fetch(endpoint)).json();
      //shows info able to display
      //   console.log(result);
      const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
      const creditsResult = await (await fetch(creditsEndpoint)).json();
      //      info to display
      //   console.log(creditsResult);
      const directors = creditsResult.crew.filter(
        (member) => member.job === "Director"
      );

      setState({
        ...result,
        actors: creditsResult.crew,
        //directors: directors
        directors,
      });
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  }, [movieId]);

  useEffect(() => {
    if (localStorage[movieId]) {
      setState(JSON.parse(localStorage[movieId]));
      setLoading(false);
    } else {
      fetchData();
    }
  }, [fetchData, movieId]);

  useEffect(() => {
    localStorage.setItem(movieId, JSON.stringify(state));
  }, [movieId, state]);

  return [state, loading, error];
};
