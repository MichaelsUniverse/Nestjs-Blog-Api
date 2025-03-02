import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { ConfigModule } from "@nestjs/config";
import * as pactum from "pactum";
import { authEndpointTest, userEndpointTest } from "./endpoints/index";

describe("AppController (e2e)", () => {

    // SETUP

    let app: INestApplication;

    const MONGODB_TEST_URI = "mongodb://admin:password@localhost:27018/blogsite?authSource=admin";

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                load: [() => ({
                    MONGODB_URI: MONGODB_TEST_URI,
                    JWT_ACCESS_SECRET: "ACCESS_TOKEN",
                    JWT_REFRESH_SECRET: "REFRESH_TOKEN",
                })],
            }),
            AppModule
        ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                disableErrorMessages: true,
            })
        );

        await app.init();
        await app.listen(3333);

        pactum.request.setBaseUrl("http://localhost:3333");
    });

    afterAll(async () => {
        await app.close();
    });

    // TESTS

    describe('Auth Test', () => {
        authEndpointTest();
    });

    describe('User Test', () => {
        userEndpointTest();
    });
});
