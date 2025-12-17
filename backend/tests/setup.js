const mongoose = require('mongoose');

beforeAll(async () => {
    const mongoUri = 'mongodb://127.0.0.1:27017/food-delivery-test';
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});
