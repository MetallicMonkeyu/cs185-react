import React, { Component } from 'react';
import * as d3 from 'd3';
import config from '../config';

const firebase = require('firebase');

export class Graph extends Component {
	constructor() {
		super();
		this.state = {
			movies: [],
			actors: [],
			links: []
		}
		this.graph = React.createRef();
	}

	drag = (simulation) => {
		function dragStarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragEnded(d) {
			if (!d3.event.active){
                simulation.alphaTarget(0);
            } 
			d.fx = null;
			d.fy = null;
		}

		return d3.drag()
			.on('start', dragStarted)
			.on('drag', dragged)
			.on('end', dragEnded);
	}

	createGraph = () => {
        const headerOffset = document.getElementsByClassName('header')[0].offsetHeight;
        const navbarOffset = document.getElementsByClassName('navheader')[0].offsetHeight;
		const width = window.innerWidth*1.6;
        const height = (window.innerHeight-headerOffset-navbarOffset)*1.6;

		let allNodes = this.state.movies.concat(this.state.actors);
		let mvNode = this.state.movies;
		let links = this.state.links;

		let svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);
		

            
        let simulation = d3.forceSimulation(allNodes)
            .force('link', d3.forceLink().links(links).id(d => { return d.index; }).distance(200))
            .force('repel', d3.forceManyBody())
            .force('attract', d3.forceManyBody())
            .force('center', d3.forceCenter(width/2, height/2));

		let link = svg.append('g')
			.attr('stroke', '#777')
			.attr('stroke-opacity', 1)
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke-width', 2);

		let radius = (node) => {
			if(node.type === 'actor') {
                return 25;
              } 
              return 100;
        }
        
		let fill = (node) => {
            if (node.type === 'movie'){
                console.log('url(#' + node.title.replace(/[ ']/g, '_') + '-' + node.year + ')');
                return 'url(#' + node.title.replace(/[ ']/g, '_') + '-' + node.year + ')';
            }
			return d3.color('rgb(191, 215, 228)');
		}
        
		let defs = svg.append('defs');

		mvNode.forEach(movieNode => {
			defs.append('pattern')
				.attr('id', movieNode.title.replace(/[ ']/g, '_') + '-' + movieNode.year)
				.attr('width', 1)
				.attr('height', 1)
				.attr('x', -35)
				.attr('y', -35)
				.append('image')
				.attr('xlink:href', movieNode.poster)
				.attr('width', 200)
				.attr('height', 200)
				
        });
        
        let tooltip = d3.select('body')
            .append('div')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')

		let node = svg.append('g')
			.attr('stroke', '#fff')
			.attr('stroke-width', 1.5)
			.selectAll('circle')
			.data(allNodes)
			.join('circle')
			.attr('r', radius)
            .attr('fill', fill)
            .on('mouseover', function(node){
                if(node.type === 'actor') {
                  tooltip.text(node.name);
                  tooltip.style('visibility', 'visible');
                  tooltip.style('top', (d3.event.y-20)+'px').style('left',(d3.event.x+20)+'px');
                }
            })
			.on('mouseout', function(){
                return tooltip.style('visibility', 'hidden');
            })
			.call(this.drag(simulation));
			
		
		simulation.on('tick', () => {
			link.attr('x1', d => d.source.x)
				.attr('y1', d => d.source.y)
				.attr('x2', d => d.target.x)
				.attr('y2', d => d.target.y);

			node.attr('cx', d => d.x)
				.attr('cy', d => d.y);

		});

		return svg.node();
    }
    
    componentDidMount() {
	  document.title = 'Movie Graph';


		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}

		let mvNode = [];
		let acNode = [];
		let links = [];

		let ref = firebase.database().ref('graph');
		ref.on('value', snapshot => {
			if (!snapshot.val()) return;

            let movies = snapshot.val();
            console.log(movies);

            for (let entry in movies) {
                if(movies[entry].lists === 'GraphViz') {
                    console.log("Found list");
                }
                console.log("Not Found list");
            }

            let moviesLength = Object.values(movies).length;
            console.log(moviesLength);
			Object.values(movies).forEach(movie => {
				movie.type = 'movie';
				console.log(movie);
				mvNode.push(movie);

				movie.actors.forEach(actor => {
					let exists = false;
					let index = -1;
					for (let i = 0; i < acNode.length; i++) {
						let n =  acNode[i];
												
						if (n.name === actor) {
							exists = true;
							index = i;
							break;
						}
					}
	
					let link = {};
					if (exists) {
						link = {
							source: mvNode.length - 1,
							target: moviesLength + index,
						};
					} else {
						let node = {
							name: actor,
							type: 'actor'
						};
						acNode.push(node);
						
						link = {
							source: mvNode.length - 1,
							target: moviesLength + acNode.length - 1,
						};
					}
	
					links.push(link);
				});
			});

			mvNode = this.state.movies.concat(mvNode);
			acNode = this.state.actors.concat(acNode);
			links = this.state.links.concat(links);
	
			this.setState({
				
				'movies': mvNode,
				'actors': acNode,
				'links': links
			}, function(){
                let element = document.getElementById('graph');
		        element.appendChild(this.createGraph());
            });
		});

	}
	
	render() {
        
		return (
            
			<div id="graph">
                <h1>Movies Graph </h1>
			</div>
		);
	}
}

export default Graph;
