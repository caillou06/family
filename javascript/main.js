var otApp = angular.module('otApp', ['ngRoute', 'otControllers']);


// Utility function to shuffle an array
function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

// Transform letter before displaying it
function transformLetter(letter) {
	return letter.toUpperCase();
}

function displayElement(id) {
	document.getElementById(id).style.display = "inline-block";
}

function displayBlockElement(id) {
	document.getElementById(id).style.display = "block";
}

function displayClass(className) {
	var elts = document.getElementsByClassName(className);
	for (i = 0; i < elts.length; i++) {
		elts[i].style.display = "block";
	}
}

function hideElement(id) {
	document.getElementById(id).style.display = "none";
}

function addStyle(id, style) {
	document.getElementById(id).classList.add(style);
}

function removeStyle(id, style) {
	document.getElementById(id).classList.remove(style);
}

otApp.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
			when('/PhotoAlbum', {
				templateUrl: 'oldalbum/index.html',
				controller: 'MainCtrl'
			}).
			when('/Home', {
				templateUrl: 'home.html',
				controller: 'MainCtrl'
			}).
			when('/School', {
				templateUrl: 'school.html',
				controller: 'SchoolCtrl'
			}).
			when('/School2', {
				templateUrl: 'school-2.html',
				controller: 'School2Ctrl'
			}).
			when('/School3', {
				templateUrl: 'school-3.html',
				controller: 'School3Ctrl'
			}).
			when('/SchoolAmelie', {
				templateUrl: 'school.html',
				controller: 'SchoolAmelieCtrl'
			}).
			when('/SchoolAmelie2', {
				templateUrl: 'school-2.html',
				controller: 'SchoolAmelie2Ctrl'
			}).
			when('/Strava', {
				templateUrl: 'strava.html',
				controller: 'StravaCtrl'
				//redirectTo: function(routeParams) {
				//	window.location = 'https://www.strava.com/oauth/authorize?client_id=21716&redirect_uri=http%3A%2F%2Fotacaille.ddns.net%2F%23%2FStrava&response_type=code&scope=activity:read_all';
				//}
			}).
			otherwise({
				redirectTo: '/Home'
			});
	}]);

//Export Table to CSV
otApp.directive('exportToCsv', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var el = element[0];
			element.bind('click', function (e) {
				var table = e.target.nextElementSibling;
				var csvString = '';
				var tableRows = $(table).children();
				for (var i = 1; i < tableRows.length; i++) {
					var rowData = $(tableRows[i]).children();
					for (var j = 0; j < rowData.length; j++) {
						csvString = csvString + rowData[j].innerHTML.replace(/,/g, ";") + ",";
					}
					csvString = csvString.substring(0, csvString.length - 1);
					csvString = csvString + "\n";
				}
				csvString = csvString.substring(0, csvString.length - 1);
				var a = $('<a/>', {
					style: 'display:none',
					href: 'data:application/octet-stream;base64,' + btoa(unescape(encodeURIComponent(csvString))),
					download: 'stravaStats.csv'
				}).appendTo('body')
				a[0].click()
				a.remove();
			});
		}
	}
});

var otControllers = angular.module('otControllers', []);

otControllers.controller('MenuCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {
	$http.get('javascript/menu.json').success(function (data) {
		$scope.menuItems = data;
	});
}]);
otControllers.controller('MainCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {
	$log.debug("Main");

	$scope.HomeWelcome = "Bienvenue!";
	$scope.SchoolLink = "Jeux Ecole";
	$scope.SchoolLink2 = "Jeux Ecole Suite";
	$scope.SchoolLinkAmelie = "Jeux Ecole Amélie";
	$scope.SchoolLinkAmelie2 = "Jeux Ecole Amélie Suite";
	$scope.StravaLink = "Activités Strava";
	$scope.PhotoLink = "Photos (accès restreint)";

	document.getElementById("school-link").onclick = function () {
		window.location.href = "#/School";
	}
	document.getElementById("school-link-2").onclick = function () {
		window.location.href = "#/School2";
	}
	document.getElementById("school-link-amelie").onclick = function () {
		window.location.href = "#/SchoolAmelie";
	}
	document.getElementById("school-link-amelie-2").onclick = function () {
		window.location.href = "#/SchoolAmelie2";
	}
	document.getElementById("strava-link").onclick = function () {
		window.location.href = "https://www.strava.com/oauth/authorize?client_id=21716&redirect_uri=http%3A%2F%2Fotacaille.ddns.net%2F%23%2FStrava&response_type=code&scope=activity:read_all";
	}
	document.getElementById("photo-link").onclick = function () {
		window.location.href = "#/PhotoAlbum";
	}
}]);

