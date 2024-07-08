import 'aws-sdk-client-mock-jest';

import { mockClient } from 'aws-sdk-client-mock';

import { EmailNotificationRepository } from '../../src/repository/email-notification-repository';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { environment } from '../../src/common/environment';

describe('Email Notification Repository', () => {
    let emailNotificationRepository: EmailNotificationRepository;
    const arn = 'arn:aws:ses:us-east-1:111111111111:identity/test@gmail.com';
    let sesMock: any;

    beforeAll(() => {
        sesMock = mockClient(SESClient);

        environment.sesArn = arn;

        emailNotificationRepository = new EmailNotificationRepository();
    });

    test('Notify by email', async () => {
        sesMock.on(SendEmailCommand).resolves({});

        await emailNotificationRepository.notify('test@gmail.com', 'subject', 'body');

        expect(sesMock).toHaveReceivedCommandTimes(SendEmailCommand, 1);
        expect(sesMock).toHaveReceivedCommandWith(SendEmailCommand, {
            Destination: {
                ToAddresses: ['test@gmail.com'],
            },
            Message: {
                Body: {
                    Text: { Data: 'body' },
                },

                Subject: { Data: 'subject' },
            },
            Source: 'test@gmail.com',
            SourceArn: 'arn:aws:ses:us-east-1:111111111111:identity/test@gmail.com',
        });
    });
});
