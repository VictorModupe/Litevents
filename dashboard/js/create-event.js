// Create Event page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('create-event-form');
    const fileUpload = document.getElementById('file-upload');
    const eventImageInput = document.getElementById('event-image');
    const eventNameInput = document.getElementById('event-name');
    const eventLinkInput = document.getElementById('event-link');

    // File upload handling
    if (fileUpload && eventImageInput) {
        fileUpload.addEventListener('click', function() {
            eventImageInput.click();
        });

        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        fileUpload.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });

        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        eventImageInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFile(this.files[0]);
            }
        });
    }

    // Handle file upload
    function handleFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showNotification('File size must be less than 5MB', 'error');
            return;
        }

        // Create file reader
        const reader = new FileReader();
        reader.onload = function(e) {
            displayImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Display image preview
    function displayImagePreview(src) {
        fileUpload.innerHTML = `
            <div class="upload-preview">
                <img src="${src}" alt="Event preview" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <div class="upload-overlay">
                    <button type="button" class="btn btn-outline btn-sm" onclick="removeImage()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        `;
    }

    // Remove image
    window.removeImage = function() {
        eventImageInput.value = '';
        fileUpload.innerHTML = `
            <div class="upload-content">
                <div class="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </div>
                <p class="upload-text">Click or drop files here to upload</p>
                <p class="upload-subtext">Maximum file size: 5MB</p>
            </div>
        `;
    };

    // Auto-generate URL slug from event name
    if (eventNameInput && eventLinkInput) {
        eventNameInput.addEventListener('input', function() {
            const name = this.value;
            const slug = generateSlug(name);
            eventLinkInput.value = slug;
        });
    }

    // Generate URL slug
    function generateSlug(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        const errors = [];

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                errors.push(`${field.labels[0]?.textContent || field.name} is required`);
            } else {
                field.classList.remove('error');
            }
        });

        // Validate event date is in the future
        const eventDate = document.getElementById('event-date');
        const eventStartTime = document.getElementById('event-start-time');
        
        if (eventDate && eventDate.value) {
            const selectedDate = new Date(eventDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                eventDate.classList.add('error');
                errors.push('Event date must be in the future');
            }
        }

        // Validate start time is before end time
        const eventEndTime = document.getElementById('event-end-time');
        if (eventStartTime && eventEndTime && eventStartTime.value && eventEndTime.value) {
            if (eventStartTime.value >= eventEndTime.value) {
                isValid = false;
                eventEndTime.classList.add('error');
                errors.push('End time must be after start time');
            }
        }

        // Validate URL slug is unique (in a real app, this would be an API call)
        const eventLink = document.getElementById('event-link');
        if (eventLink && eventLink.value) {
            const slug = eventLink.value;
            if (slug.length < 3) {
                isValid = false;
                eventLink.classList.add('error');
                errors.push('Event URL must be at least 3 characters long');
            }
        }

        return { isValid, errors };
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const validation = validateForm();
            
            if (!validation.isValid) {
                showNotification(validation.errors[0], 'error');
                return;
            }

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Creating Event...';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Collect form data
                const formData = new FormData(form);
                const eventData = {
                    name: formData.get('event-name') || document.getElementById('event-name').value,
                    description: formData.get('event-description') || document.getElementById('event-description').value,
                    link: formData.get('event-link') || document.getElementById('event-link').value,
                    location: formData.get('event-location') || document.getElementById('event-location').value,
                    category: formData.get('event-category') || document.getElementById('event-category').value,
                    date: formData.get('event-date') || document.getElementById('event-date').value,
                    startTime: formData.get('event-start-time') || document.getElementById('event-start-time').value,
                    endTime: formData.get('event-end-time') || document.getElementById('event-end-time').value,
                    image: eventImageInput.files[0]
                };

                console.log('Event created:', eventData);
                showNotification('Event created successfully!', 'success');
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;

                // Redirect to events page after a short delay
                setTimeout(() => {
                    window.location.href = 'events.html';
                }, 1500);
            }, 2000);
        });
    }

    // Real-time validation for form fields
    const formFields = form?.querySelectorAll('input, textarea, select');
    formFields?.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('error') && this.value.trim()) {
                this.classList.remove('error');
            }
        });
    });

    // Add custom styles for file upload and validation
    const createEventStyle = document.createElement('style');
    createEventStyle.textContent = `
        .file-upload.dragover {
            border-color: var(--primary);
            background: hsla(260, 100%, 66%, 0.05);
        }
        
        .upload-preview {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .upload-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .upload-preview:hover .upload-overlay {
            opacity: 1;
        }
        
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: var(--destructive);
            box-shadow: 0 0 0 3px hsla(0, 84%, 60%, 0.1);
        }
        
        .form-group input.error:focus,
        .form-group textarea.error:focus,
        .form-group select.error:focus {
            border-color: var(--destructive);
            box-shadow: 0 0 0 3px hsla(0, 84%, 60%, 0.2);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(createEventStyle);

    console.log('Create Event page initialized');
});