otControllers.controller('School3Ctrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {

	// Words reordering
	$http.get('javascript/images.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.imagesCategories = data;
	});

	$scope.imagesCategoriesTitle = "Replacer les images";
	$scope.imagesCategoriesCatTitle = "Catégories";
	$scope.imagesCategoriesShuffledTitle = "Images à déplacer";

	$scope.shuffledImageIdPrefix = "img-";
	$scope.categoryIdPrefix = "category";
	$scope.categoryNumber = 3;

	// Images
	function handleDropImages(ev) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");

		var shuffledId = data.slice($scope.shuffledImageIdPrefix.length);

		var dataCatId = $scope.shuffledImages[shuffledId].category;
		var catId = this.id.slice($scope.categoryIdPrefix.length);

		if (dataCatId == catId) {
			$log.info("Bravo!");

			if ($scope.shuffledImages[shuffledId].found) {
				$log.info("Already added");
			} else {
				this.innerHTML = this.innerHTML +
					"<img src=\"" + $scope.shuffledImages[data.slice($scope.shuffledImageIdPrefix.length)].image + "\"/>";
				//this.appendChild(document.getElementById(data));

				//track({ action: 'images-categories-success' });

				addStyle(data, "valid-image");

				$scope.shuffledImages[shuffledId].found = true;
			}
		} else {
			$log.info("Ce n'est pas le bon emplacement");

			//track({ action: 'images-categories-error' });
		}
	}

	function handleDragStartImages(ev) {
		// TODO Share this logic when dragging images
		var id = "";
		if (ev.target.nodeName == "IMG") {
			id = ev.target.parentElement.id;
		} else {
			id = ev.target.id;
		}

		ev.dataTransfer.setData("text", id);
	}

	function handleDragOverImages(ev) {
		ev.preventDefault();
	}

	function chooseCategories() {
		reinitCategoriesWidgets();

		$scope.shuffledImages = shuffle(Array.from($scope.imagesCategories));

		var sentence = "";
		for (i = 0; i < $scope.shuffledImages.length; i++) {
			// Content
			document.getElementById($scope.shuffledImageIdPrefix + i).innerHTML = "<img src=\"" + $scope.shuffledImages[i].image + "\"/>";
			// Display
			displayElement($scope.shuffledImageIdPrefix + i);
			// Initialize/Clean found indicator
			$scope.shuffledImages[i].found=false;
		}

		// Clean category content
		var categories = document.querySelectorAll("#categories .category");
		[].forEach.call(categories, function (category) {
			category.innerHTML="";
		});

		displayClass("images-categories-title");
		displayBlockElement("categories");
		displayBlockElement("shuffled-images-categories");

		// Track
		//track({ action: 'images-categories' });
	}

	function reinitCategoriesWidgets() {
		for (i = 0; i < $scope.imagesCategories.length; i++) {
			// Clean the style of the cells
			removeStyle($scope.shuffledImageIdPrefix + i, "valid-image");
		}
	}

	droppableElements = document.querySelectorAll("#categories div");
	[].forEach.call(droppableElements, function (droppable) {
		droppable.addEventListener("drop", handleDropImages, false);
		droppable.addEventListener("dragover", handleDragOverImages, false);
	});

	draggableElements = document.querySelectorAll("#shuffled-images-categories div");
	[].forEach.call(draggableElements, function (draggable) {
		draggable.addEventListener("dragstart", handleDragStartImages);
	});

	document.getElementById("choose-images-categories").addEventListener("click", chooseCategories);

}]);

