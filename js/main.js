

(function(window, document, $, undefined) {
	"use strict";

	// self = wc;
	var self = this,
		KEY = "0fe58099f62eeec2e5b566a2be6cffe9", //"06123e3e72ff147d1bb35241abbc14c5", // api key
		$ddList = $('.selectpicker'),
		$characterThumbs = {},
		// no easy lookup for these ID's, let's save time/bandwidth for example site
		charList = {
			'Spider-Man': 1009610,
			'Captain Marvel': 1010338,
			'Hulk': 1009351,
			'Thor': 1009664,
			'Iron Man': 1009368,
			'Luke Cage': 1009215,
			'Black Widow': 1009189,
			'Daredevil': 1009262,
			'Captain America': 1009220,
			'Wolverine': 1009718
		},
		charText = {
			1009610: "My spidey senses are tingling!",
			1010338: "This place... such evil.",
			1009351: "You're making me angry.",
			1009664: "I will spit my defiance at you -- with my last breath!",
			1009368: "Becoming an Avenger is not a right... but a privilege!",
			1009215: "The war is over when we SAY it's over.",
			1009189: "Rapido, Right? Your girlfriend give you that name?",
			1009262: "Just doing my Super Hero duty!",
			1009220: "Call me Steve",
			1009718: "I really like beer."
		},

		// initial search to get char pics for home page slider
		getCharPics = function(id) {
			var url = 'http://gateway.marvel.com:80/v1/public/characters/'+id+'?apikey='+KEY;
	
			return $.ajax({
				  url: url,
				  type: 'GET',
				  dataType: 'jsonp' /* needed for IE */
				});	
		},

		getComics = function(settings) {
			var defaults = {
					charList: 1009610,
					/* should add an option for the user to select the years */
					yearStart: 1950,
					yearEnd: 2014,
					offset: 0,
					limit: 20
				},
				settings = $.extend(defaults, settings),
				url = "http://gateway.marvel.com/v1/public/comics?limit="+settings.limit+"&offset="+settings.offset+"&noVariants=true&orderBy=onsaleDate&format=comic&dateRange="+settings.yearStart+"-01-01%2C"+settings.yearEnd+"-12-31&formatType=comic&characters="+settings.charList+"&apikey="+KEY;

				return $.ajax({
					  url: url,
					  type: 'GET',
					  dataType: 'json' /* jsonP needed for IE */
					});	
		},

		getHomePageCharacters = function() {
			var promises = [],
				key,
				character = {},
				$spinner = $('#hpSpinner'),
				$envelope = $('.envelope'),
				$results = $('.bxslider'),
				templateSource = $('#sliderTemplate').html(),
				template = Handlebars.compile(templateSource);

			for (key in charList) {
				promises.push(getCharPics(charList[key]));	
			}

			$.when.apply($,promises).done(function() {

				var args = Array.prototype.slice.call(arguments, 0);
					character.thumb = [];

				for(var x=0; x<args.length; x++) {
					
					var res = args[x][0];

					if(res.code === 200 && res.data.results[0].thumbnail) {
						character.url = res.data.results[0].urls[0].url || '#';
						character.thumb = res.data.results[0].thumbnail.path+'/portrait_uncanny.jpg';
						character.quote = charText[res.data.results[0].id];
						character.name = res.data.results[0].name;
						character.description = res.data.results[0].description || "Really?! No description?!?!  Write your angry letters c/o: Marvel Comics";
						character.details = "Click to learn more";
			
						// we'll display char thumb when we do user search
						$characterThumbs[res.data.results[0].id] = res.data.results[0].thumbnail.path+'/standard_medium.jpg';
						$results.append(template(character));
					} else {
						$spinner.append('Please try again later. error code:'+res.code);
					}
				}

				 // Init our slider once we have the proper images
			    $('.bxslider').bxSlider({
			        slideWidth: 750,
			        autoDelay: 100
			    }); 
			    $envelope.removeClass('dim');
			    $spinner.hide(); 		

			}).fail(function (error) {
				// perhaps a real website would have better error handling
				$spinner.append('<br>'+error.statusText+', Something has gone terribly, terribly wrong. Please try again later.');
			});

		}(), // self calls


		toggleSearchStatus = function(charList) {
			var $status = $('#charStatus');

			if (!$status.is(':visible')) {
				var	t = '',
					dimClass = 'dim',
					i, len = charList.length,
					$results = $("#comicResults"),
					$thumbWrap = $('#characterWrapper').find('.thumbs');

				// if hidden, display it
				$status.show();
				$results.addClass(dimClass);

				for (i=0; i < len; i++) {
					t += '<img src="'+$characterThumbs[charList[i]]+'">';
				}
				$thumbWrap.html(t);

			} else {
				$status.hide();
			}
		},

		getComicData = function() {
			var list = $ddList.val(), 
				offset;

			if (arguments.length > 0) {
				list = arguments[0];
				offset = arguments[1];
			}

			var $myCharList = {
					'charList': list.toString(),
					'offset': offset
				},
				dimClass = 'dim',
				$results = $("#comicResults"),
				charPromise = getComics($myCharList);

			toggleSearchStatus(list); // on

			charPromise.done(function(data) {
				toggleSearchStatus(list); // off
				$results.removeClass(dimClass);
				displayResults(data, $("#reportTemplate"), list);
			});
		},

		displayResults = function(d, template, charSelections) {

			var data = {},
				i, comic, limit, total, offset, count, newOffset,
				$resultTotals = $('.resultTotals'),
				$showMore = $('.showMoreResults'),
				$next = $('.nextResult'),
				$offset = $('.offset'),
				$limit = $('.limit'),
				$total = $('.total'),
				$results = $("#comicResults"),
				templateSource = template.html(),
				template = Handlebars.compile(templateSource);
			
			// clear out old results
			$results.empty();

			if(d.code === 200 && d.data) {
				limit = d.data.limit;
				total = d.data.total;
				offset = d.data.offset;
				newOffset = offset + limit;
				count = d.data.count;

				for(i=0;i<d.data.results.length;i++) {
					comic = d.data.results[i];
					data.url = d.data.results[i].urls[0].url || '#';
					data.title = comic.title;
					data.description = comic.description;
					if (comic.images.length > 0) {
						data.image = comic.images[0].path+'/portrait_incredible.jpg';
					}

					var html = template(data);
					$results.append(html);
				}
				// show the total # of results
				$total.html(total);
				$limit.html(offset+1);
				$offset.html(newOffset);
				$resultTotals.show();

				// if more results, show info, link
				if (count) {
					var n;

					$next.html(limit);
					$showMore.show();
					// how many more results do we have?
					// show next XX number of results (use limit unless we have less available)
					n = (count < limit) ? count : limit;
					// we need the offset for the next search
					$showMore.attr('data-offset', newOffset);
					$showMore.attr('data-sel', charSelections);
					$next.html(n);
				}

			} else {
				$resultTotals.hide();
				$results.html('Bummer!! No search results found.');
			}
		},


		// Setup our drop down
		initDropDownList = function() {
			var key, 
				charListIDs = '',
				list;

			for (key in charList) {
				charListIDs += charList[key]+',';
				list += '<option value="'+charList[key]+'">'+key+'</option>';
			}
			// append values to dd list
			$ddList.append(list);
			// initiate drop down select
			$ddList.selectpicker();				
		},

		// Setup our event listeners
		initEventHandlers = function() {
			var $submitMe = $('#submitMe'),
				$clearSelection = $('#clearMe'),
				$showMore = $('.showMoreResults'),
				$nav = $('.navWrap'),
				$slide = $('#carousel');

			// for smooth scrolling anchor links
			$('a[href*=#]:not([href=#])').on('click', function(e){
			    e.preventDefault();
			    var target= $(this).attr('href');
			    $('html, body').stop().animate({
			       scrollTop: $(target).offset().top
			    }, 1000);
			});

			// enable/disable submit on drop down change
			$ddList.on('change', function() {
				if ($(this).val()) {
					$submitMe.removeAttr("disabled");
				} else {
					$submitMe.attr("disabled", "disabled");
				}
			});

			$clearSelection.on('click', function() {
				// empty dropdown selection
				$ddList.selectpicker('deselectAll');
			});	

			$submitMe.on('click', function() {
				getComicData();
				// disable submit until new search attr are selected
				$submitMe.attr("disabled", "disabled");
				// empty selection
				$ddList.selectpicker('deselectAll');
			});

			// let's show more results! (char/comic search)
			$showMore.on('click', function() {
				var offset = $(this).attr('data-offset'),
					sel = $(this).attr('data-sel').split(','); // turn string into character list array

				if (offset && sel) {
					getComicData(sel, offset);
				}
			});

			$slide.on('click', '.slide', function() {
				var url = $(this).attr('data-url');

				if (url !== '#') {
					window.open(url);
				}
			});

		    // Open/Close mobile navigation
		    $('#openNav, #exitNav').on('click.toggleMobileNav', function(e) {
		        e.preventDefault();
		        e.stopPropagation();
		        $nav.slideToggle("fast");
		    });

		};

        $(document).ready(function(){
        	initDropDownList();		// init drop down
            initEventHandlers();	// init event listeners

        }); // doc ready


})(window,document,jQuery);


