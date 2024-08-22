import { ISuccessResponseApi } from '@/types/utils.type'
import http from 'src/utils/http'

export const registerAccount = (body: { email: string; password: string }) =>
  http.post<ISuccessResponseApi<string>>('/register', body)

export const logoutAccount = () => http.post('/logout')
