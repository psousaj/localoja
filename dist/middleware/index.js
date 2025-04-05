"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configureApp;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const cache_1 = require("../cache");
const errorHandler_1 = __importDefault(require("./errorHandler"));
const routes_1 = __importDefault(require("../routes"));
function configureApp(app, db) {
    //  Rate Limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 25,
        message: 'Muitas requisições deste IP, tente novamente mais tarde'
    });
    const cache = cache_1.AppCache.getInstance({ maxKeys: 20 });
    app.set('cache', cache);
    global.cache = cache;
    app.disable('x-powered-by'); // Disable x-powered-by header for security reasons
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '2mb' })); // Limits json payloads on max 2MB
    app.use(limiter);
    // Health Check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime() });
    });
    app.use('/api', routes_1.default);
    app.use(errorHandler_1.default);
}
//# sourceMappingURL=index.js.map