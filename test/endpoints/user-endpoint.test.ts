import * as pactum from "pactum";
import { HttpStatus } from "@nestjs/common";

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
                    Authorization: "Bearer S${userAT}"
                })
                .expectStatus(HttpStatus.OK)
                .inspect()
        });
    });

    describe("/user/edit - Updating User Profile", () => {

        const endPoint = "/user/edit";


    });

};