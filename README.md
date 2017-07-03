
# stop-watch

It is an angular application demonstrate stop watch functionality with the feature of general stop watch functionality with multiple browser tab syncronization and background running feature if the browser tab even closed.

## Instruction
Download or clone this repo and enter the `stop-watch` folder then run 
```
npm install
```
 then you can run the development server with 
 ```
 gulp
 ```

I use gulp, saas, [ngStorage](https://github.com/gsklee/ngStorage) for the development.

## Preview
You can see a video preview on [youtube](https://www.youtube.com/watch?v=AHz1dkNwZ2A&feature=youtu.be)

## Requirements
* The application consists of: a counter, controls and records.
* “Play” button must be changed to “Pause” on click, and start ticking.
* Clicking on “Pause” should stop ticking and change it’s button back to 
“Play” respectively. 
* Clicking on the button with a clock icon (in the middle) must add the 
current time into the list. 
* Recycle button erases the list, stops ticking and resets the counter 
to zero on click. 
* The app must display “Remove” button (upper cased) on mouse over per record, 
which deletes the item on click.
* The state of the app must be saved in browser’s 
memory (information about the counter and records). 
* In case if to click on “Play” button and close the page and open it after 5 minutes
it must show 5 minutes on screen. 
* Delimiters must be blinking 1 time per second on tick 
* When 2 or more pages (browser windows) 
of the same app are opened, any action must be synchronized on every page.
