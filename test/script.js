import fs from 'fs';

let cnt = 0;
const interval = setInterval(() => {
    if (cnt >= 1000) {
        clearInterval(interval);
        return;
    }

    let data = Date.now() + " This is new log. For " + cnt + "\n";
    fs.appendFileSync("logfile.log", data, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Write successful for cnt: " + cnt);
    });

    console.log(cnt);
    cnt++;
}, 2000);
