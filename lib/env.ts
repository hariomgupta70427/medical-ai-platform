/**
 * Environment variable utility
 * Safely accesses environment variables with validation
 */

/**
 * Get an environment variable with validation
 * @param key The environment variable key
 * @param defaultValue Optional default value if not found
 * @param required Whether the variable is required (throws error if missing)
 * @returns The environment variable value
 */
export function getEnv(
  key: string, 
  defaultValue: string = '', 
  required: boolean = false
): string {
  const value = process.env[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  
  return value;
}

/**
 * Check if a feature flag is enabled
 * @param flag The feature flag name
 * @returns boolean indicating if enabled
 */
export function isFeatureEnabled(flag: string): boolean {
  return process.env[`ENABLE_${flag.toUpperCase()}`] === 'true';
}

/**
 * Get all API keys as an object
 * @returns Object containing all API keys
 */
export function getApiKeys() {
  return {
    // PubChem doesn't require an API key
    ibmRxn: getEnv('IBM_RXN_API_KEY'),
    swissAdme: getEnv('SWISS_ADME_API_KEY'),
  };
}

/**
 * Get base URL for the application
 * Handles Vercel deployment automatically
 */
export function getBaseUrl(): string {
  // Handle Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Use configured base URL or default to localhost
  return getEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000');
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return process.env.ENABLE_DEBUG_MODE === 'true';
} 