import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ResponsiveContainer,
} from 'recharts';
import { MapPin, Clock, Route, Shuffle, PinIcon } from 'lucide-react';
import './App.css';

// Constants and helper functions
const NUM_CITIES = 15;
const CHART_SIZE = 600;
const MIN_DISTANCE = 15;
const CHART_PADDING = 10;
const CITY_NAMES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'Fort Worth',
  'Columbus',
  'San Francisco',
];

const FIXED_CITIES = [
  { id: 0, name: 'New York', x: 80, y: 20 },
  { id: 1, name: 'Los Angeles', x: 20, y: 80 },
  { id: 2, name: 'Chicago', x: 60, y: 40 },
  { id: 3, name: 'Houston', x: 40, y: 70 },
  { id: 4, name: 'Phoenix', x: 30, y: 50 },
  { id: 5, name: 'Philadelphia', x: 75, y: 30 },
  { id: 6, name: 'San Antonio', x: 35, y: 60 },
  { id: 7, name: 'San Diego', x: 25, y: 75 },
  { id: 8, name: 'Dallas', x: 45, y: 55 },
  { id: 9, name: 'San Jose', x: 15, y: 85 },
  { id: 10, name: 'Austin', x: 50, y: 65 },
  { id: 11, name: 'Jacksonville', x: 70, y: 25 },
  { id: 12, name: 'Fort Worth', x: 55, y: 45 },
  { id: 13, name: 'Columbus', x: 65, y: 35 },
  { id: 14, name: 'San Francisco', x: 10, y: 90 },
];

const calculateDistance = (city1, city2) => {
  const dx = city1.x - city2.x;
  const dy = city1.y - city2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const generateRandomCities = (numCities) => {
  const cities = [];

  for (let i = 0; i < numCities; i++) {
    let newCity;
    let tooClose;

    do {
      tooClose = false;
      newCity = {
        id: i,
        name: CITY_NAMES[i],
        x: Math.random() * (100 - 2 * CHART_PADDING) + CHART_PADDING,
        y: Math.random() * (100 - 2 * CHART_PADDING) + CHART_PADDING,
      };

      for (let j = 0; j < cities.length; j++) {
        if (calculateDistance(newCity, cities[j]) < MIN_DISTANCE) {
          tooClose = true;
          break;
        }
      }
    } while (tooClose);

    cities.push(newCity);
  }

  return cities;
};

const TravelingSalesmanGame = () => {
  const [cities, setCities] = useState([]);
  const [route, setRoute] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isRandomMode, setIsRandomMode] = useState(true);

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRandomMode]);

  const handleCityClick = (city) => {
    if (gameFinished) return;

    if (route.includes(city)) {
      alert("You've already visited this city!");
      return;
    }

    if (route.length === 0) {
      setStartTime(Date.now());
    }

    const newRoute = [...route, city];
    setRoute(newRoute);

    if (newRoute.length > 1) {
      const distance = calculateDistance(newRoute[newRoute.length - 2], city);
      setTotalDistance((prevDistance) => prevDistance + distance);
    }

    if (newRoute.length === cities.length) {
      const finalDistance = calculateDistance(city, newRoute[0]);
      setTotalDistance((prevDistance) => prevDistance + finalDistance);
      setEndTime(Date.now());
      setGameFinished(true);
    }
  };

  const resetGame = () => {
    setCities(isRandomMode ? generateRandomCities(NUM_CITIES) : FIXED_CITIES);
    setRoute([]);
    setTotalDistance(0);
    setGameFinished(false);
    setStartTime(null);
    setEndTime(null);
  };

  const toggleMode = () => {
    setIsRandomMode(!isRandomMode);
  };

  const routeData = route.map((city, index) => ({
    ...city,
    index: index + 1,
  }));

  const renderCityPoint = (props) => {
    const { cx, cy, payload } = props;
    const isVisited = route.includes(payload);
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isVisited ? 8 : 6}
          fill={isVisited ? '#10B981' : '#6366F1'}
          className="city-point"
          style={{ cursor: 'pointer' }}
          onClick={() => handleCityClick(payload)}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize={10}>
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className="container">
      <style>
        {`
          .city-point {
            transition: r 0.3s ease, fill 0.3s ease;
          }
          .city-point:hover {
            r: 10;
          }
        `}
      </style>
      <h1 className="title">Traveling Salesman Game</h1>
      <p>
        Visit all {NUM_CITIES} cities once and return to the start with the
        shortest possible route!
      </p>

      <div>
        <button onClick={toggleMode} className="button">
          {isRandomMode ? (
            <>
              <Shuffle /> Switch to Fixed Mode
            </>
          ) : (
            <>
              <PinIcon /> Switch to Random Mode
            </>
          )}
        </button>
      </div>

      <div className="game-container">
        <div
          className="chart-container"
          style={{ maxWidth: `${CHART_SIZE}px`, height: `${CHART_SIZE}px` }}
        >
         <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 100]}
                tick={false}
                axisLine={{ stroke: 'white' }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[0, 100]}
                tick={false}
                axisLine={{ stroke: 'white' }}
              />
              <ZAxis type="number" range={[100, 1000]} />
              <Scatter
                name="Cities"
                data={cities}
                fill="#6366F1"
                shape={renderCityPoint}
              />
              <Scatter
                name="Route"
                data={routeData}
                fill="#10B981"
                line={{ stroke: '#10B981', strokeWidth: 2 }}
                shape="star"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-container">
          <div className="game-stats">
            <h2>Game Stats</h2>
            <p>
              <Route /> Total Distance: {totalDistance.toFixed(2)}
            </p>
            <p>
              <MapPin /> Cities Visited: {route.length} / {NUM_CITIES}
            </p>
            {startTime && (
              <p>
                <Clock /> Time Elapsed:{' '}
                {(((endTime || Date.now()) - startTime) / 1000).toFixed(2)}s
              </p>
            )}
          </div>

          <div className="current-route">
            <h3>Current Route:</h3>
            <p>{route.map((city) => city.name).join(' → ')}</p>
          </div>
        </div>
      </div>

      {gameFinished && (
        <div className="game-finished">
          <h2>You Finished!</h2>
          <p>Final Distance: {totalDistance.toFixed(2)}</p>
          <p>
            Total Time: {((endTime - startTime) / 1000).toFixed(2)} seconds
          </p>
          <button onClick={resetGame} className="button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TravelingSalesmanGame;

