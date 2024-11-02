export type Message = {
  event: string;
  data: string;
  id?: string;
};

export const parser = (data: string): Message[] => {
  const list: Message[] = [];
  let message: Partial<Message> = {};

  const lines = data.split("\n");
  for (const line of lines) {
    if (line === "") {
      if (!message.data) continue;
      message.event = message.event || "message";
      list.push(message as Message);
      message = {};
      continue;
    }
    const [field, ...rest] = line.split(":");
    const value = rest.join(":").trim();

    if (field === "id") {
      message.id = value;
      continue;
    }
    if (field === "event") {
      message.event = value;
      continue;
    }
    if (field === "data") {
      message.data = value || "";
      continue;
    }
  }

  if (message.data) {
    message.event = message.event || "message";
    list.push(message as Message);
  }

  return list;
};
