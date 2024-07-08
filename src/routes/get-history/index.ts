import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetHistoryParamsSchema } from './schema';
import { validateInput } from '../../common/validate';
import { GetHistoryService } from '../../service/get-history-service';
import { CoinID } from '../../common/types/coins';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const params = event.queryStringParameters;
        await validateInput(params || {}, GetHistoryParamsSchema);
        const { coinId, from, to } = params as Record<string, string>;

        const getHistoryService = new GetHistoryService();
        const priceHistory = await getHistoryService.getPriceHistory(coinId as CoinID, from, to);

        const history = priceHistory.map(({ coinId, currency, price, createdAt }) => ({
            coinId,
            currency,
            price,
            createdAt,
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(history, undefined, 4),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 400,
            body: JSON.stringify(
                {
                    message: (error as Error).message,
                },
                undefined,
                4,
            ),
        };
    }
};
