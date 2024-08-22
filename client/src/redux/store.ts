import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import userReducer from './reducers/userSlice'

export const store = configureStore({
  reducer: {
    users: userReducer,
  }
})
export type IAppDispatch = typeof store.dispatch
export type IAppState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<IAppDispatch>()
export const useAppSelector: TypedUseSelectorHook<IAppState> = useSelector
