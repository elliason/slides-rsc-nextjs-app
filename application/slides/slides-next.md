# Next JS

- react based meta framework
- SSR, SSG, ISR
- file based routing
- ...

---

![Local Image](/images/next-usage.png)

---

# Jak Next funguje (starý způsob & SSR)

- file system based routing **/pages**

1) getServersideProps - server api
2) server renderování react komponent
3) hydratace - spuštění JS na klientovi, znovu vyrenderování komponenty s daty z getServerSideProps
4) interaktivní stránka
5) client side routing (SPA)

<!--
getServersideProps - jediné místo kde můžeme volat serverové API, databázi, apod.
-->
---

# Nový app router

- file system based routing **/app**

1) RSC renderování + SSR klientských komponent
2) klientské renderování + hydratace klientských komponent
3) interaktivní stránka
4) streamování RSC komponent (?)
5) `server centric routing & client side navigation (SPA)`

<!--
- Volání serverového API není omezené per route, ale můžeme volat kdykoliv v komponentě
- optimalizace streamování RSC
- výsledky navigace mezi routami jsou cachované v paměti (in memory cache)

SERVER CENTRIC ROUTING - klient nemusí stahovat mapu rout a požadavek na serverové komponenty lze použít k vyhledání rout
-->

---

![Local Image](/images/next-flow.png)

---

# Kombinace /pages a /app

- je možné kombinovat oba přístupy
- pro starší projekty je možné postupně přecházet na nový způsob

<!--
Je potřeba dát si pozor na konflikty v routování
-->

---

# /app složky & segmenty

- místo souborů se pro definici segmentů používají složky
- složka reprezentuje segment v URL
- všechny soubory v této složce jsou součástí segmentu
- složky mohou být vnořené

![Local Image](/images/route-segments-to-path-segments.webp)

---

# segmentové soubory

- pro každý segment může být definováno několik souborů
- všechny soubory jsou server komponenty by default, lze je ale změnit na klientské
- **page.js** - UI komponenta
- **route.js** - API endpoint (POST, GET, PUT, DELETE, OPTIONS ...)
- **layout.js** - obaluje page komponentu **a všechny child segmenty**. Uchovává stav a nepřekresluje se při klientské navigaci mezi segmenty.
- **template.js** - obdoba layout komponenty která při klientské navigaci vždy vytváří novou instanci = neuchovává stav
- **loading.js** - loading fallback pro daný segment
- **error.js** - error fallback pro daný segment
- **global-error.js** - error fallback pro root layout komponentu
- **not-found.js** - 404 fallback pro daný segment

<!--
page.js nebo route.js - segment se stává dostupný. Jeden z nich musí být vždy definován

template.js / layout.js - doporučeno je používat layout.js, pkud není specifický důvod pro použití template.js 

loading.js - obalí page komponentu v React Suspense boundary, komponenty se streamují ve chvíli kdy jsou na serveru vyrenderované

error.js - obalí page komponentu v React Error boundary, zobrazí se pokud zachytí vyjímku v page komponentě
-->

---

# Hierarchie souborů
![Local Image](/images/file-conventions-component-hierarchy.webp)

---

# Vnořené segmenty

- ve vnořených segmentech se komponenty vloží do rodičovského segmentu

![Local Image](/images/nested-file-conventions-component-hierarchy.webp)

<!--
rodičovská layout komponenta obaluje i child segmenty
-->

---

<img src="/images/partial-rendering.webp" />

<!--
- při navigaci mezi sousedícími segmenty se při klientské navigaci překresluje pouze layout a page komponenty změněného segmentu

- nepřekreslí se rodičovské layouty
-->

---
layout: two-cols
---

# route seskupování

- pokud složu uvedeme v závorkách, tak se vytvoří route seskupení.
- route seskupení **neovlivňuje** URL segmenty
- umožňuje sdílet layouty pro všechny segmenty v seskupení

::right::
<img src="/images/route-group-opt-in-layouts.webp"  />

---

# Root layout

- aplikace musí mít definovaný alespoň root layout
- obsahuje:

```
<html>
<head></head>
<body></body>
</html>
```

<!--
pomocí seskupení můžeme vytvořit vícero root layoutů
-->

---

# Další soubory

## Ikony statické

- favicon.ico,
- icon.(ico|jpg|jpeg|png|svg)
- apple-icon.(jpg|jpeg|png|svg)

## Ikony generované
JS soubory které exportují funkci vracející `Blob | ArrayBuffer | TypedArray | DataView | ReadableStream | Response`

- icon.(js|ts|tsx)
- apple-icon.(js|ts|tsx)

