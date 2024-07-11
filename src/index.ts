import express from 'express';
import { Client } from './services/playwrightbot/Client';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

async function main() {
  const client = new Client();
  await client.init();

  const userContext = await client.createUserContext();
  userContext.login('berkziya0@gmail.com', 'C2KeyR59');

  // const mobileUserContext = await client.createUserContext(true);
  // mobileUserContext.login('berkziya0@gmail.com', 'C2KeyR59');
}

main();
