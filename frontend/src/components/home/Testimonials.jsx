import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      name: "Shashi Raj",
      role: "Student @IIT Patna",
      avatar: "👨🏽‍💻",
      quote:
        "This app helped me realize what I was bottling up. The insights are scarily accurate, and I've become much more aware of my emotional patterns.",
      rating: 5,
    },
    {
      name: "Chetan Sharma",
      role: "Intern @Amazon",
      avatar: "👩🏽‍🦱",
      quote:
        "I was struggling with depression during my intern season. This app helped me to get out of it.",
      rating: 5,
    },
    {
      name: "Bishwamohan Jena",
      role: "Software Engineer @Google",
      avatar: "👨🏻‍🎓",
      quote:
        "I was skeptical at first, but the AI insights have helped me recognize stress triggers I never noticed before. Life-changing tool for self-awareness.",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  const nextTestimonial = () => {
    setDirection(1);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const renderStars = (rating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < rating ? "★" : "☆"}
        </span>
      ));

  return (
    <motion.section
      className="pb-12 sm:py-20 px-4 sm:px-8 relative overflow-hidden mt-8 z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Content */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div className="mb-8 sm:mb-12" variants={itemVariants}>
          <div className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full text-sm font-medium mb-4">
            TESTIMONIALS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 px-2">
            What Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-400 dark:to-sky-300">
              Users
            </span>{" "}
            Say
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Join thousands of people who have transformed their self-awareness through journaling
          </p>
        </motion.div>

        <motion.div className="max-w-4xl mx-auto relative" variants={itemVariants}>
          {/* Increased height for mobile and made it responsive */}
          <div className="relative min-h-[300px] sm:h-80 lg:h-72 mb-6 sm:mb-8 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full h-full flex items-start"
              >
                <div className="bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-white/50 dark:border-gray-700/50 w-full h-full flex flex-col justify-center">
                  <div className="flex flex-col items-center h-full justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 shadow-lg flex-shrink-0">
                      {testimonials[activeIndex].avatar}
                    </div>
                    <div className="text-yellow-400 mb-3 sm:mb-4 flex-shrink-0">
                      {renderStars(testimonials[activeIndex].rating)}
                    </div>
                    {/* Improved text sizing and spacing for mobile */}
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-200 italic mb-4 sm:mb-6 max-w-2xl leading-relaxed px-2 flex-grow flex items-center text-center">
                      "{testimonials[activeIndex].quote}"
                    </p>
                    <div className="flex-shrink-0">
                      <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        {testimonials[activeIndex].name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        {testimonials[activeIndex].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <motion.button
              onClick={prevTestimonial}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors border border-gray-100/60 dark:border-gray-700/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.button
              onClick={nextTestimonial}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors border border-gray-100/60 dark:border-gray-700/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goToTestimonial(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                  i === activeIndex ? "bg-indigo-500" : "bg-gray-400 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}