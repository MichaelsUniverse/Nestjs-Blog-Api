import { HttpStatus } from "@nestjs/common";
import * as pactum from "pactum";

export const postEndpointTest = () => {

    const auth = {
        Authorization: "Bearer $S{userAT}"
    }

        describe("/post/create - Creating a Post", () => {

            const endPoint = "/post/create";
            const postDetails = {
                title: "Test Post",
                content: "This is a test post"
            };

            it("should return 401 - UNAUTHORIZED | No Token", () => {
                return pactum.spec()
                    .post(endPoint)
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });

            it("should return 401 - UNAUTHORIZED | Invalid Token", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withHeaders({
                        Authorization: "Bearer invalidToken"
                    })
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });

            it("should return 400 - BAD REQUEST | No Details", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withHeaders(auth)
                    .withBody({})
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 400 - BAD REQUEST | No Title", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withHeaders(auth)
                    .withBody({
                        content: postDetails.content
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 400 - BAD REQUEST | No Content", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withHeaders(auth)
                    .withBody({
                        title: postDetails.title
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            });

            it("should return 201 - Created | Post Created", () => {
                return pactum.spec()
                    .post(endPoint)
                    .withHeaders(auth)
                    .withBody(postDetails)
                    .expectStatus(HttpStatus.CREATED)
                    .stores("postID", "post_id")
            });
        })

        describe("/post/all - Retrieving All Posts", () => {

            const endPoint = "/post/all"

            it("should return 401 - UNAUTHORIZED | No Token", () => {
                return pactum.spec()
                    .get(endPoint)
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });

            it("should return 401 - UNAUTHORIZED | Invalid Token", () => {
                return pactum.spec()
                    .get(endPoint)
                    .withHeaders({
                        Authorization: "Bearer invalidToken"
                    })
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });


            it("should return 200 - OK | Valid Token", () => {
                return pactum.spec()
                    .get(endPoint)
                    .withHeaders(auth)
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(
                        "$S{postID}"
                    )
            });

        })

        describe("/post/update/:id - Updating a Post", () => {

            const endPoint = "/post/update/$S{postID}"

            const newDetails = {
                title: "Title 2",
                content: "Content 2"
            }

            it("should return 401 - UNAUTHORIZED | No Token", () => {
                return pactum.spec()
                    .patch(endPoint)
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });

            it("should return 401 - UNAUTHORIZED | Invalid Token", () => {
                return pactum.spec()
                    .patch(endPoint)
                    .withHeaders({
                        Authorization: "Bearer invalidToken"
                    })
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });

            it("should return 400 - BAD REQUEST | No Details", () => {
                return pactum.spec()
                    .patch(endPoint)
                    .withHeaders(auth)
                    .withBody({})
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })

            it("should return 200 - ACCEPTED | Title", () => {
                return pactum.spec()
                    .patch(endPoint)
                    .withHeaders(auth)
                    .withBody({
                        title: newDetails.title
                    })
                    .expectStatus(HttpStatus.OK)
            })

            it("should return 200 - ACCEPTED | Content", () => {
                return pactum.spec()
                    .patch(endPoint)
                    .withHeaders(auth)
                    .withBody({
                        content: newDetails.content
                    })
                    .expectStatus(HttpStatus.OK)
            })

            it("should return 200 - ACCEPTED | All Details", () => {
                return pactum.spec()
                    .patch(endPoint)
                    .withHeaders(auth)
                    .withBody({
                        title: "Title 3",
                        content: "Content 3"
                    })
                    .expectStatus(HttpStatus.OK)
            })

        })

        describe("/post/delete/:id - Deleting a Post", () => {

            const endPoint = "/post/delete/$S{postID}"

            it("should return 401 - UNAUTHORIZED | No Token", () => {
                return pactum.spec()
                    .delete(endPoint)
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });

            it("should return 401 - UNAUTHORIZED | Invalid Token", () => {
                return pactum.spec()
                    .delete(endPoint)
                    .withHeaders({
                        Authorization: "Bearer invalidToken"
                    })
                    .expectStatus(HttpStatus.UNAUTHORIZED)
            });

            it("should return 200 - OK | Deleted Post", () => {
                return pactum.spec()
                    .delete(endPoint)
                    .withHeaders(auth)
                    .expectStatus(HttpStatus.OK)
            })
        })

};