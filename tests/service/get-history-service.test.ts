import { CoinID } from '../../src/common/types/coins';
import { HistoryRepository } from '../../src/repository/history-repository';
import { GetHistoryService } from '../../src/service/get-history-service';

describe('Get History Service', () => {
    test('getPriceHistory', async () => {
        const getHistoryMock = jest.fn().mockResolvedValue([]);
        const getHistoryService = new GetHistoryService({
            getHistory: getHistoryMock,
        } as unknown as HistoryRepository);

        await getHistoryService.getPriceHistory(CoinID.bitcoin, 'from', 'to');

        expect(getHistoryMock).toHaveBeenCalledWith(CoinID.bitcoin, 'from', 'to');
    });
});
