import { HttpStatus } from "@nestjs/common";
import * as pactum from "pactum";

export const authEndpointTest = () => {

    describe("Auth Register Test", () => {

        describe("/auth/register - Testing Auth Registering", () => {

            const endPoint = "/auth/register";

            const validUser = {
                username: "testUser",
                email: "test@gmail.com",
                password: "Password123!"
            };

            it("should return 400 - BAD REQUEST | No Username", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody({
                        email: validUser.email,
                        password: validUser.password
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })

            it("should return 400 - BAD REQUEST | No Email", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody({
                        username: validUser.username,
                        password: validUser.password
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 400 - BAD REQUEST | No Password", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody({
                        username: validUser.username,
                        email: validUser.email,
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 400 - BAD REQUEST | Invalid Email", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody({
                        username: validUser.username,
                        email: "test@gmail",
                        password: validUser.password
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 400 - BAD REQUEST | Invalid Password", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody({
                        username: validUser.username,
                        email: validUser.email,
                        password: ""
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 201 - CREATED | Valid Details", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody(validUser)
                    .expectStatus(HttpStatus.CREATED)
            });
        });
    });


    describe("Auth Login Test", () => {

        describe("/auth/login - Testing Auth Login", () => {

            const endPoint = "/auth/login";

            const validLogin = {
                email: "test@gmail.com",
                password: "Password123!"
            };

            it("should return 400 - BAD REQUEST | No Email", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody({
                        password: validLogin.password
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 400 - BAD REQUEST | No Password", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody({
                        email: validLogin.email,
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 200 - OK | Valid Details", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withBody(validLogin)
                    .expectStatus(HttpStatus.OK)
                    .stores("userAT", "access_token")
            });
        });

    });
};
