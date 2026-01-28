import React from 'react';
import { useSelector } from 'react-redux';
import logoDark from "../../../assets/logo.png";
import logoLight from "../../../assets/logo-light.png";

const ProfileHeader = ({ photoUrl, isEditing, photoPreview, onPhotoChange }) => {
  const { darkMode } = useSelector((state) => state.theme);

  const handlePhotoClick = () => {
    if (isEditing) {
      document.getElementById('photo-upload').click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="relative h-40 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-800 dark:to-cyan-800">
        {/* Website Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={darkMode ? logoLight : logoDark}
            alt="Bhav Book Logo"
            className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        
        <div className="absolute -bottom-16 left-6 sm:left-10">
          <div 
            className={`p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-lg relative ${
              isEditing ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
            }`}
            onClick={handlePhotoClick}
          >
            <img
              src={photoPreview || photoUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-700"
            />
            
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>
            )}
            
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </>
  );
};

export default ProfileHeader;