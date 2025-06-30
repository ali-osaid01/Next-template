import io, { Socket } from "socket.io-client";
import { toast } from "sonner";

const BASE_SOCKET_CONNECTION = "URL"

class WSService {
  private socket: Socket | null = null;

  initializeSocket = async (token: string): Promise<void> => {
    try {
      this.socket = io(BASE_SOCKET_CONNECTION, {
        extraHeaders: {
          "access-token": token 
        },
      });

      this.socket.on("connection", () => {
        console.log("=== socket connected ====");
      });

      this.socket.on("disconnect", () => {
        console.log("=== socket disconnected ====");
      });

      this.socket.on("connect_error", (err: Error) => {
        console.log(err, "socket connection error");
      });

      this.socket.on("socket-error", (data: any) => {
        console.log("socket error", data);
        toast.error(data.message);
      });
    } catch (error) {
      console.log("socket is not initialized", error);
    }
  };

  emit(event: string, data: any = {}): void {
    this.socket?.emit(event, data);
  }

  on(event: string, cb: (...args: any[]) => void): void {
    this.socket?.on(event, cb);
  }

  off(event: string, cb?: (...args: any[]) => void): void {
    if (cb) {
      this.socket?.off(event, cb);
    } else {
      this.socket?.off(event);
    }
  }

  removeListener(
    listenerName: string,
    listener: (...args: any[]) => void,
  ): void {
    this.socket?.off(listenerName, listener);
  }

  removeAllListener(listenerName?: string): void {
    if (listenerName) {
      this.socket?.removeAllListeners(listenerName);
    } else {
      this.socket?.removeAllListeners();
    }
  }
  hasListeners(event: string): boolean {
    return this.socket ? this.socket.hasListeners(event) : false;
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}

const socket = new WSService();

export default socket;