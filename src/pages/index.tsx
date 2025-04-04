import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

export default function Home() {
  return (
    <Layout
      title="Arkos - The Foundational Layer For Express and Prisma"
      description="Backend framework for simplifying API development with automatic route generation, authentication, and minimal configuration."
    >
      {/* Hero Section */}
      <header className="bg-[#020d1f] text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center">
              <img src="/img/logo.svg" alt="Arkos Logo" className="h-8" />
              <span className="ml-2 text-white font-semibold">ARKOS</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-700 rounded-md">
                v0.1.2
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <Link to="/docs" className="text-white hover:text-blue-300">
                Docs
              </Link>
              <Link to="/showcase" className="text-white hover:text-blue-300">
                Showcase
              </Link>
              <Link to="/blog" className="text-white hover:text-blue-300">
                Blog
              </Link>
              <button className="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-8">
              The Foundational Layer For Express and Prisma
            </h1>
            <p className="text-lg mb-8">
              Backend framework used to{" "}
              <span className="text-blue-400">simplify API development</span> by
              providing automatic route generation, built-in authentication,
              error handling, auto-api docs and file upload optimization.
              Allowing developers to quickly set up a{" "}
              <span className="text-blue-400">secure and scalable</span> server
              with <span className="text-blue-400">minimal configuration</span>.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/docs/get-started"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
              >
                Learn more
              </Link>
              <Link
                to="https://github.com/your-repo/arkos"
                className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-md"
              >
                GitHub
              </Link>
            </div>
          </div>

          {/* Installation Command */}
          <div className="max-w-xl mx-auto mb-16">
            <div className="bg-gray-800 rounded-md px-4 py-2 flex items-center">
              <code className="text-gray-300 flex-grow">
                $ npx create-arkos-api
              </code>
              <button className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Code Example */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-gray-800 rounded-md p-6">
              <pre className="text-gray-300">
                <code>
                  <span className="text-purple-400">import</span> arkos{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-green-400">"arkos"</span>;
                  <br />
                  arkos.<span className="text-yellow-400">init</span>({"{"}{" "}
                  <span className="text-blue-400">port</span>:{" "}
                  <span className="text-orange-400">3000</span> {"}"});
                </code>
              </pre>
            </div>
          </div>

          {/* Creator Section */}
          <div className="flex flex-col items-center justify-center mb-16">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
              <img
                src="/img/creator.jpg"
                alt="Creator"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">UANELA COMO</h3>
            <p className="text-sm text-gray-400">The creator</p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-[#020d1f] text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            What's in Arkos?{" "}
            <span className="text-gray-400 text-xl font-normal">
              API development that provide an automatic route generation
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Automatic API Generation
              </h3>
              <p className="text-gray-400">
                Instantly create RESTful API routes for Prisma models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Built-in Authentication
              </h3>
              <p className="text-gray-400">
                Supports JWT-based authentication with effortless setup.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Express Middlewares
              </h3>
              <p className="text-gray-400">
                Pre-configured security, request parsing, and error handling.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Built-in Data Validation
              </h3>
              <p className="text-gray-400">
                Using class-validator and class-transformer or zod. Just drop a
                create-post.dto.ts or create-user.schema.ts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Prisma Integration</h3>
              <p className="text-gray-400">
                Seamless connection with Prisma ORM for database management with
                relation fields handling.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                File Upload & Optimization
              </h3>
              <p className="text-gray-400">
                Efficient image, video, docs, raw-file handling.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Interceptors Middlewares
              </h3>
              <p className="text-gray-400">
                Tailor as you want, intercept, customize, for example using
                beforeCreateOne, afterSignUp.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Nodemailer Integration
              </h3>
              <p className="text-gray-400">
                Seamless nodemailer integration for sending emails.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                File Upload & Optimization
              </h3>
              <p className="text-gray-400">
                Efficient image, video, docs, raw-file handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engines Section */}
      <section className="bg-[#041633] text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12">Trusted Developers In</h2>

          <div className="flex justify-center space-x-16 mb-16">
            <img
              src="/img/grupo-virgili.png"
              alt="Grupo Virgili"
              className="h-12"
            />
            <img
              src="/img/grupo-mesquita.png"
              alt="Grupo Mesquita"
              className="h-12"
            />
          </div>

          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="bg-gray-800 text-white py-3 px-8 rounded-md text-center font-bold absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              ENGINES
            </div>
            <div className="border border-gray-600 rounded-md p-12 pt-16 flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black bg-opacity-80 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">nodejs - logo</h3>
                  <p className="text-gray-400">and description</p>
                </div>

                <div className="bg-black bg-opacity-80 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">express - logo</h3>
                  <p className="text-gray-400">and description</p>
                </div>

                <div className="bg-black bg-opacity-80 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">prisma - logo</h3>
                  <p className="text-gray-400">and description</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020d1f] text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Arkos Framework. All rights reserved.</p>
        </div>
      </footer>
    </Layout>
  );
}
