import 'aws-sdk-client-mock-jest';

import { mockClient } from 'aws-sdk-client-mock';

import { HistoryRepository } from '../../src/repository/history-repository';
import { CoinID, Currency } from '../../src/common/types/coins';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

describe('History Repository', () => {
    let historyRepository: HistoryRepository;
    let dynamoMock: any;

    beforeAll(() => {
        dynamoMock = mockClient(DynamoDBDocumentClient);

        historyRepository = new HistoryRepository();
    });

    afterEach(() => {
        dynamoMock.reset();
    });

    describe('createHistory', () => {
        test('throws error when saving dails', async () => {
            dynamoMock.on(PutCommand).rejects('test');
            const item = {
                coinId: CoinID.bitcoin,
                currency: Currency.aud,
                price: 1,
                createdAt: '2024-07-08T05:53:21.616Z',
                email: 'test@gmail.com',
            };

            await expect(historyRepository.createHistory(item)).rejects.toThrow('test');

            expect(dynamoMock).toHaveReceivedCommandTimes(PutCommand, 1);
            expect(dynamoMock).toHaveReceivedCommandWith(PutCommand, {
                Item: item,
                TableName: 'service-crypto-price-history',
            });
        });

        test('save history in dynamodb successfully', async () => {
            dynamoMock.on(PutCommand).resolves({});
            const item = {
                coinId: CoinID.bitcoin,
                currency: Currency.aud,
                price: 1,
                createdAt: '2024-07-08T05:53:21.616Z',
                email: 'test@gmail.com',
            };

            await historyRepository.createHistory(item);

            expect(dynamoMock).toHaveReceivedCommandTimes(PutCommand, 1);
            expect(dynamoMock).toHaveReceivedCommandWith(PutCommand, {
                Item: item,
                TableName: 'service-crypto-price-history',
            });
        });
    });

    describe('getHistory', () => {
        test('get history without dates', async () => {
            dynamoMock.on(QueryCommand).resolves({ Items: [] });

            await historyRepository.getHistory(CoinID.bitcoin);

            expect(dynamoMock).toHaveReceivedCommandTimes(QueryCommand, 1);
            expect(dynamoMock).toHaveReceivedCommandWith(QueryCommand, {
                ExpressionAttributeNames: {
                    '#coinId': 'coinId',
                },
                ExpressionAttributeValues: {
                    ':coinId': CoinID.bitcoin,
                },
                KeyConditionExpression: `#coinId = :coinId`,
                ScanIndexForward: false,
                TableName: 'service-crypto-price-history',
            });
        });

        test('get history with start date', async () => {
            dynamoMock.on(QueryCommand).resolves({ Items: [] });

            await historyRepository.getHistory(CoinID.bitcoin, '2024-06-08T05:53:21.616Z');

            expect(dynamoMock).toHaveReceivedCommandTimes(QueryCommand, 1);
            expect(dynamoMock).toHaveReceivedCommandWith(QueryCommand, {
                ExpressionAttributeNames: {
                    '#coinId': 'coinId',
                    '#createdAt': 'createdAt',
                },
                ExpressionAttributeValues: {
                    ':coinId': CoinID.bitcoin,
                    ':startDate': '2024-06-08T05:53:21.616Z',
                },
                KeyConditionExpression: `#coinId = :coinId AND #createdAt > :startDate`,
                ScanIndexForward: false,
                TableName: 'service-crypto-price-history',
            });
        });

        test('get history with end date', async () => {
            dynamoMock.on(QueryCommand).resolves({ Items: [] });

            await historyRepository.getHistory(CoinID.bitcoin, undefined, '2024-08-08T05:53:21.616Z');

            expect(dynamoMock).toHaveReceivedCommandTimes(QueryCommand, 1);
            expect(dynamoMock).toHaveReceivedCommandWith(QueryCommand, {
                ExpressionAttributeNames: {
                    '#coinId': 'coinId',
                    '#createdAt': 'createdAt',
                },
                ExpressionAttributeValues: {
                    ':coinId': CoinID.bitcoin,
                    ':endDate': '2024-08-08T05:53:21.616Z',
                },
                KeyConditionExpression: `#coinId = :coinId AND #createdAt < :endDate`,
                ScanIndexForward: false,
                TableName: 'service-crypto-price-history',
            });
        });

        test('get history with start and end dates', async () => {
            dynamoMock.on(QueryCommand).resolves({ Items: [] });

            await historyRepository.getHistory(CoinID.bitcoin, '2024-06-08T05:53:21.616Z', '2024-08-08T05:53:21.616Z');

            expect(dynamoMock).toHaveReceivedCommandTimes(QueryCommand, 1);
            expect(dynamoMock).toHaveReceivedCommandWith(QueryCommand, {
                ExpressionAttributeNames: {
                    '#coinId': 'coinId',
                    '#createdAt': 'createdAt',
                },
                ExpressionAttributeValues: {
                    ':coinId': CoinID.bitcoin,
                    ':startDate': '2024-06-08T05:53:21.616Z',
                    ':endDate': '2024-08-08T05:53:21.616Z',
                },
                KeyConditionExpression: `#coinId = :coinId AND #createdAt BETWEEN :startDate AND :endDate`,
                ScanIndexForward: false,
                TableName: 'service-crypto-price-history',
            });
        });
    });
});
