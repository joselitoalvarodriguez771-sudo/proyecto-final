import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Usa SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Envio para registro
export const enviarCodigoVerificacion = async (emailDestino, codigo) => {
  return await transporter.sendMail({
    from: `"Galería ESFAP" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: 'Código de verificación de correo',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0a192f;">Verificación de Cuenta</h2>
        <p>Tu código de verificación de 6 dígitos es:</p>
        <h1 style="color: #f59e0b; letter-spacing: 5px;">${codigo}</h1>
        <p>Este código expira en 15 minutos.</p>
      </div>
    `
  });
};

// Envio para restablecer contraseña
export const enviarCodigoRecuperacion = async (emailDestino, codigo) => {
  return await transporter.sendMail({
    from: `"Galería ESFAP" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: 'Recuperación de contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0a192f;">Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Usa el siguiente código:</p>
        <h1 style="color: #ef4444; letter-spacing: 5px;">${codigo}</h1>
        <p>Este código expira en 15 minutos.</p>
      </div>
    `
  });
};