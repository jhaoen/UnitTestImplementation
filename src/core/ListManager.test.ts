import { ListViewerManager, UpdateType } from "./ListManager";
import { DataBaseSystem } from "./DataBaseSystem";
import { WordPuritySystem } from "./WordPuritySystem";
import { FilterSystem } from "./FilterSystem";
import { SortSystem } from "./SortSystem";
import { DisplayRangeSystem } from "./DisplayRangeSystem";
import { BookInfo } from "@externals/simple-db";
import { WordPurityService } from "@externals/word-purity";
import { TestBookInfo } from "../__test__/TestingData";

jest.mock("./DataBaseSystem");
jest.mock("./WordPuritySystem");
jest.mock("./FilterSystem");
jest.mock("./SortSystem");
jest.mock("./DisplayRangeSystem");
jest.mock("@externals/word-purity");


describe("ListManager", () => {

    let manager: ListViewerManager;

    let mockDBSystem: jest.Mocked<DataBaseSystem>;
    let mockWordPuritySystem: jest.Mocked<WordPuritySystem>;
    let mockFilterSystem: jest.Mocked<FilterSystem>;
    let mockSortSystem: jest.Mocked<SortSystem>;
    let mockDisplayRangeSystem: jest.Mocked<DisplayRangeSystem>;

    beforeEach(async () => {

        mockDBSystem = new DataBaseSystem() as jest.Mocked<DataBaseSystem>;
        mockWordPuritySystem = new WordPuritySystem(new WordPurityService()) as jest.Mocked<WordPuritySystem>;
        mockFilterSystem = new FilterSystem() as jest.Mocked<FilterSystem>;
        mockSortSystem = new SortSystem() as jest.Mocked<SortSystem>;
        mockDisplayRangeSystem = new DisplayRangeSystem() as jest.Mocked<DisplayRangeSystem>;

        // Mock connectDB
        mockDBSystem.connectDB.mockResolvedValue("DB Connected");

        // Mock getItems
        mockDBSystem.getItems.mockReturnValue(TestBookInfo);
        mockWordPuritySystem.getItems.mockReturnValue(TestBookInfo);
        mockFilterSystem.getItems.mockReturnValue(TestBookInfo);
        mockSortSystem.getItems.mockReturnValue(TestBookInfo);
        mockDisplayRangeSystem.getItems.mockReturnValue(TestBookInfo);

        // Mock process
        mockDBSystem.process.mockResolvedValue();
        mockWordPuritySystem.process.mockResolvedValue();
        mockFilterSystem.process.mockResolvedValue();
        mockSortSystem.process.mockResolvedValue();
        mockDisplayRangeSystem.process.mockResolvedValue();

        // Mock getUpdateMessage
        mockDBSystem.getUpdateMessage.mockReturnValue("Data Base Update");
        mockWordPuritySystem.getUpdateMessage.mockReturnValue("Dom Purity Update");
        mockFilterSystem.getUpdateMessage.mockReturnValue("Filter Update");
        mockSortSystem.getUpdateMessage.mockReturnValue("Sort Update");
        mockDisplayRangeSystem.getUpdateMessage.mockReturnValue("Display Range Update");

        // 建立 ListViewerManager 並初始化
        manager = new ListViewerManager();

        // 將 mock instance 指派給 manager 的 processors
        (manager as any).processors = [
            mockDBSystem,
            mockWordPuritySystem,
            mockFilterSystem,
            mockSortSystem,
            mockDisplayRangeSystem,
        ];
    });

    test("test setUp should initial all system", async () => {

        // when
        await manager.setUp();

        // expected
        expect(manager.getProcessor(UpdateType.Data)).toBeInstanceOf(DataBaseSystem);
        expect(manager.getProcessor(UpdateType.Purity)).toBeInstanceOf(WordPuritySystem);
        expect(manager.getProcessor(UpdateType.Filter)).toBeInstanceOf(FilterSystem);
        expect(manager.getProcessor(UpdateType.Sort)).toBeInstanceOf(SortSystem);
        expect(manager.getProcessor(UpdateType.Range)).toBeInstanceOf(DisplayRangeSystem);

        expect((manager as any).processors).toHaveLength(5);
    });

    test("updateResult 從 Filter 更新時應該只更新後續系統", async () => {

        // when
        await manager.updateResult(UpdateType.Filter);

        // expected
        expect(mockDBSystem.process).not.toHaveBeenCalled();
        expect(mockWordPuritySystem.process).not.toHaveBeenCalled();
        expect(mockFilterSystem.process).toHaveBeenCalledWith(mockWordPuritySystem.getItems());
        expect(mockSortSystem.process).toHaveBeenCalledWith(mockFilterSystem.getItems());
        expect(mockDisplayRangeSystem.process).toHaveBeenCalledWith(mockSortSystem.getItems());

        expect(manager.getUpdateMessage()).toEqual([
            "Filter Update",
            "Sort Update",
            "Display Range Update",
        ]);
    });

    test("updateResult 從 Data 更新時應該更新所有系統", async () => {
        await manager.updateResult(UpdateType.Data);

        expect(mockDBSystem.process).toHaveBeenCalledWith([]);
        expect(mockWordPuritySystem.process).toHaveBeenCalledWith(mockDBSystem.getItems());
        expect(mockFilterSystem.process).toHaveBeenCalledWith(mockWordPuritySystem.getItems());
        expect(mockSortSystem.process).toHaveBeenCalledWith(mockFilterSystem.getItems());
        expect(mockDisplayRangeSystem.process).toHaveBeenCalledWith(mockSortSystem.getItems());

        expect(manager.getUpdateMessage()).toEqual([
            "Data Base Update",
            "Dom Purity Update",
            "Filter Update",
            "Sort Update",
            "Display Range Update",
        ]);
    });

    test("generateDisplayItemRow 應該回傳最後一個系統的資料", () => {

        // when
        const result = manager.generateDisplayItemRow();

        // expected
        expect(mockDisplayRangeSystem.getItems).toHaveBeenCalled();
        expect(result).toEqual(TestBookInfo);
    });
});
