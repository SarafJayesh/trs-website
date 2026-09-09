import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootArg = process.argv[2] || 'public';
const port = Number(process.argv[3] || 4173);
const root = resolve(process.cwd(), rootArg);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

function resolveRequest(urlPath) {
  let pathname = '/';
  try {
    pathname = decodeURIComponent(new URL(urlPath, 'http://local').pathname);
  } catch {
    pathname = '/';
  }

  if (pathname === '/') pathname = '/index.html';
  const target = normalize(join(root, pathname));
  if (!target.startsWith(root)) return null;
  if (existsSync(target) && statSync(target).isDirectory()) {
    return join(target, 'index.html');
  }
  return target;
}

const server = createServer((req, res) => {
  const target = resolveRequest(req.url || '/');
  if (!target || !existsSync(target)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const type = types[extname(target).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  createReadStream(target).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  const thisFile = fileURLToPath(import.meta.url);
  console.log(`Serving ${root} at http://127.0.0.1:${port}/`);
  console.log(`Server script: ${thisFile}`);
});
