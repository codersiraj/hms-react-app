export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  role: string;
  [key: string]: any;
}

const apiBaseUrl = (window as any)._env_?.API_BASE_URL || 'http://localhost:5000';

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${apiBaseUrl}/api/Auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || 'Login failed');
  }

  return response.json();
}
