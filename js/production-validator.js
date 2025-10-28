/**
 * Production Validation Script
 * Run this in browser console to verify all components are working
 */

async function validateProduction() {
    console.log('🔍 Starting Production Validation...');
    
    // Test 1: Supabase Connection
    try {
        const { supabase } = await import('./js/supabase-config.js');
        const { data, error } = await supabase.from('projects').select('count');
        console.log('✅ Supabase connection:', error ? '❌ Failed' : '✅ Success');
    } catch (e) {
        console.log('❌ Supabase connection failed:', e.message);
    }
    
    // Test 2: Form Validation
    try {
        const { submitContactForm } = await import('./js/forms.js');
        const result = await submitContactForm({
            name: '',
            email: 'invalid-email',
            phone: '123',
            message: ''
        });
        console.log('✅ Form validation:', result.success ? '❌ Failed' : '✅ Working');
    } catch (e) {
        console.log('❌ Form validation test failed:', e.message);
    }
    
    // Test 3: Carousel Elements
    const projectSlider = document.querySelector('.project-slider');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    console.log('✅ Project carousel:', projectSlider ? '✅ Found' : '❌ Missing');
    console.log('✅ Testimonial carousel:', testimonialSlider ? '✅ Found' : '❌ Missing');
    
    // Test 4: Responsive Elements
    const navbar = document.querySelector('.navbar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    console.log('✅ Navigation:', navbar ? '✅ Found' : '❌ Missing');
    console.log('✅ Mobile toggle:', sidebarToggle ? '✅ Found' : '❌ Missing');
    
    // Test 5: Admin Authentication (if on admin page)
    if (window.location.pathname.includes('admin')) {
        try {
            const { adminLogin } = await import('./js/admin-auth.js');
            console.log('✅ Admin auth module:', adminLogin ? '✅ Loaded' : '❌ Missing');
        } catch (e) {
            console.log('❌ Admin auth module failed:', e.message);
        }
    }
    
    // Test 6: CSS Loading
    const computedStyle = getComputedStyle(document.body);
    const hasStyles = computedStyle.fontFamily !== 'initial';
    console.log('✅ CSS loading:', hasStyles ? '✅ Loaded' : '❌ Failed');
    
    console.log('🎉 Production validation complete!');
}

// Auto-run if not in admin dashboard
if (!window.location.pathname.includes('admin-dashboard')) {
    validateProduction();
}