/**
 * Company details utility functions for accessing and using company information
 * across the application
 */

/**
 * Get the company details from localStorage
 * @returns The company details or default values if not set
 */
export const getCompanyDetails = () => {
  if (typeof window === 'undefined') return defaultCompanyDetails;
  
  try {
    return {
      name: localStorage.getItem('company_name') || defaultCompanyDetails.name,
      address: localStorage.getItem('company_address') || defaultCompanyDetails.address,
      city: localStorage.getItem('company_city') || defaultCompanyDetails.city,
      postcode: localStorage.getItem('company_postcode') || defaultCompanyDetails.postcode,
      phone: localStorage.getItem('company_phone') || defaultCompanyDetails.phone,
      email: localStorage.getItem('company_email') || defaultCompanyDetails.email,
      website: localStorage.getItem('company_website') || defaultCompanyDetails.website,
      vatNumber: localStorage.getItem('company_vat_number') || defaultCompanyDetails.vatNumber,
      registrationNumber: localStorage.getItem('company_registration_number') || defaultCompanyDetails.registrationNumber,
      bankName: localStorage.getItem('company_bank_name') || defaultCompanyDetails.bankName,
      accountNumber: localStorage.getItem('company_account_number') || defaultCompanyDetails.accountNumber,
      sortCode: localStorage.getItem('company_sort_code') || defaultCompanyDetails.sortCode
    };
  } catch (error) {
    console.error('Error retrieving company details from localStorage:', error);
    return defaultCompanyDetails;
  }
};

// Default company details to use if nothing is stored in localStorage
const defaultCompanyDetails = {
  name: 'All About Blinds',
  address: '123 Blind Street',
  city: 'Blindville',
  postcode: 'BL1 2ND',
  phone: '01234 567890',
  email: 'info@allaboutblinds.com',
  website: 'www.allaboutblinds.com',
  vatNumber: 'GB123456789',
  registrationNumber: '12345678',
  bankName: 'Blind Bank',
  accountNumber: '12345678',
  sortCode: '12-34-56'
};
