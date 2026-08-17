# GeoRush — vrai GeoGuessr avec Google Street View

## Installation
1. Installe Node.js 18+.
2. Dans ce dossier :
   npm install
3. Copie `.env.example` vers `.env`.
4. Mets ta clé Google Maps :
   VITE_GOOGLE_MAPS_API_KEY=TA_CLE
5. Lance :
   npm run dev

## APIs Google à activer
Dans Google Cloud Console, active au minimum :
- Maps JavaScript API
- Street View Static API n'est PAS nécessaire pour cette version.
- Places API n'est pas nécessaire.

Restreins la clé par HTTP referrer quand tu déploies le site.

## Ce qui est déjà inclus
- Interface mobile sombre inspirée de tes captures
- Accueil / continents
- Profil localStorage
- Classement local
- Vrai mode GeoGuess
- Google Street View
- Mini-carte Google
- placement du guess
- distance en km
- score sur 5000
- 5 manches
- score cumulé

Le stockage et le classement sont encore locaux. Pour un vrai classement mondial et le Duel 1v1, il faudra ajouter un backend.
