import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="w-full flex flex-wrap flex-col pt-16 items-center justify-center text-center bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
        <div className="pt-10 text-4xl font-bold font-serif text-blue-gray-800 dark:text-gray-100">
          Privacy Policy
        </div>
        <div className="w-36 h-1 border-b-4 border-indigo-400 dark:border-indigo-500 mt-2 rounded-2xl md:mt-4"></div>
      </div>

      <div className="w-full mx-auto p-8 bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
        <p className="mb-4 text-2xl text-center font-semibold text-blue-gray-700 dark:text-gray-300">
          Welcome to Conceptual Classes! This Privacy Policy outlines how we
          collect, use, and protect your personal information when you use our
          website and services.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          1. Information We Collect
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We may collect personal information such as your name, email address,
          phone number, payment details, and any other information you provide
          while using our services.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          2. How We Use Your Information
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We use your information to provide and improve our services,
          communicate with you, process payments, and offer personalized content
          and promotions.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          3. Data Security
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We take appropriate measures to protect your personal information from
          unauthorized access, alteration, or destruction. However, no data
          transmission method is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          4. Sharing Your Information
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We do not share your personal information with third parties except
          when necessary for service providers, compliance with laws, or
          business transfers.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          5. Cookies
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We use cookies to improve user experience and gather anonymous usage
          data. You can control cookie settings through your browser.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          6. Your Rights
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          You have the right to access, correct, or delete your personal data.
          You can also opt-out of marketing communications at any time.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          7. Changes to Privacy Policy
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          We may update this Privacy Policy from time to time. We will post the
          revised policy on this page and update the effective date below.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-blue-gray-600 dark:text-gray-200">
          8. Contact Us
        </h2>
        <p className="mb-4 font-serif text-gray-700 dark:text-gray-400">
          If you have any questions or concerns regarding this Privacy Policy,
          feel free to contact us at{" "}
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

export default PrivacyPolicy;
