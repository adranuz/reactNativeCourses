/* eslint-disable @typescript-eslint/no-unused-vars */
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState, AppThunk} from '../store';
import {UserData, userLogin} from '../../api/userConstants';
import {LoginSchema} from '../../components/LoginForm';
import {setMessage} from '../messages/messageSlice';
import {Response} from '../../api/userConstants';

interface AuthState {
  isLoggedIn: boolean;
  user?: UserData;
}
const initialState: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export const sessionStorage = createAsyncThunk(
  'auth/sessionStorage',
  async (_, thunkApi) => {
    try {
      // save user in cache
      const session = await AsyncStorage.getItem('@auth');

      // manage no user
      if (!session) {
        return thunkApi.rejectWithValue(undefined);
      }

      // set data in storage
      const user = JSON.parse(session);
      return user as UserData;
    } catch (error) {
      return thunkApi.rejectWithValue(undefined);
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (formValues: LoginSchema, thunkApi) => {
    try {
      //  API request
      const {username, password, keep} = formValues;
      const response: Response = userLogin({username, password});

      // manage error
      if (!response.data) {
        thunkApi.dispatch(setMessage(response.message));
        return thunkApi.rejectWithValue('');
      }

      // save user in cache
      if (keep) {
        await AsyncStorage.setItem('@auth', JSON.stringify(response.data));
      }

      // set success response
      return response.data as UserData;
    } catch (error) {
      return thunkApi.rejectWithValue(undefined);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await AsyncStorage.removeItem('@auth');
  } catch (error) {
    console.log(error);
  }
});

export const updateUserPhoto = createAsyncThunk(
  'auth/updateUserData',
  async (newImageUri, thunkApi) => {
    try {
      // get the storage session
      const session = await AsyncStorage.getItem('@auth');

      // handle empty session storage
      if (!session) {
        return thunkApi.rejectWithValue(undefined);
      }

      // update storage photo
      const user = JSON.parse(session);
      user.image = newImageUri;
      await AsyncStorage.setItem('@auth', JSON.stringify(user));
      return user as UserData;
    } catch (error) {
      console.log(error);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(updateUserPhoto.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(sessionStorage.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(sessionStorage.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = undefined;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = false;
        state.user = undefined;
      });
  },
  reducers: {},
});

const {reducer} = authSlice;
export default reducer;
