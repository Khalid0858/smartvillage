'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Spinner } from '@/components/ui';
import api from '@/lib/api';

export default function AgriculturePage() {
  const [weather,  setWeather]  = useState(null);
  const [tips,     setTips]     = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [w, t, d] = await Promise.all([
          api.get('/agriculture/weather'),
          api.get('/agriculture/tips'),
          api.get('/agriculture/diseases'),
        ]);
        setWeather(w.data.data);
        setTips(t.data.data);
        setDiseases(d.data.data);
      } catch (err) {
        // Weather might fail without API key — that's okay
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <MainLayout>
      <div className="page-container">
        <h1 className="section-title mb-1">🌾 Smart Agriculture</h1>
        <p className="text-gray-500 text-sm mb-8">Weather, crop tips, and disease information</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weather Card */}
          <div className="card p-6 col-span-1">
            <h2 className="font-bold text-gray-900 mb-4">🌤️ Current Weather</h2>
            {loading ? <Spinner /> : weather ? (
              <div className="text-center">
                <img src={weather.icon} alt={weather.description} className="w-20 mx-auto" />
                <p className="text-5xl font-black text-gray-900">{Math.round(weather.temp)}°C</p>
                <p className="text-gray-500 capitalize mt-1">{weather.description}</p>
                <p className="text-sm text-gray-500 mt-1">{weather.cityName}</p>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-blue-600 font-bold">{weather.humidity}%</p>
                    <p className="text-gray-500 text-xs">Humidity</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-green-600 font-bold">{weather.windSpeed} m/s</p>
                    <p className="text-gray-500 text-xs">Wind</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">Weather unavailable</p>
                <p className="text-xs text-gray-300 mt-1">Add WEATHER_API_KEY to enable</p>
              </div>
            )}
          </div>

          {/* Crop Tips */}
          <div className="card p-6 col-span-2">
            <h2 className="font-bold text-gray-900 mb-4">💡 Farming Tips</h2>
            {tips && (
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(tips).map(([crop, cropTips]) => (
                  <div key={crop} className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-bold text-green-800 capitalize mb-2">{crop}</h3>
                    <ul className="space-y-1">
                      {cropTips.map((tip, i) => (
                        <li key={i} className="text-sm text-green-700 flex items-start gap-1.5">
                          <span className="mt-0.5">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Disease Info */}
        <div className="card p-6 mt-6">
          <h2 className="font-bold text-gray-900 mb-4">🦠 Crop Disease Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Crop</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Disease</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Symptoms</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Treatment</th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((d, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                    <td className="px-4 py-2.5 font-semibold text-green-700">{d.crop}</td>
                    <td className="px-4 py-2.5 font-medium">{d.disease}</td>
                    <td className="px-4 py-2.5 text-gray-600">{d.symptoms}</td>
                    <td className="px-4 py-2.5 text-blue-700 font-medium">{d.treatment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
