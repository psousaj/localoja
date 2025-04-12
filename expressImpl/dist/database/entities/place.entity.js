"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("../../types");
let Place = class Place {
};
exports.Place = Place;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Place.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Place.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Place.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Place.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Place.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Place.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: false }),
    __metadata("design:type", String)
], Place.prototype, "cep", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'enum', enum: types_1.PlaceType }),
    __metadata("design:type", String)
], Place.prototype, "placeType", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        unique: true,
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true
    }),
    __metadata("design:type", Object)
], Place.prototype, "location", void 0);
exports.Place = Place = __decorate([
    (0, typeorm_1.Entity)('place')
], Place);
//# sourceMappingURL=place.entity.js.map