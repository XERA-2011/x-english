import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const imgDir = path.resolve('static/img/pet3');
const docsDir = path.resolve('docs');

async function run() {
  if (!fs.existsSync(imgDir)) {
    console.error(`Error: Directory ${imgDir} does not exist.`);
    process.exit(1);
  }

  const files = fs.readdirSync(imgDir);
  const pngFiles = files.filter(f => f.endsWith('.png'));

  console.log(`Found ${pngFiles.length} PNG images to optimize...`);

  for (const file of pngFiles) {
    const pngPath = path.join(imgDir, file);
    const webpName = file.replace('.png', '.webp');
    const webpPath = path.join(imgDir, webpName);

    console.log(`Converting ${file} to WebP...`);
    
    // Convert to webp using sharp with quality 80
    await sharp(pngPath)
      .webp({ quality: 80 })
      .toFile(webpPath);
      
    // Delete the original PNG file
    fs.unlinkSync(pngPath);
    console.log(`Converted and deleted original: ${file}`);
  }

  // Now, update references in all docs MD/MDX files
  console.log('Updating image references in documentation...');
  updateRefs(docsDir);
  console.log('Done!');
}

function updateRefs(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      updateRefs(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Replace references like "/img/pet3/something.png" with "/img/pet3/something.webp"
      const original = content;
      content = content.replace(/\/img\/pet3\/([^"\s>]+)\.png/g, '/img/pet3/$1.webp');
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated references in: ${entry.name}`);
      }
    }
  }
}

run().catch(console.error);
