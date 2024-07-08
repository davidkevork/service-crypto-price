## Usage

### Deployment

Deploy config/resources.yml in cloudformation using CoinGecko api key and verified SES email arn

Run the following command to deploy the lambdas to the us-east-1 region
```
serverless deploy
```

### Invocation

#### Get Price endpoint

https://vczqkejwyj.execute-api.us-east-1.amazonaws.com/price

```json
{
    "coinId": "bitcoin",
    "currency": "usd",
    "email": "test@gmail.com"
}
```

- coinId (required): bitcoin, ethereum, litecoin
- currency (required): usd, aud, eur, gbp
- email (required): Email to receive notification

#### Get History endpoint

https://vczqkejwyj.execute-api.us-east-1.amazonaws.com/history?coinId=bitcoin&from=2024-06-08T05:53:21.616Z&to=2024-08-08T05:53:21.616Z

- coinId (required): bitcoin, ethereum, litecoin
- from (optional): start date
- to (optional): end date
