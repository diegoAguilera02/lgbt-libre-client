import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Intentar leer el body como texto primero para debugging
    const text = await request.text();
    if (!text) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'El cuerpo de la petición está vacío'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = JSON.parse(text);
    const { nombre, telefono, email } = data;

    // Validación básica
    if (!nombre || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Nombre y email son requeridos'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email inválido'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.GMAIL_USER,
        pass: import.meta.env.GMAIL_APP_PASSWORD,
      },
    });


    // URL Logo
    const logoUrl = import.meta.env.LOGO_R2_URL;

    // Configurar el email
    const mailOptions = {
      from: import.meta.env.GMAIL_USER,
      to: import.meta.env.RECIPIENT_EMAIL,
      subject: '🌈 Nuevo mensaje de contacto - LGBT+ Libre',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #C60278 0%, #45075D 100%); border-radius: 12px 12px 0 0;">
            <img src="${logoUrl || 'https://lgbtlibre.cl/images/lgbtlibre-white-icon.svg'}" alt="LGBT+ Libre Logo" style="width: 60px; height: 70px; margin: 0 auto 15px; display: block;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
            <p style="color: #FCCCE5; margin: 10px 0 0 0;">LGBT+ Libre</p>
          </div>

          <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 12px 12px;">
            <h2 style="color: #C60278; margin-top: 0;">Información del Contacto</h2>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #45075D;">📝 Nombre:</strong>
                </td>
                <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                  ${nombre}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #45075D;">📧 Email:</strong>
                </td>
                <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                  <a href="mailto:${email}" style="color: #C60278; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${telefono ? `
              <tr>
                <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #45075D;">📱 Teléfono:</strong>
                </td>
                <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                  ${telefono}
                </td>
              </tr>
              ` : ''}
            </table>

            <div style="margin-top: 30px; padding: 15px; background-color: #FFF8E6; border-left: 4px solid #E3B35F; border-radius: 4px;">
              <p style="margin: 0; color: #664814; font-size: 14px;">
                <strong>💡 Próximos pasos:</strong><br>
                Responde a esta persona lo antes posible para atender su consulta.
              </p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 5px 0;">Fecha de contacto: ${new Date().toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p style="margin: 15px 0 5px 0; color: #9ca3af;">
                LGBT+ Libre | Trabajando por la igualdad
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error al enviar email:', error);
    // Log detallado para debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
        // En desarrollo, incluir más detalles
        debug: import.meta.env.DEV ? { error: errorMessage, stack: errorStack } : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
