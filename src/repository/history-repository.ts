import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { CoinID, Currency } from '../common/types/coins';

export type History = {
    coinId: CoinID;
    currency: Currency;
    price: number;
    createdAt: string;
    email: string;
};

export class HistoryRepository {
    protected readonly dynamoClient: DynamoDBDocumentClient;
    protected readonly tableName = 'service-crypto-price-history';

    constructor() {
        this.dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
    }

    public async createHistory(item: History): Promise<History | undefined> {
        try {
            await this.dynamoClient.send(
                new PutCommand({
                    Item: item,
                    TableName: this.tableName,
                }),
            );
            return item;
        } catch (error) {
            console.log('Error saving history', error);

            throw new Error((error as Error).message);
        }
    }

    private getDateCondition(from?: string, to?: string) {
        if (!!from && !to) {
            return ' AND #createdAt > :startDate';
        }
        if (!from && !!to) {
            return ' AND #createdAt < :endDate';
        }
        return ' AND #createdAt BETWEEN :startDate AND :endDate';
    }

    private getDateAttributes(from?: string, to?: string) {
        const attributeName: Record<string, string> = {};
        const attributeValue: Record<string, string> = {};
        if (!from && !to) {
            return { attributeName, attributeValue, condition: '' };
        }

        attributeName['#createdAt'] = 'createdAt';
        if (!!from) attributeValue[':startDate'] = from;
        if (!!to) attributeValue[':endDate'] = to;

        return {
            attributeName,
            attributeValue,
            condition: this.getDateCondition(from, to),
        };
    }

    public async getHistory(coinId: CoinID, from?: string, to?: string): Promise<History[]> {
        const { attributeName, attributeValue, condition } = this.getDateAttributes(from, to);
        const result = await this.dynamoClient.send(
            new QueryCommand({
                ExpressionAttributeNames: {
                    '#coinId': 'coinId',
                    ...attributeName,
                },
                ExpressionAttributeValues: {
                    ':coinId': coinId,
                    ...attributeValue,
                },
                KeyConditionExpression: `#coinId = :coinId${condition}`,
                ScanIndexForward: false,
                TableName: this.tableName,
            }),
        );

        return (result.Items as History[]) || [];
    }
}
