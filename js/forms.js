import { supabase } from './supabase-config.js';

// Contact Form Submission
export async function submitContactForm(data) {
  // Input validation
  if (!data.name || !data.email || !data.phone || !data.message) {
    return { success: false, error: 'All fields are required.' };
  }
  
  if (!/^[A-Za-z ]+$/.test(data.name.trim())) {
    return { success: false, error: 'Name must contain only letters and spaces.' };
  }
  
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  
  if (!/^[6-9][0-9]{9}$/.test(data.phone.trim())) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  
  if (data.message.trim().length > 1000) {
    return { success: false, error: 'Message cannot exceed 1000 characters.' };
  }
  
  // Map form fields to DB columns (snake_case)
  const payload = {
    full_name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    message: data.message.trim()
  };
  
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);
    return { success: !error, error: error?.message };
  } catch (error) {
    return { success: false, error: 'Failed to submit your message. Please try again.' };
  }
}

// Quote Request Submission
export async function submitQuoteForm(data) {
  // Input validation
  if (!data.planType || !data.areaSize || !data.name || !data.email || !data.phone) {
    return { success: false, error: 'All required fields must be filled.' };
  }
  
  if (!/^[A-Za-z ]+$/.test(data.name.trim())) {
    return { success: false, error: 'Name must contain only letters and spaces.' };
  }
  
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  
  if (!/^[6-9][0-9]{9}$/.test(data.phone.trim())) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  
  const areaNum = Number(data.areaSize);
  if (isNaN(areaNum) || areaNum < 100 || areaNum > 50000) {
    return { success: false, error: 'Area must be between 100 and 50,000 square feet.' };
  }
  
  if (data.location && data.location.length > 200) {
    return { success: false, error: 'Location cannot exceed 200 characters.' };
  }
  
  if (data.message && data.message.length > 1000) {
    return { success: false, error: 'Additional requirements cannot exceed 1000 characters.' };
  }
  
  // Map form fields to DB columns (snake_case)
  const payload = {
    plan_type: data.planType,
    area: areaNum,
    full_name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    location: data.location ? data.location.trim() : null,
    additional_requirements: data.message ? data.message.trim() : null
  };
  
  try {
    const { error } = await supabase
      .from('quotes')
      .insert([payload]);
    return { success: !error, error: error?.message };
  } catch (error) {
    return { success: false, error: 'Failed to submit your quote request. Please try again.' };
  }
}

// Calculate quote cost based on plan and area
export function calculateQuoteCost(plan, area) {
    const rates = {
        basic: 1850,
        standard: 2050,
        premium: 2250,
        luxury: 2500
    };
    
    return rates[plan] * area;
} 