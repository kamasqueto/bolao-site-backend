const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendResetPasswordEmail = async (to, name, link) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email: to, name }],
    sender: { email: 'bolão2025@bolaosirio.com', name: 'Bolão 2025' },
    subject: 'Redefinição de Senha',
    htmlContent: `<p>Olá ${name},</p>
                  <p>Você solicitou uma redefinição de senha. Clique no link abaixo para continuar:</p>
                  <a href="${link}">${link}</a>
                  <p>Se não foi você, apenas ignore este e-mail.</p>`,
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendResetPasswordEmail };
