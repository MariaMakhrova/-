const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Початкові дані
let hotels = [
    { 
        id: 1, 
        name: 'Готель Львівський', 
        city: 'Львів', 
        stars: 4, 
        price_per_night: 1850.00 
    },
    { 
        id: 2, 
        name: 'Premier Palace', 
        city: 'Київ', 
        stars: 5, 
        price_per_night: 3500.50 
    },
    { 
        id: 3, 
        name: 'Гостинний Двір', 
        city: 'Одеса', 
        stars: 3, 
        price_per_night: 980.00 
    }
];

let nextHotelId = 4;

// Функція для пошуку готелю за id
const findHotelById = (id) => hotels.find(h => h.id === id);

// ➕ Додавання нового готелю
app.post('/api/hotels', (req, res) => {
    const { name, city, stars, price_per_night } = req.body;

    if (!name || !city || !stars || !price_per_night) {
        return res.status(400).json({ message: 'Потрібно вказати name, city, stars, price_per_night' });
    }

    const newHotel = {
        id: nextHotelId++,
        name,
        city,
        stars: parseInt(stars),
        price_per_night: parseFloat(price_per_night)
    };

    hotels.push(newHotel);
    res.status(201).json(newHotel);
});

// 📋 Отримати всі готелі
app.get('/api/hotels', (req, res) => {
    res.status(200).json(hotels);
});

// 🔍 Отримати конкретний готель
app.get('/api/hotels/:id', (req, res) => {
    const hotelId = parseInt(req.params.id);
    const hotel = findHotelById(hotelId);

    if (!hotel) {
        return res.status(404).json({ message: `Готель №${hotelId} не знайдено` });
    }

    res.status(200).json(hotel);
});

// ✏️ Оновити дані готелю
app.put('/api/hotels/:id', (req, res) => {
    const hotelId = parseInt(req.params.id);
    const { name, city, stars, price_per_night } = req.body;

    const hotelIndex = hotels.findIndex(h => h.id === hotelId);
    if (hotelIndex === -1) {
        return res.status(404).json({ message: `Готель №${hotelId} не знайдено` });
    }

    hotels[hotelIndex] = {
        ...hotels[hotelIndex],
        name: name || hotels[hotelIndex].name,
        city: city || hotels[hotelIndex].city,
        stars: stars ? parseInt(stars) : hotels[hotelIndex].stars,
        price_per_night: price_per_night ? parseFloat(price_per_night) : hotels[hotelIndex].price_per_night
    };

    res.status(200).json(hotels[hotelIndex]);
});

// ❌ Видалити готель
app.delete('/api/hotels/:id', (req, res) => {
    const hotelId = parseInt(req.params.id);
    const initialLength = hotels.length;

    hotels = hotels.filter(h => h.id !== hotelId);

    if (hotels.length === initialLength) {
        return res.status(404).json({ message: `Готель №${hotelId} не знайдено` });
    }

    res.status(204).send();
});

// 🟢 Запуск сервера
app.listen(port, () => {
    console.log(`✅ Сервер запущено на http://localhost:${port}`);
    console.log('Маршрути для роботи з готелями: /api/hotels');
});
