import React, { useEffect, useState } from 'react';

// Duékoué, Côte d'Ivoire
const DUEKOUE_COORDS = { lat: 6.75, lon: -7.35 };

type Condition = 'clear' | 'cloudy' | 'rain' | 'storm';

interface WeatherState {
  isDay: boolean;
  condition: Condition;
}

function isDayFromLocalTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18.5;
}

function mapWeatherCode(code: number): Condition {
  if ([95, 96, 99].includes(code)) return 'storm';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([1, 2, 3, 45, 48].includes(code)) return 'cloudy';
  return 'clear';
}

/**
 * Decorative, time-and-weather-aware overlay for the hero banner:
 * a sun glow in daylight, stars at night, falling rain when it's actually
 * raining over Duékoué. Falls back to local-time day/night only if the
 * weather API is unreachable.
 */
export const WeatherEffects: React.FC = () => {
  const [weather, setWeather] = useState<WeatherState>({
    isDay: isDayFromLocalTime(),
    condition: 'clear',
  });

  useEffect(() => {
    let cancelled = false;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${DUEKOUE_COORDS.lat}&longitude=${DUEKOUE_COORDS.lon}&current=weather_code,is_day&timezone=auto`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.current) return;
        setWeather({
          isDay: data.current.is_day === 1,
          condition: mapWeatherCode(data.current.weather_code),
        });
      })
      .catch(() => {
        // Offline / blocked: keep the local-time guess, assume clear skies.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isRain = weather.condition === 'rain' || weather.condition === 'storm';
  const isClearDay = weather.isDay && !isRain;
  const isNight = !weather.isDay;

  const raindrops = isRain ? Array.from({ length: 60 }) : [];
  const stars = isNight ? Array.from({ length: 35 }) : [];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {isClearDay && (
        <div className="absolute -top-24 -right-16 w-[28rem] h-[28rem]">
          <div
            className="absolute inset-0 rounded-full blur-3xl animate-sun-glow"
            style={{
              background:
                'radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(251,191,36,0.15) 45%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 animate-sun-ray-spin opacity-30"
            style={{
              background:
                'repeating-conic-gradient(from 0deg, rgba(251,191,36,0.25) 0deg 4deg, transparent 4deg 18deg)',
              maskImage: 'radial-gradient(circle, black 0%, transparent 65%)',
              WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 65%)',
            }}
          />
        </div>
      )}

      {isNight && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1526]/35 via-[#0b1526]/5 to-transparent" />
          {stars.map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: Math.random() > 0.8 ? '2.5px' : '1.5px',
                height: Math.random() > 0.8 ? '2.5px' : '1.5px',
                top: `${Math.random() * 55}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2.5 + Math.random() * 3}s`,
              }}
            />
          ))}
        </>
      )}

      {isRain && (
        <div className="absolute inset-0 bg-slate-900/5">
          {raindrops.map((_, i) => (
            <span
              key={i}
              className="absolute top-0 w-px h-10 bg-gradient-to-b from-transparent via-sky-300/70 to-sky-200/40 animate-rain-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
