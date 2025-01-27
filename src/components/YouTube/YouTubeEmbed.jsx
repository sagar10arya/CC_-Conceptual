const YouTubeEmbed = () => {
  return (
    <section className="bg-gray-200 py-10">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <h2 className="text-gray-700 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed">
          Start your learning journey for free with our YouTube content!
        </h2>
        <div className="w-20 h-1 bg-gray-900 rounded-full my-4"></div>
        <div className="w-full max-w-2xl">
          <div className="relative pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/Vgrok-yUzsY?si=rQHNRPNWcEO1kJD9"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <a
          href="https://youtube.com/@conceptualclasses2624?si=pwMz2mzUeHUbIX7C"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 bg-red-500 text-white text-sm sm:text-base px-8 py-3 rounded-md font-semibold hover:bg-red-800 transition duration-300"
        >
          Subscribe to Our YouTube Channel
        </a>
      </div>
    </section>
  );
};

export default YouTubeEmbed;
