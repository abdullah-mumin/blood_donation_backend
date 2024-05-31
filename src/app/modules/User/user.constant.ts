export const userSearchAbleFields: string[] = [
  "name",
  "email",
  "bloodType",
  "location",
]; // only for search term

export const userFilterableFields: string[] = [
  "availability",
  "bloodType",
  "searchTerm",
];

export const userSortByFields: string[] = ["name", "age", "lastDonationDate"];

export enum BloodType {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}

export const BLOOD_TYPE = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];
