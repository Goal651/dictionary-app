import axios, { AxiosInstance, AxiosResponse, AxiosProgressEvent, CancelToken } from 'axios';
import { API_CONFIG, } from './constants';
import { ApiResponse, ApiError} from '@/types';
import { router } from 'expo-router';


class ApiClient {
    private axiosInstance: AxiosInstance;
    private logoutListeners: (() => void)[] = [];

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: `${API_CONFIG.BASE_URL}/api`,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });


        // Response interceptor to handle errors
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                console.log(error)
                try {
                    if (error.response) {
                        const apiError: ApiError = {
                            status: error.status,
                            message: error?.message || 'An error occurred',
                            errors: error.errors,
                        };

                        throw apiError;
                    }
                    if (error.code === 'ECONNABORTED') {
                        throw new Error('Request timeout');
                    }
                    router.replace('/network-error')
                    throw new Error('Network error');
                } catch (err) {
                    throw err
                }
            }
        );
    }


    public async logout() {
        try {

            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    throw error
                }
            });
        } catch (error) {
            throw error
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    throw error
                }
            });
        }
    }

    public onLogout(callback: () => void) {
        try {
            this.logoutListeners.push(callback);
        } catch (error) {
            throw error
        }
    }

    public removeLogoutListener(callback: () => void) {
        try {
            this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
        } catch (error) {
            throw error
        }
    }

    async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params })
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.patch<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

 
    async uploadFile<T>(
        endpoint: string,
        file: File,
        onUploadProgress?: (event: AxiosProgressEvent) => void,
        cancelToken?: CancelToken,
        timeout?: number
    ): Promise<ApiResponse<T>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
                cancelToken,
                timeout: timeout ?? API_CONFIG.TIMEOUT,
            });
            return response.data;
        } catch (error) {

            throw error;
        }
    }
}

export const client = new ApiClient();
