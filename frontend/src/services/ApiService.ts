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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Auth endpoints
  static async login(credentials: LoginCredentials) {
    return this.request<{
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