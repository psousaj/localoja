"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const place_controller_1 = __importDefault(require("../controller/place.controller"));
const utils_1 = require("../utils");
const zodSchemas_1 = require("../schemas/zodSchemas");
const router = express_1.default.Router();
router.post('/places', (0, utils_1.validateBodySchema)(zodSchemas_1.createPlaceSchema), (0, utils_1.wrapAction)(place_controller_1.default.create));
router.get('/places', (0, utils_1.wrapAction)(place_controller_1.default.listAll));
router.get('/places/nearest/:cep', (0, utils_1.validateParamsSchema)(zodSchemas_1.nearestPlaceSchema), (0, utils_1.wrapAction)(place_controller_1.default.nearest));
router.patch('/places/:placeId', (0, utils_1.validateBodySchema)(zodSchemas_1.updatePlaceSchema), (0, utils_1.wrapAction)(place_controller_1.default.update));
router.get('/places/:placeId', (0, utils_1.wrapAction)(place_controller_1.default.getById));
router.get('/places/:placeId', (0, utils_1.wrapAction)(place_controller_1.default.getPlacesByCep));
router.delete('/places/:placeId', (0, utils_1.wrapAction)(place_controller_1.default.delete));
exports.default = router;
//# sourceMappingURL=placeRouter.js.map