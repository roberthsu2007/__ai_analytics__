<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# AI Meeting Summarizer

This repository is a general Express + Vite fullstack app for meeting summarization.
It is designed to run on a standard Express server and does not require Google AI Studio deployment tooling.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create a `.env` file in the project root and add your environment variables.
3. Set `GEMINI_API_KEY` in `.env` to your Gemini API key.
4. Run the app in development:
   `npm run dev`

## Build for production

1. Build the frontend and backend:
   `npm run build`
2. Start the production server:
   `npm start`

## Environment variables

Create a `.env` file with values like:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```
