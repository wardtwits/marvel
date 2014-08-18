marvel
======

JavaScript demo utilizing the Marvel API

This is a site demo using Marvel Comic's API

Features
* Carousel - View top Marvel heroes and description / click them to view more detail at Marvel.com

* Characters Link (or scroll down): Here you can choose 1 or more characters in the drop down list and see their comics. We return 20 results at a time (keep in mind our API limit is 3000 hits per day) and you can continue fetching results.
* Clicking on a comicbook will bring you to Marvel's site with more info

INFO:
* When you first load the site we'll fetch a default number of characters/ imgages and descriptions, unfortunately you have to make one API call at a time for each based on ID.  These images/descriptions will load into our carousel.  It's a bit slow (caching or using putting these in local storage would be nice to add).  
* We re-use the carousel image links to populate thumbnails on the drop down search.

BUG:
* Unfortunately I just came across a cross-site scripting bug in IE9 that causes the drop down search to hang. While JSONP should work, it appears there is some compat issue with jQuery and I'm still searching for the fix on this.

TO DO / nice to have:
* Add search filter by year
* This is some-what responsive but needs work, I didn't have time yet to test or fix bugs on many different devices
* Spinner animation is compat with IE10+ / add more compat spinner
* Fine tune search character thumbs for smaller devices

FYI:
* The downside on the API is that some calls (i.e char stats) only give a URL for a link back, no real data you can use
* I had wanted to add a little more functionality but I've hit the API limit a few times and had to wait or borrow keys


Technology:
* jQuery 2.1.1
* Handlebars.js 1.3.0 (for templating json data)
* Bootstrap / Bootstrap select (for the multi drop down)
* BX Slider for the carousel  (could probably switch to bootstrap's carousel, very similar)
