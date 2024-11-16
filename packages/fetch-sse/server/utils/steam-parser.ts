export const DEFAULT_EVENT = "message";
export type Message = { event: string; data: string; id?: string };

export class StreamParser {
  private buffer: Uint8Array;
  private message: Partial<Message>;
  public onMessage?: (message: Message) => void;

  constructor() {
    this.message = {};
    this.buffer = new Uint8Array();
  }

  private compose(data: Uint8Array) {
    const buffer = new Uint8Array(this.buffer.length + data.length);
    buffer.set(this.buffer);
    buffer.set(data, this.buffer.length);
    this.buffer = buffer;
    return buffer;
  }

  private onLine(bytes: Uint8Array) {
    if (bytes.length === 0) {
      if (this.onMessage && this.message.data) {
        this.message.event = this.message.event || DEFAULT_EVENT;
        this.onMessage(this.message as Message);
      }
      this.message = {};
      return;
    }
    const decoder = new TextDecoder();
    const line = decoder.decode(bytes);
    const [field, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    switch (field) {
      case "id":
        this.message.id = value;
        break;
      case "event":
        this.message.event = value;
        break;
      case "data":
        this.message.event = this.message.event || DEFAULT_EVENT;
        this.message.data = value;
        break;
      default:
        break;
    }
  }

  public onBinary(bytes: Uint8Array) {
    const buffer = this.compose(bytes);
    const len = buffer.length;
    let start = 0;

    for (let i = 0; i < len; i++) {
      if (buffer[i] === 10) {
        this.onLine(buffer.slice(start, i));
        start = i + 1;
      }
    }
    this.buffer = buffer.slice(start);
  }
}
