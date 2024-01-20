const app = require('../app');
const request = require('supertest');
const Authorization = require('../models/authorization');
const verifyJWTToken = require('../verifyJWTToken');
const appointmentsService = require('../services/appointmentsService');

describe("Authorizations API", () => {

    verifyToken = jest.spyOn(verifyJWTToken, "verifyToken");
    verifyToken.mockImplementation(async () => Promise.resolve(true));

    getAppointmentFunc = jest.spyOn(appointmentsService, "getAppointment");
    getAppointmentFunc.mockImplementation(async () => Promise.resolve(true));

    const testJWT = "thisTokenWorks";

    describe("GET /authorizations", () => {
        const authorizations = [
            new Authorization({"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":true,"idAppointment":1}),
            new Authorization({"name":"AuthorizationTest", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":true,"idAppointment":2}),
            new Authorization({"name":"TestAuth", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":false,"idAppointment":3})
        ];
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(Authorization, "find");
        });

        it("Should return all authorizations", () => {
            dbFind.mockImplementation(async () => Promise.resolve(authorizations));

            return request(app).get("/api/v1/authorizations")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving all authorizations", () => {
            dbFind.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/authorizations")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("GET /authorizations/:id", () => {
        const authorization = new Authorization({"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":true,"idAppointment":1});
        var dbFindById;

        beforeEach(() => {
            dbFindById = jest.spyOn(Authorization, "findById");
        });

        it("Should return authorization given its id", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(authorization));

            return request(app).get("/api/v1/authorizations/1")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.name).toEqual("TestAuthorization");
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 404 if the authorization does not exist", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(null));

            return request(app).get("/api/v1/authorizations/1")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving an authorization", () => {
            dbFindById.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/authorizations/1")
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFindById).toBeCalled();
            });
        });
    });

    describe("POST /authorizations", () => {
        
        const authorization = new Authorization({"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":true,"idAppointment":1});
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Authorization.prototype, "save");
        });

        it("Should add a new authorization if everything is fine", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/api/v1/authorizations")
            .set("x-auth-token", testJWT)
            .send(authorization)
            .then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem with the connection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/api/v1/authorizations")
            .set("x-auth-token", testJWT)
            .send(authorization)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            });
        });
    });

    describe("DELETE /authorizations/:id", () => {
        const authorization = new Authorization({"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":true,"idAppointment":1});
        var dbDeleteOne;

        beforeEach(() => {
            dbDeleteOne = jest.spyOn(Authorization, "deleteOne");
        });

        it("Should delete authorization given its id", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Authorization successfully deleted', deletedCount: 1}));

            return request(app).delete("/api/v1/authorizations/"+authorization._id)
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual("Authorization successfully deleted");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 404 if the authorization does not exist", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Authorization not found', deletedCount: 0}));

            return request(app).delete("/api/v1/authorizations/"+(authorization._id+1))
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.error).toEqual("Authorization not found");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving an authorization", () => {
            dbDeleteOne.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).delete("/api/v1/authorizations/"+authorization._id)
            .set("x-auth-token", testJWT)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbDeleteOne).toBeCalled();
            });
        });
    });

    describe("PUT /authorizations/:id", () => {
        const authorization = new Authorization({"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":null,"idAppointment":1});
        const updatedBody = {"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":true,"idAppointment":1};
        const updatedAuthorization = new Authorization(updatedBody);
        var dbfindByIdAndUpdate;

        beforeEach(() => {
            dbfindByIdAndUpdate = jest.spyOn(Authorization, "findByIdAndUpdate");
        });

        it("Should update authorization given its id", () => {
            dbfindByIdAndUpdate.mockImplementation(async () => Promise.resolve(updatedAuthorization));

            return request(app).put("/api/v1/authorizations/"+authorization._id)
            .set("x-auth-token", testJWT)
            .send(updatedBody)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.name).toEqual("TestAuthorization");
                expect(response.body.acceptance).toEqual(true);
                expect(dbfindByIdAndUpdate).toBeCalled();
            });
        });

        it("Should return 404 if the authorization does not exist", () => {
            dbfindByIdAndUpdate.mockImplementation(async () => Promise.resolve());

            return request(app).put("/api/v1/authorizations/"+(authorization._id+1))
            .set("x-auth-token", testJWT)
            .send(updatedBody)
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbfindByIdAndUpdate).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when updating an authorization", () => {
            dbfindByIdAndUpdate.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).put("/api/v1/authorizations/"+authorization._id)
            .set("x-auth-token", testJWT)
            .send(updatedBody)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbfindByIdAndUpdate).toBeCalled();
            });
        });
    });
});