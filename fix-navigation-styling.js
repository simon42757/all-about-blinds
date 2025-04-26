// Script to fix navigation styling consistency across all pages
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to recursively get all .tsx files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.tsx')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Get all tsx files in the app directory
const appDir = path.join(__dirname, 'src', 'app');
const files = getAllFiles(appDir);

// Counter for modified files
let modifiedCount = 0;

// Process each file
files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix back arrow styling
  if (content.includes('className="text-gray-600 mr-4"')) {
    content = content.replace(
      /className="text-gray-600 mr-4"/g, 
      'className="text-white hover:text-primary-300 mr-4"'
    );
    modified = true;
  }

  // Fix the arrow icon size
  if (content.includes('<FaArrowLeft />')) {
    content = content.replace(
      /<FaArrowLeft \/>/g, 
      '<FaArrowLeft className="text-xl" />'
    );
    modified = true;
  }

  // Fix heading text color
  if (content.includes('className="text-xl font-bold text-gray-900"')) {
    content = content.replace(
      /className="text-xl font-bold text-gray-900"/g, 
      'className="text-xl font-bold text-white"'
    );
    modified = true;
  }

  // Fix filter icon colors where applicable
  if (content.includes('className="mr-2 text-gray-600"')) {
    content = content.replace(
      /className="mr-2 text-gray-600"/g, 
      'className="mr-2 text-primary-300"'
    );
    modified = true;
  }

  // Fix dropdown text colors where applicable
  if (content.includes('className="border-0 bg-transparent text-sm font-medium focus:outline-none text-gray-700"')) {
    content = content.replace(
      /className="border-0 bg-transparent text-sm font-medium focus:outline-none text-gray-700"/g, 
      'className="border-0 bg-transparent text-sm font-medium focus:outline-none text-white"'
    );
    modified = true;
  }

  // Add class to dropdown options where applicable
  if (content.includes('<option value="all">')) {
    content = content.replace(
      /<option value="([^"]+)">([^<]+)<\/option>/g, 
      '<option value="$1" className="text-gray-900 bg-white">$2</option>'
    );
    modified = true;
  }

  // Fix search input styles if they exist
  const searchInputRegex = /<div className="relative">\s*<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">\s*<FaSearch className="text-gray-400" \/>\s*<\/div>\s*<input\s*type="text"\s*className="input-field pl-10"\s*placeholder="([^"]+)"\s*value={([^}]+)}\s*onChange={([^}]+)}\s*\/>/g;
  
  if (content.match(searchInputRegex)) {
    content = content.replace(
      searchInputRegex,
      '<div className="bg-white p-3 rounded-md shadow-sm flex items-center">\n' +
      '          <FaSearch className="text-gray-400 mr-2" />\n' +
      '          <input\n' +
      '            type="text"\n' +
      '            placeholder="$1"\n' +
      '            className="w-full focus:outline-none text-gray-700"\n' +
      '            value={$2}\n' +
      '            onChange={$3}\n' +
      '          />'
    );
    modified = true;
  }

  // Save the file if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${filePath}`);
  }
});

console.log(`\nCompleted! Updated ${modifiedCount} files for consistent navigation styling.`);
