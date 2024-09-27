import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';

let restPort: string | number;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();
  const configService = app.get(ConfigService);
  restPort = configService.get('port') as string | number;

  const config = new DocumentBuilder()
    .setTitle('Form Management')
    .setDescription('Form Management service')
    .setVersion('1.0')
    .setContact('alexistech Dev', 'Nikky Dev', 'alexisdame2017@gmail.com')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer('dark' as SwaggerThemeName),
  };
  SwaggerModule.setup('api', app, document, options);

  await app.listen(3000);
}
bootstrap().then(() => {
  console.log('Form Managemant Service started ');
  console.log(`API: http://localhost:${restPort}`);
});
