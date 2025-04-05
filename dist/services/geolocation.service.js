"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationAPI = void 0;
const types_1 = require("../types");
const env_1 = require("../config/env");
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../utils/errors");
const cache_1 = require("../cache");
const logger_1 = require("../config/logger");
const cache = cache_1.AppCache.getInstance({ maxKeys: 20 });
class GeolocationAPI {
    static async getGeoLocationByAddress(address) {
        const cacheKey = `geolocation:${address}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData)
            return cachedData;
        try {
            const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address,
                    key: env_1.env.GMAPS_GEOCODING_APIKEY,
                },
            });
            if (response.data.error_message) {
                throw new errors_1.InternalServerError(response.data.error_message);
            }
            if (response.data.status === "ZERO_RESULTS") {
                throw new errors_1.BadRequestError(types_1.ErrorCodes.PLACE_NOT_FOUND, "No results found");
            }
            cache.set(cacheKey, response.data.results, 600);
            return response.data.results;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new errors_1.InternalServerError(error.message, error);
            }
            if (error instanceof errors_1.BadRequestError) {
                throw error;
            }
            throw new errors_1.InternalServerError("Unexpected error", error.message);
        }
    }
    static async getRoutesToPlace(origin, destination) {
        const cacheKey = `routes:${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData)
            return cachedData;
        try {
            const response = await axios_1.default.post(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
                origin: {
                    location: {
                        latLng: {
                            latitude: origin.latitude,
                            longitude: origin.longitude
                        }
                    }
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: destination.latitude,
                            longitude: destination.longitude
                        }
                    }
                },
                travelMode: "DRIVE",
                routingPreference: "TRAFFIC_AWARE",
                computeAlternativeRoutes: false,
                languageCode: "pt-BR",
                units: "METRIC"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": env_1.env.GMAPS_GEOCODING_APIKEY,
                    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
                }
            });
            cache.set(cacheKey, response.data.routes[0], 600);
            return response.data.routes[0];
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_1.logger.error(error.response.data.error?.message);
                if (error.response.status === 502) {
                    throw new errors_1.InternalServerError("Something went wrong, try again after 30 seconds", error);
                }
                throw new errors_1.InternalServerError(null, error);
            }
            if (error instanceof errors_1.BadRequestError) {
                throw error;
            }
            throw new errors_1.InternalServerError("Unexpected error", error.message);
        }
    }
    static async getPlaceByCep(cep) {
        const cacheKey = `cep:${cep}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData)
            return cachedData;
        try {
            const response = await axios_1.default.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data.erro) {
                return null;
            }
            cache.set(cacheKey, response.data, 86400);
            return response.data;
        }
        catch (error) {
            throw new errors_1.InternalServerError("Failed to fetch CEP data", error.message);
        }
    }
}
exports.GeolocationAPI = GeolocationAPI;
//# sourceMappingURL=geolocation.service.js.map