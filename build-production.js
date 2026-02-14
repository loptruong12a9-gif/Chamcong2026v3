/**
 * Production Build Script
 * Minifies JavaScript and CSS files for production deployment
 * 
 * Usage: node build-production.js
 * 
 * Requirements:
 * - npm install terser cssnano-cli postcss-cli --save-dev
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Production Build...\n');

// Check if required packages are installed
try {
    require.resolve('terser');
    require.resolve('cssnano');
} catch (e) {
    console.error('❌ Required packages not found. Installing...');
    execSync('npm install terser cssnano-cli postcss-cli --save-dev', { stdio: 'inherit' });
}

// File paths
const files = {
    js: {
        input: 'app.js',
        output: 'app.min.js'
    },
    githubSync: {
        input: 'github-sync.js',
        output: 'github-sync.min.js'
    },
    css: {
        input: 'style.css',
        output: 'style.min.css'
    }
};

// Minify JavaScript files
console.log('📦 Minifying JavaScript files...');
try {
    // Minify app.js
    execSync(`npx terser ${files.js.input} -o ${files.js.output} --compress --mangle --comments false`, {
        stdio: 'inherit'
    });
    console.log(`✅ Created ${files.js.output}`);

    // Minify github-sync.js
    execSync(`npx terser ${files.githubSync.input} -o ${files.githubSync.output} --compress --mangle --comments false`, {
        stdio: 'inherit'
    });
    console.log(`✅ Created ${files.githubSync.output}`);
} catch (error) {
    console.error('❌ JavaScript minification failed:', error.message);
    process.exit(1);
}

// Minify CSS
console.log('\n🎨 Minifying CSS files...');
try {
    execSync(`npx postcss ${files.css.input} --use cssnano -o ${files.css.output}`, {
        stdio: 'inherit'
    });
    console.log(`✅ Created ${files.css.output}`);
} catch (error) {
    console.error('❌ CSS minification failed:', error.message);
    process.exit(1);
}

// Calculate file size reductions
console.log('\n📊 File Size Comparison:');
Object.values(files).forEach(({ input, output }) => {
    if (fs.existsSync(input) && fs.existsSync(output)) {
        const originalSize = fs.statSync(input).size;
        const minifiedSize = fs.statSync(output).size;
        const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

        console.log(`  ${input}: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);
    }
});

// Create production index.html
console.log('\n📝 Creating production index.html...');
try {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    const productionIndex = indexContent
        .replace('app.js', 'app.min.js')
        .replace('github-sync.js', 'github-sync.min.js')
        .replace('style.css', 'style.min.css');

    fs.writeFileSync('index.production.html', productionIndex);
    console.log('✅ Created index.production.html');
} catch (error) {
    console.error('❌ Failed to create production HTML:', error.message);
}

console.log('\n✨ Production build completed successfully!');
console.log('\n📦 Next steps:');
console.log('  1. Test index.production.html locally');
console.log('  2. Deploy to production server');
console.log('  3. Monitor for errors\n');
