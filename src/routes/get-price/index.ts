import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetPriceBodySchema } from './schema';
import { validateInput } from '../../common/validate';
import { GetPriceService } from '../../service/get-price-service';
import { EmailNotificationRepository } from '../../repository/email-notification-repository';
import { HistoryRepository } from '../../repository/history-repository';
import axios from 'axios';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body as string);
        await validateInput(body, GetPriceBodySchema);
        const { coinId, currency, email } = body;

        const historyRepository = new HistoryRepository();
        const emailNotificationRepository = new EmailNotificationRepository();
        const getPriceService = new GetPriceService(axios, historyRepository, emailNotificationRepository);
        const price = await getPriceService.getPrice(coinId, currency, email);

        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    coinId,
                    currency,
                    price,
                },
                undefined,
                4,
            ),
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
