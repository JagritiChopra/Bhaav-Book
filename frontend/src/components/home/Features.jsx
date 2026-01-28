// src/components/Features.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Move static data outside component to prevent recreation
const FEATURES_DATA = [
  {
    icon: "📝",
    title: "Daily Journaling",
    desc: "Capture your thoughts, moods, and daily experiences with our intuitive interface designed for seamless reflection and personal growth.",
    color: "from-blue-500 to-sky-400",
  },
  {
    icon: "🧠",
    title: "AI Emotional Insights",
    desc: "Get personalized insights about your emotional patterns and trends with advanced AI analysis that helps you understand your mental well-being.",
    color: "from-indigo-500 to-purple-400",
  },
  {
    icon: "✍️",
    title: "Share Your Wisdom",
    desc: "Write and publish emotional advice blogs to help others on their journey while building a supportive community of like-minded individuals.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: "💬",
    title: "Anonymous Chat",
    desc: "Connect and share your emotions anonymously with others who understand, creating safe spaces for authentic emotional expression.",
    color: "from-fuchsia-500 to-pink-500",
  },
];

// Move animation variants outside component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Features() {
  // Memoize features to prevent unnecessary re-renders
  const features = useMemo(() => FEATURES_DATA, []);

  // State for current slide index for mobile
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  
  // Ref for drag constraints
  const carouselRef = useRef(null);
  const containerRef = useRef(null);

  // Number of features
  const totalFeatures = features.length;

  // Detect if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate drag constraints
  useEffect(() => {
    if (isMobile && carouselRef.current && containerRef.current) {
      const carouselWidth = carouselRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;
      const maxDrag = carouselWidth - containerWidth;
      
      setDragConstraints({
        left: -maxDrag,
        right: 0
      });
    }
  }, [isMobile, features]);

  // Handle arrow navigation
  const slideLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const slideRight = () => {
    if (currentIndex < totalFeatures - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Calculate slide position
  const slidePosition = isMobile ? -currentIndex * 100 : 0;

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden pb-24 sm:pb-32">
      <motion.div 
        className="max-w-7xl mx-auto text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div 
          className="mb-12 sm:mb-20" 
          variants={itemVariants}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-300">Works</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Our powerful tools work together to transform your emotional journey
          </p>
        </motion.div>

        {/* For large screens: grid layout */}
        {!isMobile && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={`feature-${i}`}
                className="relative group"
                variants={itemVariants}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 rounded-xl sm:rounded-2xl transition-opacity duration-500 -m-1 p-1 blur-md`}></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full hover:-translate-y-2 hover:scale-[1.02] overflow-hidden border border-gray-100/60 dark:border-gray-700/50">
                  <div className="flex justify-center mb-4 sm:mb-6 relative">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl shadow-lg`}>
                      <span>{feature.icon}</span>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 dark:opacity-20 blur-xl rounded-full scale-150`}></div>
                  </div>
                  
                  <h3 className={`text-sm sm:text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${feature.color} mb-2 sm:mb-4`}>
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* For mobile: Framer Motion sliding carousel */}
        {isMobile && (
          <div className="relative">
            {/* Left Arrow - Positioned at mid-left */}
            <AnimatePresence>
              {(
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.8, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={slideLeft}
                  className="absolute left-2 top-32 transform -translate-y-1/2 z-10 p-2 transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-12  text-gray-700 dark:text-gray-300" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Right Arrow - Positioned at mid-right */}
            <AnimatePresence>
              {(
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.8, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={slideRight}
                  className="absolute right-2 top-32 transform -translate-y-1/2 z-10 p-2 transition-all duration-300"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-12 text-gray-700 dark:text-gray-300" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Carousel Container with Framer Motion */}
            <div ref={containerRef} className="overflow-hidden rounded-2xl">
              <motion.div
                ref={carouselRef}
                className="flex"
                drag="x"
                dragConstraints={dragConstraints}
                dragElastic={0.1}
                dragMomentum={false}
                animate={{ x: `${slidePosition}%` }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                onDragEnd={(event, info) => {
                  const threshold = 50;
                  if (info.offset.x > threshold && currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                  } else if (info.offset.x < -threshold && currentIndex < totalFeatures - 1) {
                    setCurrentIndex(currentIndex + 1);
                  }
                }}
              >
                {features.map((feature, i) => (
                  <motion.div 
                    key={`feature-mobile-${i}`}
                    className="min-w-full px-4 pb-10 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 rounded-2xl transition-opacity duration-500 -m-1 p-1 blur-md`}></div>
                      
                      {/* Removed shadow from mobile cards */}
                      <div className="relative bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl p-6 transition-all duration-300 h-full overflow-hidden border border-gray-100/60 dark:border-gray-700/50">
                        <div className="flex justify-center mb-6 relative">
                          <motion.div 
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl shadow-lg`}
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <span>{feature.icon}</span>
                          </motion.div>
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 dark:opacity-20 blur-xl rounded-full scale-150`}></div>
                        </div>
                        
                        <motion.h3 
                          className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${feature.color} mb-4`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {feature.title}
                        </motion.h3>
                        <motion.p 
                          className="w-60 text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                         {feature.desc}
                        </motion.p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots with Framer Motion */}
            <div className="flex justify-center space-x-2 mt-6">
              {features.map((_, idx) => (
                <motion.button
                  key={`dot-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    backgroundColor: currentIndex === idx 
                      ? '#2563eb' 
                      : '#d1d5db',
                    scale: currentIndex === idx ? 1.25 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}