otControllers.controller('School2Ctrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {

	// Words reordering
	$http.get('javascript/words_words.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.wordsWords = data;
	});

	$scope.wordsWordsTitle = "Replacer les mots";
	$scope.showModelWordsWordsTitle = "Montrer le modèle";
	$scope.hideModelWordsWordsTitle = "Cacher le modèle";
	$scope.wordsWordsModelTitle = "Mots dans l'ordre";
	$scope.wordsWordsShuffledTitle = "Mots à déplacer";

	$scope.showModelWordsWords = false;
	$scope.words = [];


	$scope.wordIdPrefix = "word-word-";
	$scope.modelWordIdPrefix = "model-word-word-";
	$scope.shuffledWordIdPrefix = "shuffled-word-word-";

	// Track data (json)
	function track(data) {
		// Track width & height
		data.width=window.innerWidth;
		data.height=window.innerHeight;
		$http.post("php/game_usage.php", JSON.stringify(data)).then(function (response) {
			$log.info(response.data);
		}, function (error) {
			$log.error(error);
		});
	}

	// Words
	function handleDropWords(ev) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");

		var dataText = document.getElementById(data).innerText;

		var match = false;

		for (i = 0; i < $scope.words.length; i++) {
			if (dataText == $scope.words[i].name) {
				match = (($scope.words[i].order) == this.id.slice($scope.modelWordIdPrefix.length));
			}
		}

		if (match) {
			$log.info("Bravo!");
			this.innerText = dataText;
			this.classList.add("valid-word");
			addStyle(data, "valid-word");

			track({ action: 'words-words-success' });
		} else {
			$log.info("Ce n'est pas le bon emplacement");

			track({ action: 'words-words-error' });
		}
	}

	function handleDragStartWords(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
	}

	function handleDragOverWords(ev) {
		ev.preventDefault();
	}

	function chooseWords() {
		reinitWordsWidgets();

		var wordIdx = Math.floor(Math.random() * ($scope.wordsWords.length));

		$scope.words = $scope.wordsWords[wordIdx].words;
		$scope.shuffledWords = shuffle(Array.from($scope.words));

		var sentence = "";
		for (i = 0; i < $scope.words.length; i++) {
			// Content
			document.getElementById($scope.shuffledWordIdPrefix + i).innerText = $scope.shuffledWords[i].name;
			document.getElementById($scope.modelWordIdPrefix + i).innerText = ".";
			// Display
			displayElement($scope.modelWordIdPrefix + i);
			displayElement($scope.shuffledWordIdPrefix + i);

			sentence = sentence + $scope.words[i].name + " ";
		}

		document.getElementById("model-words-words").innerText = sentence;
		document.getElementById("img-words-words").innerHTML = "<img src=\"" + $scope.wordsWords[wordIdx].image + "\"/>";

		displayBlockElement("img-words-words");

		displayClass("words-words-title");
		displayElement("show-words-words-model");

		// Track
		track({ action: 'words-words' });
	}

	function showHideWords() {
		$scope.showModelWordsWords = !$scope.showModelWordsWords;
		if ($scope.showModelWordsWords) {
			displayBlockElement("model-words-words");
		} else {
			hideElement("model-words-words");
		}

		$scope.$apply();
	}

	function reinitWordsWidgets() {
		for (i = 0; i < $scope.words.length; i++) {
			// Clean the style of the cells
			removeStyle($scope.modelWordIdPrefix + i, "valid-word");
			removeStyle($scope.shuffledWordIdPrefix + i, "valid-word");
			hideElement($scope.modelWordIdPrefix + i);
			hideElement($scope.shuffledWordIdPrefix + i);
		}
	}

	// Words Events
	droppableElements = document.querySelectorAll("#shuffled-model-words-words div");
	[].forEach.call(droppableElements, function (droppable) {
		droppable.addEventListener("drop", handleDropWords, false);
		droppable.addEventListener("dragover", handleDragOverWords, false);
	});

	draggableElements = document.querySelectorAll("#shuffled-words-words div");
	[].forEach.call(draggableElements, function (draggable) {
		draggable.addEventListener("dragstart", handleDragStartWords);
	});

	document.getElementById("choose-words-words").addEventListener("click", chooseWords);
	document.getElementById("show-words-words-model").addEventListener("click", showHideWords);
}]);

