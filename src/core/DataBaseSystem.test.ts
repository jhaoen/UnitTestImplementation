import { TestBookInfo } from "../__test__/TestingData";
import { BookInfo } from "@externals/simple-db";

var books: BookInfo[] = [...TestBookInfo];

jest.mock("@externals/simple-db", () => {
    return {
        BookDataBaseService: jest.fn().mockImplementation(() => {
            return {
                // mock setUp method
                setUp: jest.fn().mockImplementation((url: string, port: number) => {
                    return Promise.resolve('Connection established successfully');
                }),

                // mock getBooks method
                getBooks: jest.fn().mockImplementation(() => {
                    return Promise.resolve(books);
                }),

                // mock addBook method
                addBook: jest.fn().mockImplementation((book: BookInfo) => {
                    books.push(book);
                    return Promise.resolve('Book added successfully');
                }),

                // mock deleteBook method
                deleteBook: jest.fn().mockImplementation((bookISBN: string) => {
                    const index = books.findIndex((book) => book.ISBN === bookISBN);
                    if (index !== -1) {
                        books.splice(index, 1);
                    }
                    return Promise.resolve('Book deleted successfully');

                }),
            }
        })
    }
});

import { DataBaseSystem } from "./DataBaseSystem";
import { BookDataBaseService } from "@externals/simple-db";

describe("DataBaseSystem", () => {

    let dbSystem: DataBaseSystem;

    beforeEach(() => {

        jest.clearAllMocks();
        dbSystem = new DataBaseSystem(new (jest.requireMock('@externals/simple-db').BookDataBaseService)());
    });


    test("test constructor initialization", () => {

        // given
        let defaultUpdateMessage = "Data Base Update";

        // when
        let updateMessage = dbSystem.getUpdateMessage();

        // expected
        expect(updateMessage).toEqual(defaultUpdateMessage);
    });

    test("test constructor should create default db instance when not provided", () => {

        // given & when
        jest.clearAllMocks();
        const dbSystemWithoutParam = new DataBaseSystem();

        // expected
        const MockedBookDataBaseService = jest.requireMock('@externals/simple-db').BookDataBaseService;
        expect(MockedBookDataBaseService).toHaveBeenCalledTimes(1);
    });

    test("test connectDB method retry logic", async () => {

        // given
        const mockDBServiceInstance = dbSystem.db as jest.Mocked<BookDataBaseService>;

        // 模擬第一次失敗，第二次成功
        mockDBServiceInstance.setUp
            .mockRejectedValueOnce(new Error("First connection failed"))
            .mockResolvedValueOnce("Connection established successfully");

        // when
        const result = await dbSystem.connectDB();

        // expected
        expect(mockDBServiceInstance.setUp).toHaveBeenCalledTimes(2);
        expect(result).toEqual("Connection established successfully");
    });

    test("test connectDB failure after retries", async () => {

        // given
        const mockDBServiceInstance = dbSystem.db as jest.Mocked<BookDataBaseService>;
        mockDBServiceInstance.setUp.mockRejectedValue(new Error("setUp Failed"));

        // when & expected
        await expect(dbSystem.connectDB()).rejects.toThrow("Cannot connect to DB");
        expect(mockDBServiceInstance.setUp).toHaveBeenCalledTimes(DataBaseSystem.retryTimes);
    });

    test("test addBook method with valid parameter", async () => {

        // given
        let title: string = "Hello";
        let author: string = "Andy"

        // when
        await dbSystem.addBook(title, author);
        await dbSystem.process(null);

        // expected
        expect(dbSystem.getItems()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: title,
                    author: author,
                }),
            ])
        );

    });

    test("test addBook method with invalid parameter", async () => {

        // given
        let title: string = null;
        let author: string = null;

        // when & expected
        await expect(dbSystem.addBook(title, author)).rejects.toThrow('Add book failed');
    });

    test("test deleteBook method with valid parameter", () => {

        // given
        let deletedBookISBN: string = "148-71-77362-42-3";

        // when
        dbSystem.deleteBook(deletedBookISBN);

        // expected
        expect(dbSystem.getItems()).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ISBN: deletedBookISBN
                }),
            ])
        );
    });

    test("test deleteBook method with invalid parameter", async () => {

        // given
        let deletedBookISBN: string = "";

        // when & expected
        await expect(dbSystem.deleteBook(deletedBookISBN)).rejects.toThrow('Delete book failed');
    });
});
