# Simple Frame Front

Frontend Vue do MVP Simple Frame.

Stack:

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router

## Setup

```powershell
npm install
copy .env.example .env
npm run dev
```

Configure o backend:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Scripts

```powershell
npm run dev
npm run build
npm run preview
```

## Fluxo implementado

- `/register`: cadastro com email/senha.
- `/login`: login.
- `/buildings`: lista e cria prédios.
- `/buildings/:buildingId/model`: cria modulação padrão e gera pórtico.
- `/frames/:frameId/loads`: salva cargas e mostra casos gerados.
- `/frames/:frameId/analysis`: cria job e acompanha SSE.
- `/analysis-jobs/:jobId/results`: mostra resultado retornado pelo backend.

## Componentes

Base UI:

- `AppButton`
- `AppInput`
- `AppNumberInput`
- `AppSelect`
- `AppCheckbox`
- `AppFormField`
- `AppAlert`
- `AppCard`
- `AppPageHeader`
- `AppEmptyState`
- `AppBadge`
- `AppProgressBar`
- `AppTable`

Layout:

- `AuthLayout`
- `AppLayout`

Domínio:

- `BuildingCard`
- `BuildingForm`
- `FrameGeometryForm`
- `LoadForm`
- `FrameViewer2D`
- `AnalysisStatusPanel`

## Backend esperado

O frontend espera o backend em `VITE_API_BASE_URL`.

Rotas usadas:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/buildings`
- `POST /api/buildings`
- `POST /api/buildings/:buildingId/modulations`
- `POST /api/modulations/:modulationId/frames/generate`
- `PUT /api/frames/:frameId/load-cases`
- `POST /api/analysis-jobs`
- `GET /api/analysis-jobs/:jobId/events`
- `GET /api/analysis-jobs/:jobId/results`

## Status atual

Implementado como MVP funcional de interface e fluxo.

Limitações:

- estado do pórtico fica em memória Pinia; recarregar em rotas intermediárias pode exigir voltar para `/buildings`;
- resultados estruturais dependem do backend, que ainda usa placeholder para cálculo real;
- sem testes automatizados de UI ainda.
