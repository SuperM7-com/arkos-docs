import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function Home() {
  return (
    <div className="tailwind">
      <Layout
        id="tailwind"
        className="tailwind"
        title="Arkos - The Foundational Layer For Express and Prisma"
        description="Backend framework for simplifying API development with automatic route generation, authentication, and minimal configuration."
      >
        {/* Hero Section */}
        <header id="tailwind" className="bg-[#020d1f] text-white tailwind">
          <div className="container mx-auto px-4 py-12">
            {/* Navigation */}
            {/* <nav className="flex items-center justify-between mb-16">
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
          </nav> */}

            {/* Hero Content */}
            <div
              id="tailwind"
              className="max-w-6xl mx-auto text-center md:mb-16 lg:mt-32 md:mt-20 mt-10"
            >
              <div
                id="tailwind"
                className="bg-white  text-zinc-900 py-1 px-4 rounded-full w-fit mx-auto text-center mb-2 text-xs font-bold "
              >
                BETA VERSION
              </div>
              <h1 className="lg:text-7xl md:text-5xl text-3xl font-bold mb-8">
                The Express & Prisma Framework For RESTful API
              </h1>
              <p className="mb-8 text-base md:text-lg">
                Used to simplify the development of a secure and scalable
                RESTful API with minimal configuration, allowing developers to
                focus on what matters.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/docs/getting-started"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-md w-[140px]"
                >
                  Learn more
                </Link>
                <Link
                  to="https://github.com/uanela/arkos"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-md w-[140px] "
                >
                  GitHub
                </Link>
              </div>
            </div>

            {/* Installation Command */}
            {/* <div className="max-w-xl mx-auto mb-16"> */}
            {/* <div className="bg-gray-800 rounded-md px-4 py-2 flex items-center">
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
          </div> */}
          </div>
        </header>

        {/* Features Section */}
        <section
          id="tailwind"
          className="bg-[#020d1f] text-white py-16 tailwind"
        >
          <div className="container mx-auto px-4">
            <h2 className="md:text-3xl text-xl font-bold mb-8">
              What Arkos Do?{" "}
              {/* <span className="text-gray-400 text-xl font-normal">
              API development that provide an automatic route generation
            </span> */}
            </h2>

            <div
              id="tailwind"
              className="tailwind grid grid-cols-1 md:grid-cols-3 gap-6 "
            >
              {/* Feature 1 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Automatic API Generation
                </h3>
                <p className="text-gray-400">
                  Instantly create RESTful API routes for Prisma models.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Built-in Authentication
                </h3>
                <p className="text-gray-400">
                  Supports JWT-based authentication with effortless setup.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Express Middlewares
                </h3>
                <p className="text-gray-400">
                  Pre-configured security, request parsing, and error handling.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Built-in Data Validation
                </h3>
                <p className="text-gray-400">
                  Using class-validator and class-transformer or zod. Just drop
                  a create-post.dto.ts or create-user.schema.ts.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Prisma Integration
                </h3>
                <p className="text-gray-400">
                  Seamless connection with Prisma ORM for database management
                  with relation fields handling.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  File Upload & Optimization
                </h3>
                <p className="text-gray-400">
                  Efficient image, video, docs, raw-file handling.
                </p>
              </div>

              {/* Feature 7 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Interceptors Middlewares
                </h3>
                <p className="text-gray-400">
                  Tailor as you want, intercept, customize, for example using
                  beforeCreateOne, afterSignUp.
                </p>
              </div>

              {/* Feature 8 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Nodemailer Integration
                </h3>
                <p className="text-gray-400">
                  Seamless nodemailer integration for sending emails.
                </p>
              </div>

              {/* Feature 9 */}
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">
                  Swagger API Documentation
                </h3>
                <p className="text-gray-400">
                  Seamless generate an api documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Engines Section */}
        {/* <section className="bg-[#041633] text-white py-16">
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

      {/* Footer *
      <footer className="bg-[#020d1f] text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Arkos Framework. All rights reserved.</p>
        </div>
      </footer> */}
      </Layout>
    </div>
  );
}
