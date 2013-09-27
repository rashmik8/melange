TimeMelange is a website for sharing and displaying timelines.

* I have used http://timeline.verite.co/ Library for showing diagrammatic representation of timelines.
* Rest API example lookup: "http://squarism.com/2011/04/01/how-to-write-a-ruby-rails-3-rest-api/"
* CSS reference from http://pollengra.in

Narrative:

When I visit the website, I am taken to home page which lists timelines available.
There are 4 options given: showcase, new timeline, home and browse.
When I click on Showcase tab, it lists timelines with respect to genre ie movie, music or technology.
I log in to the website and the listing changes. Timelines created by me are visible.
Clicking on one of the timelines, takes me to a page which displays timeline in a diagram. I can click 
on left and right arrows to traverse in the timeline.
Clicking on More link in browse timelines tab, list more timeline tiles under exiting one(using AJAX call)

Tasks done:
* AJAX call
* REST API XML request
* Two controllers timeline and events dependent on each other (timeline has many events)
* User has multiple timelines
* To check integration test, run rspec spec\requests\publics_spec.rb (for user pages)
* To check for unit tests, run rake test test\controllers\.. in the website directory
* Sign up and Sign in works

Tasks not yet accomplished:
* Creation of timeline(the way I want)
* Data is very basic. Need to populate with better data
* Unit tests failing after my last change to website. Will fix it asap
* Some beautification required on the site
* Redirection from sign out page to sign in broken