---

## open graph statické soubory

- opengraph-image.(jpg|jpeg|png|gif)
- twitter-image.(jpg|jpeg|png|gif)

## open graph generované soubory
JS soubory které exportují funkci vracející `Blob | ArrayBuffer | TypedArray | DataView | ReadableStream | Response`

- opengraph-image.(js|ts|tsx)
- twitter-image.(js|ts|tsx)

---

## robots.txt

- robots.txt - statický soubor
- robots.(js|ts) - generovaný soubor vracející Robots Object

<img src="/images/robots.png" />

<!--
typescript pro zajištění správné syntaxe
-->

---

## sitemap.xml

- sitemap.xml - statický soubor
- sitemap.(js|ts) - generovaný soubor vracející Sitemap Object

---

# Head metadata

- metadata API
- export objektu nebo funkce `generateMetadata` v layoutu nebo page komponentě

![Local Image](/images/metadata.png)

---

# /route.js

- definuje API endpoint
- nahrazuje starý `api/[...slug].js` soubor
- custom HTTP handlery
GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS

```js
export async function GET(request: Request) { }

export async function HEAD(request: Request) { }

export async function POST(request: Request) { }

export async function PUT(request: Request) { }

export async function DELETE(request: Request) { }

export async function PATCH(request: Request) { }

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) { }
```

<!--
route.js je nejvíc low level soubor, který můžeme použít
-->

---

# Loading & Suspense

- loading fallback na úrovni celého segmentu
- granulární loading fallback na úrovni jednotlivých komponent
- fallback ui je typicky staticky předgegenerované a zobrazí se instantně po navigaci
- funguje obalením komponenty v React Suspense boundary a poté streamováním komponenty ze serveru

---

## Loading fallback pro page komponentu

- vzniká přidáním loading.js souboru do složky segmentu
![Local Image](/images/loading-folder.webp)

---

- loading.js je vnořený do layout.js a obaluje page.js
![Local Image](/images/loading-diagram.webp)

---

## Loading fallback pro jednotlivé komponenty

- obalení asynchroní serverové komponenty v React Suspense boundary
- Selective Hydration - react prioritizuje které komponenty se dříve hydratují (dle user interakce)

```js
import { Suspense } from "react";
import { PostFeed, Weather } from "./Components";

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  );
}
```

<!--
Suspendované komponenty jsou streamované ze serveru
-->

---

# Data fetching

- doporučený postup je data stahovat na serveru, paralelně.
- doporučuje se stahovat data v místě kde jsou použita. Next.js GET requesty optimalizuje a de-duplikuje.
- na serveru cache trvá po dobu requestu a renderování
- na klientu cache trvá po dobu session

<!--
post requesty nejsou cachovány
-->
---

![Local Image](/images/deduplicated-fetch-requests.webp)

---

## Statické a dynamické stahování

- requesty jsou by default statické (data se stáhnou při build timu, uloží do cache a jsou servírovana z cache)

```js
fetch('https://...'); // cache: 'force-cache' is the default
```

- request je možné označit jako "dynamický" a stahovat nová data na každý request bez cachování

```js
fetch('https://...', { cache: 'no-store' });
```

- next.js rozšiřuje options objekt `fetch` funkce o nastavení cache.

```js
fetch('https://...', { next: { revalidate: 10 } });
```

- fetch options se dají nastavit per request nebo per layout/page

```js
// layout.js|page.js

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export function generateStaticParams(...)
```

---

```js
// app/artist/[username]/page.jsx
import Albums from './albums';

async function getArtist(username) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}

async function getArtistAlbums(username) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}


export default async function Page({ params: { username } }) {
  // Initiate both requests in parallel
  const artistData = getArtist(username);
  const albumsData = getArtistAlbums(username);

  // Wait for the promises to resolve
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  );
}
```

---

# Použití s Apollo Clientem

- Apollo klient je založený na fetch API, je možné pro něj použít stejné nastavení cache
- Pro RSC vždy používáme pro requesty novou instanci klienta
- pro RSC není možné použít context API a tedy ani ApolloProvider

---

```js
//utils/apollo.ts
export const getApolloCMSClient = () => {
    const client = new ApolloClient({
        headers: {
            authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
        },
    });

    return client;
};
// app/images/[category].jsx
export async function imageCategoriesLoader() {
    const client = getApolloCMSClient();
    const { data } = await client.query<ImageCategories>({
        query: imageCategoriesQuery,
        context: {
            fetchOptions: {
                next: { revalidate: 60 },
            },
        },
    });

    return data;
}
```
