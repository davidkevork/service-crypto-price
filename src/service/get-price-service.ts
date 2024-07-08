import { environment } from '../common/environment';
import { CoinID, Currency } from '../common/types/coins';
import { EmailNotificationRepository } from '../repository/email-notification-repository';
import { HistoryRepository } from '../repository/history-repository';

import { AxiosStatic } from 'axios';

export class GetPriceService {
    private readonly axios: AxiosStatic;
    private readonly historyRepository: HistoryRepository;
    private readonly emailNotificationRepository: EmailNotificationRepository;

    constructor(
        axios: AxiosStatic,
        historyRepository: HistoryRepository,
        emailNotificationRepository: EmailNotificationRepository,
    ) {
        this.axios = axios;
        this.historyRepository = historyRepository;
        this.emailNotificationRepository = emailNotificationRepository;
    }

    public async getPrice(coinId: CoinID, currency: Currency, email: string): Promise<number> {
        const price = await this.fetchPrice(coinId, currency);

        await this.savePrice(coinId, currency, price, email);
        await this.emailPrice(coinId, currency, price, email);

        return price;
    }

    private async fetchPrice(coinId: CoinID, currency: Currency): Promise<number> {
        const request = await this.axios({
            url: 'https://api.coingecko.com/api/v3/simple/price',
            params: {
                ids: coinId,
                vs_currencies: currency,
                precision: 8,
            },
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cg-api-key': environment.coingeckoApiKey,
            },
        });

        return request.data[coinId][currency];
    }

    private async savePrice(coinId: CoinID, currency: Currency, price: number, email: string): Promise<void> {
        await this.historyRepository.createHistory({
            coinId,
            currency,
            price,
            email,
            createdAt: new Date().toISOString(),
        });
    }

    private async emailPrice(coinId: CoinID, currency: Currency, price: number, email: string): Promise<void> {
        await this.emailNotificationRepository.notify(
            email,
            'CryptoCurrency Price',
            `The price for cryptocurrency ${coinId} in ${currency} is: ${price}`,
        );
    }
}
