import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        localStorage.removeItem('authToken');
        throw new Error('Token verification failed');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (idToken, { rejectWithValue }) => {
    // console.log(idToken);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/firebase/firebase-google-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' 
          
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google authentication failed');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', idToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshFirebaseToken = createAsyncThunk(
  'auth/refreshFirebaseToken',
  async (_, { rejectWithValue }) => {
    try {
      const { auth } = await import('../../config/firebase');
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const newToken = await currentUser.getIdToken(true);
      localStorage.setItem('authToken', newToken);
      
      return { token: newToken };
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(error.message);
    }
  }
);

export const checkTokenExpiration = createAsyncThunk(
  'auth/checkTokenExpiration',
  async (_, { dispatch, getState }) => {
    const { auth: authState } = getState();
    
    if (!authState.isAuthenticated) {
      return;
    }

    try {
      const { auth } = await import('../../config/firebase');
      if (!auth.currentUser) {
        return;
      }

      const token = await auth.currentUser.getIdToken(true);
      const currentToken = localStorage.getItem('authToken');
      
      if (token !== currentToken) {
        localStorage.setItem('authToken', token);
        return { token };
      }
    } catch (error) {
      console.error('Token check failed:', error);
      dispatch(logout());
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  loading: false,
  error: null,
  isCheckingAuth: true,
  isInitialLoad: true,
  hasCheckedAuth: false,
  loginSuccess: false,
  registerSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loginSuccess = false;
      state.registerSuccess = false;
      state.isInitialLoad = true;
      state.isCheckingAuth = true;
      state.hasCheckedAuth = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      
      window.dispatchEvent(new CustomEvent('authChanged'));
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearSuccess: (state) => {
      state.loginSuccess = false;
      state.registerSuccess = false;
    },
    
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      state.isInitialLoad = false;
      state.hasCheckedAuth = true;
    },
    
    setCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },
    
    setInitialLoadComplete: (state) => {
      state.isInitialLoad = false;
      state.isCheckingAuth = false;
    },

    setAuthChecked: (state) => {
      state.hasCheckedAuth = true;
      state.isCheckingAuth = false;
      state.isInitialLoad = false;
    },

    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          profile: {
            ...state.user.profile,
            ...action.payload.profile
          }
        };
        localStorage.setItem('userProfile', JSON.stringify(state.user));
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loginSuccess = true;
        state.hasCheckedAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.loginSuccess = false;
        state.isInitialLoad = false;
        state.hasCheckedAuth = true;
      })
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.registerSuccess = true;
        state.hasCheckedAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.registerSuccess = false;
        state.isInitialLoad = false;
        state.hasCheckedAuth = true;
      })
      
      .addCase(verifyToken.pending, (state) => {
        state.isCheckingAuth = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
        state.isInitialLoad = false;
        state.hasCheckedAuth = true;
        localStorage.setItem('userProfile', JSON.stringify(action.payload));
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.isInitialLoad = false;
        state.hasCheckedAuth = true;
        state.error = action.payload;
      })
      
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasCheckedAuth = true;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.isInitialLoad = false;
        state.hasCheckedAuth = true;
      })
      
      .addCase(refreshFirebaseToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshFirebaseToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      .addCase(checkTokenExpiration.fulfilled, (state, action) => {
        if (action.payload?.token) {
          state.token = action.payload.token;
        }
      });
  },
});

export const { 
  logout, 
  clearError, 
  clearSuccess, 
  setCredentials, 
  setCheckingAuth,
  setInitialLoadComplete,
  setAuthChecked,
  updateUserProfile
} = authSlice.actions;

export default authSlice.reducer;