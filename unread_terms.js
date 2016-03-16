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
					return pages = response.map(d => Math.round(numberOfPages(d)));
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
				var table = table || 'html';
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
				return $(page).text().length/3000;
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
					visualize(response, type);
				}, function(error){
					errorMssg(error, true);
				});

			/**
			 * Visualizes given numbers in a bar chart according to the given type.
			 * 'Terms' type is shown in the positive y axis and 'privacy' type the other way.
			 *
			 * @param {array} of numbers representing how long the content of web pages have
			 * @param {string} of url type ('terms' or 'privacy' - determined in input data)
			 */
			function visualize(pagesCount, type){
				console.log(pagesCount, type)
			}
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

	var pages = [
		{name: 'Facebook', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/3-128.png', url_terms: 'http://www.facebook.com/terms', url_privacy: 'https://www.facebook.com/full_data_use_policy'},
		{name: 'LinkedIn', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/9-128.png', url_terms: 'http://www.linkedin.com/legal/user-agreement', url_privacy: 'https://www.linkedin.com/legal/privacy-policy?trk=hb_ft_priv'},
		{name: 'Twitter', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/4-128.png', url_terms: 'http://twitter.com/tos', url_privacy: 'https://twitter.com/privacy'},
		{name: 'Tumblr', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/36-128.png', url_terms: 'http://www.tumblr.com/policy/en/terms-of-service', url_privacy: 'https://www.tumblr.com/policy/en/privacy'},
		{name: 'Instagram', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/5-128.png', url_terms: 'http://www.instagram.com/about/legal/terms', url_privacy: 'https://www.instagram.com/about/legal/privacy/'},
		{name: 'Google', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/2-128.png', url_terms: 'http://www.google.com/policies/terms', url_privacy: 'https://www.google.com/policies/privacy/'}
	];

	data2vis(pages);
	
})(this, document);