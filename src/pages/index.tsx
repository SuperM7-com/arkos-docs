import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        {/* Logo Arkos */}
        <img
          src="/img/logo.svg"
          alt="Arkos Logo"
          className="hero-logo"
          style={{ maxHeight: "100px" }}
        />
        <Heading as="h1" className="herotitle">
          Arkos: A Next-Gen Backend Framework
        </Heading>
        <p className="herosubtitle">
          Simplifying API Development with Express.js and Prisma
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/your-repo"
          >
            Contribute
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="Welcome to Arkos"
      description="Arkos is a lightweight backend framework for Express.js and Prisma"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className="feature-code">
          <h2 className="feature-title">Quick Start</h2>
          <pre className="language-ts">
            <code>{`
              // app.ts
              import arkos from 'arkos';
              import express from 'express';

              const app = express();
              arkos.init(app);  // Initialize Arkos with Express

              app.listen(8000, () => {
                console.log("Server is running on port 8000");
              });
            `}</code>
          </pre>
        </section>
      </main>
    </Layout>
  );
}
