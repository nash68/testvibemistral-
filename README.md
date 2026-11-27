# Chat Mistral — app web minimale

Petite app de chat qui appelle l'API Mistral avec le SDK TypeScript officiel
(`@mistralai/mistralai`), modèle `mistral-small-latest`.

## Installation

```bash
npm install
```

## Configuration

Exportez votre clé API (elle reste uniquement côté serveur, jamais envoyée au navigateur) :

```bash
export MISTRAL_API_KEY="votre-clé-api"
```

## Exécution locale

```bash
npm start        # ou npm run dev pour le rechargement automatique
```

Ouvrez http://localhost:3000

## Structure

- `server.ts` — serveur Express : sert l'interface et expose `POST /api/chat`, seul endroit où la clé est utilisée
- `public/index.html` — interface de chat (vanilla JS, sans build)
