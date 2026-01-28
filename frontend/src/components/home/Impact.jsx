
import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// iPhone-style emoji paths
const EMOJI_PATHS = {
  brain: "/assets/emojis/brain.png",
  relieved: "/assets/emojis/relaxFace.png",
  heart: "/assets/emojis/heart.png",
};

export default function Impact() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  
  // Get authentication status from Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const impactItems = [
    {
      number: "73%",
      label: "Report improved self-awareness",
      icon: EMOJI_PATHS.brain,
      alt: "Brain Emoji",
      color: "from-blue-500 to-sky-400"
    },
    {
      number: "66%",
      label: "Reduced anxiety levels",
      icon: EMOJI_PATHS.relieved,
      alt: "Relieved Face Emoji",
      color: "from-indigo-500 to-purple-400"
    },
    {
      number: "82%",
      label: "Better emotional regulation",
      icon: EMOJI_PATHS.heart,
      alt: "Heart Emoji",
      color: "from-fuchsia-500 to-pink-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    }
  };

  // Handle navigation based on authentication status
  const handleStartJourney = () => {
    if (isAuthenticated && user) {
      // User is logged in, redirect to journal page
      navigate('/journal');
    } else {
      // User is not logged in, redirect to login page
      navigate('/login');
    }
  };

  return (
    <motion.section
      className="pb-12 px-4 sm:px-8 relative overflow-hidden pt-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* No background elements - they're in the Home component */}
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          variants={itemVariants}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Why Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-400 dark:to-sky-300">Words</span> Matter
          </h2>
          <motion.p 
            className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light"
            variants={itemVariants}
          >
            Journaling isn't just a habit — it's a path to emotional clarity and personal growth.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {impactItems.map((item, i) => (
            <motion.div
              key={i}
              className="relative"
              variants={itemVariants}
              onMouseEnter={() => setHoveredItem(i)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center h-full transform hover:-translate-y-2 relative z-10 border border-gray-100/60 dark:border-gray-700/50 cursor-pointer">
                <div className="mb-5 relative">
                  <img 
                    src={item.icon} 
                    alt={item.alt} 
                    className="w-16 h-16 object-contain inline-block filter drop-shadow-md"
                  />
                  <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${item.color} opacity-10 dark:opacity-20 blur-xl rounded-full scale-150`}></div>
                </div>
                <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${item.color} mb-4`}>
                  {item.number}
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium tracking-wide">
                  {item.label}
                </p>
              </div>
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-md transition-opacity duration-300 ${hoveredItem === i ? 'opacity-20 dark:opacity-30' : 'opacity-0'}`}>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="bg-gradient-to-r from-sky-50/80 to-indigo-50/80 dark:from-slate-800/50 dark:to-slate-800/50 p-10 rounded-3xl shadow-xl max-w-4xl mx-auto text-center border border-white/50 dark:border-gray-700/50 backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="mb-2">
            <span className="w-10 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full inline-block"></span>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-200 italic font-light leading-relaxed">
            "By capturing your daily thoughts, our app helps you notice patterns, understand feelings,
            and grow over time with insights backed by real data and intelligent analysis."
          </p>
          <div className="mt-8">
            <motion.button 
              onClick={handleStartJourney}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 dark:from-indigo-500 dark:to-sky-400 dark:hover:from-indigo-600 dark:hover:to-sky-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl shadow-indigo-500/20 dark:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAuthenticated ? 'Go to Journal' : 'Start Your Journey'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}