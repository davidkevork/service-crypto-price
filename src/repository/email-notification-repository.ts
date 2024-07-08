import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { environment } from '../common/environment';

export class EmailNotificationRepository {
    protected readonly sesClient: SESClient;

    constructor() {
        this.sesClient = new SESClient({ region: 'us-east-1' });
    }

    public async notify(email: string, subject: string, body: string) {
        try {
            const sesArn = environment.sesArn;
            // arn format: arn:aws:ses:region:accountId:identity/email
            const sesEmail = sesArn.split('/').at(1);

            await this.sesClient.send(
                new SendEmailCommand({
                    Destination: {
                        ToAddresses: [email],
                    },
                    Message: {
                        Body: {
                            Text: { Data: body },
                        },

                        Subject: { Data: subject },
                    },
                    Source: sesEmail,
                    SourceArn: sesArn,
                }),
            );
        } catch (error) {
            console.log('Failed to notify by email', { email, subject, body, error });
            throw new Error('Failed to notify by email');
        }
    }
}
