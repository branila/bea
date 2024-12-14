import { sendMail } from './emailService';

async function test() {
    try {
        await sendMail(
            'ABC', // Replace with your test user ID
            'yes.alex.loca@gmail.com' // Replace with the recipient's email
        );
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

test();