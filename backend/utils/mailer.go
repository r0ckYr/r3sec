package utils

import (
	"fmt"
	"os"

	"github.com/resend/resend-go/v2"
)

func SendVerificationEmail(to string, token string) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	from := os.Getenv("EMAIL_FROM") // e.g., Whatrobe <no-reply@whatrobe.com>
	client := resend.NewClient(apiKey)

	verificationLink := fmt.Sprintf("https://r3sec.xyz/auth/verify-email?token=%s", token)

    html := fmt.Sprintf(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; border: 1px solid #27272a; border-radius: 12px; padding: 40px 30px;">
  <h1 style="font-size: 40px; font-weight: bold; color: #ffffff; letter-spacing: -1px; text-align: center;">
    <span style="color: #ffffff;">R3</span><span style="color: #22c55e;">SEC</span>
  </h1>

  <h2 style="color: #ffffff; font-size: 24px; margin-top: 32px; margin-bottom: 20px;">Verify Your Email Address</h2>

  <p style="font-size: 16px; color: #e4e4e7; margin-bottom: 24px;">
    Thank you for signing up for <strong style="color: #22c55e;">R3SEC</strong>. To complete your registration and start submitting Solana smart contracts for audit, please verify your email by clicking the button below.
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="%s" style="display: inline-block; background-color: #22c55e; color: #0f0f0f; padding: 14px 26px; font-size: 16px; font-weight: bold; border-radius: 8px; text-decoration: none;">
      Verify My Email
    </a>
  </div>

  <p style="font-size: 14px; color: #a1a1aa; margin-top: 16px;">
    If the button above does not work, copy and paste this link into your browser:
  </p>

  <div style="background-color: #18181b; padding: 10px; border: 1px dashed #3f3f46; word-break: break-all; font-size: 13px; color: #e4e4e7; border-radius: 6px; margin-top: 10px;">
    %s
  </div>

  <p style="font-size: 13px; color: #71717a; margin-top: 32px;">
    This email verification is required to confirm your identity and secure your account. If you did not request this, please ignore it.
  </p>

  <hr style="margin: 40px 0; border: none; border-top: 1px solid #27272a;" />

  <p style="font-size: 12px; color: #52525b; text-align: center;">
    &copy; 2025 R3SEC. All rights reserved.<br/>
    Need help? Contact us at <a href="mailto:support@r3sec.com" style="color: #22c55e;">support@r3sec.com</a>
  </p>
</div>
`, verificationLink, verificationLink)
	params := &resend.SendEmailRequest{
		From:    from,
		To:      []string{to},
		Html:    html,
		Subject: "Verify your Whatrobe email",
	}

	sent, err := client.Emails.Send(params)
	if err != nil {
		fmt.Println("❌ Email send error:", err.Error())
		return err
	}

	fmt.Println("✅ Email sent. ID:", sent.Id)
	return nil
}

