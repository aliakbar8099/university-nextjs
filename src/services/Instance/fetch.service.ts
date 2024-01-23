import { useRouter } from "next/navigation";

interface Location {
    origin: string;
}

interface ErrorResponse {
    message: string;
    status: number;
    errorData?: any;
}

interface RequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: BodyInit | null | undefined;
}

interface CrudOptions extends RequestOptions {
    action?: 'create' | 'read' | 'update' | 'delete';
}

interface RefreshTokenResponse {
    accessToken: string;
}

// Define location variable
const location: Location = { origin: "http://localhost:3000/api" };

// Token refresh function
const refreshAccessToken = async (): Promise<RefreshTokenResponse | null> => {
    try {
        // Implement the logic to refresh the access token
        // You may need to send a request to the server or authentication provider
        const response = await fetch(location.origin + '/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken'),
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to refresh access token. Status: ${response.status}`);
        }

        const newTokenData: RefreshTokenResponse = await response.json();
        return newTokenData;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
};

// CRUD operation execution function
const performCrudOperation = async (url: string, options: CrudOptions, data?: any): Promise<any> => {
    const router = useRouter
    const defaultOptions: RequestOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const mergedOptions: CrudOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    // Add authentication header if token exists
    const token = localStorage.getItem('accessToken');
    mergedOptions.headers ??= {};
    if (token) {
        mergedOptions.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
        mergedOptions.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${location.origin}${url[0] === "/" ? url : "/" + url}`, mergedOptions);

        if (!response.ok) {
            let errorMessage = 'Failed to perform CRUD operation';
            let statusCode = response.status;

            if (response.status === 401) {
                // Attempt to refresh the access token
                const newAccessToken = await refreshAccessToken();


                // If the access token refresh was successful, update the headers and try again
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken.accessToken);
                    mergedOptions.headers.Authorization = `Bearer ${newAccessToken.accessToken}`;
                    return performCrudOperation(url, mergedOptions, data);
                }
            }

            try {
                const errorData: ErrorResponse = await response.json();
                errorMessage = errorData.message || errorMessage;
                statusCode = errorData.status || statusCode;
                throw { message: errorMessage, status: statusCode, errorData } as ErrorResponse;
            } catch (parseError) {
                console.error('Error parsing error response:', parseError);
                throw { message: errorMessage, status: statusCode } as ErrorResponse;
            }
        }

        const responseData = await response.json();
        return { responseData, statusCode: response.status };
    } catch (error) {
        const typedError = error as ErrorResponse;
        throw typedError;
    }
};

// New CRUD functions with appropriate names
export const performPost = async (url: string, data: any): Promise<any> => {
    return performCrudOperation(url, { method: "POST" }, data);
};

export const performGet = async (url: string): Promise<any> => {
    return performCrudOperation(url, { method: "GET" });
};

export const performPut = async (url: string, data: any): Promise<any> => {
    return performCrudOperation(url, { method: "PUT" }, data);
};

export const performDelete = async (url: string, data?: any): Promise<any> => {
    return performCrudOperation(url, { method: "DELETE" }, data);
};
