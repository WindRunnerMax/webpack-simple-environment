import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app";

// https://docs.nestjs.com/first-steps
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
