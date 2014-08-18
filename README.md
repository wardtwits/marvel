marvel
======

JavaScript demo utilizing the Marvel API

This is a basic site demo using Marvel Comic's API

Features
* When you first load the site we'll fetch a default number of characters with imgages and descriptions, unfortunately you have to make one API call at a time for each.  These images/descriptions will load into our carousel.  It's a bit of a slow load so I've added a spinner, I would look at doing things differently for a commercial site.

* Characters Link (or scroll down): Here you can choose 1 or more characters in the drop down list and see what comics they've been in together.  We return 20 results at a time (keep in mind our API limit is 3000 hits per day)


TO DO:
* Add search filter by year
* This is some-what responsive but needs work, I didn't have time yet to test or fix bugs on many different devices
* Need to add a spinner (for IE and older browsers)
* Add smooth scrolling, easy just haven't had time
* Fine tune search character thumbs for smaller devices

FYI:
* I was hoping to have a pop-up (from the carousel) with way more character stats but I couldn't find them in the API
* I had wanted to add a little more functionality but I've hit the API limit a few times and had to wait or borrow keys


Technology:
* jQuery
* Handlebars.js (for templating)
* Bootstrap / Bootstrap select (for the multi drop down)
* BX Slider for the carousel
