/**
 * Logo utility functions for accessing and using the company logo
 * across the application
 */

/**
 * Get the company logo from localStorage
 * @returns The logo data URL or null if not set
 */
export const getCompanyLogo = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('company_logo');
};

/**
 * Convert a data URL to a Blob
 * This is useful for PDF libraries that need a Blob
 */
export const dataURLtoBlob = (dataURL: string): Blob => {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
