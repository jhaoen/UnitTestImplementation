import { SortSystem } from "./SortSystem";
import { TestBookInfo } from "../__test__/TestingData";

describe("SortSystem", () => {

    let sortSystem:SortSystem;

    beforeEach(() => {
        sortSystem = new SortSystem();
    });

    test("test constructor initialization", () => {
        
        // given
        let defaultUpdateMessage = "Sort Update";

        // when
        let updateMessage = sortSystem.getUpdateMessage();

        // expected
        expect(updateMessage).toEqual(defaultUpdateMessage);

    });

    test("test setSortType method with parameter ASC", ()=>{

        // given
        let setValue:string = "ASC";

        // when
        sortSystem.setSortType(setValue);

        // expected
        expect(sortSystem.getSortType()).toEqual(setValue);
    });

    test("test setSortType method with parameter DESC", ()=>{

        // given
        let setValue:string = "DESC";

        // when
        sortSystem.setSortType(setValue);

        // expected
        expect(sortSystem.getSortType()).toEqual(setValue);
    });

    test("test setSortType method with parameter neither ASC nor DESC", ()=>{

        // given
        let setValue:string = "value";

        // when
        const testThrowException = () =>{
            sortSystem.setSortType(setValue);
        }

        // expected
        expect(testThrowException).toThrow("It must be ASC or DESC");
    });


    test("test process method with set sort type ASC", ()=>{

        // given
        sortSystem.setSortType("ASC");
        const bookSortByASC = TestBookInfo.sort((a, b) => a.title.localeCompare(b.title));

        // when
        sortSystem.process(TestBookInfo);

        // expected
        expect(sortSystem.getItems()).toEqual(bookSortByASC);

    });

    test("test process method with set sort type DESC", ()=>{

        // given
        sortSystem.setSortType("DESC");
        const bookSortByASC = TestBookInfo.sort((a, b) => a.title.localeCompare(a.title));

        // when
        sortSystem.process(TestBookInfo);

        // expected
        expect(sortSystem.getItems()).toEqual(bookSortByASC);

    });
});
