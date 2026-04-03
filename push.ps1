param(
    [switch]$Setup,
    [switch]$AddKey
)

$SERVER_IP   = "147.93.14.101"
$SERVER_PORT = "65002"
$SERVER_USER = "u697575747"
$REMOTE_DIR  = "~/portfolio"
$KEY_FILE    = "$env:USERPROFILE\.ssh\id_rsa"

if ($Setup) { $SetupFlag = "--setup" } else { $SetupFlag = "" }

if ($AddKey) {
    Write-Host "Configurando chave SSH no servidor..."

    if (-not (Test-Path $KEY_FILE)) {
        Write-Host "Gerando chave SSH (pressione Enter duas vezes para sem senha)..."
        ssh-keygen -t rsa -b 4096 -f "$KEY_FILE" -C "deploy-portifolio"
    }

    if (-not (Test-Path "$KEY_FILE.pub")) {
        Write-Host "ERRO: Chave nao foi criada. Rode: ssh-keygen -t rsa -f $KEY_FILE"
        exit 1
    }

    $pubKey = Get-Content "$KEY_FILE.pub"
    Write-Host "Instalando chave no servidor (vai pedir a senha uma vez)..."

    $remoteCmd = "mkdir -p ~/.ssh && echo '$pubKey' >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
    ssh -p $SERVER_PORT "${SERVER_USER}@${SERVER_IP}" $remoteCmd

    Write-Host "Pronto! Proximos deploys serao sem senha."
    exit 0
}

Write-Host "Deploy -> ygorstefan.com ($SERVER_USER@${SERVER_IP}:$SERVER_PORT)"

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "AVISO: Ha mudancas nao commitadas. O servidor faz git pull do GitHub."
    $resp = Read-Host "Continuar mesmo assim? [s/N]"
    if ($resp -notmatch "^[sS]$") { exit 1 }
}

Write-Host "Conectando ao servidor..."
ssh -p $SERVER_PORT "${SERVER_USER}@${SERVER_IP}" "bash $REMOTE_DIR/deploy.sh $SetupFlag"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy concluido! Acesse: https://ygorstefan.com"
} else {
    Write-Host "Deploy falhou com codigo $LASTEXITCODE"
    exit $LASTEXITCODE
}
