import { DisplayRangeSystem } from "./DisplayRangeSystem";
import { TestBookInfo } from "../__test__/TestingData";

describe("DisplayRangeSystem", () => {
    let displayRangeSystem: DisplayRangeSystem;

    beforeEach(() => {
        displayRangeSystem = new DisplayRangeSystem();
    });

    test("test constructor initialization", () => {
        // given
        let defaultUpdateMessage = "Display Range Update";
        let defaultStart = 1;
        let defaultEnd = 10;

        // when
        let updateMessage = displayRangeSystem.getUpdateMessage();
        let initialStart = displayRangeSystem.getStartRange();
        let initialEnd = displayRangeSystem.getEndRange();

        // expected
        expect(updateMessage).toEqual(defaultUpdateMessage);
        expect(initialStart).toBe(defaultStart);
        expect(initialEnd).toBe(defaultEnd);
    });

    // setRange 正常情況測試
    describe("setRange 正常輸入", () => {
        test("測試數字輸入", () => {
            displayRangeSystem.setRange(2, 15);
            expect(displayRangeSystem.getStartRange()).toBe(2);
            expect(displayRangeSystem.getEndRange()).toBe(15);
        });

        test("測試字串输入", () => {
            displayRangeSystem.setRange("5", "9");
            expect(displayRangeSystem.getStartRange()).toBe(5);
            expect(displayRangeSystem.getEndRange()).toBe(9);
        });


        test("浮點數字串輸入", () => {
            displayRangeSystem.setRange("2.5", "6.8");
            expect(displayRangeSystem.getStartRange()).toBe(2);
            expect(displayRangeSystem.getEndRange()).toBe(6);
        });

        test("測試 start = end", () => {
            displayRangeSystem.setRange(5, 5);
            expect(displayRangeSystem.getEndRange()).toBe(5);
        });
    });

    // setRange 異常輸入情況測試
    describe("setRange 異常處理", () => {

        test("非數字字串", () => {
            expect(() => displayRangeSystem.setRange("abc", 5)).toThrow("Invalid String Input");
        });
    
        test("零", () => {
            expect(() => displayRangeSystem.setRange(0, 5)).toThrow("Cannot be less than 0");
        });

        test("負數", () => {
            expect(() => displayRangeSystem.setRange(-2, "3")).toThrow("Cannot be less than 0");
        });
        
        test("浮點數輸入", () => {
            expect(() => displayRangeSystem.setRange(2.5, 6.8)).toThrow(
                "Invalid Float Input"
            );
        });

        test("end < start", () => {
            expect(() => displayRangeSystem.setRange(5, 3)).toThrow(
                "End Range cannot less than Start Range"
            );
        });

    });

    test("test process method", async ()=>{

        // given
        let start = 2;
        let end = 5;
        displayRangeSystem.setRange(start,end);
        const sliceBooks = TestBookInfo.slice(start-1, end);

        // when 
        displayRangeSystem.process(TestBookInfo);

        // expected
        expect(displayRangeSystem.getItems()).toEqual(sliceBooks);

    });
});
