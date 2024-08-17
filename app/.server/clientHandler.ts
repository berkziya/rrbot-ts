import { Client } from 'ozen-bot/dist/Client';
import invariant from 'tiny-invariant';

class ClientHandler {
  private static instance: ClientHandler;
  public client: Client | null = null;

  private constructor() {}

  public static async getInstance(): Promise<ClientHandler> {
    if (!ClientHandler.instance) {
      ClientHandler.instance = new ClientHandler();
      await ClientHandler.instance.initializeClient();
    }
    return ClientHandler.instance;
  }

  private async initializeClient() {
    try {
      this.client = new Client({ browserType: 'firefox' });
      const browser = await this.client.init({ headless: false });
      invariant(browser, 'Browser not initialized');
    } catch (e) {
      console.error('Error initializing client', e);
      process.exit(1);
    }
  }

  public async getClient() {
    try {
      invariant(this.client, 'Client not initialized');
      return this.client;
    } catch (e) {
      console.error('Error getting client', e);
    }
    return null;
  }

  public isClientRelevant(): boolean {
    // Add your logic to check if the client is still relevant
    return this.client !== null;
  }

  public async getUser(playerId?: number) {
    try {
      const availableClient = await this.getClient();
      invariant(availableClient, 'No client available');
      const usersArray = Array.from(availableClient.users);
      if (!playerId) {
        const user = usersArray[Math.floor(Math.random() * usersArray.length)];
        invariant(user, 'No user found');
        return user;
      }
      const user = usersArray.find((user) => user.id === playerId);
      invariant(user, `No user found with id ${playerId}`);
      return user;
    } catch (e) {
      console.error('Error getting user', e);
    }
  }
}

export default ClientHandler;
