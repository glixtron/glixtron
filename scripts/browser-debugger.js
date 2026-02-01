// Browser Console Debugger for Resume Scanner
// Paste this into your browser console on the resume scanner page

console.log('🔍 RESUME SCANNER DEBUGGER STARTED\n');

// 1. Check for React errors
window.addEventListener('error', (event) => {
  console.error('❌ JavaScript Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled Promise Rejection:', event.reason);
});

// 2. Check if all required components are loaded
console.log('📦 Checking component imports...');
try {
  // Check if React is loaded
  if (typeof React !== 'undefined') {
    console.log('✅ React loaded');
  } else {
    console.log('❌ React not loaded');
  }

  // Check if hooks are working
  if (typeof useState !== 'undefined') {
    console.log('✅ useState hook available');
  } else {
    console.log('❌ useState hook not available');
  }

  // Check if lucide icons are loaded
  if (typeof lucide !== 'undefined') {
    console.log('✅ Lucide icons loaded');
  } else {
    console.log('❌ Lucide icons not loaded');
  }

} catch (error) {
  console.log('❌ Component check error:', error.message);
}

// 3. Check for brand config issues
console.log('\n🎨 Checking brand config...');
try {
  // This will be logged by the useBrandConfig hook
  console.log('✅ Brand config check initiated');
} catch (error) {
  console.log('❌ Brand config error:', error.message);
}

// 4. Check API endpoints
console.log('\n🌐 Checking API endpoints...');
fetch('/api/resume/analyze-enhanced')
  .then(response => {
    if (response.ok) {
      console.log('✅ Resume API endpoint accessible');
    } else {
      console.log('❌ Resume API returned:', response.status);
    }
  })
  .catch(error => {
    console.log('❌ Resume API error:', error.message);
  });

fetch('/api/admin/config')
  .then(response => {
    if (response.ok) {
      console.log('✅ Admin config API accessible');
    } else {
      console.log('❌ Admin config API returned:', response.status);
    }
  })
  .catch(error => {
    console.log('❌ Admin config API error:', error.message);
  });

// 5. Check for jspdf loading
console.log('\n📄 Checking PDF generation...');
setTimeout(() => {
  try {
    // Look for any jspdf related errors
    const errors = Array.from(document.querySelectorAll('.error')).map(el => el.textContent);
    if (errors.length > 0) {
      console.log('❌ Page errors found:', errors);
    } else {
      console.log('✅ No visible page errors');
    }
  } catch (error) {
    console.log('❌ Error check failed:', error.message);
  }
}, 2000);

// 6. Check DOM elements
console.log('\n🏗️ Checking DOM structure...');
setTimeout(() => {
  try {
    const container = document.querySelector('.container');
    if (container) {
      console.log('✅ Main container found');
    } else {
      console.log('❌ Main container not found');
    }

    const fileUpload = document.querySelector('input[type="file"]');
    if (fileUpload) {
      console.log('✅ File upload input found');
    } else {
      console.log('❌ File upload input not found');
    }

    const buttons = document.querySelectorAll('button');
    console.log(`✅ Found ${buttons.length} buttons`);
  } catch (error) {
    console.log('❌ DOM check error:', error.message);
  }
}, 1000);

console.log('\n🎯 Debugger running... Check console for results.');
