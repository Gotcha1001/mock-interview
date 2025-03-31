import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://jollysidecoder:QMLv8d0oYeqr@ep-dark-morning-a56a4rkg-pooler.us-east-2.aws.neon.tech/ai-mockup-interview?sslmode=require",
  },
});