otControllers.controller('SchoolCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {

	// Get json definitions
	// Words for Letters Match
	$http.get('javascript/words.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.words = data;
	});

	// Images and Words Match
	$http.get('javascript/images.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.images = data;
	});

	// Images and Images Match
	$http.get('javascript/images_images.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.imagesImages = data;
	});

	// Fonts
	$http.get('javascript/fonts.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.fonts = data;
	});

	$scope.letterTitle = "Mots à reconstituer";
	$scope.letterModelTitle = "Mot à reconstituer";
	$scope.letterDestinationTitle = "Destination des lettres";
	$scope.letterShuffledTitle = "Déplace ces lettres au bon endroit";
	$scope.imagesAndWordsTitle = "Image et Mots en script";
	$scope.imagesAndWordsImageTitle = "Image à trouver";
	$scope.imagesAndWordsWordTitle = "Mot à associer";
	$scope.wordsTitle = "Mots dans plusieurs écritures";
	$scope.wordsModelTitle = "Mot à trouver";
	$scope.wordsShuffledTitle = "Mot à déplacer";
	$scope.imagesAndImagesTitle = "Images et Mots en cursive";
	$scope.imagesAndImagesATitle = "Image à trouver";
	$scope.imagesAndImagesBTitle = "Mot à déplacer";

	$scope.fontStyles = ["normal", "italic", "oblique"];
	$scope.fontWeights = ["normal", "bold", "bolder", "lighter"];

	$scope.maxLetters = 20;
	$scope.maxImages = 6;
	$scope.maxWords = 6;
	$scope.shuffledLetterIdPrefix = "shuffled-letter-";
	$scope.destinationLetterIdPrefix = "dest-letter-";
	$scope.modelLetterIdPrefix = "model-letter-";

	$scope.imgIdPrefix = "img-";
	$scope.wordIdPrefix = "word-";
	$scope.imgAIdPrefix = "imga-";
	$scope.imgBIdPrefix = "imgb-";

	$scope.shuffledModelWordIdPrefix = "model-word-";
	$scope.shuffledWordIdPrefix = "shuffled-word-";

	$scope.trackPrefix="";

	// Transform letter/word style
	function transformStyle(id) {
		var font = $scope.fonts[Math.floor(Math.random() * ($scope.fonts.length))].font;
		$log.debug("Selected font:" + font);
		document.getElementById(id).style.fontFamily = font;
		var fontStyle = $scope.fontStyles[Math.floor(Math.random() * ($scope.fontStyles.length))];
		document.getElementById(id).style.fontStyle = fontStyle;
		var fontWeight = $scope.fontWeights[Math.floor(Math.random() * ($scope.fontWeights.length))];
		document.getElementById(id).style.fontWeight = fontWeight;
	}

	// Track data (json)
	function track(data) {
		// Track width and height
		data.width=window.innerWidth;
		data.height=window.innerHeight;
		$http.post("php/game_usage.php", JSON.stringify(data)).then(function (response) {
			$log.info(response.data);
		}, function (error) {
			$log.error(error);
		});
	}

	// Letters
	function handleDropLetters(ev) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");

		if (document.getElementById(data).innerText == transformLetter(document.getElementById($scope.modelLetterIdPrefix + this.id.slice($scope.destinationLetterIdPrefix.length)).innerText)) {
			//ev.target.appendChild(document.getElementById(data));
			$log.info("Bravo!");
			this.classList.add("valid-letter");
			addStyle(data, "valid-letter");
			this.innerText = document.getElementById(data).innerText;

			track({ action: $scope.trackPrefix+'letters-success' });
		} else {
			$log.info("Ce n'est pas le bon emplacement");

			track({ action: $scope.trackPrefix+'letters-error' });
		}
	}

	function handleDragStartLetters(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
	}

	function handleDragOverLetters(ev) {
		ev.preventDefault();
		ev.dataTransfer.dropEffect = "move";
	}

	function chooseLetters() {
		var wordIdx = Math.floor(Math.random() * ($scope.words.length));

		$log.debug("Word Idx:" + wordIdx);

		reinitLetterWidgets();
		$scope.letters = Array();
		$scope.shuffledLetters = Array();
		var letters = $scope.words[wordIdx].name.split("");
		var shuffledLetters = shuffle(Array.from(letters));
		letters.forEach(letter => $scope.letters.push({ id: $scope.modelLetterIdPrefix + $scope.letters.length, title: letter }));

		for (i = 0; i < shuffledLetters.length; i++) {
			// Content
			document.getElementById($scope.shuffledLetterIdPrefix + i).innerText = transformLetter(shuffledLetters[i]);
			document.getElementById($scope.destinationLetterIdPrefix + i).innerText = ".";
			// Display
			displayElement($scope.shuffledLetterIdPrefix + i);
			displayElement($scope.destinationLetterIdPrefix + i);
			// Text Style
			transformStyle($scope.shuffledLetterIdPrefix + i);
		}

		displayClass("letter-title");

		// Track
		track({ action: $scope.trackPrefix+'letters' });


		$scope.$apply();
	}

	function reinitLetterWidgets() {
		for (i = 0; i < $scope.maxLetters; i++) {
			// Clean content
			document.getElementById($scope.destinationLetterIdPrefix + i).innerText = "";
			document.getElementById($scope.shuffledLetterIdPrefix + i).innerText = "";
			// Hide cells
			hideElement($scope.destinationLetterIdPrefix + i);
			hideElement($scope.shuffledLetterIdPrefix + i);
			// Clean style
			removeStyle($scope.shuffledLetterIdPrefix + i, "valid-letter");
			removeStyle($scope.destinationLetterIdPrefix + i, "valid-letter");
		}
	}

	// Letter Events
	var droppableElements = document.querySelectorAll("#destination div");
	[].forEach.call(droppableElements, function (droppable) {
		droppable.addEventListener("drop", handleDropLetters, false);
		droppable.addEventListener("dragover", handleDragOverLetters, false);
	});

	var draggableElements = document.querySelectorAll("#shuffled div");
	[].forEach.call(draggableElements, function (draggable) {
		draggable.addEventListener("dragstart", handleDragStartLetters);
	});

	document.getElementById("choose-word").addEventListener("click", chooseLetters);

	// Images and Words
	function handleDropImagesWords(ev) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		if (document.getElementById(data).innerText == $scope.shuffledImages[this.id.slice($scope.imgIdPrefix.length)].word) {
			$log.info("Bravo!");
			this.classList.add("valid-image");
			addStyle(data, "valid-word");

			track({ action: $scope.trackPrefix+'images-words-success' });
		} else {
			$log.info("Ce n'est pas le bon emplacement");
			track({ action: $scope.trackPrefix+'images-words-error' });
		}
	}

	function handleDragStartImagesWords(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
	}

	function handleDragOverImagesWords(ev) {
		ev.preventDefault();
	}

	function chooseImages() {
		reinitImageWidgets();
		var slicedImagesWords = shuffle(Array.from($scope.images)).slice(0, $scope.maxImages)
		$scope.shuffledWords = shuffle(Array.from(slicedImagesWords));
		$scope.shuffledImages = shuffle(Array.from(slicedImagesWords));

		for (i = 0; i < $scope.maxImages; i++) {
			// Content
			document.getElementById($scope.imgIdPrefix + i).innerHTML = "<img src=\"" + $scope.shuffledImages[i].image + "\"/>";
						
			document.getElementById($scope.wordIdPrefix + i).innerText = $scope.shuffledWords[i].word;
			// Display
			displayElement($scope.imgIdPrefix + i);
			displayElement($scope.wordIdPrefix + i);
		}

		displayClass("images-words-title");


		// Track
		track({ action: $scope.trackPrefix+'images-words' });
	}

	function reinitImageWidgets() {
		for (i = 0; i < $scope.maxImages; i++) {
			// Clean the style of the cells
			removeStyle($scope.imgIdPrefix + i, "valid-image");
			removeStyle($scope.wordIdPrefix + i, "valid-word");
		}
	}

	// Images Events
	droppableElements = document.querySelectorAll("#shuffled-images div");
	[].forEach.call(droppableElements, function (droppable) {
		droppable.addEventListener("drop", handleDropImagesWords, false);
		droppable.addEventListener("dragover", handleDragOverImagesWords, false);
	});

	draggableElements = document.querySelectorAll("#shuffled-images-words div");
	[].forEach.call(draggableElements, function (draggable) {
		draggable.addEventListener("dragstart", handleDragStartImagesWords);
	});

	document.getElementById("choose-images").addEventListener("click", chooseImages);

	// Words
	function handleDropWords(ev) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");

		if (document.getElementById(data).innerText == this.innerText) {
			$log.info("Bravo!");
			this.classList.add("valid-word");
			addStyle(data, "valid-word");

			track({ action: $scope.trackPrefix+'words-success' });
		} else {
			$log.info("Ce n'est pas le bon emplacement");

			track({ action: $scope.trackPrefix+'words-error' });
		}
	}

	function handleDragStartWords(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
	}

	function handleDragOverWords(ev) {
		ev.preventDefault();
	}

	function chooseWords() {
		reinitWordsWidgets();
		var slicedWords = shuffle(Array.from($scope.words)).slice(0, $scope.maxWords)
		$scope.shuffledModelWords = shuffle(Array.from(slicedWords));
		$scope.shuffledWords = shuffle(Array.from(slicedWords));

		for (i = 0; i < $scope.maxWords; i++) {
			// Content
			document.getElementById($scope.shuffledModelWordIdPrefix + i).innerText = $scope.shuffledModelWords[i].name;
			document.getElementById($scope.shuffledWordIdPrefix + i).innerText = $scope.shuffledWords[i].name;
			// Display
			displayElement($scope.shuffledModelWordIdPrefix + i);
			displayElement($scope.shuffledWordIdPrefix + i);
			transformStyle($scope.shuffledWordIdPrefix + i);
		}

		displayClass("words-title");

		// Track
		track({ action: $scope.trackPrefix+'words' });
	}

	function reinitWordsWidgets() {
		for (i = 0; i < $scope.maxWords; i++) {
			// Clean the style of the cells
			removeStyle($scope.shuffledModelWordIdPrefix + i, "valid-word");
			removeStyle($scope.shuffledWordIdPrefix + i, "valid-word");
		}
	}

	// Words Events
	droppableElements = document.querySelectorAll("#shuffled-model-words div");
	[].forEach.call(droppableElements, function (droppable) {
		droppable.addEventListener("drop", handleDropWords, false);
		droppable.addEventListener("dragover", handleDragOverWords, false);
	});

	draggableElements = document.querySelectorAll("#shuffled-words div");
	[].forEach.call(draggableElements, function (draggable) {
		draggable.addEventListener("dragstart", handleDragStartWords);
	});

	document.getElementById("choose-words").addEventListener("click", chooseWords);

	// Images and Images
	function handleDropImagesImages(ev) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");

		var idA = this.childNodes[0].src;
		var idB = document.getElementById(data).childNodes[0].src;

		$log.debug("drop => " + idA + "<=>" + idB);

		var textA = "";
		var textB = "";

		for (i = 0; i < $scope.maxImages; i++) {			
			if (window.location.origin + "/" + $scope.shuffledImagesA[i].image == idA) {
				textA = $scope.shuffledImagesA[i].word;
			}

			if (window.location.origin + "/" + $scope.shuffledImagesB[i].image == idB) {
				textB = $scope.shuffledImagesB[i].word;
			}
		}

		if (textA && textB && textA == textB) {
			$log.info("Bravo!");
			this.classList.add("valid-image");
			addStyle(data, "valid-image");

			track({ action: $scope.trackPrefix+'images-images-success' });
		} else {
			$log.info("Ce n'est pas le bon emplacement");

			track({ action: $scope.trackPrefix+'images-images-error' });
		}
	}

	function handleDragStartImagesImages(ev) {
		var id = "";
		if (ev.target.nodeName == "IMG") {
			id = ev.target.parentElement.id;
		} else {
			id = ev.target.id;
		}

		$log.debug("Drag:" + id);

		ev.dataTransfer.setData("text", id);
	}

	function handleDragOverImagesImages(ev) {
		ev.preventDefault();
	}

	function chooseImagesImages() {
		reinitImageImageWidgets();
		var slicedImagesImages = shuffle(Array.from($scope.imagesImages)).slice(0, $scope.maxImages);

		var imagesA = [];
		var imagesB = [];

		for (i = 0; i < $scope.maxImages; i++) {
			imagesA[i] = slicedImagesImages[i].image_a;
			imagesB[i] = slicedImagesImages[i].image_b;
		}

		$scope.shuffledImagesA = shuffle(imagesA);
		$scope.shuffledImagesB = shuffle(imagesB);

		for (i = 0; i < $scope.maxImages; i++) {
			// Content
			document.getElementById($scope.imgAIdPrefix + i).innerHTML = "<img src=\"" + $scope.shuffledImagesA[i].image + "\" />";
			document.getElementById($scope.imgBIdPrefix + i).innerHTML = "<img src=\"" + $scope.shuffledImagesB[i].image + "\" />";
			// Display
			displayElement($scope.imgAIdPrefix + i);
			displayElement($scope.imgBIdPrefix + i);
		}

		displayClass("images-images-title");

		// Track
		track({ action: $scope.trackPrefix+'images-images' });
	}

	function reinitImageImageWidgets() {
		for (i = 0; i < $scope.maxImages; i++) {
			// Clean the style of the cells
			removeStyle($scope.imgAIdPrefix + i, "valid-image");
			removeStyle($scope.imgBIdPrefix + i, "valid-image");
		}
	}

	// Images-Images events
	droppableElements = document.querySelectorAll("#shuffled-images-images-a div.image");
	[].forEach.call(droppableElements, function (droppable) {
		droppable.addEventListener("drop", handleDropImagesImages, false);
		droppable.addEventListener("dragover", handleDragOverImagesImages, false);
	});

	draggableElements = document.querySelectorAll("#shuffled-images-images-b div.image-text");
	[].forEach.call(draggableElements, function (draggable) {
		draggable.addEventListener("dragstart", handleDragStartImagesImages);
	});

	document.getElementById("choose-images-images").addEventListener("click", chooseImagesImages);
}]);

