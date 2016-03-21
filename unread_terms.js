/**
 * Visualization of Terms of Service and Privacy Policy.
 * How many pages of terms we do not read? 
 * 
 * @author lucyia (ping@lucyia.com)
 */

'use strict';

(function(window, document, undefined){
	/**
	 * Visualizes passed data within SVG panel 
	 *
	 * @param {array} of objects
	 */
	function data2vis(pages) {

		var terms = typePagesPromise(pages, 'terms');	
		promise2visualize(terms, 'terms');

		var privacy = typePagesPromise(pages, 'privacy');
		promise2visualize(privacy, 'privacy');

		/**
		 * Calculates how long the content of given pages are.
		 *
		 * @param {array} of url pages
		 * @param {string} of url type ('terms' or 'privacy' - determined in input data)
		 * @return {Promise}
		 */
		function typePagesPromise(pages, type){
			var typePromises = pages.map(d => pagesContent(d['url_'+type]));

			return Promise.all(typePromises).then(function(response){ 
					return pages = response.map(d => numberOfPages(d));
				}, function(error) {
					errorMssg(error, true);
				});

			/**
			 * Gets the whole html for a given page by using YQL service.
			 *
			 * @param {string} representing url of a page
			 * @param {string} describing a table in YQL query
			 * @return {Promise} with the content of a page
			 */
			function pagesContent(page, table){
				// when 'xml' is passed as a 'table' var, some pages return the correct output
				// but 'html' as 'table' var works for most cases, so it set as default
				var table = 'html';
				return $.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20'+table+'%20where%20url%3D%27'+encodeURIComponent(page)+'%27&format=xml', 
					function (response, status) {
						return response;
				});
			}

			/**
			 * Calculates number of standard pages for given page (all html tags ignored).
			 *
			 * @param {string} content of a web page
			 * @return {number} of standard pages (3000 characters per page)
			 */
			function numberOfPages(page) {
				return Math.round($(page).text().length/3000);
			}
		}

		/**
		 * Turns response from promise into visualization of a bar chart.
		 *
		 * @param {Promise} 
		 * @param {string} of url type ('terms' or 'privacy' - determined in input data)
		 */
		function promise2visualize(promise, type){
			promise.then(function(response){
					visualizePages(response, type);
				}, function(error){
					errorMssg(error, true);
				});
		}

		/**
		 * Shows/Hides message with an error.
		 * 
		 * @param {string} message to be displayed
		 * @param {boolean} show/hide error message
		 */
		function errorMssg(mssg, show) {
			console.log(mssg);
		}
	}

	/**
	 * Sets up a panel for visualization and add icons of given web pages into it.
	 * The bar charts are generated after the content of the pages were parsed.
	 * 
	 * @param {array} of objects
	 * @param {string} element which height and width will visualization inherit
	 */
	function setVis(pages, element){
		var margin = { top: 25, right: 25, bottom: 30, left: 25};
		var width = $('#vis').width() - margin.left - margin.right;
		var height = $('#vis').height() - margin.top - margin.bottom;

		var svg = d3.select('#vis')
			.append('svg')
				.attr('width', width)
				.attr('height', height)
				.style('border', '1px solid lightgrey')
			.append('g')
				.attr('class', 'svg-wrapper');
				//.attr('transform', 'translate('+ margin.left +','+ margin.top +')');
		
		var barPad = 0.5;
		var barWidth = 40;

		var xScale = d3.scale.ordinal()
			.domain(pages.map( (d, i) => i*barWidth ))
			.rangeRoundBands([0, width], barPad);
		
		// generate the icons
		var icons = svg.selectAll('.icons')
			.data(pages)
			.enter()
			.append('svg:image')
			.attr('class', 'icons')
			.attr('xlink:href', d => d.url_image )
			.attr('x', (d, i) => xScale(i*barWidth) )
			.attr('y', height/2 - xScale.rangeBand()/2 )
			.attr('width', xScale.rangeBand() )
			.attr('height', xScale.rangeBand() );

	}

	/**
	 * Visualizes given numbers in a bar chart according to the given type.
	 * 'Terms' type is shown in the positive y axis and 'privacy' type the other way.
	 *
	 * @param {array} of numbers representing how long the content of web pages have
	 * @param {string} of url type ('terms' or 'privacy' - determined in input data)
	 */
	function visualizePages(pagesCount, type){
		// get the already created svg
		var svg = d3.select('svg').select('.svg-wrapper');

		drawDocumentIcon();
		
		function drawDocumentIcon(count) {
			// icon of a document
			svg.selectAll('.'+type+'.fileIcons')
				.data(d3.range(count))
				.enter()
				.append('svg:image')
				.attr('class', 'fileIcons '+type)
				.attr('xlink:href', 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699044-icon-55-document-text-128.png' )
				.attr('x', (d, i) => i*70 )
				.attr('y', (d, i) => i*10 )
				.attr('width', 50 )
				.attr('height', 100 )
				//.style('transform', 'translate('+ x +'px, '+ y +'px)');
		}
	}

	// array of objects with url links to various services
	var pages = [
		{	name: 'Facebook', 
			url_image: 'https://cdn4.iconfinder.com/data/icons/miu-square-shadow-social/60/facebook-square-shadow-social-media-128.png', 
			url_terms: 'https://www.facebook.com/terms', 
			url_privacy: 'https://www.facebook.com/full_data_use_policy'
		},
		{
			name: 'LinkedIn', 
			url_image: 'https://cdn4.iconfinder.com/data/icons/miu-square-shadow-social/60/linkedin-square-shadow-social-media-128.png', 
			url_terms: 'https://www.linkedin.com/legal/user-agreement', 
			url_privacy: 'https://www.linkedin.com/legal/privacy-policy?trk=hb_ft_priv'
		},
		{
			name: 'Twitter', 
			url_image: 'https://cdn4.iconfinder.com/data/icons/miu-square-shadow-social/60/twitter-square-shadow-social-media-128.png', 
			url_terms: 'https://twitter.com/tos', 
			url_privacy: 'https://twitter.com/privacy'
		},
		{
			name: 'Tumblr', 
			url_image: 'https://cdn4.iconfinder.com/data/icons/miu-square-shadow-social/60/tumblr-square-shadow-social-media-128.png', 
			url_terms: 'https://www.tumblr.com/policy/en/terms-of-service', 
			url_privacy: 'https://www.tumblr.com/policy/en/privacy'
		},
		{
			name: 'Instagram', 
			url_image: 'https://cdn4.iconfinder.com/data/icons/miu-square-shadow-social/60/instagram-square-shadow-social-media-128.png', 
			url_terms: 'https://www.instagram.com/about/legal/terms', 
			url_privacy: 'https://www.instagram.com/about/legal/privacy/'
		},
		{
			name: 'Google', 
			url_image: 'https://cdn4.iconfinder.com/data/icons/miu-square-shadow-social/60/google_plus-square-shadow-social-media-128.png', 
			url_terms: 'https://www.google.com/policies/terms', 
			url_privacy: 'https://www.google.com/policies/privacy/'
		}
	];

	data2vis(pages);

	$(document).ready(function () {
		setVis(pages, '#vis');
	});	
	
})(this, document);