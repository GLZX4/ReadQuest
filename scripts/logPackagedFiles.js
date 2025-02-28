const fs = require('fs');
const path = require('path');

module.exports = async (context) => {
    const outputPath = context.appOutDir;  // The packaged app directory
    const logFile = path.join(outputPath, "packaged-files.log");

    function listFiles(dir, fileList = []) {
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                listFiles(fullPath, fileList);
            } else {
                fileList.push(fullPath.replace(outputPath, '')); // Relative paths
            }
        });
        return fileList;
    }

    const files = listFiles(outputPath);
    fs.writeFileSync(logFile, files.join("\n"), 'utf-8');

    console.log("✅ Packaged Files List Created: ", logFile);
};
