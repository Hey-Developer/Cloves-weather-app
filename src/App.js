const express = require("express");
const path = require("path");
const requests = require("requests");
const fs = require("fs");

// Function to count the number of files in a directory.
const getAllDirFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(file);
    }
  });

  return arrayOfFiles;
};

const static_path = path.join(__dirname, "../public");
const node_modules = path.join(__dirname, "../node_modules");
const views_path = path.join(__dirname, "../views");
const port = process.env.PORT || 3000;
let dataFromApi;

const app = express();

// For POST DATA
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/public", express.static(static_path));
app.use("/node_modules", express.static(node_modules));
app.set("views", views_path);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/search-by-city", (req, res) => {
  const cityname = req.body.cityname;
  let maxFile;
  //+Here i have to play with the API:
  requests(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=71a8c7a2be7cf985a299657f9b550aca`
  )
    .on("data", (chunk) => {
      const JSONData = JSON.parse(chunk);
      if (JSONData.cod == 200) {
        const weatherStatus = JSONData.weather[0].main;
        const wStatus1 = ["Fog", "Mist"];
        const wStatus2 = ["Sand", "Dust", "Ash"];
        const wStatus3 = ["Rain", "Drizzle"];
        const wStatus4 = ["Clouds", "Smoke"];
        if (wStatus1.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Fog-Mist`)
          ).length;
        } else if (wStatus2.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Sand-Dust`)
          ).length;
        } else if (wStatus3.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Rain-Drizzle`)
          ).length;
        } else if (wStatus4.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Clouds`)
          ).length;
        } else {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/${JSONData.weather[0].main}`)
          ).length;
        }
        dataFromApi = {
          temp: JSONData.main.temp,
          cityName: JSONData.name,
          weatherStatus: JSONData.weather[0].main,
          clouds: JSONData.clouds.all,
          humidity: JSONData.main.humidity,
          windSpeed: JSONData.wind.speed,
          pressure: JSONData.main.pressure,
          errorMsg: null,
          maxFile: maxFile,
        };
      } else {
        dataFromApi = {
          temp: "-",
          cityName: "-",
          weatherStatus: "---",
          clouds: "--",
          humidity: "--",
          windSpeed: "--",
          pressure: "--",
          errorMsg: `Something wrong happened could not fetch data from API`,
          maxFile: 0,
        };
      }
    })
    .on("end", (err) => {
      if (err) {
        dataFromApi = {
          temp: "-",
          cityName: "-",
          weatherStatus: "---",
          clouds: "--",
          humidity: "--",
          windSpeed: "--",
          pressure: "--",
          errorMsg: `Something wrong happened could not fetch data from API`,
          maxFile: 0,
        };
        res.render("weather", dataFromApi);
      }
      res.render("weather", dataFromApi);
    });
});

app.get("/current-location", (req, res) => {
  const lat = req.query.lat || 0;
  const lon = req.query.long || 0;
  let maxFile;
  let url;
  if (req.query.cityname) {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${req.query.cityname}&units=metric&appid=71a8c7a2be7cf985a299657f9b550aca`;
  } else {
    url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=71a8c7a2be7cf985a299657f9b550aca`;
  }

  requests(url)
    .on("data", (chunk) => {
      const JSONData = JSON.parse(chunk);
      if (JSONData.cod == 200) {
        const weatherStatus = JSONData.weather[0].main;
        const wStatus1 = ["Fog", "Mist"];
        const wStatus2 = ["Sand", "Dust", "Ash"];
        const wStatus3 = ["Rain", "Drizzle"];
        const wStatus4 = ["Clouds", "Smoke"];
        if (wStatus1.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Fog-Mist`)
          ).length;
        } else if (wStatus2.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Sand-Dust`)
          ).length;
        } else if (wStatus3.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Rain-Drizzle`)
          ).length;
        } else if (wStatus4.includes(weatherStatus)) {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/Clouds`)
          ).length;
        } else {
          maxFile = getAllDirFiles(
            path.join(__dirname, `../public/assets/${JSONData.weather[0].main}`)
          ).length;
        }

        dataFromApi = {
          temp: JSONData.main.temp,
          cityName: JSONData.name,
          weatherStatus: JSONData.weather[0].main,
          clouds: JSONData.clouds.all,
          humidity: JSONData.main.humidity,
          windSpeed: JSONData.wind.speed,
          pressure: JSONData.main.pressure,
          errorMsg: null,
          maxFile: maxFile,
        };
      } else {
        dataFromApi = {
          temp: "-",
          cityName: "-",
          weatherStatus: "---",
          clouds: "--",
          humidity: "--",
          windSpeed: "--",
          pressure: "--",
          errorMsg: `Something wrong happened could not fetch data from API`,
          maxFile: 0,
        };
      }
    })
    .on("end", (err) => {
      if (err) {
        dataFromApi = {
          temp: "-",
          cityName: "-",
          weatherStatus: "---",
          clouds: "--",
          humidity: "--",
          windSpeed: "--",
          pressure: "--",
          errorMsg: `Something wrong happened could not fetch data from API`,
          maxFile: 0,
        };
        res.render("weather", dataFromApi);
      }
      res.render("weather", dataFromApi);
    });
});

// for 404 page..
app.use((req, res) => {
  if (res.status(404)) {
    res.render("404");
  }
});

app.listen(port, () =>
  console.log(`Weather App is Running on http://localhost:${port}`)
);
