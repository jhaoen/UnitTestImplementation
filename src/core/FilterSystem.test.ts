import { FilterSystem } from "./FilterSystem";
import { TestBookInfo } from "../__test__/TestingData";


describe("filterSystem", () => {

    let filterSystem: FilterSystem;

    beforeEach(() => {
        filterSystem = new FilterSystem();
      });

    // test constructor
    describe("test filterSystem Constructor", () => {
        test("test constructor initialize correctly", () => {

            // given
            let defaultFilterWord:string = "";
            let defaultIgnoreCase:boolean = false;
            let defaultUpdateMessage:string = "Filter Update";

            // when
            let initializedFilterWord:string = filterSystem.getFilterWord();
            let initializedIgnoreCase:boolean = filterSystem.isIgnoreCase();
            let initializedUpdateMessage:string = filterSystem.getUpdateMessage();

            // expected
            expect(initializedFilterWord).toBe(defaultFilterWord);
            expect(initializedIgnoreCase).toBe(defaultIgnoreCase);
            expect(initializedUpdateMessage).toBe(defaultUpdateMessage);
        });
    });

    // test setter/getter method
    describe("test filterSystem setter/getter", () => {

        test("test filterWord setter/getter work correctly", () => {

            // given
            let setValue:string = "hello";

            // when
            filterSystem.setFilterWord(setValue);

            // expected
            expect(filterSystem.getFilterWord()).toBe(setValue);
        });

        test("test ignoreCase setter/getter work correctly", () => {

            // given
            let setValue:boolean = true;

            // when
            filterSystem.setIgnoreCase(setValue);

            // expected
            expect(filterSystem.isIgnoreCase()).toBe(setValue);
        });
    });

    // test process method
    describe("test filterSystem process()", ()=>{

        test("empty filterWord need to return all items", async () => {

            // given
            filterSystem.setFilterWord("");

            // when
            await filterSystem.process(TestBookInfo);

            // expected
            expect(filterSystem.getItems()).toEqual(TestBookInfo);
        });

        test("test process() ignore case", async ()=>{

            // given
            filterSystem.setFilterWord("of");
            filterSystem.setIgnoreCase(true);
            const filteredBooks = TestBookInfo.filter(book => book.title.toLowerCase().includes("of"));
            
            // when
            await filterSystem.process(TestBookInfo);

            // expected
            console.log(filterSystem.getItems());
            expect(filterSystem.getItems()).toStrictEqual(filteredBooks);
        });

        test("test process() no ignore case", async ()=>{

            // given
            filterSystem.setFilterWord("of");
            filterSystem.setIgnoreCase(false);
            const filteredBooks = TestBookInfo.filter(book => book.title.includes("of"));
            
            // when
            await filterSystem.process(TestBookInfo);

            // expected
            console.log(filterSystem.getItems());
            expect(filterSystem.getItems()).toStrictEqual(filteredBooks);
        });
    });
});
