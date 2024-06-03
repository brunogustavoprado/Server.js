const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 1001;

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'public',
        req.url === '/' ? 'Arquivo aqui':
                    req.url
    );
    const extname = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.php': 'text/html'
    }[extname] || 'text/plain';

    if (extname === '.php') {
        exec(`php -f ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Error executing PHP script: ${stderr}`);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', contentType);
                res.end(stdout);
            }
        });
    } else {
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    exec('php -f Arquivo PHP Aqui', (err, stdout, stderr) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'text/plain');
                            res.end(`Error executing PHP script: ${stderr}`);
                        } else {
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'text/html');
                            res.end(stdout);
                        }
                    });
                } else {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(`Server Error: ${error.code}`);
                }
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', contentType);
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Servidor aberto by Bruno: http://${hostname}:${port}/ Rodando e depurando`);
});
