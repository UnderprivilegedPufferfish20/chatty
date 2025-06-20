import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT!

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
  }));

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true
  })

  await app.listen(PORT);
}
bootstrap();

console.log(`App running @ http://localhost:${PORT}`)
