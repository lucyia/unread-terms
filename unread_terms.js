/**
 * Visualization of Terms of Service. 
 * 
 * @author lucyia (ping@lucyia.com)
 */

'use strict';

(function(window, document, undefined){

	// Accepts a url and a callback function to run
	// source: http://code.tutsplus.com/tutorials/quick-tip-cross-domain-ajax-request-with-yql-and-jquery--net-10225
	function requestCrossDomain( site, callback ) {
		 
		// If no url was passed, exit.
		if ( !site ) {
			alert('No site was passed.');
			return false;
		}
		 
		// Take the provided url, and add it to a YQL query. Make sure you encode it!
		var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml&callback=?';
		 
		// Request that YSQL string, and run a callback function.
		// Pass a defined function to prevent cache-busting.
		$.getJSON( yql, cbFunc );
		 
		function cbFunc(data) {
		// If we have something to work with...
		if ( data.results[0] ) {
			// Strip out all script tags, for security reasons.
			// BE VERY CAREFUL. This helps, but we should do more. 
			data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
			 
			// If the user passed a callback, and it
			// is a function, call it, and send through the data var.
			if ( typeof callback === 'function') {
				callback(data);
			}
		}
		// Else, Maybe we requested a site that doesn't exist, and nothing returned.
		else throw new Error('Nothing returned from getJSON.');
		}
	}

	requestCrossDomain('https://www.instagram.com/about/legal/terms', function(results) {
		$('body').html(results);
	});

	/**
	 * Visualizes passed data within SVG panel 
	 *
	 * @param {array} of objects
	 */
	function data2vis(pages) {

		var dataTerms = new Promise( function(resolve, reject) {
			resolve(pagesContent(pages.map(d => d.url_terms)));
		});

		dataTerms.then(
			function(response){
				var termsPages = response.map(d => Math.round(numberOfPages(d)));
		}, function(error) {
				errorMssg(error, true);
		});

		var dataPrivacy =  new Promise( function(resolve, reject) {
			resolve(pagesContent(pages.map(d => d.url_privacy)));
		});

		dataPrivacy.then(
			function(response){
				var privacyPages = response.map(d => Math.round(numberOfPages(d)));
		}, function(error){
				errorMssg(error, true);
		});

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
			return $(page.content).text().length/3000;
		}

		/**
		 * Gets web pages content through embed.ly service, therefore requires embded.ly API key.
		 *
		 * @param {array} of strings - urls of webpages
		 * @return {array} of objects with web page parameters (see http://docs.embed.ly/docs/extract)
		 */

		function pagesContent(pages) {
			return $.embedly.extract(pages, {
					format: 'json',
					key: 'your embed.ly key'
				});
		}
	}

	var pages = [
		{name: 'Facebook', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/3-128.png', url_terms: 'https://www.facebook.com/terms', url_privacy: 'https://www.facebook.com/full_data_use_policy'},
		{name: 'LinkedIn', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/9-128.png', url_terms: 'https://www.linkedin.com/legal/user-agreement', url_privacy: 'https://www.linkedin.com/legal/privacy-policy?trk=hb_ft_priv'},
		{name: 'Twitter', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/4-128.png', url_terms: 'https://twitter.com/tos', url_privacy: 'https://twitter.com/privacy'},
		{name: 'Tumblr', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/36-128.png', url_terms: 'https://www.tumblr.com/policy/en/terms-of-service', url_privacy: 'https://www.tumblr.com/policy/en/privacy'},
		{name: 'Instagram', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/5-128.png', url_terms: 'https://www.instagram.com/about/legal/terms', url_privacy: 'https://www.instagram.com/about/legal/privacy/'},
		{name: 'Google', url_image: 'https://cdn0.iconfinder.com/data/icons/social-network-9/50/2-128.png', url_terms: 'https://www.google.com/policies/terms', url_privacy: 'https://www.google.com/policies/privacy/'}
	];

	data2vis(pages);
	
})(this, document);