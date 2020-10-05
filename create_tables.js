const { spawn } = require('child_process');
const npm = (process.platform === 'win32' ? 'npm.cmd' : 'npm');
const run = spawn(npm, ['run','db:migrate']);

run.stdout.pipe(process.stdout);
run.stderr.pipe(process.stderr);

run.on('exit', function (code) {
  process.exit(code);
});
