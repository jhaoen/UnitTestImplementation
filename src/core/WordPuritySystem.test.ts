import { WordPuritySystem } from "./WordPuritySystem";
import { TestBookInfo } from "../__test__/TestingData";

describe("WordPuritySystem", () => {

    jest.mock('@externals/word-purity', () => {
        return {
            __esModule: true,
            WordPurityService: jest.fn().mockImplementation(() => {
                return {
                    addWord: jest.fn((words: string[]) => {
                        purityWords.push(...words);
                    }),
                    purity: jest.fn().mockImplementation((text: string) => {
                        return purityWords.reduce((accumulator, word) => {
                            return accumulator.replace(new RegExp(word, 'gi'), '***');
                        }, text);
                    })
                };
            })
        };
    });
    let purityWords: string[] = [];
    let wordPuritySystem: WordPuritySystem;

    beforeEach(() => {

        purityWords = ["Copperfield", "Wonderland"];
        wordPuritySystem = new WordPuritySystem(
            new (jest.requireMock('@externals/word-purity').WordPurityService)()
        );
    });

    test("test constructor initialization", () => {

        // given
        let defaultUpdateMessage = "Dom Purity Update";

        // when
        let updateMessage = wordPuritySystem.getUpdateMessage();

        // expected
        expect(updateMessage).toEqual(defaultUpdateMessage);
    });

    test("test setter/getter of DisablePurity() method", () => {

        // given
        let setValue: boolean = true;

        // when
        wordPuritySystem.setDisablePurity(setValue);

        // expected
        expect(wordPuritySystem.isDisablePurity()).toEqual(setValue);
    });

    test("test process() method with disable false", async () => {

        // given
        const purityItems = TestBookInfo.map((book) => {
            return {
                ...book,
                title: purityWords.reduce((accumulator, word) => {
                    // case-insensitive
                    return accumulator.replace(new RegExp(word, 'gi'), '***');
                }, book.title),
            };
        });
        wordPuritySystem.setDisablePurity(false);

        // when
        await wordPuritySystem.process(TestBookInfo);

        // expected
        expect(wordPuritySystem.getItems()).toEqual(purityItems);
    });

    test("test process() method with disable true", async () => {

        // given
        wordPuritySystem.setDisablePurity(true);

        // when
        await wordPuritySystem.process(TestBookInfo);

        // expected
        expect(wordPuritySystem.getItems()).toEqual(TestBookInfo);
    });
});
