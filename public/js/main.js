//$ DOM PART:
const searchBtn = document.querySelector(".btn-sub");

//$ Event-Handling:
//@ Submit-Event
searchBtn.addEventListener("click", (e) => {
  const cityname = document.getElementById("cityname").value;
  e.preventDefault();
  if (cityname) {
    document.querySelector(".form").submit();
  } else {
    document.getElementById("warning-txt").innerText =
      "Please enter a city name";
  }
});
