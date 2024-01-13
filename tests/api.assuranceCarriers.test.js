const app = require('../app');
const request = require('supertest');
const AssuranceCarrier = require('../models/assuranceCarrier');

describe("Assurance Carriers API", () => {

    describe("GET /assurance_carriers", () => {
        const assuranceCarriers = [
            new AssuranceCarrier({"name":"TestAssurance", "email":"testassurance@testassurance.com", "url": "https://www.testassurance.com"}),
            new AssuranceCarrier({"name":"TestCarrier", "email":"testcarrier@testcarrier.com", "url": "https://www.testcarrier.com"}),
            new AssuranceCarrier({"name":"TestAssuranceCarrier", "email":"testassurancecarrier@testassurancecarrier.com", "url": "https://www.testassurancecarrier.com"})
        ];
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(AssuranceCarrier, "find");
        });

        it("Should return all assurance carriers", () => {
            dbFind.mockImplementation(async () => Promise.resolve(assuranceCarriers));

            return request(app).get("/api/v1/assurance_carriers").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving all assurance carriers", () => {
            dbFind.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/assurance_carriers").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("GET /assurance_carriers/:id", () => {
        const assuranceCarrier = new AssuranceCarrier({"name":"TestAssuranceCarrier", "email":"testassurancecarrier@testassurancecarrier.com", "url": "https://www.testassurancecarrier.com"});
        var dbFindById;

        beforeEach(() => {
            dbFindById = jest.spyOn(AssuranceCarrier, "findById");
        });

        it("Should return assurance carrier given its id", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(assuranceCarrier));

            return request(app).get("/api/v1/assurance_carriers/1").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.name).toEqual("TestAssuranceCarrier");
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 404 if the assurance carrier does not exist", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(null));

            return request(app).get("/api/v1/assurance_carriers/1").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving an assurance carrier", () => {
            dbFindById.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/assurance_carriers/1").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFindById).toBeCalled();
            });
        });
    });

    describe("POST /assurance_carriers", () => {
        const assuranceCarrier = new AssuranceCarrier({"name":"TestAssuranceCarrier", "email":"testassurancecarrier@testassurancecarrier.com", "url": "https://www.testassurancecarrier.com"});
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(AssuranceCarrier.prototype, "save");
        });

        it("Should add a new assurance carrier if everything is fine", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/api/v1/assurance_carriers").send(assuranceCarrier).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem with the connection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/api/v1/assurance_carriers").send(assuranceCarrier).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            });
        });
    });

    describe("DELETE /assurance_carriers/:id", () => {
        const assuranceCarrier = new AssuranceCarrier({"name":"TestAssuranceCarrier", "email":"testassurancecarrier@testassurancecarrier.com", "url": "https://www.testassurancecarrier.com"});
        var dbDeleteOne;

        beforeEach(() => {
            dbDeleteOne = jest.spyOn(AssuranceCarrier, "deleteOne");
        });

        it("Should delete assurance carrier given its id", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Assurance carrier successfully deleted', deletedCount: 1}));

            return request(app).delete("/api/v1/assurance_carriers/"+assuranceCarrier._id).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual("Assurance carrier successfully deleted");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 404 if the assurance carrier does not exist", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Assurance carrier not found', deletedCount: 0}));

            return request(app).delete("/api/v1/assurance_carriers/"+(assuranceCarrier._id+1)).then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.error).toEqual("Assurance carrier not found");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when deleting an assurance carrier", () => {
            dbDeleteOne.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).delete("/api/v1/assurance_carriers/"+assuranceCarrier._id).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbDeleteOne).toBeCalled();
            });
        });
    });
});