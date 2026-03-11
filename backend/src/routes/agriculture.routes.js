const router = require('express').Router();
const axios  = require('axios');

const CROP_TIPS = {
  rice:       ['Plant in June-July for best yield','Keep fields flooded to 5-10cm depth','Use NPK fertilizer at planting'],
  vegetables: ['Test soil pH 6.0-7.0 before planting','Water deeply twice a week','Rotate crops each season'],
  fish:       ['Maintain water oxygen levels','Change 20% water weekly','Feed twice daily — morning and evening'],
  wheat:      ['Sow in November for winter crop','Fertilize 3 weeks after germination','Harvest when 80% golden yellow'],
  jute:       ['Sow March-April','Requires heavy rainfall','Harvest at early pod stage'],
};

const DISEASES = [
  { crop: 'Rice', disease: 'Blast', symptoms: 'Diamond-shaped lesions on leaves', treatment: 'Tricyclazole fungicide' },
  { crop: 'Rice', disease: 'BLB',   symptoms: 'Water-soaked lesions on leaf edges', treatment: 'Copper-based bactericide' },
  { crop: 'Vegetables', disease: 'Powdery Mildew', symptoms: 'White powder on leaves', treatment: 'Sulfur-based fungicide' },
  { crop: 'Wheat', disease: 'Rust', symptoms: 'Orange-red pustules on leaves', treatment: 'Propiconazole spray' },
];

router.get('/weather', async (req, res) => {
  const { lat = 23.8103, lng = 90.4125 } = req.query;
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    res.json({
      success: true,
      data: {
        temp:        data.main.temp,
        feelsLike:   data.main.feels_like,
        humidity:    data.main.humidity,
        description: data.weather[0].description,
        windSpeed:   data.wind.speed,
        icon:        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        cityName:    data.name,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Weather fetch failed. Check WEATHER_API_KEY.' });
  }
});

router.get('/tips', (req, res) => {
  res.json({ success: true, data: CROP_TIPS });
});

router.get('/diseases', (req, res) => {
  res.json({ success: true, data: DISEASES });
});

module.exports = router;
