const AssuranceCarrier = require('../../models/assuranceCarrier');
const Authorization = require('../../models/authorization');
const Fee = require('../../models/fee');
const dbConnectTest = require('../../dbTests');


jest.setTimeout(3000);

describe("Integration Tests", () => {

    beforeAll((done) => {
        if(dbConnectTest.readyState == 1){
            done();
        } else {
            dbConnectTest.on("connected", () => done());
        }
    });

    describe("Assurance DB connection", () => {

        const assuranceCarrier = new AssuranceCarrier({"name":"TestAssuranceCarrier", "email":"testassurancecarrier@testassurancecarrier.com", "url": "https://www.testassurancecarrier.com"});
        var result;

        beforeAll(async () => {
            await AssuranceCarrier.deleteMany({});
        });

        it("Writes an assurance carrier in the DB", async () => {
            await assuranceCarrier.save();
            result = await AssuranceCarrier.find();
            expect(result).toBeArrayOfSize(1);
        });

        it("Reads an assurance carrier from the DB", async () => {
            result = await AssuranceCarrier.findById(assuranceCarrier._id);
            expect(result.name).toEqual("TestAssuranceCarrier");
        });

        it("Deletes an assurance carrier from the DB", async () => {
            await AssuranceCarrier.deleteOne(assuranceCarrier._id);
            result = await AssuranceCarrier.findById(assuranceCarrier._id);
            expect(result).toEqual(null);
        });

        afterAll(async () => {
            await AssuranceCarrier.deleteMany({});
        });
    });

    describe("Authorization DB connection", () => {

        const authorization = new Authorization({"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":null,"idAppointment":1});
        var result;

        beforeAll(async () => {
            await Authorization.deleteMany({});
        });

        it("Writes an authorization in the DB", async () => {
            await authorization.save();
            result = await Authorization.find();
            expect(result).toBeArrayOfSize(1);
        });

        it("Reads an authorization from the DB", async () => {
            result = await Authorization.findById(authorization._id);
            expect(result.name).toEqual("TestAuthorization");
        });

        it("Updates an authorization in the DB", async () => {
            const updateData = {"name":"TestAuthorization", "authDate":Date.now(), "serviceDate": Date.now(), "description":"Test description","acceptance":true,"idAppointment":1};
            await Authorization.findByIdAndUpdate(authorization._id, updateData, { new: true });
            result = await Authorization.findById(authorization._id); 
            expect(result.acceptance).toEqual(true);
        });

        it("Deletes an authorization from the DB", async () => {
            await Authorization.deleteOne(authorization._id);
            result = await Authorization.findById(authorization._id);
            expect(result).toEqual(null);
        });

        afterAll(async () => {
            await Authorization.deleteMany({});
        });
    });

    describe("Fee DB connection", () => {

        const fee = new Fee({"name":"TestFee", "services":"Some test services","idAssuranceCarrier":1});
        var result;

        beforeAll(async () => {
            await Fee.deleteMany({});
        });

        it("Writes a fee in the DB", async () => {
            await fee.save();
            result = await Fee.find();
            expect(result).toBeArrayOfSize(1);
        });

        it("Reads a fee from the DB", async () => {
            result = await Fee.findById(fee._id);
            expect(result.name).toEqual("TestFee");
        });

        it("Deletes a fee from the DB", async () => {
            await Fee.deleteOne(fee._id);
            result = await Fee.findById(fee._id);
            expect(result).toEqual(null);
        });

        afterAll(async () => {
            await Fee.deleteMany({});
        });

    });

    afterAll(async () => {
        if(dbConnectTest.readyState == 1){
            await dbConnectTest.close();
        }
    });

});