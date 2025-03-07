import * as pactum from "pactum";
import { HttpStatus } from "@nestjs/common";
import * as bcrypt from "bcrypt";

export const userEndpointTest = () => {

    describe("/user/me - Getting User Profile", () => {

        const endPoint = "/user/me";

        const userDetails = {
            username: "testUser",
            email: "test@gmail.com",
            password: "Password123!"
        };

        it("should return 401 - UNAUTHORIZED | No Token", () => {
            return pactum.spec()
                .get(endPoint)
                .expectStatus(HttpStatus.UNAUTHORIZED)
        });

        it("should return 200 - OK & User Details | Valid Token", () => {
            return pactum.spec()
                .get(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .expectStatus(HttpStatus.OK)
        });
    });

    describe("/user/edit - Updating User Profile", () => {

        const endPoint = "/user/edit";

        const userUpdateDetails = {
            username: "testUser1",
            email: "test1@gmail.com",
            password: "P@ssword123"
        };

        const passwordHash = bcrypt.hash(userUpdateDetails.password, 12);

        it("should return 401 - UNAUTHORIZED | No Token", () => {
            return pactum.spec()
                .patch(endPoint)
                .expectStatus(HttpStatus.UNAUTHORIZED)
        });

        it("should return 400 - BAD REQUEST | No Details Provided", () => {
            return pactum.spec()
                .patch(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .withBody({})
                .expectStatus(HttpStatus.BAD_REQUEST)
        });

        it("should return 202 - ACCEPTED | Username", () => {
            return pactum.spec()
                .patch(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .withBody({
                    username: userUpdateDetails.username
                })
                .expectStatus(HttpStatus.ACCEPTED)
        });

        it("should return 202 - ACCEPTED | Email", () => {
            return pactum.spec()
                .patch(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .withBody({
                    email: userUpdateDetails.email
                })
                .expectStatus(HttpStatus.ACCEPTED)
        });


        it("should return 202 - ACCEPTED | Password", () => {
            return pactum.spec()
                .patch(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .withBody({
                    password: userUpdateDetails.password
                })
                .expectStatus(HttpStatus.ACCEPTED)
        });

        it("should return 409 - CONFLICT | Username Taken", () => {
            return pactum.spec()
                .patch(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .withBody({
                    username: userUpdateDetails.username
                })
                .expectStatus(HttpStatus.CONFLICT)
                .expectBodyContains("Username Taken")
        });

        it("should return 409 - CONFLICT | Email In Use", () => {
            return pactum.spec()
                .patch(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .withBody({
                    email: userUpdateDetails.email
                })
                .expectStatus(HttpStatus.CONFLICT)
                .expectBodyContains("Email In Use")
        });

        it("should return 202 - ACCEPTED | All Details", () => {
            return pactum.spec()
                .patch(endPoint)
                .withHeaders({
                    Authorization: "Bearer $S{userAT}"
                })
                .withBody({
                    username: "testUser",
                    email: "test@gmail.com",
                    password: "Password123!"
                })
                .expectStatus(HttpStatus.ACCEPTED)
        });

    });

};