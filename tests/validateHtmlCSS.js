// validateHtmlCSS.js
// Code for validating tool adapted from: https://www.npmjs.com/package/html-validator

const fs = require("fs");
const path = require("path");
const validator = require("html-validator");
const stylelint = require("stylelint");
const chokidar = require("chokidar");

const reactComponentsDir = path.join(__dirname, "../src/components");
const cssDirectory = path.join(__dirname, "../src/styles");

// Function to extract JSX content, Meaning that the only returned content is HTML and associating JS Components
function extractJSX(content) {
    return content
    .replace(/import .*? from ".*?";/g, "")
    .replace(/export default .*?;/g, "")    
    .replace(/export .*?;/g, "")        
    .replace(/\{.*?\}/g, "")           
    .replace(/className=/g, "class=")       
    .replace(/htmlFor=/g, "for=")          
    .replace(/<Fragment>/g, "")             
    .replace(/<\/Fragment>/g, "")           
    .replace(/<>/g, "")                     
    .replace(/<\/>/g, "");    
}

// Validate React JSX as HTML
async function validateReactComponents() {
    const componentFiles = fs.readdirSync(reactComponentsDir).filter(file => file.endsWith(".js") || file.endsWith(".jsx"));

    for (const file of componentFiles) {
        const filePath = path.join(reactComponentsDir, file);
        let content = fs.readFileSync(filePath, "utf8");
        let jsxContent = extractJSX(content); // Extract JSX-only parts

        try {
            const result = await validator({ data: jsxContent, format: "json" });
            console.log(`\nValidating ${file}... \n`);

            if (result.messages.length === 0) {
                console.log("No JSX/HTML errors found!");
            } else {
                result.messages.forEach(msg => {
                    console.log(`${msg.type.toUpperCase()} in ${file}: ${msg.message}`);
                });
            }
        } catch (error) {
            console.error(`Error validating ${file}:`, error.message);
        }
    }
}

// Validate CSS
async function validateCSS() {
    const cssFiles = fs.readdirSync(cssDirectory).filter(file => file.endsWith(".css"));

    for (const file of cssFiles) {
        const filePath = path.join(cssDirectory, file);
        console.log(`\nLinting ${file}...`);

        const result = await stylelint.lint({
            files: filePath,
            config: {
                extends: "stylelint-config-standard"
            }
        });

        if (result.errored) {
            console.log("CSS Linting Errors:");
            console.log(result.output);
        } else {
            console.log("No CSS linting errors found!");
        }
    }
}

// Watch for changes in JSX and CSS
function watchFiles() {
    console.log("\n Watching for changes in JSX and CSS files...");

    chokidar.watch([`${reactComponentsDir}/*.js`, `${reactComponentsDir}/*.jsx`, `${cssDirectory}/*.css`]).on("change", filePath => {
        console.log(`\nDetected change in: ${filePath}`);
        if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) validateReactComponents();
        if (filePath.endsWith(".css")) validateCSS();
    });
}

// Run Validations & attempt to Start change watching
(async () => {
    await validateReactComponents();
    await validateCSS();
    watchFiles();
})();
