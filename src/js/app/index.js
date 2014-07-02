(function() {
	var CURRENT_REQUEST_VERSION = '0.0.1';

	var SearchManager = require('./models/SearchManager');
	var SearchManagerView = require('./views/SearchManagerView');
	var SlideMenuView = require('./views/SlideMenuView');
	var RequestManager = require('./RequestManager');

	var manager = new SearchManager();

	var managerView = new SearchManagerView({ model: manager });

	document.addEventListener('DOMContentLoaded', function() {
		var requester = window.crossDomainRequest;
		var rVersion = window.crossDomainRequestVersion;

		if (!requester || !rVersion || rVersion() !== CURRENT_REQUEST_VERSION) {
			var requesterMissingPanel = document.getElementById('userscript-missing-modal');

			// Hacky way to display modal
			document.body.classList.add('modal-open');
			requesterMissingPanel.style.display = 'block';

			return;
		}

		var requestManager = new RequestManager({
			dom: window,
			request: window.crossDomainRequest,
			eventName: 'cross-domain-request-message'
		});

		manager.setURLFetcher(
			function (url, callback) {
				requestManager.request(url, callback);
			}
		);

		var searchInput = document.getElementById('search');
		var searchResultsDiv = document.getElementById('search-results');

		var slideMenuToggleButton = document.getElementById('slide-menu-toggle');

		var slideMenuView = new SlideMenuView({
			model: manager,
			element: document.getElementById('slide-menu'),
			container: document.body
		})

		searchResultsDiv.appendChild(managerView.getElement());
		window.document.body.appendChild(slideMenuView.getElement())

		managerView.render();
		slideMenuView.render();

		slideMenuToggleButton.addEventListener(
			'click',
			function (event) {
				event.preventDefault();

				slideMenuView.toggle();

				document.getElementById('icon-bars').classList.toggle('icon-bars-back');
			}
		);

		searchInput.addEventListener(
			'change',
			function() {
				manager.setSearchTerm(searchInput.value);

				manager.execute();
			}
		);

		if (searchInput.value) {
			manager.setSearchTerm(searchInput.value);

			manager.execute();
		}
	});
})();
