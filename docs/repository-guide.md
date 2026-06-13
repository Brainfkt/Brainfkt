# Guide du depot

Ce depot alimente deux surfaces publiques :

- le README de profil GitHub de `Brainfkt` ;
- le site portfolio statique disponible sur `https://github.human---think.ing/`.

Il contient aussi les scripts qui mettent a jour automatiquement les cartes SVG affichees dans le README.

## Ce que vous pouvez trouver ici

| Chemin | Description |
| --- | --- |
| `README.md` | README de profil GitHub. Il affiche les cartes SVG dynamiques et des liens vers le CV et le site. |
| `dark_mode.svg` / `light_mode.svg` | Cartes de profil affichees selon le theme GitHub clair ou sombre. |
| `today.py` | Script Python qui recupere les statistiques GitHub et reecrit les SVG. |
| `.github/workflows/build.yaml` | Workflow GitHub Actions qui regenere les SVG automatiquement. |
| `index.html` | Page principale du site portfolio. |
| `styles.css` | Feuille de style du site portfolio. |
| `script.js` | Interactions front-end du site. |
| `assets/` | Logos, images et visuels utilises par le site. |
| `cv-enzo-de-matos.pdf` | CV public. |
| `CNAME` | Domaine personnalise GitHub Pages. |
| `LICENSE` | Conditions de reutilisation du code et des contenus. |

## README de profil

Le `README.md` est concu pour le profil GitHub. Il reste volontairement court afin que la premiere chose visible soit la carte SVG du profil.

Il utilise une balise `<picture>` :

- `dark_mode.svg` est affiche si GitHub est en theme sombre ;
- `light_mode.svg` est affiche si GitHub est en theme clair.

Les deux SVG sont des fichiers versionnes dans le depot. Ils sont charges via `raw.githubusercontent.com`, ce qui permet au README GitHub de les afficher directement.

Le README contient aussi des liens vers :

- le CV en version web ;
- le CV en telechargement direct ;
- le site portfolio ;
- ce guide du depot.

## Mise a jour automatique des SVG

Le script `today.py` met a jour les donnees affichees dans `dark_mode.svg` et `light_mode.svg`.

Il calcule notamment :

- l'age ;
- le nombre de commits ;
- les etoiles ;
- les repositories ;
- les contributions ;
- les followers ;
- les lignes de code ;
- la barre des langages principaux.

La barre des langages affiche les 6 premiers langages puis regroupe les langages restants dans `Other`.

Le script utilise l'API GitHub GraphQL avec deux variables d'environnement :

```text
ACCESS_TOKEN
USER_NAME
```

Si l'appel API des langages echoue, le script conserve l'ancienne barre presente dans les SVG au lieu de l'effacer.

## Automatisation GitHub Actions

Le workflow `.github/workflows/build.yaml` execute la generation automatiquement.

Il se lance :

- a chaque push sur `main` ;
- tous les jours a `04:00 UTC` ;
- manuellement avec `workflow_dispatch`.

Le workflow :

1. clone le depot ;
2. installe Python ;
3. installe les dependances depuis `cache/requirements.txt` ;
4. execute `python today.py` ;
5. commit les fichiers modifies ;
6. push les changements vers `main`.

Le secret GitHub Actions `ACCESS_TOKEN` doit exister pour que le script puisse interroger l'API GitHub.

## Site portfolio

Le site est un site statique en HTML, CSS et JavaScript. Il ne depend pas d'un framework et ne necessite pas de build.

Fichiers principaux :

- `index.html` contient la structure ;
- `styles.css` contient le design responsive ;
- `script.js` contient les interactions ;
- `assets/` contient les logos et images ;
- `cv-enzo-de-matos.pdf` est servi comme document public.

Pour le lancer localement :

```bash
python3 -m http.server 8000
```

Puis ouvrir :

```text
http://127.0.0.1:8000/
```

## Deploiement

Le site est deploye avec GitHub Pages.

Configuration attendue :

- source : `Deploy from a branch` ;
- branche : `main` ;
- dossier : `/` ;
- domaine personnalise : `github.human---think.ing` ;
- HTTPS force : active.

Le fichier `CNAME` doit rester a la racine du depot avec ce contenu :

```text
github.human---think.ing
```

Configuration DNS recommandee :

```text
Type: CNAME
Name: github
Target: brainfkt.github.io
```

Une fois deploye, le site est disponible ici :

```text
https://github.human---think.ing/
```

Le CV est disponible ici :

```text
https://github.human---think.ing/cv-enzo-de-matos.pdf
```

## Reutilisation et licence

Le code source est publie sous licence MIT. Cela permet de consulter, reutiliser, modifier et redistribuer le code, sous reserve de conserver la notice de licence.

Le contenu personnel n'est pas inclus dans cette autorisation. Cela concerne notamment :

- le CV ;
- les textes personnels ;
- les donnees de profil ;
- le design de presentation personnelle ;
- les SVG generes du profil ;
- les images, logos, marques et visuels non crees comme code source reutilisable.

Ces contenus restent proteges et ne peuvent pas etre repris comme base d'un autre portfolio sans autorisation explicite.

Voir le fichier `LICENSE` pour le detail.

## Contributions

Ce depot est principalement un portfolio personnel. Les issues ou pull requests peuvent etre utiles pour signaler :

- un lien casse ;
- une faute ;
- un probleme d'affichage ;
- un bug dans le script de generation.

Les modifications du contenu personnel, du CV, du branding ou des donnees de profil ne sont pas destinees a etre reutilisees pour d'autres projets.

