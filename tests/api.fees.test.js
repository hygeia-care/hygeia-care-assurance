const app = require('../app');
const request = require('supertest');
const Fee = require('../models/fee');

describe("Fees API", () => {

    describe("GET /fees", () => {
        const fees = [
            new Fee({"name":"TestFee", "services":"Some test services","idAssuranceCarrier":1}),
            new Fee({"name":"FeeTest", "services":"Some test services","idAssuranceCarrier":2}),
            new Fee({"name":"SomeNewTestFee", "services":"Some test services","idAssuranceCarrier":3})
        ];
        var dbFind;

        beforeEach(() => {
            dbFind = jest.spyOn(Fee, "find");
        });

        it("Should return all fees", () => {
            dbFind.mockImplementation(async () => Promise.resolve(fees));

            return request(app).get("/api/v1/fees").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving all fees", () => {
            dbFind.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/fees").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("GET /fees/:id", () => {
        const fee = new Fee({"name":"TestFee", "services":"Some test services","idAssuranceCarrier":1});
        var dbFindById;

        beforeEach(() => {
            dbFindById = jest.spyOn(Fee, "findById");
        });

        it("Should return fee given its id", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(fee));

            return request(app).get("/api/v1/fees/1").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.name).toEqual("TestFee");
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 404 if the fee does not exist", () => {
            dbFindById.mockImplementation(async () => Promise.resolve(null));

            return request(app).get("/api/v1/fees/1").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFindById).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving a fee", () => {
            dbFindById.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).get("/api/v1/fees/1").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFindById).toBeCalled();
            });
        });
    });

    describe("POST /fees", () => {
        const fee = new Fee({"name":"TestFee", "services":"Some test services","idAssuranceCarrier":1});
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Fee.prototype, "save");
        });

        it("Should add a new fee if everything is fine", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/api/v1/fees").send(fee).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem with the connection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/api/v1/fees").send(fee).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            });
        });
    });

    describe("DELETE /fees/:id", () => {
        const fee = new Fee({"name":"TestFee", "services":"Some test services","idAssuranceCarrier":1});
        var dbDeleteOne;

        beforeEach(() => {
            dbDeleteOne = jest.spyOn(Fee, "deleteOne");
        });

        it("Should delete fee given its id", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Fee successfully deleted', deletedCount: 1}));

            return request(app).delete("/api/v1/fees/"+fee._id).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual("Fee successfully deleted");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 404 if the fee does not exist", () => {
            dbDeleteOne.mockImplementation(async () => Promise.resolve({ message: 'Fee not found', deletedCount: 0}));

            return request(app).delete("/api/v1/fees/"+(fee._id+1)).then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body.error).toEqual("Fee not found");
                expect(dbDeleteOne).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem when retrieving a fee", () => {
            dbDeleteOne.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).delete("/api/v1/fees/"+fee._id).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbDeleteOne).toBeCalled();
            });
        });
    });
});