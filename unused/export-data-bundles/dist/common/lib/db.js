"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = exports.db = void 0;
const firestore_1 = require("firebase/firestore");
const app_1 = __importDefault(require("@common/lib/app"));
exports.db = (0, firestore_1.getFirestore)(app_1.default);
// if (process.env["NODE_ENV"] === "development") {
//     connectFirestoreEmulator(db, "localhost", 8080);
// }
var collections_1 = require("@common/lib/collections");
Object.defineProperty(exports, "collections", { enumerable: true, get: function () { return collections_1.collections; } });
// ------ References ------
//# sourceMappingURL=db.js.map