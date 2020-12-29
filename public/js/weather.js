//$DOM PART:
const root = document.querySelector(":root");
const currentLocation = document.querySelector(".current-location");
const searchBtn = document.querySelector("#search-btn");
const weatherStatus = document.querySelector(".weather-text").innerText;
const maxFile = document.querySelector(".maxFile").innerText;
const primaryBG = document.querySelector(".primary-bg");
const secondaryBG = document.querySelector(".secondary-bg");
const dateTime = document.querySelector(".date-time");

//$ HELPERS FUNCTIONS:

//@DATE AND TIME FUNCTIONS
const getCurrentTime = () => {
  let hours = new Date().getHours();
  let mins = new Date().getMinutes();
  let periods = "AM";
  if (hours > 11) {
    periods = "PM";
    if (hours > 12) hours -= 12;
  }
  if (mins < 10) {
    mins = "0" + mins;
  }
  return `${hours}:${mins} ${periods}`;
};
//@ Random Number Function:
function randomNum(min = 1, max = maxFile) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//@ Fetching User's Location
const fetchUserLocation = (e) => {
  var startPos;
  var latitude;
  var longitude;
  var geoSuccess = function (position) {
    startPos = position;
    latitude = startPos.coords.latitude;
    longitude = startPos.coords.longitude;
    window.location.replace(
      `https://cloves-weather-app.herokuapp.com/current-location?lat=${latitude}&long=${longitude}`
    );
  };
  var geoError = function (error) {
    console.log("Error occurred. Error code: " + error.code);
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

//@ Function TO check the light color and dark color:
function lightOrDark(color) {
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return "light";
  } else {
    return "dark";
  }
}

//@ Function to change the background Images according to the weather condition..
const changeBG = (url) => {
  primaryBG.style.backgroundImage = `url("${url}")`;
  secondaryBG.style.backgroundImage = `linear-gradient(to bottom,rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1)), url("${url}")`;
  //@ Making Text color dynamic i.e according to backgroundImage
  var vibrant = new Vibrant(url);
  vibrant.getPalette().then((palette) => {
    // document.querySelector("#body").style.color = palette.LightVibrant.hex;
    const clr = lightOrDark(palette.DarkVibrant.hex);
    const primaryClr = clr == "light" ? "#000" : "#fff";
    root.style.setProperty("--primary-color", primaryClr);
    root.style.setProperty("--accent-color", palette.Vibrant.hex);
    root.style.setProperty("--secondary-color", palette.DarkMuted.hex);
    root.style.setProperty("--hover-color", palette.Muted.hex);
  });
};

//$DOM and CSS MANIPULATION:

//@Changing Date and Time:
dateTime.innerText = moment().format("llll");

//@ Changing Icon on the basis of Weather Condition..
root.style.setProperty(
  "--icon-url",
  `url("../assets/icons/${weatherStatus}.svg")`
);

//@making Theme Dynamic...Changing Backgrounds according to weather Condition..

//-Weather Status Words that are similar, i grouped them..
const wStatus1 = ["Fog", "Mist"];
const wStatus2 = ["Sand", "Dust", "Ash"];
const wStatus3 = ["Rain", "Drizzle"];
const wStatus4 = ["Clouds", "Smoke"];

//- getting a random num to select random images from a particular folder in assets.
const num = randomNum();
let imgUrl;

if (wStatus1.includes(weatherStatus)) {
  imgUrl = `./public/assets/Fog-Mist/${num}.jpg`;
  changeBG(imgUrl);
} else if (wStatus2.includes(weatherStatus)) {
  imgUrl = `./public/assets/Sand-Dust/${num}.jpg`;
  changeBG(imgUrl);
} else if (wStatus3.includes(weatherStatus)) {
  imgUrl = `./public/assets/Rain-Drizzle/${num}.jpg`;
  changeBG(imgUrl);
} else if (wStatus4.includes(weatherStatus)) {
  imgUrl = `./public/assets/Clouds/${num}.jpg`;
  changeBG(imgUrl);
} else {
  imgUrl = `./public/assets/${weatherStatus}/${num}.jpg`;
  changeBG(imgUrl);
}

//$ Events Handling..

//@ Current-Location Event:
currentLocation.addEventListener("click", fetchUserLocation);

//@ Submit-Event: City Search:
searchBtn.addEventListener("click", (e) => {
  const cityname = document.getElementById("cityname").value;
  e.preventDefault();
  if (cityname) {
    document.querySelector(".form").submit();
  } else {
    alert("Please Enter a City Name");
  }
});
