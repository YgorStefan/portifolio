#!/bin/bash
# =============================================================
# push.sh — Envia deploy para o servidor Hostinger
#
# Uso:
#   bash push.sh           → atualiza o site
#   bash push.sh --setup   → primeiro deploy (cria .env, symlinks)
#
# Autenticação (escolha uma):
#   1. Chave SSH (recomendado) — rode bash push.sh --add-key uma vez
#   2. Arquivo .env.deploy com SERVER_PASS=suasenha
# =============================================================

SERVER_IP="147.93.14.101"
SERVER_PORT="65002"
SERVER_USER="u697575747"
REMOTE_DIR="~/portfolio"

SETUP_FLAG=""
ADD_KEY=false

for arg in "$@"; do
    case $arg in
        --setup)   SETUP_FLAG="--setup" ;;
        --add-key) ADD_KEY=true ;;
    esac
done

# Carrega senha do .env.deploy se existir
if [ -f ".env.deploy" ]; then
    # shellcheck disable=SC1091
    source .env.deploy
fi

# Modo: instalar chave SSH no servidor
if [ "$ADD_KEY" = true ]; then
    echo "================================================"
    echo " Configurando chave SSH no servidor"
    echo "================================================"

    KEY_FILE="$HOME/.ssh/id_rsa"
    if [ ! -f "$KEY_FILE" ]; then
        echo "🔑 Gerando chave SSH..."
        ssh-keygen -t rsa -b 4096 -f "$KEY_FILE" -N "" -C "deploy-portifolio"
    fi

    echo ""
    echo "📤 Enviando chave pública para o servidor..."
    echo "   (vai pedir a senha uma última vez)"
    echo ""

    ssh-copy-id -i "$KEY_FILE.pub" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_IP" 2>/dev/null || \
    {
        PUB_KEY=$(cat "$KEY_FILE.pub")
        ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_IP" \
            "mkdir -p ~/.ssh && echo '$PUB_KEY' >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
    }

    echo ""
    echo "✅ Chave SSH instalada! Próximos deploys serão sem senha."
    exit 0
fi

echo "================================================"
echo " Deploy → ygorstefan.com"
echo " Servidor: $SERVER_USER@$SERVER_IP:$SERVER_PORT"
echo "================================================"

# Garante que o código local está commitado
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo ""
    echo "⚠  Há mudanças não commitadas."
    echo "   O servidor faz git pull do GitHub — commit e push primeiro."
    echo ""
    read -p "   Continuar mesmo assim? [s/N] " -r RESP
    [[ "$RESP" =~ ^[Ss]$ ]] || exit 1
fi

# Decide como autenticar
if ssh -p "$SERVER_PORT" -o BatchMode=yes -o ConnectTimeout=5 "$SERVER_USER@$SERVER_IP" "exit" 2>/dev/null; then
    # Chave SSH disponível — conecta direto
    SSH_CMD="ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP"
elif [ -n "$SERVER_PASS" ]; then
    # Senha no .env.deploy
    if ! command -v sshpass &>/dev/null; then
        echo ""
        echo "❌ sshpass não encontrado. Instale via Chocolatey:"
        echo "   choco install sshpass"
        echo ""
        echo "   Ou configure chave SSH (recomendado):"
        echo "   bash push.sh --add-key"
        exit 1
    fi
    export SSHPASS="$SERVER_PASS"
    SSH_CMD="sshpass -e ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP"
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo " Nenhuma autenticação configurada."
    echo ""
    echo " Opção 1 (recomendado): configure chave SSH"
    echo "   bash push.sh --add-key"
    echo ""
    echo " Opção 2: crie um arquivo .env.deploy com:"
    echo "   SERVER_PASS=sua_senha_aqui"
    echo "   (já está no .gitignore — não vai para o GitHub)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 1
fi

echo ""
echo "📡 Conectando ao servidor..."

$SSH_CMD "bash $REMOTE_DIR/deploy.sh $SETUP_FLAG"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ Deploy concluído! Acesse: https://ygorstefan.com"
else
    echo ""
    echo "❌ Deploy falhou com código $EXIT_CODE"
    exit $EXIT_CODE
fi
