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
      }
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWeatherData(result)
        }).catch(err => {
          console.log(err)
        })
    }
    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>DARTH VÄDER</h1>
      <h2>Luke Skywatcher</h2>
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
