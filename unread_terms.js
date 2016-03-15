/**
 * Visualization of Terms of Service. 
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



		var termsPromises = pages.map(d => pagesContent(d.url_terms, 'html'));

		Promise.all(termsPromises).then(
			function(response){ 
				var pages = response.map(d => Math.round(numberOfPages(d)));
				//visualize(pages);
		}, function(error) {
				errorMssg(error, true);
		});

		function pagesContent(page, table){
			// when 'xml' is passed as a 'table' var, some pages return the correct output
			return $.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20'+table+'%20where%20url%3D%27'+encodeURIComponent(page)+'%27&format=xml', 
				function (response, status) {					
					return response;
			});
		}

		function pagesContentFallback(pages) {
			return $.embedly.extract(pages, {
					format: 'json',
					key: 'your embed.ly key'
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