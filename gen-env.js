// Write pure UTF-8 .env file
const fs = require('fs');
fs.writeFileSync(
    '.env',
    'YOUCAM_API_KEY="your_api_key_here"\nDATABASE_URL="file:./dev.db"\nAUTH_SECRET="super_secret_for_local_dev_only_123"\n'
);
console.log(".env generated successfully");
