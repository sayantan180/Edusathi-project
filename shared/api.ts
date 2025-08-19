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
