import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-gray-400 dark:text-gray-300 p-12 dark:border-y-2 transition-colors duration-300">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:flex lg:justify-between lg:space-x-8 gap-10">
        {/* Column 1 */}
        <div className="text-center lg:text-left lg:flex-1">
          <h2 className="text-4xl text-blue-gray-500 dark:text-blue-300 font-bold mb-4 transition-colors duration-300">
            Conceptual Classes
          </h2>
          <p className="transition-colors duration-300">
            Dehariya, Mukhani, Haldwani
            <br />
            Nainital, Uttarakhand (263139)
          </p>
          <p className="transition-colors duration-300">
            Email -{" "}
            <a
              href="mailto:conceptual.ac.in@gmail.com"
              className="underline hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              conceptual.ac.in@gmail.com
            </a>
          </p>
          <p className="transition-colors duration-300">
            © 2025 <span className="font-semibold">Conceptual Classes</span>:
            All rights reserved.
          </p>
          <div className="flex justify-center lg:justify-start mt-4 space-x-4">
            <p className="transition-colors duration-300">Follow Us Here</p>
            <a
              href="https://www.instagram.com/conceptual_classes_"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a
              href="https://www.youtube.com/@conceptualclasses2624"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <i className="fab fa-youtube text-lg"></i>
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="text-center lg:text-left lg:flex-1">
          <h3 className="font-bold mb-4 text-gray-300 dark:text-gray-200 transition-colors duration-300">
            Pages
          </h3>
          <ul className="space-y-2">
            {[
              { name: "Home", path: "/" },
              { name: "Courses", path: "/courses" },
              { name: "Study Material", path: "/study-material" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className="hover:underline hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 */}
        <div className="text-center lg:text-left lg:flex-1">
          <h3 className="font-bold mb-4 text-gray-300 dark:text-gray-200 transition-colors duration-300">
            Company
          </h3>
          <ul className="space-y-2">
            {[
              { name: "Terms & Conditions", path: "/terms-conditions" },
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Payment Terms", path: "/payment-terms" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className="hover:underline hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200 block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 */}
        <div className="text-center lg:text-left lg:flex-1">
          <h3 className="font-bold mb-4 text-gray-300 dark:text-gray-200 transition-colors duration-300">
            Examination Info{" "}
            <span className="text-sm text-gray-500">(Soon)</span>
          </h3>
          <ul className="space-y-2">
            {["JEE Mains", "JEE Advanced", "NEET", "CUET", "Boards"].map(
              (exam) => (
                <li
                  key={exam}
                  className="text-gray-500 dark:text-gray-400 transition-colors duration-300"
                >
                  {exam}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 border-t border-gray-700 dark:border-gray-600 pt-4 transition-colors duration-300">
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          Conceptual Classes Pvt. Ltd. © 2025 All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;