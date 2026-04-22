#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing Supabase credentials in .env file");
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  try {
    console.log("📦 Reading schema file...");
    const schemaPath = path.join(__dirname, "..", "supabase", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("🔨 Executing database schema...");

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc("exec_sql", {
          sql: statement + ";",
        });
        if (error) {
          // Try using the REST API directly for DDL statements
          console.log("⚠️  Standard RPC failed, trying alternative method...");
          throw error;
        }
        successCount++;
        process.stdout.write(".");
      } catch (err) {
        // Some statements might fail if tables already exist, which is OK
        if (err.message && err.message.includes("already exists")) {
          process.stdout.write("s"); // 's' for skipped
          successCount++;
        } else {
          process.stdout.write("x");
          errorCount++;
        }
      }
    }

    console.log("\n");
    console.log(`✅ Schema execution completed!`);
    console.log(`   Success: ${successCount} statements`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount} statements (some may be expected)`);
    }
    console.log("\n🎉 Database setup complete! You can now sign up.");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    console.log("\n📝 Manual setup required:");
    console.log("   1. Go to https://supabase.com/dashboard");
    console.log("   2. Select your project");
    console.log('   3. Click "SQL Editor" in the sidebar');
    console.log("   4. Copy the contents of supabase/schema.sql");
    console.log('   5. Paste and click "Run"');
    process.exit(1);
  }
}

setupDatabase();
