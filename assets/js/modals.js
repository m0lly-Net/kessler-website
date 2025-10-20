document.addEventListener('DOMContentLoaded', function() {
// ===== CONTACT MODALS FUNCTIONALITY =====
    
    // Modal configuration mapping contact cards to modals
    const contactModalMap = {
        0: 'modal-darlene',      
        1: 'modal-pelagia',         
        2: 'modal-aexe',        
        3: 'modal-james',    
        4: 'modal-talia',
        5: 'modal-elizabeth',       
        6: 'modal-daria',       
        7: 'modal-thomas',      // Thomas Müller (pas utilisé - tester si suppression ok DQP)
        
    };
    
    // Get all contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    
    // Add click event to each contact card
    contactCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = contactModalMap[index];
            if (modalId) {
                openModal(modalId);
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Function to open modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }
    
    // Function to close modal
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
    
    // Get all modals
    const allModals = document.querySelectorAll('.contact-modal');
    
    // Add close button functionality to all modals
    allModals.forEach(modal => {
        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        
        // Close on overlay click
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
        
        // Handle form submission
        // const form = modal.querySelector('.cyber-form');
        // if (form) {
        //     form.addEventListener('submit', function(e) {
        //         //e.preventDefault();    // Désactivé car empêche netlify de gérer les envois de forms sur boite mail.
                
        //         // Get form data
        //         const formData = {
        //             name: form.querySelector('input[name="name"]').value,
        //             // email: form.querySelector('input[name="email"]').value,
        //             subject: form.querySelector('input[name="subject"]').value,
        //             message: form.querySelector('textarea[name="message"]').value
        //         };
                
        //         // Show success message
        //         showSuccessMessage('Message envoyé avec succès! 🚀');
                
        //         // Reset form
        //         form.reset();
                
        //         // Close modal after 2 seconds
        //         setTimeout(() => {
        //             closeModal(modal);
        //         }, 2000);
                
        //         // Log form data (in real app, this would send to server)
        //         console.log('Form submitted:', formData);
        //     });
        // }

    // Function to show success message
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        // Remove after 2.5 seconds
        setTimeout(() => {
            successDiv.style.animation = 'modalFadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 2000);
    }
    });
});
