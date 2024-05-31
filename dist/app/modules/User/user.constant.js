"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOOD_TYPE = exports.BloodType = exports.userSortByFields = exports.userFilterableFields = exports.userSearchAbleFields = void 0;
exports.userSearchAbleFields = [
    "name",
    "email",
    "bloodType",
    "location",
]; // only for search term
exports.userFilterableFields = [
    "availability",
    "bloodType",
    "searchTerm",
];
exports.userSortByFields = ["name", "age", "lastDonationDate"];
var BloodType;
(function (BloodType) {
    BloodType["A_POSITIVE"] = "A_POSITIVE";
    BloodType["A_NEGATIVE"] = "A_NEGATIVE";
    BloodType["B_POSITIVE"] = "B_POSITIVE";
    BloodType["B_NEGATIVE"] = "B_NEGATIVE";
    BloodType["AB_POSITIVE"] = "AB_POSITIVE";
    BloodType["AB_NEGATIVE"] = "AB_NEGATIVE";
    BloodType["O_POSITIVE"] = "O_POSITIVE";
    BloodType["O_NEGATIVE"] = "O_NEGATIVE";
})(BloodType || (exports.BloodType = BloodType = {}));
exports.BLOOD_TYPE = [
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
];
