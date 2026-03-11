import { HashGenerator } from "./HashGenerator";

describe("Hash Generator", () => {

    let generator: HashGenerator;
    const mockMathRandom = jest.spyOn(Math, 'random');

    beforeEach(() => {
        generator = new HashGenerator();
    });

    test("測試 g()，給定合法輸入", () => {

        // given
        mockMathRandom
            .mockReturnValueOnce(0.0)   // A
            .mockReturnValueOnce(0.1)   // (0.1*26=2.6 → 65+2.6=67.6 → C)
            .mockReturnValueOnce(0.2)   // (0.2*26=5.2 → 65+5.2=70.2 → F)
            .mockReturnValueOnce(0.3);  // (0.3*26=7.8 → 65+7.8=72.8 → H)

        // when
        const result = generator.g(4);

        // expected
        expect(result).toBe("ACFH");
    });

    test("測試 g()，給定非法輸入", () => {

        expect(() => generator.g(0)).toThrow("Hash number can't less than 0");
        expect(() => generator.g(-1)).toThrow("Hash number can't less than 0");

    });

    test("測試 simpleISBN() 僅返回數字以及 -", () => {

        // given
        let allCharPattern = "xxxx-xxxxxx-xxx-xxx";

        // when
        const result = generator.simpleISBN(allCharPattern);

        // expected
        expect(result).toMatch(/^[0-9-]+$/);

    });
});
