import React, { Component } from 'react';
import Axios from 'axios';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import 'react-popupbox/dist/react-popupbox.css'; 
import config from '../config';

const firebase = require('firebase');

export class AddMovie extends Component {
	constructor() {
		super();
		this.state = {
			movies: [],
			moviesToLoad: 8,
			last: '',
			loaded: 0,
			loading: true,
			movieID: '',
			listName: '',
			lists: {},
			movieListPairs: [],
			addToListName: 'Add to List',
			currentList: {id: '', name: 'All'},
			searchQuery: '',
            graphList: [],
            maxLoaded: false
		};
		this.wrapper = React.createRef();

        this.setState({loading:false});
	}

	componentDidMount() {
        document.title = 'Categorized Movies';
		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}

		this.loadMovies();

		let ref = firebase.database().ref('lists');
		ref.orderByChild('name').on('value', snapshot => {
			if (!snapshot.val()) return;
			
			let lists = {};
			
			Object.values(snapshot.val()).forEach(list => {
				lists[list.id] = list.name;
			});

			this.setState({
				lists: lists
			});
		});

		//new
		ref = firebase.database().ref('movie-lists');
		ref.orderByKey().on('value', snapshot => {
			if (!snapshot.val()) return;
			
			let movieLists = [];

			Object.values(snapshot.val()).forEach(movieListPair => {
				let pair = Object.entries(movieListPair)[0];
				movieLists.push(pair[0] + ' - ' + pair[1]);
			});

			this.setState({
				movieListPairs: movieLists
			});
		});
		ref = firebase.database().ref('graph');
		ref.on('movieChild', snapshot => {
			let movie = snapshot.val();

			let movies = this.state.graphList;
			movies.push(movie);

			this.setState({
				'graphList': movies
			});
		});
		ref.on('child_removed', snapshot => {
			let movie = snapshot.val();

			let movies = this.state.graphList;
			for (let i = 0; i < movies.length; i++) {
				if (movies[i].id === movie.id) {
					movies.splice(i, 1);
					break;
				}
			}

			this.setState({
				'graphList': movies
			});

		});
		//new


    }
    // componentWillUnmount() {
    //     this.;
    // }

	loadMovies = () => {
		if (this.state.currentList.name === 'All') {
			let ref = firebase.database()
				.ref('movies')
				.orderByChild('title')
				.limitToFirst(this.state.moviesToLoad);
			
			ref.on('movieChild', snapshot => {
				let movie = snapshot.val();
				let last = movie.title;
				// console.log(movie);

				let movies = this.state.movies;
				movies.push(movie);

				this.setState({
					'movies': movies,
					'last': last,
					'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
					'loading': this.state.loaded + 1 < this.state.moviesToLoad
				});
			});
		}

		let movieIDs = this.getID();
		
		movieIDs.forEach(movieID => {
			let ref = firebase.database()
				.ref('movies')
				.orderByChild('id')
				.equalTo(movieID)
				.limitToFirst(1);

			ref.on('movieChild', snapshot => {
				let movie = snapshot.val();
				let last = movie.title;
	
				if (this.state.currentList.name !== 'All') {
					let show = false;
					movieIDs.forEach(movieID => {
						if (movie.id === movieID) show = true;
					});
					if (!show) return;
				}
	
				let movies = this.state.movies;
				movies.push(movie);
	
				this.setState({
					'movies': movies,
					'last': last,
					'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
					'loading': this.state.loaded + 1 < this.state.moviesToLoad
				});
			});
		});
	}

	loadMore = () => {
		if (this.state.loading) return;
		
		this.setState({
			loading: true,
			loaded: 0
		});
		
		let ref = firebase.database()
			.ref('movies')
			.orderByChild('title')
			.startAt(this.state.last)
			.limitToFirst(this.state.moviesToLoad + 1);

		let movieIDs = [];
		if (this.state.currentList.name !== 'All') movieIDs = this.getID();

		ref.on('movieChild', snapshot => {
			const movie = snapshot.val();

			let duplicate = false;
			this.state.movies.forEach(m => {
				if (m.id === movie.id) duplicate = true;
			});
			if (duplicate) return;

			if (this.state.currentList.name !== 'All') {
				let show = false;
				movieIDs.forEach(movieID => {
					if (movie.id === movieID) show = true;
				});
				if (!show) return;
			}

			let movies = this.state.movies;
			movies.push(movie);

			let last = movie.title;

			this.setState({
				'movies': movies,
				'last': last,
				'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
				'loading': this.state.loaded + 1 < this.state.moviesToLoad
            });
            // if ()
		});
	}

	addMovie = (event) => {
		event.preventDefault();
		
		if (this.state.movieID.slice(0, 2) !== 'tt' || !/^\d+$/.test(this.state.movieID.slice(2))) {
			const title = this.state.movieID;

			this.setState({
				'movieID': ''
			});

			Axios.get('https://www.omdbapi.com/?apikey=' + 'ec05d9ae' + '&t=' + title)
			.then(response => {
				if (response.data.Response === 'False') {
					alert('Movie cannot be found! Try another one.');
					return;
				}

				let duplicate = false;
				this.state.movies.forEach(movie => {
					if (movie.id === response.data.imdbID) duplicate = true;
				});

				if (duplicate) {
					alert('Movie existed!');
					return;
				}

				let movie = [];
				movie.id = response.data.imdbID;
				movie.title = response.data.Title;
				movie.director = response.data.Director;
				movie.year = response.data.Year;
				movie.plot = response.data.Plot;
				movie.rating = response.data.imdbRating;
				movie.poster = response.data.Poster;
				movie.actors = response.data.Actors.split(', ');

                firebase.database().ref('movies').push().set(movie);
				
			});
            

			return;
		}

		const id = this.state.movieID;

		this.setState({
			'movieID': ''
		});
		
		let duplicate = false;
		this.state.movies.forEach(movie => {
			if (movie.id === id) duplicate = true;
		});

		if (duplicate) {
			alert('Movie existed!');
			return;
		}


		Axios.get('https://www.omdbapi.com/?apikey=' + 'ec05d9ae' + '&i=' + id)
		.then(response => {
			if (response.data.Response === 'False') {
				alert('Movie not found!');
				return;
			}

			let movie = [];
			movie.id = id;
			movie.title = response.data.Title;
			movie.director = response.data.Director;
			movie.year = response.data.Year;
			movie.plot = response.data.Plot;
            movie.rating = response.data.imdbRating;
			movie.poster = response.data.Poster;
			movie.actors = response.data.Actors.split(', ');
            firebase.database().ref('movies').push().set(movie);
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });

		});
	}

	addList = (event) => {
		event.preventDefault();
		console.log('addList: ' + this.state.listName);
		
		let listName = this.state.listName;
		
		this.setState({
			'listName': ''
		});

		let duplicate = false;
		Object.entries(this.state.lists).forEach(list => {
			if (listName.toLowerCase() === list[1].toLowerCase()) duplicate = true;
		});
		if (duplicate) {
			alert('List already exists!');
			return;
		};
		
		let ref = firebase.database().ref('lists');
		let listRefKey = ref.push().key;
		
		let updates = {};
		updates['/lists/' + listRefKey + '/id'] = listRefKey;
		updates['/lists/' + listRefKey + '/name'] = listName;
        alert('List is successfully added!');
		firebase.database().ref().update(updates);
	}

	getupdatess = () => {
		return Object.entries(this.state.lists).map(list => (
			<option key={list[0]}
				value={list[0]}>{list[1]}</option>
		));
	}

	getAddToLists = (id) => {
		return Object.entries(this.state.lists).map((list, i) => (
			<option key={list[0]}
				value={list[0]}>{list[1]}</option>
		));
	}

	updates = (event) => {
		let listName = '';
		if (event.target.value === '') {
			listName = 'All';
		} else {
			listName = this.state.lists[event.target.value];
		}

		this.setState({
			movies: [],
			currentList: {id: event.target.value, name: listName},
			loaded: 0,
			loading: true
		});

		this.forceUpdate(this.loadMovies);
	}

	addToList = (event, movieID, movieClass) => {
		let listID = event.target.value;
		let duplicate = false;
		this.state.movieListPairs.forEach(movieListPair => {
			let pair = movieListPair.split(' - ');
			if (pair[0] === listID && pair[1] === movieID) duplicate = true;
		});
		if (duplicate) {
			alert('Movie already in the selected list!');
			return;
		};

		alert('Added ' + movieID + ' to ' +  this.state.lists[event.target.value]);
		
		if (this.state.lists[event.target.value] == "GraphViz"){
			this.addGraph(movieClass)
			alert('Now you can find ' + movieClass.title + " in Graph!" );
		};
		
	}

	getID = () => {
		let movieIDs = [];
		this.state.movieListPairs.forEach(movieListPair => {
			if (movieListPair.search(this.state.currentList.id) > -1) {
				movieIDs.push(movieListPair.slice((this.state.currentList.id + ' - ').length));
			}
		});

		return movieIDs;
	}

	search = (event) => {
		event.preventDefault();
	}

	checkGraphMovie = (id) => {
		let movies = this.state.graphList;
		for (let i = 0; i < movies.length; i++) {
			if (movies[i].id === id) return true;
		}
		return false;
	}

	addGraph = (movie) => {		
		let exists = this.checkGraphMovie(movie.id);
		
		if (exists) {
			let ref = firebase.database().ref('graph');
			let removeMovie = ref.orderByChild('id').equalTo(movie.id).limitToFirst(1).on('movieChild', snapshot => {
				ref.child(snapshot.key).remove();
			});
			ref.off('movieChild', removeMovie);
		} else {
			console.log(movie.title);
			alert('Current movie is not in graph');

			firebase.database().ref('graph').push().set(movie);
		}
		this.displayLightbox(movie);
	}

	deleteMovie = (movieID) => {
		console.log('deleteMovie');
		let ref = firebase.database().ref('movies');
		
		ref.orderByChild('id').equalTo(movieID).limitToFirst(1).on('movieChild', snapshot => {
			console.log(snapshot.key);
			ref.child(snapshot.key).remove();
		});

		let movies = this.state.movies;
		
		let toDelete = -1;
		movies.forEach((movie, i) => {
			if (movie.id === movieID) toDelete = i;
		});
		movies.splice(toDelete, 1);

		this.setState({movies: movies});

		PopupboxManager.close();
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	lockScroll = () => {
		document.body.style.overflow = 'hidden';
	}

	unlockScroll = () => {
		document.body.style.overflow = 'inherit';
    }
    dimPoster(e) {
        e.target.style.opacity = 0.5;
      }
    
    resetPoster(e) {
        e.target.style.opacity = 1;
    }

	displayMovies = () => {
		return this.state.movies.filter(movie => movie.title.toLowerCase().includes(this.state.searchQuery)).map(movie => (
			<img className="moviePoster" src={movie.poster}
                key={movie.id} alt=""
                onMouseEnter={this.dimPoster} onMouseLeave={this.resetPoster}
				onClick={this.displayLightbox.bind(this, movie)}/>
		));
	}

	displayLightbox = (movie) => {
		const content = (
			
            <div className="movLightboxContainer">
				<img className="movLightboxImage" src={movie.poster} alt=""/>
				<div className = "movLightboxContent">
					<span className = "title">{movie.title}</span>
					<br></br>
					<br></br>
					<span className = "director">Directed by: <b>{movie.director}</b></span>
					<br></br>
					<br></br>
					<br></br>
					<p>{movie.plot}</p>
					<br></br>
					<br></br>
					<span className = "rating">Rating: <b>{movie.rating}</b></span>
                    <br></br>
					<br></br>
                    <div>
						<select className="dropdown" value={this.state.addToListName} onChange={event => {this.addToList(event, movie.id, movie)}}>
							<option hidden value="">Add to List</option>
                             {this.getAddToLists(movie.id)}
                             
                        </select>

			 		</div>
                    <br></br>
					<br></br>
					<div>
					<button className="add-to-graph-button">
							{this.checkGraphMovie(movie.id) ? 'Remove from Graph' : 'Checking in graph'}
					</button>
                    
                        <button className="delete-button-add" onClick={() => {this.deleteMovie(movie.id)}}>Delete From Collection</button>
                    </div>
	
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


	render() {
		const popupboxConfig = {
			style: {
				overflow: 'inherit'
			}
		}

		return (
			<div>
				<h1>Movies Collection </h1>
				
				<div className="movie-forms">
                    <div className="dropdown">
							<select  onChange={this.updates} >
								<option value="">All</option>
                                {this.getupdatess()}
                                
                            </select>
                            
                        
                            
                            
						</div>
					<div className="movie-add-forms">
                        
						<form className="movie-form" onSubmit={e => this.addMovie(e)}>
							<div>
								<input type="text"
									name="movieID"
									className="form-input-text"
									value={this.state.movieID}
									onChange={e => this.handleChange(e)}
									placeholder="Movie title or IMDB ID"/>
                                
                                <input type='submit' value='Add a Movie'/>
							</div>
						</form>

						<form className="movie-form" onSubmit={e => this.addList(e)}>
							<div>
								<input type="text"
									name="listName"
									className="form-input-text"
									value={this.state.listName}
									onChange={e => this.handleChange(e)}
									placeholder="Enter a new list name"/>
                                <input type='submit' value='Create List'/>
							</div>
						</form>
						
						<form className="movie-form" onSubmit={e => this.search(e)}>
						<div>
                        <label><span>Search By Name: </span></label>
                        <div>
							<input type="text"
								name="searchQuery"
								className="form-input-text"
								value={this.state.searchQuery}
								onChange={e => this.handleChange(e)}
								placeholder="Enter a name"/>
                        </div>
							
						</div>
					</form>

					</div>

					
					<div></div>
				</div>
				
				<div className="movies"
					ref={this.moviesScroll}>
					{this.displayMovies()}

					<PopupboxContainer { ...popupboxConfig } />
				</div>
                <div className='button'>
                {!(this.state.loading) && <button className = 'but' onClick={this.loadMore}>Load More ...</button>}
                </div>
			</div>

		);
	}
}

export default AddMovie;
