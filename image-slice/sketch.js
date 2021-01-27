let stacksize = 1000; // define the size of the image stack
let canvasspace = 100; // define the space around the image stack
let canvasspacey = 160; // additional spacing for image URL input box
let canvassize = stacksize// + (canvasspace * 2);
let clearness = 100; // set transparency levels
let savebutton, textarea, loadbutton, urls; // create save button, load button, text box and urls
let savebuttonx = 220;
let savebuttony = (canvasspace/2)+160;
let imagecount = 0;
let imagex;
let imagey;
let imagesegment;
let sel;

let imagesStack = []; // set up array

function preload() {
  urls = localStorage.getItem("urls"); //load previously saved data from localstorage
  if(urls){ //skips if no data before
	  urls = urls.split("\n"); //every line contains a new url
	  for(let i=0; i<urls.length; i++){
		if(urls[i].trim()!=""){
		  imagesStack[i] = loadImage(urls[i],null,(e)=>{
			  alert("One or more urls failed to load. Please try again or double check the urls.");
			  localStorage.removeItem("urls");
			  location.reload();
		  }); //load images from localstorage lines
		}
	  }
  }
}

function setup() {
	// first, draw the canvas.
	// the order of creation is also the order of display
	let canvas = createCanvas(canvassize,canvassize);
	canvas.position(canvasspace, canvasspace + canvasspacey);
	background('red');

  //count total number of images to determine width of image slices
  imagenumber = imagesStack.length;
  imagesegment = stacksize/imagenumber;

  // print so can be checked in console
  print(imagesegment);

  // create dropdown box to select blend mode
  sel = createSelect();
  sel.option(BLEND);
  sel.option(DARKEST);
  sel.option(LIGHTEST);
  sel.option(DIFFERENCE);
  sel.option(MULTIPLY);
  sel.option(EXCLUSION);
  sel.option(SCREEN);
  sel.option(REPLACE);
  sel.option(OVERLAY);
  sel.option(HARD_LIGHT);
  sel.option(SOFT_LIGHT);
  sel.option(DODGE);
  sel.option(BURN);
  sel.option(ADD);
  sel.option(NORMAL);
  sel.selected(NORMAL);
  sel.changed(render);
  sel.position(canvasspace, (canvasspace / 2)+canvasspacey);

  //Display the textarea and assign a class
  textarea = createElement("textarea");
  textarea.position(canvasspace, (canvasspace / 2));
  textarea.class("image-inputs");
  textarea.size(400,100);
  if(urls){ //if urls exist in localstorage just put it in the textarea and clear the localstorage
	  textarea.value(urls.join("\n"));
	  localStorage.removeItem("urls");
  }

  // display button to load images and bind its event handler
  loadbutton = createButton('Load Images');
  loadbutton.position(canvasspace, savebuttony-40);
  loadbutton.mousePressed(loadimgs);

  // display button to save images
  savebutton = createButton('Save image');
  savebutton.position(savebuttonx, savebuttony);
  savebutton.mousePressed(saveimg);

  render()
}

// renamed the function "render", we call them at the end of setup
// and each time the dropdown is changed

function render() {

  for(let i = 0; i < imagesStack.length; i++) {

	  // load the image contained in the 'imagesStack' array at index 'i'
	  // and put it in a temporary variable called 'currentImage'
	  let currentImage = imagesStack[i];

	  if (currentImage.width > currentImage.height) {
	    currentImage.resize(0,stacksize);
	  } else {
	    currentImage.resize(0,stacksize);
	  }
	// these instructions are applied in both cases, so i move them
	// outside the if/else block
	imagex = i * imagesegment
  	imagey = 0
  	imagew = imagesegment;
  	imageh = stacksize;
  	blend(currentImage, imagex, 0, imagew, imageh, imagex, imagey, imagew, imageh, sel.value());
  }
}

function loadimgs(){
  // save the data in localstorage and reload the page, so that next time on page load the images will be read from localstorage and initiated in p5
  localStorage.setItem("urls",textarea.value());
  location.reload();
}

function saveimg() {
  saveCanvas('myCanvas', 'jpg');
}
