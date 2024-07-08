import { AxiosStatic } from 'axios';
import { CoinID, Currency } from '../../src/common/types/coins';
import { EmailNotificationRepository } from '../../src/repository/email-notification-repository';
import { HistoryRepository } from '../../src/repository/history-repository';
import { GetPriceService } from '../../src/service/get-price-service';
import { environment } from '../../src/common/environment';

describe('Get Price Service', () => {
    let createHistoryMock: jest.Mock;
    let notifyMock: jest.Mock;
    let axiosMock: jest.Mock;

    let getPriceService: GetPriceService;

    beforeAll(() => {
        environment.coingeckoApiKey = 'coingeckoApiKey';
        createHistoryMock = jest.fn().mockResolvedValue({});
        notifyMock = jest.fn().mockResolvedValue({});
        axiosMock = jest.fn().mockResolvedValue({
            data: {
                [CoinID.bitcoin]: {
                    [Currency.aud]: 1,
                },
            },
        });

        getPriceService = new GetPriceService(
            axiosMock as unknown as AxiosStatic,
            {
                createHistory: createHistoryMock,
            } as unknown as HistoryRepository,
            {
                notify: notifyMock,
            } as unknown as EmailNotificationRepository,
        );
    });

    test('getPrice', async () => {
        await getPriceService.getPrice(CoinID.bitcoin, Currency.aud, 'test@gmail.com');

        expect(createHistoryMock).toHaveBeenCalledWith({
            coinId: CoinID.bitcoin,
            currency: Currency.aud,
            price: 1,
            email: 'test@gmail.com',
            createdAt: expect.any(String),
        });
        expect(notifyMock).toHaveBeenCalledWith(
            'test@gmail.com',
            'CryptoCurrency Price',
            `The price for cryptocurrency ${CoinID.bitcoin} in ${Currency.aud} is: 1`,
        );
        expect(axiosMock).toHaveBeenCalledWith({
            url: 'https://api.coingecko.com/api/v3/simple/price',
            params: {
                ids: CoinID.bitcoin,
                vs_currencies: Currency.aud,
                precision: 8,
            },
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-cg-api-key': 'coingeckoApiKey',
            },
        });
    });
});
