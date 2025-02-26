"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configureApp;
const session_entity_1 = require("../models/session.entity");
const express_1 = __importDefault(require("express"));
const typeorm_store_1 = require("typeorm-store");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const env_1 = require("../utils/env");
const cors_1 = __importDefault(require("cors"));
function configureApp(app, db) {
    // Use typeorm like store
    const sessionRepository = db.getRepository(session_entity_1.Session);
    //  Rate Limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Muitas requisições deste IP, tente novamente mais tarde'
    });
    // Disable 'x-powered-by' for security (not expose what server is running)
    app.disable('x-powered-by');
    // disable ETAG for 'caching' responses
    // app.disable('etag')
    app.use((0, cors_1.default)());
    // Limits json payloads on max 2MB
    app.use(express_1.default.json({ limit: '2mb' }));
    app.use((0, cookie_parser_1.default)());
    app.use(limiter);
    app.use((0, express_session_1.default)({
        secret: env_1.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        store: new typeorm_store_1.TypeormStore({ repository: sessionRepository })
    }));
    // Health Check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime() });
    });
}
//# sourceMappingURL=index.js.map