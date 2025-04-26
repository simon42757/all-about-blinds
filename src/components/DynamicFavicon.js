'use client';

import { useEffect } from 'react';
import { getCompanyLogo } from '@/utils/logoUtils';

/**
 * Component that dynamically updates the favicon based on the company logo
 * stored in localStorage. This component doesn't render anything visible.
 */
export default function DynamicFavicon() {
  useEffect(() => {
    // Function to update the favicon based on the stored logo
    const updateFavicon = () => {
      const logo = getCompanyLogo();
      
      if (logo) {
        try {
          // Create a temporary canvas to convert the logo image to a favicon
          const canvas = document.createElement('canvas');
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext('2d');
          
          const img = new Image();
          
          img.onload = () => {
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, 32, 32);
            
            // Create a link element for the favicon
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            
            // Set the favicon URL to the canvas data URL
            link.href = canvas.toDataURL('image/png');
          };
          
          img.src = logo;
        } catch (error) {
          console.error('Error updating favicon:', error);
        }
      }
    };
    
    // Update favicon when component mounts
    updateFavicon();
    
    // Set up storage event listener to update favicon when logo changes
    const handleStorageChange = (e) => {
      if (e.key === 'company_logo') {
        updateFavicon();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
}
