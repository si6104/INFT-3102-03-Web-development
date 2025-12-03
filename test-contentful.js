import dotenv from "dotenv";
dotenv.config();

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

console.log("Space ID:", SPACE_ID);
console.log("Access Token:", ACCESS_TOKEN ? "Found" : "Missing");

const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?content_type=movie&access_token=${ACCESS_TOKEN}`;

console.log("\nFetching from:", url);

try {
  const response = await fetch(url);
  console.log("Response status:", response.status);
  
  const data = await response.json();
  console.log("\nTotal movies:", data.items?.length || 0);
  
  if (data.items && data.items.length > 0) {
    console.log("\nFirst movie:");
    console.log(JSON.stringify(data.items[0], null, 2));
  } else {
    console.log("\n⚠️ No movies found in Contentful!");
    console.log("Full response:", JSON.stringify(data, null, 2));
  }
} catch (error) {
  console.error("❌ Error:", error.message);
}
