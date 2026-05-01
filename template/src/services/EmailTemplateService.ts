export class EmailTemplateService {
  static signature = `<p>The <a href="${process.env.CLIENT_APP_URL}">Moviz App</a> Team</p>`

  static mailStyles = `<style>
                body {
                  background-color: #ffffff;
                }
                .container {
                  max-width: 640px;
                  margin: 0 auto;
                  padding: 0;
                  border: 2px solid #ff6b35;
                  background-color: #ffffff;
                }
                header h1 {
                  font-size: 20px;
                  margin: 0;
                  padding: 16px;
                  background-color: #ff6b35;
                  color: #071013;
                }
                .space {
                  padding: 16px;
                  background-color: #ffffff;
                }
                .content {
                  background-color: #ffffff;
                  color: #242424;
                  padding-bottom: 16px;
                }
                .data {
                  padding-top: 16px;
                  border-top: 2px solid #ff6b35;
                  background-color: #ffffff;
                  color: #071013;
                  padding-bottom: 16px;
                }
                .signature {
                  background-color: #ffffff;
                  color: #242424;
                  padding-bottom: 16px;
                }
              </style>`

  static accountValidationMail(username: string, validationLink: string) {
    return `<!doctype html>
            <html lang="en">
            <head>
              <title>Email Verification</title>
              ${this.mailStyles}
            </head>
            <body>
              <div class="container">
                <header>
                  <h1>Hello and welcome ${username},</h1>
                </header>

                <div class="space">
                  <div class="content">
                    <p>An account has been created using this email address. If you did not create this account, ignore this email.</p>
                  </div>
                  <div class="data">
                    <p>To activate your account, please verify your email by clicking the following link: <a href="${validationLink}">Activate my account!</a></p>
                  </div>
                  <div class="signature">
                    ${this.signature}
                  </div>
                </div>
              </div>
            </body>
            </html>
            `
  }

  static resetPasswordMail(username: string, resetPasswordLink: string) {
    return `<!doctype html>
            <html lang="en">
            <head>
              <title>Reset your password</title>
              ${this.mailStyles}
            </head>
            <body>
              <div class="container">
                <header>
                  <h1>Hello and welcome ${username},</h1>
                </header>

                <div class="space">
                  <div class="content">
                    <p>A request to change your password has been created using this email address. If you did not create this request, ignore this email.</p>
                  </div>
                  <div class="data">
                    <p>To reset your password, please click on the following link: <a href="${resetPasswordLink}">Reset my password!</a></p>
                  </div>
                  <div class="signature">
                    ${this.signature}
                  </div>
                </div>
              </div>
            </body>
            </html>
            `
  }
}
