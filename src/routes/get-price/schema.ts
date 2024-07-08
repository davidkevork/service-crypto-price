import { CoinID, Currency } from '../../common/types/coins';

export const GetPriceBodySchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    additionalProperties: false,
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        currency: {
            enum: Object.values(Currency),
            type: 'string',
        },
        coinId: {
            enum: Object.values(CoinID),
            type: 'string',
        },
    },
    required: ['coinId', 'currency', 'email'],
    type: 'object',
};
