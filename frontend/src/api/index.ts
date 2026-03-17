import { getBackend } from './generated/generated'
import apiClient from 'axios'

export const api = getBackend(apiClient)