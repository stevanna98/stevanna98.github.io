# Stefano Vannoni — AI & Neuroscience

Buildless static portfolio. Serve dist/ with a static web server; no build step is required.

- dist/index.html: introduction, research approach, three full-width research
  compositions, selected publications, education timeline, biography, interests,
  CV and contacts.
- dist/projects/: PRONIA, BGT-ESRE and SET-VAE project pages.
- dist/assets/: user-supplied research figures and conference poster, rendered images and original PDFs.
- dist/assets/cinema.png and magic.png: user-supplied personal-interest illustrations,
  served through optimized WebP copies with the original PNGs as fallbacks.
- dist/style.css: shared responsive styling.
- dist/script.js: accessible mobile navigation, reading progress, progressive
  reveals and an original decorative connectome animation. Content remains
  readable without JavaScript; reduced-motion preferences are respected.
- dist/assets/fonts/: locally served Manrope and IBM Plex Mono fonts, with their
  included SIL Open Font License files.
- dist/assets/institutions/: official institution logos used in the education and
  research timeline (Buzzi, UniFi, Politecnico di Milano and Imperial).

The education and research timeline follows the dates supplied by Stefano. The
school's official name was checked on https://tulliobuzzi.edu.it/; the BASIRA Lab
and Islem Rekik's name were checked on https://basira-lab.com/. Institution logos
come from the public headers of their official websites:
https://tulliobuzzi.edu.it/, https://www.unifi.it/, https://www.polimi.it/ and
https://www.imperial.ac.uk/.

The visual redesign uses graphite, warm ivory and blue, with original network
graphics. All pre-existing descriptive paragraphs and scientific project content
were retained. The first biography paragraph introduces the research approach.
Stylesheet and script references include content fingerprints to avoid stale
assets after publication; update these fingerprints in all four HTML pages when
editing the shared assets.

The CV links to the Google Drive URL provided by Stefano. Contact details and professional profiles are user-supplied. Biography and experience are based on the supplied CV; no expected PhD completion date is stated. NeurIPS 2026 acceptance was explicitly confirmed by Stefano.

Publication summaries were checked against the Politecnico di Milano institutional record (https://re.public.polimi.it/handle/11311/1287278) and Springer (https://link.springer.com/chapter/10.1007/978-3-031-73967-5_8). Springer lists online publication in October 2024 and a 2025 citation year; the site identifies the conference as TGI3 2024.

## Pubblicazione su GitHub Pages

Il sito viene pubblicato dalla cartella `dist/` tramite il workflow
`.github/workflows/pages.yml`, a ogni push sul branch `main` oppure avviandolo
manualmente dalla scheda **Actions**. Non serve compilare il sito o aggiungere token.

1. Crea un repository GitHub pubblico. Per usare l'indirizzo principale
   `https://stevanna98.github.io/`, chiamalo `stevanna98.github.io` nell'account
   `stevanna98`. Con un nome come `portfolio`, l'indirizzo sarà invece
   `https://stevanna98.github.io/portfolio/`.
2. Carica l'intero progetto, comprese le cartelle `dist/` e `.github/`, sul branch
   `main`. Non spostare i file fuori da `dist/`.
3. In **Settings → Pages → Build and deployment → Source**, scegli
   **GitHub Actions**.
4. Nella scheda **Actions**, apri **Deploy portfolio to GitHub Pages** e controlla
   che il workflow termini correttamente. Se il primo tentativo è avvenuto prima
   dell'attivazione di Pages, avvialo con **Run workflow** sul branch `main`.
5. L'indirizzo pubblicato compare in **Settings → Pages** e nel deployment.

I collegamenti interni sono relativi, quindi funzionano con entrambi gli indirizzi.
Le pagine contengono attualmente il meta tag `robots` con valore
`noindex,nofollow`: il sito sarà accessibile tramite link, ma chiederà ai motori di
ricerca di non indicizzarlo. Per consentire l'indicizzazione, rimuovi quel meta tag
da `dist/index.html` e dalle tre pagine in `dist/projects/`.

## Anteprima locale

Dalla cartella del progetto:

```sh
python3 -m http.server 8000 --directory dist
```

Apri `http://localhost:8000/` nel browser.
