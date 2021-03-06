import React, { useState, useEffect } from 'react';
import '../styles/ChosenMovie.scss';
import backButton from '../assets/back-button.svg';
import ratingStar from '../assets/rating-star.svg';
import runtimeReel from '../assets/runtime-reel.svg';
import { apiCalls } from '../apiCalls';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import { Spring } from 'react-spring/renderprops';

const ChosenMovie = ({ match }) => {
  const [movie, setMovie] = useState(null);
  const [video, setVideo] = useState(null);

  const getChosenMovieData = () => {
    const { id } = match.params;
    return Promise.all([
      apiCalls.selectMovie(id),
      apiCalls.selectVideo(id),
    ]).then((data) => {
      const chosenMovie = data.reduce((chosenMovieData, eachDataset) => {
        return (chosenMovieData = { ...chosenMovieData, ...eachDataset });
      }, {});
      setMovie(chosenMovie.movie);
      setVideo(chosenMovie.videos[0]);
    });
  };

  useEffect(() => getChosenMovieData(), []);

  const formatDate = (movieReleaseDate) => {
    const date = new Date(movieReleaseDate);
    return date.toDateString().split(' ');
  };

  const formatMonetaryInfo = (amount) => {
    const formattedAmount = amount / 1000000;
    return amount % 1000000 ? formattedAmount.toFixed(2) : formattedAmount;
  };

  if (movie) {
    const genres = movie.genres.map((genre) => <p key={genre}>{genre} </p>);
    const releaseDate = formatDate(movie.release_date);
    return (
      <section className='chosen-movie' data-testid='chosen-movie'>
        <section
          className='backdrop-img'
          style={{
            backgroundImage: `linear-gradient(to right, black, 55%, transparent), url(${movie.backdrop_path})`,
          }}
        >
          <section className='movie-info'>
            <Link to='/'>
              <img
                data-testid='return-btn'
                className='back-button-icon'
                src={backButton}
                alt='back-button-icon'
              />
            </Link>
            <h3>{movie.title}</h3>
            <section className='numeric-info'>
              <p className='rating-text'>
                <img
                  className='rating-star'
                  src={ratingStar}
                  alt='rating-star-icon'
                />{' '}
                {movie.average_rating.toFixed(1)}
              </p>
              <p className='runtime-text'>
                <img
                  className='runtime-reel'
                  src={runtimeReel}
                  alt='runtime-reel-icon'
                />
                {movie.runtime}min.
              </p>
              <p className='release-date-text-chosen'>
                {releaseDate[1]} {releaseDate[2]}, {releaseDate[3]}
              </p>
            </section>
            <p className='overview-text' data-testid='overview'>
              Overview: {movie.overview}
            </p>
            <section className='genre' data-testid='genre'>
              {genres}
            </section>
            <section className='monetary-info'>
              <p className='budget-text'>
                Budget: ${formatMonetaryInfo(movie.budget)}M
              </p>
              <p className='revenue-text'>
                Revenue: ${formatMonetaryInfo(movie.revenue)}M
              </p>
            </section>
            <p>Tagline: {movie.tagline}</p>
          </section>
          <section className='video-frame'>
            {video && (
              <Spring
                config={{ mass: 2, tension: 6.5, friction: 0, clamp: true }}
                from={{ opactiy: 0, marginTop: -250 }}
                to={{ opactiy: 1, marginTop: 0 }}
              >
                {(props) => (
                  <section className='video-frame' style={props}>
                    <iframe
                      className='video-container'
                      src={`https://youtube.com/embed/${video.key}`}
                      alt='trailer-iframe-video-player'
                      title='trailer-video-player'
                      height='400'
                      width='700'
                    ></iframe>
                  </section>
                )}
              </Spring>
            )}
          </section>
        </section>
      </section>
    );
  } else {
    return <Loading />;
  }
};

export default ChosenMovie;
