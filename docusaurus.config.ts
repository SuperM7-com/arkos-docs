import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { configDotenv } from "dotenv";

configDotenv();

const config: Config = {
  title: "Arkos.js",
  tagline: "The Express And Prisma Framework For RESTful API",
  favicon: "img/favicon.ico",
  url: "https://www.arkosjs.com",
  baseUrl: "/",
  organizationName: "SuperM7.com", // Usually your GitHub org/user name.
  projectName: "Arkos.js", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "pt"],
  },
  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",

          editUrl:
            "https://github.com/supmer7/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },

          editUrl:
            "https://github.com/supmer7/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      logo: {
        alt: "Arkos js Logo",
        src: "img/arkos-js-logo.svg",
        srcDark: "img/arkos-js-logo-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "right",
          label: "Docs",
        },
        { to: "/blog", label: "Blog", position: "right" },
        {
          href: "https://github.com/uanela/arkos",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Docs",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "WhatsApp",
              href: "https://chat.whatsapp.com/EJ8cjb9hxau0EcOnI4fdpD",
            },
            // {
            //   label: "Discord",
            //   href: "https://discordapp.com/invite/docusaurus",
            // },
            // {
            //   label: "X",
            //   href: "https://x.com/docusaurus",
            // },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/uanela/arkos",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SuperM7.com, Lda.`,
    },
    algolia: {
      // The application ID provided by Algolia
      appId: process.env.ALGOLIA_APP_ID,

      // Public API key: it is safe to commit it
      apiKey: process.env.ALGOLIA_SEARCH_API_KEY,

      indexName: "crawler_arkos_docsArkos.js Official Documentation",
      // indexName: "test_dev",

      // Optional: see doc section below
      contextualSearch: true,

      // // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      // externalUrlRegex: "npmjs\\.com|arkosjs\\.com",

      // replaceSearchResultPathname: {
      //   from: "/docs/", // or as RegExp: /\/docs\//
      //   to: "/",
      // },

      // Optional: Algolia search parameters
      // searchParameters: {},

      // // Optional: path for search page that enabled by default (`false` to disable it)
      // searchPagePath: "search",

      // // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      // insights: false,

      //... other Algolia params
    },
    prism: {
      theme: prismThemes.oneDark,
      // darkTheme: prismThemes.oneDark,
    },
    onBrokenLinks: "ignore",
    onBrokenMarkdownLinks: "ignore",
  } satisfies Preset.ThemeConfig,
};

export default config;
