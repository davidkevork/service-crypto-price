import { CoinID } from '../common/types/coins';
import { History, HistoryRepository } from '../repository/history-repository';

export class GetHistoryService {
    private readonly historyRepository: HistoryRepository;

    constructor() {
        this.historyRepository = new HistoryRepository();
    }

    public async getPriceHistory(coinId: CoinID, from?: string, to?: string): Promise<History[]> {
        const priceHistory = await this.historyRepository.getHistory(coinId, from, to);

        return priceHistory;
    }
}
