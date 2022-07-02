let ws = require("nodejs-websocket");
// const {json} = require("express");
console.log("开始建立连接...")

const port = 8888 // 端口
let server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        str = JSON.parse(str)
        /**
         * @Description: 此处结构为  str = {text: shutdown/shutdown -time/shutdown -a,
         *                               time: 1000s}
         * @author sufy
         * @date 2022/7/1 15:42
         */

        console.log("收到的信息为:" + str)
        if(str === "1"){
            conn.sendText('连接成功')
        }


        if (str.text === 'shutdown') { // 马上关机
            run('shutdown -s -t 000')
            conn.sendText('关机成功')
        } else if (str.text === 'shutdown -time') { // 定时关机
            run(`shutdown -s -t ${str.time}`)
            conn.sendText('定时关机成功')
        } else if (str.text === 'shutdown -a') { // 取消关机
            run(str.text)
            conn.sendText('取消关机成功')
        }
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(port)
console.log(`WebSocket建立完毕 127.0.0.1:${port}`)


const {exec} = require('child_process');


function run(cmd) {
    let command = exec(cmd, function (err, stdout, stderr) {
        if (err || stderr) {
            console.log(`${cmd} failed` + err + stderr);
        }
    });
    command.stdin.end();
    command.on('close', function (code) {
        console.log(`${cmd}`, code);
    });
}

