

 AOS.init();

 document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.getElementById('commentCarousel');
            const dotsContainer = document.getElementById('dotsContainer');
            const cards = document.querySelectorAll('.comment-card');
            let currentSlide = 0;
            let slidesPerView = 1;
            let autoSlideInterval;

            function updateSlidesPerView() {
                slidesPerView = window.innerWidth >= 768 ? 2 : 1;
                renderCarousel();
            }

            function renderCarousel() {
                cards.forEach(card => {
                    card.style.flexBasis = `${100 / slidesPerView}%`;
                });

                const dotsCount = Math.ceil(cards.length / slidesPerView);
                dotsContainer.innerHTML = '';

                for (let i = 0; i < dotsCount; i++) {
                    const dot = document.createElement('div');
                    dot.className = `dot ${i === 0 ? 'active' : ''}`;
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }

                goToSlide(currentSlide);
            }

            function goToSlide(slideIndex) {
                const dotsCount = Math.ceil(cards.length / slidesPerView);
                
                if (slideIndex >= dotsCount) slideIndex = 0;
                if (slideIndex < 0) slideIndex = dotsCount - 1;
                
                currentSlide = slideIndex;
                carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

                document.querySelectorAll('.dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            function nextSlide() {
                const dotsCount = Math.ceil(cards.length / slidesPerView);
                goToSlide((currentSlide + 1) % dotsCount);
            }

            function startAutoSlide() {
                autoSlideInterval = setInterval(nextSlide, 4000);
            }

            updateSlidesPerView();
            startAutoSlide();

            window.addEventListener('resize', updateSlidesPerView);

            carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            carousel.addEventListener('mouseleave', startAutoSlide);

            let touchStartX = 0;
            carousel.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
                clearInterval(autoSlideInterval);
            });

            carousel.addEventListener('touchend', e => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextSlide();
                    else {
                        const dotsCount = Math.ceil(cards.length / slidesPerView);
                        goToSlide((currentSlide - 1 + dotsCount) % dotsCount);
                    }
                }
                
                startAutoSlide();
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const contactBtn = document.getElementById('contactBtn');
    const contactModal = document.getElementById('contactModal');
    const modalClose = document.querySelector('.modal-close');
    const successMessage = document.getElementById('successMessage');
    const successClose = document.querySelector('.success-close');
    const contactForm = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn');
    const sendText = document.getElementById('sendText');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Open modal
    contactBtn.addEventListener('click', () => {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    function closeModal() {
        contactModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });

    // Close success message
    successClose.addEventListener('click', () => {
        successMessage.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Form validation
    function validateField(field, errorElement) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.required && value === '') {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value !== '' && !emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.id === 'name' && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        } else if (field.id === 'subject' && value.length < 3) {
            isValid = false;
            errorMessage = 'Subject must be at least 3 characters';
        } else if (field.id === 'message' && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }

        if (isValid) {
            field.classList.remove('error');
            errorElement.textContent = '';
        } else {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            const errorElement = document.getElementById(`${field.id}Error`);
            validateField(field, errorElement);
        });

        field.addEventListener('input', () => {
            field.classList.remove('error');
            document.getElementById(`${field.id}Error`).textContent = '';
        });
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        formFields.forEach(field => {
            const errorElement = document.getElementById(`${field.id}Error`);
            if (!validateField(field, errorElement)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Prepare data for sending
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        sendBtn.disabled = true;
        sendText.textContent = 'Sending...';
        loadingSpinner.style.display = 'block';

        try {
            // Send to your email (using Formspree, EmailJS, or your backend)
            // Note: Replace with your actual email sending method
            
            // Example using Fetch API (you need to create your own endpoint)
            const response = await sendToEmail(formData);
            
            if (response.success) {
                // Show success message
                closeModal();
                successMessage.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset form
                contactForm.reset();
                formFields.forEach(field => {
                    field.classList.remove('error');
                    document.getElementById(`${field.id}Error`).textContent = '';
                });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            alert('Error sending message. Please try again later.');
            console.error('Error:', error);
        } finally {
            // Reset button state
            sendBtn.disabled = false;
            sendText.textContent = 'Send Message';
            loadingSpinner.style.display = 'none';
        }
    });

    // Email sending function (Replace with your implementation)
    async function sendToEmail(formData) {
        // Method 1: Using Formspree (free service)
        // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(formData)
        // });
        // return response.ok;

        // Method 2: Using EmailJS (requires account setup)
        emailjs.send('service_iiavyoo', 'template_q8xvgbq', formData, 'DWabyGc5D-uUZ6Mqr')
            .then(response => ({ success: true }))
            .catch(error => ({ success: false, error }));

         


        // Method 3: Your own backend API
        // const response = await fetch('/api/send-email', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        // return response.json();

        // For demo purposes - simulate successful sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Message to send:', formData);
        return { success: true };
    }

    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (contactModal.classList.contains('active')) {
                closeModal();
            }
            if (successMessage.classList.contains('active')) {
                successMessage.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
});