import React, { Component } from 'react';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import 'react-popupbox/dist/react-popupbox.css';
import Axios from 'axios';

const mv = require('./movieId.json');

export class Movies extends Component {
	constructor() {
		super();
		this.state = {
			movies: []
		};
		this.wrapper = React.createRef();
	}

	componentDidMount() {
		document.title = 'Movie Gallery';
		mv.map((item, i) => {
			return Axios.get('https://www.omdbapi.com/?apikey=' + 'ec05d9ae' + '&i=' + item.id)
			.then((response) => {
				let movies = this.state.movies;
				movies[i] = response.data
				this.setState({movies});
			});
		});
	}

	lockScroll = () => {
		console.log('lock')
		document.body.style.overflow = 'hidden'
	}

	unlockScroll = () => {
		console.log('unlock')
		document.body.style.overflow = 'inherit'
	}

	displayMovies = () => {
		return this.state.movies.map((movie) => (
			<img className="movie" src={movie.Poster}
                key={movie.Title} alt=""
                onMouseEnter={this.dimPoster} onMouseLeave={this.resetPoster}
				onClick={this.displayLightbox.bind(this, movie)}/>
		));
	}

	displayLightbox = (movie) => {
		const content = (
			
			<div className="movLightboxContainer">
				<img className="movLightboxImage" src={movie.Poster} alt=""/>
				<div className = "movLightboxContent">
					<span className = "title">{movie.Title}</span>
					<br></br>
					<br></br>
					<span className = "director">Directed by: <b>{movie.Director}</b></span>
					<br></br>
					<br></br>
					<br></br>
					<p>{movie.Plot}</p>
					<br></br>
					<br></br>
					<span className = "rating">Rating: <b>{movie.imdbRating}</b></span>
	
				</div>
			
			</div>
		)

		PopupboxManager.open({content,
			config: {
				onOpen: this.lockScroll,
				onClosed: this.unlockScroll
			}
		});
    }
    dimPoster(e) {
        e.target.style.opacity = 0.5;
      }
    
    resetPoster(e) {
        e.target.style.opacity = 1;
    }

	render() {
		return (
			<div>
				<h1>Movies</h1>
				<div className="movies">
					{this.displayMovies()}

					<PopupboxContainer />
				</div>
			</div>

		);
	}
}

export default Movies;