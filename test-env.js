import dotenv from "dotenv";

const result = dotenv.config();

console.log("ENV Loading Result:", result.error ? result.error.message : "Success");
console.log("CONTENTFUL_SPACE_ID:", process.env.CONTENTFUL_SPACE_ID);
console.log("CONTENTFUL_ACCESS_TOKEN:", process.env.CONTENTFUL_ACCESS_TOKEN ? "Found" : "Missing");
