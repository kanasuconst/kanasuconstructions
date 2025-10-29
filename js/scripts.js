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
  console.log('uploadTestimonial called:', { user_name, testimonial_text, hasImage: !!imageFile });
  
  try {
    let imageUrl = null;
    
    if (imageFile) {
      console.log('Uploading image file:', imageFile.name, imageFile.type, imageFile.size);
      
      // Create a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;
      
      console.log('File path for upload:', filePath);
      
      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('testimonial-images')
        .upload(filePath, imageFile, { 
          contentType: imageFile.type,
          cacheControl: '3600',
          upsert: false
        });
      
      if (storageError) {
        console.error('Storage upload error:', storageError);
        return { error: `Upload failed: ${storageError.message}` };
      }
      
      console.log('Image uploaded successfully. Storage data:', storageData);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('testimonial-images')
        .getPublicUrl(storageData.path);
      
      imageUrl = urlData.publicUrl;
      console.log('Generated public URL:', imageUrl);
      
      if (!imageUrl || imageUrl === '') {
        console.error('Failed to generate public URL');
        return { error: 'Failed to generate image URL' };
      }
    } else {
      console.log('No image file provided, creating testimonial without avatar');
    }

    // Prepare data for insertion
    const insertData = { 
      user_name, 
      testimonial_text,
      user_image_url: imageUrl || null  // Always include this field
    };
    
    console.log('Inserting testimonial into database:', insertData);
    console.log('Image URL to save:', imageUrl || '(null)');
    
    // Insert into database
    const { data: insertedData, error: dbError } = await supabase
      .from('testimonials')
      .insert([insertData])
      .select();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return { error: `Database error: ${dbError.message}` };
    }

    console.log('Testimonial inserted successfully:', insertedData);
    return { error: null, data: insertedData };
    
  } catch (err) {
    console.error('Exception in uploadTestimonial:', err);
    return { error: `Error: ${err.message}` };
  }
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
export async function updateTestimonial(id, { user_name, testimonial_text, imageFile }) {
  console.log('updateTestimonial called:', { id, user_name, testimonial_text, hasImage: !!imageFile });
  
  try {
    let imageUrl = null;
    
    if (imageFile) {
      console.log('Uploading new image file:', imageFile.name, imageFile.type, imageFile.size);
      
      // Create a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;
      
      console.log('File path for upload:', filePath);
      
      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('testimonial-images')
        .upload(filePath, imageFile, { 
          contentType: imageFile.type,
          cacheControl: '3600',
          upsert: false
        });
      
      if (storageError) {
        console.error('Storage upload error:', storageError);
        return { error: `Upload failed: ${storageError.message}` };
      }
      
      console.log('Image uploaded successfully. Storage data:', storageData);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('testimonial-images')
        .getPublicUrl(storageData.path);
      
      imageUrl = urlData.publicUrl;
      console.log('Public URL generated:', imageUrl);
      
      if (!imageUrl || imageUrl === '') {
        console.error('Failed to generate public URL');
        return { error: 'Failed to generate image URL' };
      }
    } else {
      console.log('No new image provided, keeping existing avatar');
    }
    
    // Prepare update data
    const updateData = { 
      user_name, 
      testimonial_text
    };
    
    // Only update image URL if a new one was uploaded
    if (imageUrl) {
      updateData.user_image_url = imageUrl;
      console.log('Updating with new image URL:', imageUrl);
    } else {
      console.log('No new image, keeping existing avatar');
    }
    
    console.log('Updating testimonial in database:', updateData);
    
    // Update in database
    const { data: updatedData, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Database update error:', error);
      return { error: `Database error: ${error.message}` };
    }
    
    console.log('Testimonial updated successfully:', updatedData);
    return { error: null, data: updatedData };
    
  } catch (err) {
    console.error('Exception in updateTestimonial:', err);
    return { error: `Error: ${err.message}` };
  }
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