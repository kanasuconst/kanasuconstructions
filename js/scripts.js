import { supabase } from './supabase-config.js';

// Upload Project (Image + Metadata)
export async function uploadProject({ project_name, description, imageFile }) {
  if (!imageFile) return { error: 'No image file provided' };
  // Remove 'public/' from path, just use `${Date.now()}_${imageFile.name}`
  const filePath = `${Date.now()}_${imageFile.name}`;
  const { data: storageData, error: storageError } = await supabase
    .storage
    .from('project-images')
    .upload(filePath, imageFile, { contentType: imageFile.type });

  if (storageError) {
    return { error: 'Failed to upload image. Please try again.' };
  }

  const imageUrl = supabase.storage.from('project-images').getPublicUrl(storageData.path).data.publicUrl;

  const { error: dbError } = await supabase
    .from('projects')
    .insert([{ project_name, description, image_url: imageUrl }]);

  if (dbError) {
    return { error: 'Failed to save project. Please try again.' };
  }

  return { error: null };
}

// Upload Testimonial (Image + Metadata)
export async function uploadTestimonial({ user_name, testimonial_text, imageFile }) {
  let imageUrl = '';
  if (imageFile) {
    const filePath = `${Date.now()}_${imageFile.name}`;
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('testimonial-images')
      .upload(filePath, imageFile, { contentType: imageFile.type });
    if (storageError) {
      return { error: 'Failed to upload image. Please try again.' };
    }
    imageUrl = supabase.storage.from('testimonial-images').getPublicUrl(storageData.path).data.publicUrl;
  }

  const { error: dbError } = await supabase
    .from('testimonials')
    .insert([{ user_name, testimonial_text, user_image_url: imageUrl }]);

  if (dbError) {
    return { error: 'Failed to save testimonial. Please try again.' };
  }

  return { error: null };
}

// Delete Project by ID
export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) {
    return { error: 'Failed to delete project. Please try again.' };
  }
  return { error: null };
}

// Update Project by ID
export async function updateProject(id, { project_name, description, status, imageFile }) {
  let imageUrl = null;
  if (imageFile) {
    const filePath = `${Date.now()}_${imageFile.name}`;
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('project-images')
      .upload(filePath, imageFile, { contentType: imageFile.type });
    if (storageError) {
      return { error: 'Failed to upload image. Please try again.' };
    }
    imageUrl = supabase.storage.from('project-images').getPublicUrl(storageData.path).data.publicUrl;
  }
  const updateData = { project_name, description };
  if (status) updateData.status = status;
  if (imageUrl) updateData.image_url = imageUrl;
  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id);
  if (error) {
    return { error: 'Failed to update project. Please try again.' };
  }
  return { error: null };
}

// Delete Testimonial by ID
export async function deleteTestimonial(id) {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  if (error) {
    return { error: 'Failed to delete testimonial. Please try again.' };
  }
  return { error: null };
}

// Update Testimonial by ID
export async function updateTestimonial(id, { user_name, user_role, testimonial_text, imageFile }) {
  let imageUrl = null;
  if (imageFile) {
    const filePath = `${Date.now()}_${imageFile.name}`;
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('testimonial-images')
      .upload(filePath, imageFile, { contentType: imageFile.type });
    if (storageError) {
      return { error: 'Failed to upload image. Please try again.' };
    }
    imageUrl = supabase.storage.from('testimonial-images').getPublicUrl(storageData.path).data.publicUrl;
  }
  const updateData = { user_name, testimonial_text };
  if (user_role) updateData.user_role = user_role;
  if (imageUrl) updateData.user_image_url = imageUrl;
  const { error } = await supabase
    .from('testimonials')
    .update(updateData)
    .eq('id', id);
  if (error) {
    return { error: 'Failed to update testimonial. Please try again.' };
  }
  return { error: null };
}

// Fetch all projects
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

// Fetch all testimonials
export async function fetchTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}