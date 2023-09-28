import { useEffect, useState } from 'react'
import './App.css'

import Spinner from './components/spinner'

function App() {
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [weatherData, setWeatherData] = useState([])


  useEffect(() => {
    console.log('before call: ' + `${typeof (weatherData)}`)
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })


      console.log('before fetch: ' + lat, long)
      if (lat === 0 || long === 0) {
        return
      } else if (lat == localStorage.getItem("lat") && long == localStorage.getItem("long") && new Date().getTime() < JSON.parse(localStorage.getItem("weatherDataLS")).expiry && lat !== 0 && long !== 0) {
        console.log("LS and POS match, fetching from localstorage")
        console.log("Next update is in " + (JSON.parse(localStorage.getItem("weatherDataLS")).expiry - new Date().getTime()) / 1000 + " seconds")
        console.log("LS = " + localStorage.getItem("lat") + ", " + localStorage.getItem("long"))
        console.log(JSON.parse(localStorage.getItem("weatherDataLS")))
        console.log(weatherData)
        setWeatherData(JSON.parse(localStorage.getItem("weatherDataLS")).value)
      } else {
        console.log("LS and POS do not match, fetching from api")
        const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
        await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
          .then(res => res.json())
          .then(result => {
            console.log(result)
            setWeatherData(result)
            const weatherDataLS = {
              value: result,
              expiry: new Date().getTime() + 600000,
            }
            localStorage.setItem("lat", lat);
            localStorage.setItem("long", long);
            localStorage.setItem("weatherDataLS", JSON.stringify(weatherDataLS));
            console.log("set LSDATA = " + weatherDataLS)
            console.log("LSDATA is now = " + localStorage.getItem("weatherDataLS"))
          }).catch(err => {
            console.log(err)
          })
      }
    }
    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>Luke Skywatcher</h1>
      {weatherData.main ? (
        <>
          <h2>City: {weatherData.name}</h2>
          <h2>Temperature: {(weatherData.main.temp - 273.15).toFixed(2)} c</h2>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default App
