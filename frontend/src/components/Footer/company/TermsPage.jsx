import React from "react";

const TermsPage = () => {
  return (
    <>
      <div className="w-full flex flex-wrap flex-col pt-16 items-center justify-center text-center bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
        <div className="pt-10 text-4xl font-bold font-serif text-blue-gray-800 dark:text-gray-100">
          Terms & Conditions
        </div>
        <div className="w-36 h-1 border-b-4 border-indigo-400 dark:border-indigo-500 mt-2 rounded-2xl md:mt-4"></div>
      </div>

      <div className="w-full mx-auto p-8 bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
        <p className="mb-4 text-2xl text-center font-semibold text-blue-gray-700 dark:text-gray-300">
          Welcome to Conceptual Classes! By using our website and services, you
          agree to the following terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          1. Acceptance of Terms
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          By accessing or using Conceptual Classes, you agree to comply with and
          be bound by these terms and conditions, as well as our Privacy Policy.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          2. User Responsibilities
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          As a user, you are responsible for maintaining the confidentiality of
          your account details. You agree not to use the website for any
          unlawful purpose.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          3. Content Usage
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          You acknowledge that all content on Conceptual Classes is the property
          of Conceptual Classes and is protected by copyright laws.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          4. Termination
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We reserve the right to terminate or suspend your access to the
          website if we believe you have violated these terms.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          5. Limitation of Liability
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          Conceptual Classes will not be held liable for any direct or indirect
          damages that may occur from the use of the website or services.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          6. Changes to Terms
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We may update these terms from time to time. When we do, we will post
          the revised terms on this page and update the effective date at the
          bottom.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          7. Contact Us
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          If you have any questions about these terms, please feel free to
          contact us at{" "}
          <a
            href="mailto:conceptual.ac.in@gmail.com"
            className="underline text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            conceptual.ac.in@gmail.com
          </a>
          .
        </p>

        <footer className="text-center mt-8 text-gray-700 dark:text-gray-400">
          <p>© 2025 Conceptual Classes. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default TermsPage;