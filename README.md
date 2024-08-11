# EN
A powerful tool designed to perform DDoS attacks on specified targets using proxies and headless browsers. The tool is capable of bypassing various protections such as Cloudflare, and it uses multiple threads to simulate user behavior for more effective attacks.

## Features
- **Proxy Support**: Utilize a list of proxies to distribute traffic and avoid IP bans.
- **Bypass Protections**: Capable of bypassing Cloudflare and other DDoS protection mechanisms.
- **Multithreading**: Leverage multiple threads to increase the attack's intensity.
- **Headless Browser**: Uses Playwright with headless browsers to simulate real user behavior.

## Installation
1. **Clone the repository**:
```bash
git clone https://github.com/geniuszlyy/GenJSDdosser.git
cd GenJSDdosser
```
2. **Install dependencies**:
```bash
npm install
```

## Usage
To run the tool, use the following command:
```bash
node GenJSDdosser.js [target_url] [delay_seconds] [threads] [proxy_list]
```

## Example
```bash
node GenJSDdosser.js http://example.com 60 4 192.168.0.1:8080,192.168.0.2:8080
```
- `target_url`: The URL of the target website.
- `delay_seconds`: Duration of the attack in seconds.
- `threads`: Number of concurrent threads.
- `proxy_list`: Comma-separated list of proxy servers in the format `ip:port`.

## Important Notes
- **Disclaimer**: This tool is intended for educational purposes only. Unauthorized use of this tool to target and attack systems without the explicit consent of the owner is illegal. The creators are not responsible for any misuse or damage caused by this tool.
- **Responsibility**: Use responsibly and always ensure you have permission to test the security of systems.

# RU
Мощный инструмент, предназначенный для выполнения DDoS-атак на указанные цели с использованием прокси и браузеров без пользовательского интерфейса. Инструмент способен обходить различные защиты, такие как Cloudflare, и использует несколько потоков для имитации поведения пользователя для более эффективных атак.

## Особенности
- **Поддержка прокси**: Использование списка прокси для распределения трафика и избежания блокировки IP.
- **Обход защит**: Способность обходить защиту от DDoS-атак, такую как Cloudflare.
- **Многопоточность**: Использование нескольких потоков для увеличения интенсивности атаки.
- **Браузер без пользовательского интерфейса**: Использует Playwright с браузерами без пользовательского интерфейса для имитации реального поведения пользователя.

Установка
1. **Клонируйте репозиторий**:
```bash
git clone https://github.com/geniuszlyy/GenJSDdosser.git
cd GenJSDdosser
```
2. **Установите зависимости**:
```bash
npm install
```

## Использование
Для запуска инструмента используйте следующую команду:
```bash
node GenJSDdosser.js [target_url] [delay_seconds] [threads] [proxy_list]
```

## Пример
```bash
node GenJSDdosser.js http://example.com 60 4 192.168.0.1:8080,192.168.0.2:8080
```
- `target_url`: URL целевого веб-сайта.
- `delay_seconds`: Длительность атаки в секундах.
- `threads`: Количество одновременных потоков.
- `proxy_list`: Список прокси-серверов, разделенных запятыми, в формате `ip:port`.

## Важные замечания
- **Дисклеймер**: Этот инструмент предназначен исключительно для образовательных целей. Неавторизованное использование этого инструмента для атаки на системы без явного согласия владельца является незаконным. Создатели не несут ответственности за любое неправомерное использование или ущерб, причиненный этим инструментом.
- **Ответственность**: Используйте ответственно и всегда убедитесь, что у вас есть разрешение на тестирование безопасности систем.
