let apikey = "97d6755f6da6d2636df57cd373621143";


let input = document.querySelector('#search');
let searchbtn = document.querySelector('.bx-search-alt-2');
let cityname = document.querySelector('#search');

async function getFetchData(point,cityname,apikey){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/${point}?q=${cityname}&appid=${apikey}&units=metric`);
    let data = await response.json();

    return data;

}

async function search(){
    let citynamevalue = cityname.value;
    
    let data = await getFetchData('weather',citynamevalue,apikey);

    if(cityname.value.trim() != ""){

        // console.log(data);
        if(data.cod != "200"){
            notfound();
            cityname.value = '';
            cityname.blur();
        }
        else{
            changer(data);
            found();
            cityname.value = '';
            cityname.blur();
            
        }
    }
}

let city_name = document.querySelector('.name_city');
let temp_today = document.querySelector('.temp');
let date_today = document.querySelector('.date');
let weather_status = document.querySelector('.weather-status');
let Humidity = document.querySelector('.Humidity_cal');
let wind = document.querySelector('.wind_speed_cal');
let image = document.getElementById('imageHero');

async function changer(data){
    
    const {
        name,
        sys: {country},
        weather : [{id, main}],
        wind : {speed},
        main : {temp, humidity}
    } = data;
    
    let date = new Date();
    let option = {
        day : '2-digit',
        weekday : 'short',
        month : 'short'
    }
    
    date_today.textContent = date.toLocaleDateString('en-GB',option);// British (en-GB) DD/MM/YYYY  // US (en-US) MM/DD/YYYY                                   
    weather_status.textContent = data.weather[0].main;
    city_name.textContent = data.name + ' | ' + data.sys.country;
    temp_today.textContent = Math.round(data.main.temp) + '°C';
    Humidity.textContent = data.main.humidity + '%';
    wind.textContent = data.wind.speed + 'M/s';
    image.src = `assets/weather/${getweather(data)}`
    
    await forecastsInfo(data);
}

async function forecastsInfo(data) {
    container.innerHTML = '';
    let forecastdata = await getFetchData('forecast',data.name,apikey);

    let today_date = new Date().toISOString().split('T')[0];
    let skipday = '12:00:00' ;
    // console.log(today_date);

    forecastdata.list.forEach(forecastFuture => {

        if(forecastFuture.dt_txt.includes(skipday) && !forecastFuture.dt_txt.includes(today_date)){
            updateForcastsWeather(forecastFuture);
        }
    })
}


let container = document.querySelector('.scroll');


function updateForcastsWeather(forecastUpdate){

    console.log(forecastUpdate);

    const  {
        dt_txt : date,
        main : {temp},
        weather : [{id}]
    } = forecastUpdate;

    let calender = new Date(date);
    
    let optionDate = {
        day : '2-digit',
        month: 'short'
    }

    let dateResult = calender.toLocaleDateString('en-US',optionDate);

    const forecastItem = `<div class="box">
                            <p class="date">${dateResult}</p>
                            <img src="assets/weather/${getweather(forecastUpdate)}">
                            <p class="temp">${Math.round(temp)}°C</p>
                        </div>
    `

    

    container.insertAdjacentHTML('beforeend',forecastItem);

    



}

function getweather(data){
    if(data.weather[0].id <= 232) return 'thunderstrom.svg';
    if(data.weather[0].id <= 321) return 'drizzle.svg';
    if(data.weather[0].id <= 531) return 'rain.svg';
    if(data.weather[0].id <= 622) return 'snow.svg';
    if(data.weather[0].id <= 781) return 'atmosphere.svg';
    if(data.weather[0].id <= 800) return 'clear.svg';
    else return 'clouds.svg'
}




let not_found = document.querySelector('.not-found');
let search_display = document.querySelector('.search_city')
let found_display = document.querySelector('.found');



function notfound(){
    search_display.classList.add('disable');
    found_display.classList.remove('enable');
    not_found.classList.add('enable');


}

function found(){
    not_found.classList.remove('enable');
    found_display.classList.add('enable');
    search_display.classList.add('disable');



}


searchbtn.addEventListener('click',search);

input.addEventListener('keydown',(event) =>{
    if(event.key === "Enter"){
        search();
    }
   
})









