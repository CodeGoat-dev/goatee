#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { Goatee } from "@codegoatx/goatee";
import { fileURLToPath } from "url";

// Resolve the package version dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

// CLI arguments
const args = process.argv.slice(2);
const flag = args[0];

if (flag === "--help") {
  console.log(`
Goatee CLI
-----------

Usage:
  goatee [sourceDir] [buildDir]

Options:
  --help         Show this help message
  --version      Print the current version

Examples:
  goatee               Build ./web to ./build
  goatee src dist      Build ./src to ./dist
`);
  process.exit(0);
}

if (flag === "--version") {
  console.log(`Goatee version ${packageJson.version}`);
  process.exit(0);
}

// Set up build directories
const sourceDir = args[0] || path.resolve(process.cwd(), "web");
const buildDir = args[1] || path.resolve(process.cwd(), "build");

console.log("📦 Attempting to build Goatee site...");

if (!fs.existsSync(sourceDir)) {
  console.log(`❌ The source directory ${sourceDir} does not exist.`);
  process.exit(1);
}

try {
  require.resolve("@codegoatx/goatee");
} catch {
  console.error("❌ You must install @codegoatx/goatee in your project to use this CLI.");
  process.exit(1);
}

console.log(`🚀 Building Goatee site to: ${buildDir}`);

try {
  await Goatee.buildFromDirectory(sourceDir, buildDir, true);
  console.log(`✅ Goatee build complete.
   - Source: ${sourceDir}
   - Output: ${buildDir}`);
} catch (err) {
  console.error("❌ Build failed:", err.message);
  process.exit(1);
}
