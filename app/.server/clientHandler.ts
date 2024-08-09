import { Client } from 'ozen-bot/dist/Client';
import { UserContext } from 'ozen-bot/dist/UserContext';
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
    this.client = new Client({ browserType: 'firefox' });
    const browser = await this.client.init({ headless: true });
    invariant(browser, 'Browser not initialized');
  }

  public getClient(): Client {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    return this.client;
  }

  public isClientRelevant(): boolean {
    // Add your logic to check if the client is still relevant
    return this.client !== null;
  }

  public async getUser(playerId?: number) {
    const usersArray = Array.from(this.getClient().users);
    if (!playerId) {
      const user = usersArray[Math.floor(Math.random() * usersArray.length)];
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }
    const user = usersArray.find((user) => user.id === playerId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export default ClientHandler;
