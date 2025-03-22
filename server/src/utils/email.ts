import { Template } from './../../node_modules/@types/ejs/index.d';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface ICreateSenedEmailCommand {
  fromAddress: string;
  toAddresses: string | string[];
  ccAddresses?: string | string[];
  body: string;
  subject: string;
  replyToAddresses?: string | string[];
}
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
});

const createSendEmailCommand = (props: ICreateSenedEmailCommand) => {
  const { fromAddress, toAddresses, ccAddresses = [], body, subject, replyToAddresses = [] } = props;
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  });
};

export const sendVerifyEmail = (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  });

  return sesClient.send(sendEmailCommand);
};

export const sendRegisterVerifyEmail = async (email: string, emailVerifyToken: string) => {
  const templatePath = path.resolve('src/views/emailTemplate.ejs');
  const emailHtml = await ejs.renderFile(templatePath, {
    name: email?.split('@')[0],
    clientUrl: process.env.CLIENT_URL,
    emailVerifyToken: emailVerifyToken
  });
  return sendVerifyEmail(email, 'Account Verification', emailHtml);
};

export const sendForgotPasswordVerifyEmail = async (email: string, forgotPasswordToken: string) => {
  const templatePath = path.resolve('src/views/forgotPasswordTemplate.ejs');
  const templateHtml = await ejs.renderFile(templatePath, {
    name: email?.split('@')[0],
    clientUrl: process.env.CLIENT_URL,
    forgotPasswordToken: forgotPasswordToken
  });
  return sendVerifyEmail(email, 'Change Password', templateHtml);
};

// sendVerifyEmail('trunglvb.hust@gmail.com', 'Tiêu đề email', '<h1>Nội dung email</h1>');
