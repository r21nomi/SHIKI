const exec = require("child_process").exec;
exec("/usr/shiki-app.AppImage", (err, stdout, stderr) => {
    if (err) {
        console.log(err);
    }
    console.log(stdout);
});