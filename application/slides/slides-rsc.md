# React

- knihovna pro vykreslování UI
- UI je funkce stavu
- kompozice komponent
- deklarativní
- úzce zaměčená a čistě front-endová knihovna
- neřeší routing, stav, data, apod.

---

# RSC - React Server Components

- největší změna v Reactu od začátku
- nový mentální model, nové patterny
- dělí komponenty na 2 části
  - **serverovou**
  - **klientskou**
- serverové komponenty mají přístup k celému Node.js ekosystému (databáze, soubory, env, apod.)
- serverové komponenty můžou být asynchronní
- serverové komponenty nemůžou používat React Hooks
- low-level API, určeno především pro vývojáře frameworků
- stabilní verze vydaná v reactu 18 (Q2 2022)
- zatím nejlepší implementace v Next.js

---

# serverové kmponenty závisí na datech, klientké komponenty na stavu

- Serverový kód je typicky bezstavový.
- Hooky jsou stavové, řeší především stav a efekty.

---

![Local Image](/images/thinking-in-server-components.webp)

---

# Kombinování serverových a klientských komponent

- serverové komponenty mohou obsahovat klientské komponenty
- klientské komponenty nemohou obsahovat serverové komponenty jinak než pomocí render props
- props předávané serverovým komponentám musí být serializovatelné (network boundaries)
- aplikace bude hybridní kombinací serverových a klientských komponent

![Local Image](/images/rsc-server-client-render-props.png)

---

![Local Image](/images/component-tree.webp)

---

# Serverové komponenty jsou default

- pokud chci použít klientskou komponentu, musím ji explicitně označit na začátku souboru `'use client'`;

---
class: 'text-xs'
layout: two-cols
---

**app/ClientComponent.tsx**

```jsx
'use client';

export default function ClientComponent({children}) {
  return (
    <>
      {children}
    </>
  );
}
```

::right::
**app/page.tsx**

```jsx
// ✅ This pattern works. You can pass a Server Component
// as a child or prop of a Client Component.
import ClientComponent from "./ClientComponent";
import ServerComponent from "./ServerComponent";

// Pages are Server Components by default
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
}

```

---

- 'use client' nemusí být v každém souboru, slouží jako označení hranice mezi serverovým a klientským kódem;
    <img src="/images/use-client-directive.webp" class="w-110 h-110 rounded shadow" />

---

- Kód serverových komponent rendruje pouze na serveru
- Tyto komponenty nikdy neposílají na klienta zdrojový kód
- Nejsou vhodné pro interaktivní komponenty, např. formuláře, animace, apod.
- Výsledek serverově renderovaných komponent je možné streamovat na klienta
- Serverové komponenty mohou být re-fetched na serveru bez nutnosti znovu renderovat celou stránku
- Klientské komponenty jsou schopné uchovat stav mezi re-fetchingem serverových komponent

---

![Local Image](/images/rsc-render-flow.png)

<!--
-   Modře označené komponenty jsou serverové,
-   zeleně označené komponenty jsou klientské.
-->

---
class: 'text-xs'
---

| | Server Component | Client Component |
| ---------------------------------------------------------------------------- | ---------------- | ---------------- |
| Fetch data. [Learn more.](#) | ✅ | ⚠️ |
| Access backend resources (directly) | ✅ | ❌ |
| Keep sensitive information on the server (access tokens, API keys, etc) | ✅ | ❌ |
| Keep large dependencies on the server / Reduce client-side JavaScript | ✅ | ❌ |
| Add interactivity and event listeners (onClick(), onChange(), etc) | ❌ | ✅ |
| Use State and Lifecycle Effects (useState(), useReducer(), useEffect(), etc) | ❌ | ✅ |
| Use browser-only APIs | ❌ | ✅ |
| Use custom hooks that depend on state, effects, or browser-only APIs | ❌ | ✅ |
| Use React Class components | ❌ | ✅ |

---

# Proč RSC?

- performance
- usnadnění vývoje
- lepší architektura
- větší modularity

---

# RSC x SSR

- SSR je technika, hack který nemá v Reactu své místo.
- Není možné v klasické React komponentě volat serverové API, databázi, apod. Tento kód je od Reactu oddělený (getServerSideProps / getStaticProps).
- SSR není optimální (bundle size, time to interactive, apod.)
- SSR komponenty stále musí posílat na klienta JS, který je potřeba spustit a znovu vykreslit (hydratace).

---

# SSR (next.js implementace)

1) Na úrovni stránky (getServerSideProps / getStaticProps) se načtou data ze serveru.
2) Na serveru se vyrenderuje HTML.
3) HTML se odešle klientovi i s celým JS bundlem + json s počátečním stavem.
4) Na klientu je zobrazena statická neinteraktivní stránka.
4) spustí se JS, který znovu vyrenderuje stránku (hydratace).
5) Stránka je interaktivní.
![Local Image](/images/ssr-chart.png)

---

# RSC

1) Kdekoliv ve stromu se načtou data ze serveru.
2) Na serveru se vyrenderuje HTML. Pokud je komponenta náročná, nejdříve renderuje fallback a výsledek streamuje dodatečně.
3) HTML se odešle klientovi. JS se odešle pouze pro klientské komponenty.
4) Rychlejší hydratace, pouze části komponent.
5) Stránka je interaktivní.
![Local Image](/images/rsc-chart.png)

---

<img src="/images/ssr-chart.webp" />

---

<img src="/images/server-rendering-with-streaming-chart.webp" />

<!--
SSR - kroky jsou sekvenční a blokující - nejdříve je potřeba dokončit jeden pro pokračování
RSC - můžeme renderovat komponenty postupně a streamovat je na klienta. Není třeba čekat na pomalé komponenty.

Zlepšujeme tím Time to first byte (TTFB), First Contentful Paint (FCP) a Time to Interactive (TTI).
-->

---

# RSC a SSR jsou komplementární

- klientské komponenty v next.js jsou předrenderované pomocí SSR
