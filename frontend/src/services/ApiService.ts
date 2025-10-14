const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('bluebird_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const parsed = await response.json();

      if (!response.ok) {
        // If the server returned an error payload, try to surface its message
        const msg = (parsed && parsed.message) || 'Something went wrong';
        throw new Error(msg);
      }

      // If the server already returns the ApiResponse shape { success, data, error }
      // return it directly so callers get the server's `data` in response.data.
      if (parsed && typeof parsed === 'object' && 'success' in parsed) {
        return parsed as ApiResponse<T>;
      }

      // Fallback: server returned raw data, wrap it.
      return { success: true, data: parsed };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Auth endpoints
  static async login(credentials: LoginCredentials) {
    console.log('Login request with credentials:', {
      username: credentials.username,
      passwordLength: credentials.password.length
    });

    const response = await this.request<{
      token: string;
      user: {
        id: string;
        username: string;
        role: 'admin' | 'manager';
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('Login response:', { success: response.success, error: response.error });
    return response;
  }

  // Shipment endpoints
  static async getShipments() {
    return this.request('/shipments');
  }

  static async getShipmentByTracking(trackingNumber: string) {
    return this.request(`/shipments/tracking/${trackingNumber}`);
  }

  static async createShipment(shipmentData: any) {
    return this.request('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    });
  }

  static async updateShipment(id: string, shipmentData: any) {
    return this.request(`/shipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(shipmentData),
    });
  }

  static async deleteShipment(id: string) {
    return this.request(`/shipments/${id}`, {
      method: 'DELETE',
    });
  }

  static async addShipmentEvent(shipmentId: string, eventData: any) {
    return this.request(`/shipments/${shipmentId}/events`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }
}

export default ApiService;