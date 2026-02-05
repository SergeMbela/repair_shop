# 🚗 AutoExpert - Solution de Gestion de Garage

**AutoExpert** est une plateforme "tout-en-un" moderne conçue pour la gestion d'un atelier mécanique. Elle combine un site vitrine pour la prise de rendez-vous client et une interface d'administration complète (PWA) pour la gestion quotidienne du garage.

## 🌟 Fonctionnalités Clés

### 🏢 Côté Client (Site Vitrine)
*   **Prise de Rendez-vous Intelligente** : Formulaire dynamique avec sélection de véhicule (Marque/Modèle), service et créneau horaire.
*   **Catalogue de Services** : Affichage des forfaits (Entretien, Pneus, Mécanique) avec tarifs dynamiques.
*   **Expérience Utilisateur** : Site entièrement responsive, mode sombre/clair automatique, FAQ interactive.
*   **Installation PWA** : Possibilité d'installer l'application sur mobile pour un accès rapide.

### 🔧 Côté Administration (Back-Office)
*   **Tableau de Bord Planning** :
    *   Vues Liste et Calendrier (FullCalendar).
    *   Filtrage avancé (Statut, Date, Type de client).
    *   Notifications en temps réel (Sonore + Visuelle) lors d'un nouveau RDV.
*   **Gestion des Fiches de Travail** :
    *   Création de fiches liées aux RDV.
    *   Suivi technique (Kilométrage, Contrôle technique, Remarques).
    *   Gestion des statuts de paiement (Acompte, Reste à payer).
*   **Facturation & Communication** :
    *   Génération automatique de **factures PDF**.
    *   Envoi de factures et rappels par **Email** et **SMS** en un clic.
    *   Modèles de messages prédéfinis (Véhicule prêt, Devis, etc.).
*   **Statistiques & Pilotage** :
    *   Graphiques interactifs (Revenus, Taux de conversion, Respect des délais).
    *   Tableau de bord personnalisable par glisser-déposer (Drag & Drop).
*   **Performance & Offline** :
    *   Architecture **PWA** (Progressive Web App).
    *   Mode **Hors-Ligne** (Cache-First) pour consulter les données sans connexion.
    *   Outil de diagnostic réseau intégré.

## 🛠️ Stack Technique

*   **Frontend** : HTML5, JavaScript (Vanilla ES6+), Tailwind CSS (via CDN).
*   **Backend (BaaS)** : [Supabase](https://supabase.com) (PostgreSQL, Auth, Realtime).
*   **Serverless** : Supabase Edge Functions (pour l'envoi d'emails et SMS).
*   **Bibliothèques** :
    *   `Chart.js` (Visualisation de données).
    *   `FullCalendar` (Gestion d'agenda).
    *   `jsPDF` (Génération de PDF).

## 🚀 Installation et Configuration

### 1. Prérequis
*   Un compte Supabase.
*   Node.js (uniquement pour le script de build/déploiement, pas pour l'exécution locale).

### 2. Configuration de la Base de Données (Supabase)
Créez un projet Supabase et exécutez les scripts SQL pour créer les tables suivantes :
*   `appointments` (Rendez-vous)
*   `work_orders` (Fiches de travail)
*   `messages` (Historique des communications)
*   `vehicle_brands` & `vehicle_models` (Base de données véhicules)
*   `service_packages` (Offres et tarifs)

*Note : N'oubliez pas d'activer le **Realtime** sur les tables `appointments` et `work_orders`.*

### 3. Installation Locale
1.  Clonez ce dépôt :
    ```bash
    git clone https://github.com/votre-utilisateur/autoexpert.git
    cd autoexpert
    ```
2.  Créez un fichier `config.js` à la racine du projet avec vos clés API :
    ```javascript
    window.CONFIG = {
        SUPABASE_URL: 'VOTRE_URL_SUPABASE',
        SUPABASE_KEY: 'VOTRE_CLE_PUBLIQUE_ANON'
    };
    ```
3.  Ouvrez `index.html` ou `admin.html` avec un serveur local (ex: Live Server sur VS Code).

### 4. Déploiement (GitHub Pages)
Le projet est configuré pour un déploiement automatique via GitHub Actions.

1.  Allez dans les **Settings** de votre dépôt GitHub -> **Secrets and variables** -> **Actions**.
2.  Ajoutez les secrets de dépôt suivants :
    *   `SUPABASE_URL`
    *   `SUPABASE_KEY`
3.  Poussez vos modifications sur la branche principale (`master` ou `main`).
4.  Le workflow `deploy.yml` va :
    *   Exécuter `build.js`.
    *   Injecter les clés API de manière sécurisée dans les fichiers HTML.
    *   Déployer le dossier `public/` sur la branche `gh-pages`.

## 📱 Utilisation PWA

Pour installer l'application sur votre appareil :
1.  Ouvrez l'interface d'administration (`admin.html`) ou les paramètres (`settings.html`).
2.  Cliquez sur le bouton **"Installer App"** dans le menu ou la section dédiée.
3.  L'application sera accessible depuis votre écran d'accueil et fonctionnera en mode plein écran.

## 📂 Structure du Projet

*   `index.html` : Site vitrine client.
*   `admin.html` : Tableau de bord principal (Planning).
*   `work_orders.html` : Gestion des fiches et facturation.
*   `stats.html` : Statistiques détaillées.
*   `settings.html` : Configuration de l'application.
*   `sw.js` : Service Worker (Cache & PWA).
*   `manifest.json` : Configuration PWA.

---
&copy; 2023 AutoExpert. Tous droits réservés.