otControllers.controller('SchoolAmelieCtrl', ['$scope', '$http', '$log', '$controller', function ($scope, $http, $log,$controller) {
	// Same as School Controller
	// Extend it
	angular.extend(this,$controller('SchoolCtrl',{$scope:$scope}));

	// Get json definitions
	// Words for Letters Match
	$http.get('javascript/Amelie/words.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.words = data;
	});

	// Images and Words Match
	$http.get('javascript/Amelie/images.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.images = data;
	});

	// Images and Images Match
	$http.get('javascript/Amelie/images_images.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.imagesImages = data;
	});

	$scope.trackPrefix="amelie-";
}]);

otControllers.controller('SchoolAmelie2Ctrl', ['$scope', '$http', '$log', '$controller', function ($scope, $http, $log,$controller) {
	// Same as School2 Controller
	// Extend it
	angular.extend(this,$controller('School2Ctrl',{$scope:$scope}));

	// Get json definitions
	// Words reordering
	$http.get('javascript/Amelie/words_words.json', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.wordsWords = data;
	});

	$scope.trackPrefix="amelie-";
}]);

otControllers.controller('StravaCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {
	$log.debug("Strava");

	// Strava Access token
	$http.get('strava_client.txt', { headers: { 'Cache-Control': 'no-cache' } }).success(function (data) {
		$scope.stravaClientToken = data;
    });

	var accessTokenSet = false;
	// Stava App code
	var stravaAppId = "21716";
	// Get Strava code (when logged)
	var stravaCode = getUrlVars()["code"]

	// Parse strava authenticated url to get parameters
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			vars[key] = value;
		});
		return vars;
	}

	// Date Picker event
	$('.datepicker').datepicker().on('changeDate', function (ev) {
		var element = angular.element($('.datepicker'));
		var controller = element.controller();
		var scope = element.scope();

		// Clean activities
		$scope.activities = new Array();

		getActivitiesFromDate(ev.date);
	});

	// Numeric event
	$('.numeric').on('change', function (ev) {
		var element = angular.element($('.numeric'));
		var controller = element.controller();
		var scope = element.scope();

		//Clean activities
		$scope.activities = new Array();

		getActivitiesFromPage(parseInt(ev.target.value));
	});

	// Enrich Activities: Gear, ...
	enrichActivities = function (activities) {

		for (var i = 0; i < activities.length; i++) {
			// Date
			var activityDate = new Date(activities[i].start_date_local);
			activities[i].start_date = activityDate.getFullYear() + "-" + (activityDate.getMonth() + 1) + "-" + activityDate.getDate();

			// Gear
			if (typeof activities[i].gear_id !== 'undefined' &&
				activities[i].gear_id !== null) {
				getGear(activities[i], activities[i].gear_id);
			}
		}

	}

	// Decorate Activity with gear
	getGear = function (activity, gearId) {
		if (typeof $scope.gears[gearId] === 'undefined') {
			$http.get('https://www.strava.com/api/v3/gear/' + gearId + '?access_token=' + accessToken).success(function (data) {
				$scope.gears[gearId] = data;
				activity.gear_name = data.name;
			});
		} else {
			console.log("Gear cached");
			activity.gear_name = $scope.gears[gearId].name;
		}
	}

	// Get Activities from Date
	// Trigger the strava authentication in case the token is not set before calling BL
	getActivitiesFromDate = function (myDate) {
		if (accessTokenSet == false) {
			// Get new token
			$http.post('https://www.strava.com/oauth/token?client_id=' + stravaAppId + '&client_secret=' + $scope.stravaClientToken + '&code=' + stravaCode + '&grant_type=authorization_code')
				.success(function (data) {
					accessToken = data.access_token;
					accessTokenSet = true;
					getActivitiesFromDateWithAccessToken(myDate);
				});
		} else {
			// Token already available
			getActivitiesFromDateWithAccessToken(myDate);
		}
	}

	// Get Activities from Date BL (taking for granted the token is proprely set)
	getActivitiesFromDateWithAccessToken = function (myDate) {
		$http.get('https://www.strava.com/api/v3/athlete/activities?after=' + myDate.getTime() / 1000 + '&access_token=' + accessToken).success(function (data) {
			console.log("Nb Activities:" + data.length);

			enrichActivities(data);
			Array.prototype.push.apply($scope.activities, data);
		});
	}

	// Get Activities from Page
	// Trigger the strava authentication in case the token is not set before calling BL
	getActivitiesFromPage = function (myPageId) {
		if (accessTokenSet == false) {
			// Get new token
			$http.post('https://www.strava.com/oauth/token?client_id=' + stravaAppId + '&client_secret=' + $scope.stravaClientToken + '&code=' + stravaCode + '&grant_type=authorization_code')
				.success(function (data) {
					accessToken = data.access_token;
					accessTokenSet = true;

					getActivitiesFromPageWithAccessToken(myPageId);
				});
		} else {
			// Token already available
			getActivitiesFromPageWithAccessToken(myPageId);
		}
	}

	// Get Activities from Page BL (taking for granted the token is proprely set)
	getActivitiesFromPageWithAccessToken = function (myPageId) {
		$http.get('https://www.strava.com/api/v3/athlete/activities?page=' + myPageId + '&access_token=' + accessToken).success(function (data) {
			console.log("Nb Activities:" + data.length + "for page:" + myPageId);
			enrichActivities(data);
			Array.prototype.push.apply($scope.activities, data);

			// Recursive till no more activities retrieved
			if (data.length > 0) {
				getActivitiesFromPage(myPageId + 1);
			}
		});
	}

	// OT Activities
	$scope.activities = new Array();
	$scope.gears = {};

	var activitiesCount = 0;
	var activitiesNewCount = 0;

	//getActivities(1);

}]);
