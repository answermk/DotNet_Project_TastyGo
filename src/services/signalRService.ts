import * as signalR from '@microsoft/signalr';
import { API_CONFIG } from '../config/api';

class SignalRService {
  private hubConnections: Map<string, signalR.HubConnection> = new Map();
  private static instance: SignalRService;

  private constructor() {}

  static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  private async createHubConnection(hubName: string, token: string): Promise<signalR.HubConnection> {
    const hubUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.SIGNALR.HUBS[hubName]}`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) // Retry intervals
      .build();

    connection.onreconnecting((error) => {
      console.warn(`SignalR ${hubName} reconnecting:`, error);
    });

    connection.onreconnected((connectionId) => {
      console.log(`SignalR ${hubName} reconnected. ConnectionId:`, connectionId);
    });

    connection.onclose((error) => {
      console.error(`SignalR ${hubName} connection closed:`, error);
    });

    return connection;
  }

  async startConnection(token: string): Promise<void> {
    try {
      // Start all hub connections
      const hubs = Object.keys(API_CONFIG.SIGNALR.HUBS);
      for (const hub of hubs) {
        if (!this.hubConnections.has(hub)) {
          const connection = await this.createHubConnection(hub, token);
          await connection.start();
          this.hubConnections.set(hub, connection);
          console.log(`SignalR ${hub} Connected!`);
        }
      }
    } catch (err) {
      console.error('SignalR Connection Error:', err);
      throw err;
    }
  }

  async stopConnection(): Promise<void> {
    for (const [hub, connection] of this.hubConnections) {
      try {
        await connection.stop();
        console.log(`SignalR ${hub} connection stopped`);
      } catch (err) {
        console.error(`Error stopping ${hub} connection:`, err);
      }
    }
    this.hubConnections.clear();
  }

  // Order tracking
  onOrderStatusUpdate(callback: (orderId: string, status: string) => void): void {
    this.hubConnections.get('ORDERS')?.on('OrderStatusUpdate', callback);
  }

  onNewOrder(callback: (order: any) => void): void {
    this.hubConnections.get('ORDERS')?.on('NewOrder', callback);
  }

  // Real-time notifications
  onNotification(callback: (notification: any) => void): void {
    this.hubConnections.get('NOTIFICATIONS')?.on('Notification', callback);
  }

  // Analytics updates
  onAnalyticsUpdate(callback: (data: any) => void): void {
    this.hubConnections.get('ANALYTICS')?.on('AnalyticsUpdate', callback);
  }

  // Audit log updates
  onAuditLogUpdate(callback: (log: any) => void): void {
    this.hubConnections.get('ANALYTICS')?.on('AuditLogUpdate', callback);
  }

  // Remove event listeners
  removeListener(hubName: string, eventName: string): void {
    this.hubConnections.get(hubName)?.off(eventName);
  }

  // Get connection state
  getConnectionState(hubName: string): signalR.HubConnectionState | undefined {
    return this.hubConnections.get(hubName)?.state;
  }
}

export const signalRService = SignalRService.getInstance(); 