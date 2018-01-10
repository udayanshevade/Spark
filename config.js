exports.port = process.env.PORT || 5001;
exports.origin = process.env.ORIGIN || `http://localhost:${exports.port}`;
exports.JWT_SECRET = 'JWT_SECRET';
exports.DATABASE_URL = process.env.DATABASE_URL;