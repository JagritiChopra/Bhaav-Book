import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ data, isFormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile/update`, {
        method: 'PUT',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    error: null,
    updateSuccess: false,
    profileData: null,
  },
  reducers: {
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.profileData = action.payload;
        
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
          localStorage.setItem('userProfile', JSON.stringify(action.payload));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const { clearUpdateSuccess, clearError, setProfileData } = profileSlice.actions;
export default profileSlice.reducer;