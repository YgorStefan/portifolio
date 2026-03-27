#!/bin/bash
# =============================================================
# Script de Deploy - Portfólio Ygor Stefan
# Execute este script no servidor via SSH
#
# PRIMEIRO DEPLOY:  bash ~/portfolio/deploy.sh --setup
# ATUALIZAÇÃO:      bash ~/portfolio/deploy.sh
# =============================================================

set -e  # Para o script se qualquer comando falhar

PORTFOLIO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOME_DIR="$(dirname "$PORTFOLIO_DIR")"
cd "$PORTFOLIO_DIR"

SETUP_MODE=false
if [ "$1" == "--setup" ]; then
    SETUP_MODE=true
fi

echo "🚀 Iniciando deploy em: $PORTFOLIO_DIR"
echo "-------------------------------------------"

# 1. Baixar atualizações do GitHub
echo "📥 Baixando atualizações do GitHub..."
git pull origin master

# 2. Instalar/atualizar dependências PHP
echo "📦 Instalando dependências PHP..."
composer install --optimize-autoloader --no-dev --no-interaction

# 3. Criar banco SQLite se não existir
if [ ! -f "database/database.sqlite" ]; then
    echo "🗄️  Criando banco de dados SQLite..."
    touch database/database.sqlite
    echo "   ✓ database/database.sqlite criado"
fi

# 4. Criar o arquivo .env se não existir (apenas no setup)
if [ ! -f ".env" ]; then
    if [ "$SETUP_MODE" = true ]; then
        echo "📝 Copiando .env.example para .env..."
        cp .env.example .env
        echo ""
        echo "⚠️  AÇÃO NECESSÁRIA:"
        echo "   Edite o .env com seus dados reais:"
        echo "   nano $PORTFOLIO_DIR/.env"
        echo ""
        echo "   Variáveis obrigatórias:"
        echo "     APP_URL=https://ygorstefan.com"
        echo "     APP_ENV=production"
        echo "     APP_DEBUG=false"
        echo "     MAIL_USERNAME=seu-login-brevo"
        echo "     MAIL_PASSWORD=sua-api-key-brevo"
        echo "     MAIL_FROM_ADDRESS=contato@ygorstefan.com"
        echo "     MAIL_OWNER_ADDRESS=ygor.stefan@gmail.com"
        echo ""
        read -p "✏️  Pressione ENTER após editar o .env para continuar..." -r
    else
        echo "❌ ERRO: Arquivo .env não encontrado!"
        echo "   Execute o setup completo primeiro:"
        echo "   bash ~/portfolio/deploy.sh --setup"
        exit 1
    fi
fi

# 5. Gerar APP_KEY se estiver em branco
APP_KEY_VAL=$(grep "^APP_KEY=" .env | cut -d '=' -f2)
if [ -z "$APP_KEY_VAL" ]; then
    echo "🔑 Gerando APP_KEY..."
    php artisan key:generate
fi

# 6. Rodar migrations
echo "🗃️  Rodando migrations..."
php artisan migrate --force

# 7. Ajustar permissões
echo "🔒 Ajustando permissões..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# 8. Criar symlink do storage (public/storage → storage/app/public)
echo "🔗 Criando symlink do storage Laravel..."
php artisan storage:link --force 2>/dev/null || true

# 9. Configurar public_html para servir ygorstefan.com sem /public na URL
if [ "$SETUP_MODE" = true ]; then
    echo ""
    echo "🌐 Configurando Document Root: ygorstefan.com → portfolio/public"
    echo "-------------------------------------------"

    PUBLIC_HTML="$HOME_DIR/public_html"
    PORTFOLIO_PUBLIC="$PORTFOLIO_DIR/public"

    if [ -L "$PUBLIC_HTML" ]; then
        echo "   Symlink public_html já existe, recriando..."
        rm "$PUBLIC_HTML"
    elif [ -d "$PUBLIC_HTML" ]; then
        echo "   Fazendo backup de public_html → public_html_backup..."
        mv "$PUBLIC_HTML" "${PUBLIC_HTML}_backup"
    fi

    ln -s "$PORTFOLIO_PUBLIC" "$PUBLIC_HTML"
    echo "   ✓ Symlink criado: public_html → $PORTFOLIO_PUBLIC"
    echo "   ✓ ygorstefan.com agora serve o portfólio sem /public na URL"
fi

# 10. Limpar caches antigos
echo ""
echo "🧹 Limpando caches antigos..."
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true

# 11. Reconstruir caches para produção
echo "⚡ Otimizando para produção..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo ""
echo "-------------------------------------------"
echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse: https://ygorstefan.com"
echo "-------------------------------------------"
