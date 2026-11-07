# Rango's Week UI

Frontend (Angular 17, componentes standalone, PrimeNG, ng2-charts) do projeto Rango's Week. Consome a API FastAPI do repositório `fastAPI-foods` para usuários, autenticação, pratos e registros de refeições.

## Como rodar tudo localmente

### 1. API (repositório `fastAPI-foods/fast_zero`)
```bash
poetry install
cp .env.example .env            # defina JWT_SECRET_KEY
poetry run alembic upgrade head
poetry run task seed            # popula os pratos
poetry run task run             # http://localhost:8000
```
Detalhes (variáveis do `.env`, Python 3.12, testes) no README da API.

### 2. Frontend
```bash
npm install
npx ng serve                    # http://localhost:4200
```
O `ng serve` usa `proxy.conf.json` (registrado em `angular.json` > `serve.options.proxyConfig`): tudo que o app chama em `/api/...` é encaminhado para `http://localhost:8000/...`. **Reinicie o `ng serve` se ele já estava rodando antes dessa configuração**, pois o proxy só é lido na inicialização.

### Fluxo
Cadastro (`/signup`, com nome de usuário, e-mail e senha de pelo menos 8 caracteres) → login → home com os pratos e os registros do dia → adicionar, editar e excluir alimentos → logout. Sem login, as rotas protegidas redirecionam para `/login`.

## Configuração de ambiente
`src/environments/environment.ts` (produção) e `environment.development.ts` (usado no `ng serve`/`ng build --configuration development`) definem `apiUrl`. Ambos usam `/api`. Em produção, sirva a API sob `/api` (proxy reverso) ou troque o valor pela URL pública da API.

## Autenticação
- `AuthService` chama `POST /users` (cadastro) e `POST /auth/token` (login) e guarda o JWT em `localStorage` (`access_token`). `isLoggedIn$` considera a expiração do token.
- `authInterceptor` (`src/app/core/interceptors`) envia `Authorization: Bearer <token>` nas chamadas a `apiUrl`. Em resposta 401 faz logout, mostra um aviso e redireciona para `/login`.
- `AuthGuard` protege as rotas com base no token.

## Dados
- Pratos: `GET /api/recipes` (`CardapioService.getAlimentoOptions`).
- Registros: `GET/POST/PUT/DELETE /api/records` (`CardapioService.getCardapiosByDate`, `saveCardapio`, `deleteCardapio`).
- Perfil: `GET/PUT /api/users/me` (`UserService`).
- Recomendações: calculadas no navegador (`RecommendationService`) sobre os pratos de `/api/recipes`.

### Ainda não usa a API
- Detalhes da marmita (`marmita/:id`): `MarmitaService` ainda lê `json/marmitas-detalhes.json`.
- Meus Registros (`meus-registros`): usa dados de demonstração; a API já oferece `/analytics/me/*`.
- O histórico de avaliações das recomendações fica em memória (perde-se ao recarregar).

## Scripts
```bash
npx ng build --configuration development   # build de desenvolvimento
npx ng build                               # produção (veja a observação abaixo)
npx ng test --watch=false --browsers=ChromeHeadless
```
Observação: o build de produção reporta estouro de *budgets* (bundle inicial e CSS de `home`/`my-records`) que já existia antes da integração com a API.

## Testes
Jasmine/Karma. Há specs para `AuthService`, `authInterceptor`, `AuthGuard`, `CardapioService` e a tela de detalhes da marmita, usando `HttpTestingController`. Se o Chrome não for encontrado, defina `CHROME_BIN`.

## Mock antigo (json-server)
O `json/db.json` continua no repositório como fonte dos pratos usados no seed da API, mas o app não depende mais de `json-server`.
