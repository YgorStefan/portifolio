{{-- resources/views/mail/contact.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; color: #333333; padding: 20px; margin: 0;">

    <h2 style="color: #3b82f6; margin-bottom: 20px;">Nova mensagem do portfólio</h2>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; width: 100px; background: #f9f9f9;">Nome:</td>
            <td style="padding: 8px 12px; background: #f9f9f9;">{{ $formData['name'] }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 12px; font-weight: bold;">E-mail:</td>
            <td style="padding: 8px 12px;">{{ $formData['email'] }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f9f9f9;">Assunto:</td>
            <td style="padding: 8px 12px; background: #f9f9f9;">{{ $formData['subject'] }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Mensagem:</td>
            <td style="padding: 8px 12px;">{!! nl2br(e($formData['message'])) !!}</td>
        </tr>
    </table>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eeeeee;">
    <p style="color: #888888; font-size: 12px; margin: 0;">
        Enviado através do formulário em {{ config('app.url') }}
    </p>

</body>
</html>
