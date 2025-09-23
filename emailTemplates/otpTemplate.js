exports.otpTemplate = ( otp) => {
  return ` <!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>OTP from Portfolio</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;background:#f4f6fb;margin:0;padding:20px}
      .card{max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
      .logo{font-weight:700;color:#111;margin-bottom:8px}
      .lead{color:#555;margin-bottom:18px}
      .otp{display:inline-block;font-size:28px;letter-spacing:6px;padding:12px 20px;border-radius:6px;background:#f0f2f6;border:1px solid #e6e9ef}
      .foot{color:#777;font-size:13px;margin-top:18px}
    </style>
  </head>
  <body>
    <div class="card">
      <div class="logo">Ritesh mishra's Portfolio</div>
      <div class="lead">Aapka OTP neeche hai. Yeh OTP kisi ke saath share mat karein.</div>

      <div style="text-align:center;margin:18px 0">
        <span class="otp">${otp}</span>
      </div>

      <div class="foot">OTP valid: 10 minutes.<br/>Agar aapne request nahi kiya, to ignore kar dein.</div>
    </div>
  </body>
</html>`;
};
