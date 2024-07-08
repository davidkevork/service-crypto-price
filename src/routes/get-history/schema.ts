import { CoinID } from '../../common/types/coins';

export const GetHistoryParamsSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    additionalProperties: false,
    properties: {
        coinId: {
            enum: Object.values(CoinID),
            type: 'string',
        },
        from: {
            format: 'date-time',
            type: 'string',
        },
        to: {
            format: 'date-time',
            type: 'string',
        },
    },
    required: ['coinId'],
    type: 'object',
};
