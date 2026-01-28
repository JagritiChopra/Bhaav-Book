import React from 'react';
import { useSelector } from 'react-redux';
import { ProfileItem, StatCard } from './Items';

const ProfileView = ({ profile, setIsEditing, isEditing, formData, setFormData, handleSubmit, cancelEdit, isSaving, canEdit = true }) => {
  const { darkMode } = useSelector((state) => state.theme);

  // Popular country codes with India at top
  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' }
  ];

  const languages = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
    'ja': 'Japanese', 'zh': 'Chinese', 'it': 'Italian', 'pt': 'Portuguese',
    'ru': 'Russian', 'ar': 'Arabic'
  };

  const tones = {
    'neutral': 'Neutral',
    'encouraging': 'Encouraging',
    'analytical': 'Analytical',
    'supportive': 'Supportive',
    'casual': 'Casual',
    'professional': 'Professional'
  };

  const emotionStyles = {
    'emoji': 'Emoji',
    'detailed': 'Detailed',
    'concise': 'Concise',
    'analytical': 'Analytical',
    'supportive': 'Supportive'
  };

  const insightFrequencies = {
    'daily': 'Daily',
    'weekly': 'Weekly',
    'biweekly': 'Bi-weekly',
    'monthly': 'Monthly'
  };

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value
        }
      }));
    }
  };

  // Handle phone number input with country code
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    // Only allow numbers, spaces, hyphens, and parentheses
    const cleanedValue = value.replace(/[^\d\s\-\(\)]/g, '');
    setFormData(prev => ({ 
      ...prev, 
      phoneNumber: cleanedValue 
    }));
  };

  // Handle country code change
  const handleCountryCodeChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      countryCode: value 
    }));
  };

  // Get current phone parts
  const getCurrentPhoneParts = () => {
    const phone = formData.phone || profile.phone || '';
    
    // Check if phone already has country code
    const countryCode = countryCodes.find(cc => phone.startsWith(cc.code));
    if (countryCode) {
      return {
        countryCode: countryCode.code,
        phoneNumber: phone.substring(countryCode.code.length).trim()
      };
    }
    
    // Default to India if no country code found
    return {
      countryCode: formData.countryCode || '+91',
      phoneNumber: formData.phoneNumber || phone
    };
  };

  const { countryCode, phoneNumber } = getCurrentPhoneParts();

  // Update complete phone number when country code or number changes
  const updateCompletePhone = (newCountryCode, newPhoneNumber) => {
    const completePhone = newCountryCode + newPhoneNumber;
    setFormData(prev => ({ 
      ...prev, 
      phone: completePhone,
      countryCode: newCountryCode,
      phoneNumber: newPhoneNumber
    }));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
        <div className="flex-1">
          {isEditing && canEdit ? (
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleInputChange}
              className="text-3xl font-bold text-slate-800 dark:text-blue-100 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 mb-2"
              placeholder="Your Name"
              required
            />
          ) : (
            <h2 className="text-3xl font-bold text-slate-800 dark:text-blue-100">{profile.fullName}</h2>
          )}

          <div className="flex items-center mt-1">
            <p className="text-slate-600 dark:text-slate-300">{profile.email}</p>
            <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          </div>

          {isEditing && canEdit ? (
            <div className="mt-2 flex items-center space-x-2">
              {/* Country Code Selector */}
              <select
                value={countryCode}
                onChange={(e) => updateCompletePhone(e.target.value, phoneNumber)}
                className="text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:border-blue-500 px-2 py-1"
              >
                {countryCodes.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.flag} {cc.code} {cc.country}
                  </option>
                ))}
              </select>
              
              {/* Phone Number Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => updateCompletePhone(countryCode, e.target.value)}
                className="flex-1 text-sm text-slate-600 dark:text-slate-300 bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-blue-500 px-2 py-1"
                placeholder="Enter phone number"
                maxLength="15"
              />
              
              {profile.isPhoneVerified && (
                <span className="text-xs text-green-600 dark:text-green-400">✓ Verified</span>
              )}
            </div>
          ) : (
            profile.phone && (
              <div className="mt-1 flex items-center">
                <p className="text-sm text-slate-600 dark:text-slate-300">{profile.phone}</p>
                {profile.isPhoneVerified && (
                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                )}
              </div>
            )
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 rounded-full p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Date of Birth</p>
                {isEditing && canEdit ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.profile?.dob || ""}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="text-sm text-slate-700 dark:text-slate-200 bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-purple-500 w-full"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {profile.profile?.dob
                      ? new Date(profile.profile.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      : <span className="text-slate-400 dark:text-slate-500">Not set</span>
                    }
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 rounded-full p-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-h-[2.5rem] flex flex-col justify-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gender</p>
                {isEditing && canEdit ? (
                  <select
                    name="gender"
                    value={formData.profile?.gender || ""}
                    onChange={handleInputChange}
                    className="text-sm text-slate-700 dark:text-slate-200 bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-pink-500 w-full py-1 appearance-none"
                    style={{ minHeight: '1.25rem' }}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200" style={{ minHeight: '1.25rem', lineHeight: '1.25rem' }}>
                    {profile.profile?.gender
                      ? ({
                        male: "Male",
                        female: "Female",
                        "non-binary": "Non-binary",
                        "prefer-not-to-say": "Prefer not to say",
                        other: "Other",
                      }[profile.profile.gender] || profile.profile.gender)
                      : <span className="text-slate-400 dark:text-slate-500">Not specified</span>
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing && canEdit ? (
            <textarea
              name="bio"
              value={formData.profile?.bio || ""}
              onChange={handleInputChange}
              rows="3"
              className="w-full mt-3 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us a bit about yourself..."
            />
          ) : (
            <div className="mt-4 relative">
              {profile.profile?.bio ? (
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-200">
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-base">
                    {profile.profile.bio}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-6 px-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    No bio added yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4 sm:mt-0">
          {isEditing && canEdit ? (
            <>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center min-w-[140px] justify-center"
                disabled={!formData.fullName?.trim() || isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </>
          ) : (
            canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            )
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-blue-100 mb-4">Profile Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
          <ProfileItem
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            }
            label="Member Since"
            value={
              profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
                : 'Date not available'
            }
            darkMode={darkMode}
          />

          <div className="flex items-start">
            <div className={`flex-shrink-0 rounded-full p-1.5 ${darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3.5 flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Timezone</p>
              {isEditing && canEdit ? (
                <select
                  name="timezone"
                  value={formData.profile?.timezone || ""}
                  onChange={handleInputChange}
                  className="mt-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-base font-medium"
                >
                  <option value="">Select timezone</option>
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-slate-900 dark:text-slate-200">
                  {timezones.find(tz => tz.value === profile.profile?.timezone)?.label || "Not set"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className={`flex-shrink-0 rounded-full p-1.5 ${darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3.5 flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Preferred Tone</p>
              {isEditing && canEdit ? (
                <select
                  name="tone"
                  value={formData.profile?.tone || ""}
                  onChange={handleInputChange}
                  className="mt-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-base font-medium"
                >
                  {Object.entries(tones).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-slate-900 dark:text-slate-200">
                  {tones[profile.profile?.tone] || "Neutral"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className={`flex-shrink-0 rounded-full p-1.5 ${darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3.5 flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Emotion Style</p>
              {isEditing && canEdit ? (
                <select
                  name="emotionStyle"
                  value={formData.profile?.emotionStyle || ""}
                  onChange={handleInputChange}
                  className="mt-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-base font-medium"
                >
                  {Object.entries(emotionStyles).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-slate-900 dark:text-slate-200">
                  {emotionStyles[profile.profile?.emotionStyle] || "Emoji"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className={`flex-shrink-0 rounded-full p-1.5 ${darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733a18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3.5 flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Preferred Language</p>
              {isEditing && canEdit ? (
                <select
                  name="language"
                  value={formData.profile?.language || ""}
                  onChange={handleInputChange}
                  className="mt-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-base font-medium"
                >
                  {Object.entries(languages).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-slate-900 dark:text-slate-200">
                  {languages[profile.profile?.language] || "English"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className={`flex-shrink-0 rounded-full p-1.5 ${darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3.5 flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Insight Frequency</p>
              {isEditing && canEdit ? (
                <select
                  name="insightFrequency"
                  value={formData.profile?.insightFrequency || ""}
                  onChange={handleInputChange}
                  className="mt-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-base font-medium"
                >
                  {Object.entries(insightFrequencies).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-medium text-slate-900 dark:text-slate-200">
                  {insightFrequencies[profile.profile?.insightFrequency] || "Weekly"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-blue-100 mb-4">Journal Statistics</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Entries"
            value={profile.profile?.entryCount || 0}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>}
            darkMode={darkMode}
          />

          <StatCard
            title="Writing Streak"
            value={profile.profile?.streak || 0}
            unit="days"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>}
            darkMode={darkMode}
          />

          <StatCard
            title="Last Insight"
            value={profile.profile?.lastInsightGenerated ?
              new Date(profile.profile.lastInsightGenerated).toLocaleDateString() :
              "Not available"
            }
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileView;