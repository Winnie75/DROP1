import {EmailService} from "./email-service";
import {generateHTMLTemplate} from "./email-templates/templates";
import {getCustomers} from "./firebase";


const emailService = new EmailService(
    process.env.NEXT_PUBLIC_RESHRD_EMAIL!,
    process.env.NEXT_PUBLIC_RESHRD_EMAIL_PASSWORD!
);

export const sendInvitationEmail = async (email: string) => {

    const emailConfig = {
        from: process.env.NEXT_PUBLIC_RESHRD_EMAIL!,
        to: email,
        subject: 'Get access to your updateable QR Clothing | RESHRD\n',
        html: generateHTMLTemplate.newUser(email),
        attachments: [{
            filename: 'logo.png',
            path: `${process.cwd()}/public/logo.png`,
            cid: 'logo'
        }]
    };

    await emailService.send(emailConfig);
    console.log('email sent to ', email);
}



export const sendEmailToOldCustomer = async (email: string) => {

        const emailConfig = {
            from: process.env.NEXT_PUBLIC_RESHRD_EMAIL!,
            to: email,
            subject: 'New item has joined the party | RESHRD',
            html: generateHTMLTemplate.alreadyUser()
        };

        await emailService.send(emailConfig);
        console.log('email sent to ', email);
}

export const sendRegistrationEmail = async (email: string) => {

        const customers = await getCustomers();
        const isUser = customers.find(customer => customer.email === email);

        const emailConfig = {
            from: process.env.NEXT_PUBLIC_RESHRD_EMAIL!,
            to: email,
            subject: 'Thanks for registering! | RESHRD',
            html: isUser ? generateHTMLTemplate.registrationUser() : generateHTMLTemplate.registrationNotUser()
        };

        await emailService.send(emailConfig);
        console.log('email sent to ', email);
}