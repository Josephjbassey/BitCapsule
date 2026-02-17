const { execSync } = require('child_process');
try {
    console.log("Running production logic tests...");
    const output = execSync('npx tsx apps/dapp/src/tests/logic.test.ts', { encoding: 'utf8' });
    console.log(output);
} catch (error) {
    console.error("Tests failed:");
    console.error(error.stdout);
    process.exit(1);
}
