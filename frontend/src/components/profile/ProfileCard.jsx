import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from "./subcomponents/ProfileHeader";
import ProfileView from "./subcomponents/ProfileView";
import LoadingState from "./subcomponents/ProfileLoadingState";
import { ErrorState } from "./subcomponents/StatusError";
import { updateProfile, clearUpdateSuccess } from '../../store/slices/profileSlice';
import { updateUserProfile, verifyToken } from '../../store/slices/authSlice';
import NotificationMessages from "../Notification";
import { API_BASE_URL } from '../../config/api';

export default function ProfileCard({ profile: externalProfile, isOwnProfile = true }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { loading: profileLoading, updateSuccess, error: profileError, profileData } = useSelector((state) => state.profile);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  // Notification states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Check for success message from localStorage on component mount
  useEffect(() => {
    const successMsg = localStorage.getItem('profileUpdateSuccess');
    if (successMsg) {
      setSuccessMessage(successMsg);
      localStorage.removeItem('profileUpdateSuccess');
    }
  }, []);

  const fetchFreshProfileData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
    } catch (error) {
      console.error('Error fetching fresh profile:', error);
    }
    return null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (externalProfile) {
        setProfile(externalProfile);
        setFormData({
          fullName: externalProfile.fullName || "",
          email: externalProfile.email || "",
          phone: externalProfile.phone || "",
          profile: {
            bio: externalProfile.profile?.bio || "",
            emotionStyle: externalProfile.profile?.emotionStyle || "emoji",
            language: externalProfile.profile?.language || "en",
            tone: externalProfile.profile?.tone || "neutral",
            timezone: externalProfile.profile?.timezone || "",
            insightFrequency: externalProfile.profile?.insightFrequency || "weekly",
            avatar: externalProfile.profile?.avatar || null,
            dob: externalProfile.profile?.dob || "",
            gender: externalProfile.profile?.gender || ""
          },
        });
        setLoading(false);
        return;
      }

      const currentProfile = profileData || user;
      if (currentProfile) {
        setProfile(currentProfile);
        setFormData({
          fullName: currentProfile.fullName || "",
          email: currentProfile.email || "",
          phone: currentProfile.phone || "",
          profile: {
            bio: currentProfile.profile?.bio || "",
            emotionStyle: currentProfile.profile?.emotionStyle || "emoji",
            language: currentProfile.profile?.language || "en",
            tone: currentProfile.profile?.tone || "neutral",
            timezone: currentProfile.profile?.timezone || "",
            insightFrequency: currentProfile.profile?.insightFrequency || "weekly",
            avatar: currentProfile.profile?.avatar || null,
            dob: currentProfile.profile?.dob || "",
            gender: currentProfile.profile?.gender || ""
          },
        });
        setLoading(false);
      } else {
        setLoading(false);
        setError("No profile data available");
      }
    };

    fetchProfile();
  }, [externalProfile, user, profileData]);

  useEffect(() => {
    if (updateSuccess) {
      // Store success message in localStorage before reload
      localStorage.setItem('profileUpdateSuccess', 'Profile updated successfully!');
      
      // Clear Redux success state
      dispatch(clearUpdateSuccess());
      
      // Reload the page
      window.location.reload();
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (profileError) {
      setErrorMessage(profileError);
    }
  }, [profileError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.fullName?.trim()) {
      setErrorMessage("Full name is required");
      return;
    }

    const updateData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone?.trim() || "",
      profile: {
        bio: formData.profile.bio?.trim() || "",
        emotionStyle: formData.profile.emotionStyle,
        language: formData.profile.language,
        tone: formData.profile.tone,
        timezone: formData.profile.timezone,
        insightFrequency: formData.profile.insightFrequency,
        dob: formData.profile.dob,
        gender: formData.profile.gender
      }
    };

    try {
      let result;
      
      if (formData.profile.avatar instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append('fullName', updateData.fullName);
        formDataToSend.append('phone', updateData.phone);
        formDataToSend.append('profile[bio]', updateData.profile.bio);
        formDataToSend.append('profile[emotionStyle]', updateData.profile.emotionStyle);
        formDataToSend.append('profile[language]', updateData.profile.language);
        formDataToSend.append('profile[tone]', updateData.profile.tone);
        formDataToSend.append('profile[timezone]', updateData.profile.timezone);
        formDataToSend.append('profile[insightFrequency]', updateData.profile.insightFrequency);
        formDataToSend.append('profile[dob]', updateData.profile.dob);
        formDataToSend.append('profile[gender]', updateData.profile.gender);
        formDataToSend.append('avatar', formData.profile.avatar);
        
        result = await dispatch(updateProfile({ data: formDataToSend, isFormData: true }));
      } else {
        result = await dispatch(updateProfile({ data: updateData, isFormData: false }));
      }
      
      // The page reload will happen in the updateSuccess useEffect
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage("Failed to update profile");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPhotoPreview(null);
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        profile: {
          bio: profile.profile?.bio || "",
          emotionStyle: profile.profile?.emotionStyle || "emoji",
          language: profile.profile?.language || "en",
          tone: profile.profile?.tone || "neutral",
          timezone: profile.profile?.timezone || "",
          insightFrequency: profile.profile?.insightFrequency || "weekly",
          avatar: profile.profile?.avatar || null,
          dob: profile.profile?.dob || "",
          gender: profile.profile?.gender || ""
        }
      });
    }
  };

  const handlePhotoChange = (file, preview) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatar: file
      }
    }));
    setPhotoPreview(preview);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-10 mt-16" key={renderKey}>
      {/* Notification Messages Component */}
      <NotificationMessages
        successMessage={successMessage}
        error={errorMessage}
        onDismissSuccess={() => setSuccessMessage('')}
        onDismissError={() => setErrorMessage('')}
        darkMode={darkMode}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <ProfileHeader
          photoUrl={profile.profile?.avatar}
          isEditing={isOwnProfile && isEditing}
          photoPreview={photoPreview}
          onPhotoChange={handlePhotoChange}
          darkMode={darkMode}
        />

        <div className="pt-20 px-6 sm:px-10 pb-8">
          <ProfileView
            profile={profile}
            setIsEditing={setIsEditing}
            isEditing={isOwnProfile && isEditing}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            cancelEdit={cancelEdit}
            isSaving={profileLoading}
            canEdit={isOwnProfile}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}