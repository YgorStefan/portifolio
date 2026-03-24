<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ygor Stefankowski — Desenvolvedor Full Stack</title>
    <meta name="description" content="Portfólio de Ygor Stefankowski da Silva, Desenvolvedor Full Stack.">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-950 text-white antialiased" x-data>
    @include('partials.nav')
    <main>
        @yield('content')
    </main>
    @include('partials.footer')
</body>
</html>
