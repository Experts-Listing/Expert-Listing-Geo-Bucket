import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3000;
const server = createApp().listen(port, () => {
  console.log(JSON.stringify({ level: 'info', msg: `geo-bucket listening on ${port}` }));
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
