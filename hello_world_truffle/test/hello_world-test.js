const HelloWorldContract = artifacts.require("HelloWorld");

contract("HelloWorld", () => {
    it("has been deployed successfully", async () => {
        const hello = await HelloWorldContract.deployed();
        assert(hello, "contract was not deployed.");
    });

    describe("getMessage()", () => {
        it("returns 'Hello, World!'", async () => {
            const hello = await HelloWorldContract.deployed();
            const expected = "Hello, world!";
            const actual = await hello.getMessage();
            assert.equal(actual, expected, "got message 'Hello. World!'");
        });
    });

    describe("add()", () => {
        it("returns 'add()", async () => {
            const hello = await HelloWorldContract.deployed();
            const expected = "1209";
            const actual = await hello.add("855","354");
            assert.equal(actual, expected, "got correct answer '1209'");
        });
    });
});
