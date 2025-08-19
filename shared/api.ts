/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Center types for the educational dashboard
 */
export interface Center {
  id: string;
  name: string;
  domain: string;
  website: string;
  superAdminPath: string;
  createdAt: string;
  expireDate: string;
  status: 'active' | 'inactive';
}

export interface CreateCenterRequest {
  name: string;
  domain: string;
  website: string;
  superAdminPath: string;
}

export interface CentersResponse {
  centers: Center[];
}

/**
 * Payment types for Razorpay integration
 */
export interface CreateOrderRequest {
  amount: number;
  currency: string;
  institute: string;
  owner: string;
  email: string;
  plan: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  error?: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message?: string;
  payment_id?: string;
  order_id?: string;
  error?: string;
}
