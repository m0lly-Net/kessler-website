
/*
 * CONTACT MODALS - SYSTÈME DYNAMIQUE
 * Charge les contacts depuis contacts.json et génère les modals automatiquement
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Contact Modals Dynamique - Initialisation...');
    
    // Charger les données des contacts
    fetch('./contacts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Impossible de charger contacts.json');
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Contacts chargés:', data.contacts.length);
            initializeContactModals(data.contacts);
        })
        .catch(error => {
            console.error('❌ Erreur lors du chargement des contacts:', error);
        });
    
    /**
     * Initialise tous les modals et boutons pour les contacts
     * @param {Array} contacts - Tableau des contacts
     */
    function initializeContactModals(contacts) {
        contacts.forEach(contact => {
            // Créer le modal de profil si nécessaire
            if (contact.hasProfileModal) {
                createProfileModal(contact);
                
                // Attacher l'événement au bouton "Voir le profil"
                const btnProfile = document.getElementById(`btn-profile-${contact.id}`);
                if (btnProfile) {
                    btnProfile.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(`modal-${contact.id}-profile`);
                        console.log(`✅ Modal profil ${contact.name} ouvert`);
                    });
                }
            }
            
            // Créer le modal de message si nécessaire
            if (contact.hasMessageModal) {
                createMessageModal(contact);
                
                // Attacher l'événement au bouton "Envoyer un message"
                const btnMessage = document.getElementById(`btn-message-${contact.id}`);
                if (btnMessage) {
                    btnMessage.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(`modal-${contact.id}-message`);
                        console.log(`✅ Modal message ${contact.name} ouvert`);
                    });
                }
            }
        });
        
        // Initialiser les gestionnaires de fermeture
        initializeModalClosing();
        
        console.log('✨ Système de modals dynamique initialisé avec succès');
    }
    
    /**
     * Crée un modal de profil pour un contact
     * @param {Object} contact - Données du contact
     */
    function createProfileModal(contact) {
        const modalId = `modal-${contact.id}-profile`;
        
        // Vérifier si le modal existe déjà
        if (document.getElementById(modalId)) {
            console.log(`ℹ️ Modal ${modalId} existe déjà`);
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'contact-modal';
        
        // Construire l'avatar
        const avatarContent = contact.avatarImage 
            ? `<img src="${contact.avatarImage}" alt="Avatar de ${contact.name}" class="avatar-image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : `<span class="avatar-initials">${contact.avatarInitials}</span>`;
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <div class="modal-avatar ${contact.avatarType}-avatar">
                        ${avatarContent}
                    </div>
                    <h2 class="modal-name">${contact.name}</h2>
                    <p class="modal-title">${contact.title}</p>
                    ${contact.department ? `
                    <p class="has-text-grey">   
                        Département : ${contact.department} <br>
                        Responsable : ${contact.manager || 'N/A'}
                    </p>` : ''}
                </div>
                <div class="modal-body">
                    <div class="modal-bio">
                        <h3><i class="fas fa-user-circle"></i> Profil</h3>
                        ${contact.bio}
                    </div>
                    ${contact.igMessenger ? `
                    <div class="modal-contact-form">
                        <h3><i class="fas fa-envelope"></i>Messagerie IG : ${contact.igMessenger}</h3>
                    </div>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log(`📝 Modal profil créé: ${modalId}`);
    }
    
    /**
     * Crée un modal de message pour un contact
     * @param {Object} contact - Données du contact
     */
    function createMessageModal(contact) {
        const modalId = `modal-${contact.id}-message`;
        
        // Vérifier si le modal existe déjà
        if (document.getElementById(modalId)) {
            console.log(`ℹ️ Modal ${modalId} existe déjà`);
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'contact-modal';
        
        // Construire l'avatar
        const avatarContent = contact.avatarImage 
            ? `<img src="${contact.avatarImage}" alt="Avatar de ${contact.name}" class="avatar-image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : `<span class="avatar-initials">${contact.avatarInitials}</span>`;
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <div class="modal-avatar ${contact.avatarType}-avatar">
                        ${avatarContent}
                    </div>
                    <h2 class="modal-name">Contacter ${contact.name}</h2>
                    <p class="modal-title">${contact.title}</p>
                    ${contact.department ? `
                    <p class="has-text-grey">   
                        Département : ${contact.department} <br>
                        Responsable : ${contact.manager || 'N/A'}
                    </p>` : ''}
                </div>
                <div class="modal-body">
                    <div class="modal-contact-form">
                        <h3><i class="fas fa-envelope"></i> Envoyer un message à ${contact.name.split(' ')[0]}</h3>
                        <form name="${contact.contactFormName}" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="cyber-form" action="/merci.html">
                            <!-- Champs obligatoires pour Netlify -->
                            <input type="hidden" name="form-name" value="${contact.contactFormName}">
                            <input type="hidden" name="bot-field" aria-hidden="true">
                            <input type="hidden" name="predefined-message" value="${contact.contactFormMessage}">
                            <div class="form-group">
                                <label>Nom complet</label>
                                <input type="text" name="name" required placeholder="Votre nom">
                            </div>
                            <div class="form-group">
                                <label>Sujet</label>
                                <input type="text" name="subject" required placeholder="Sujet du message">
                            </div>
                            <div class="form-group">
                                <label>Message</label>
                                <textarea name="message" rows="5" required placeholder="Votre message..."></textarea>
                            </div>
                            <div>
                                <button type="submit" class="cyber-btn">
                                    <i class="fas fa-paper-plane"></i> ENVOYER
                                </button>
                            </div>
                        </form>
                        <br><br><br><br>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log(`📝 Modal message créé: ${modalId}`);
    }
    
    /**
     * Ouvre un modal spécifique
     * @param {string} modalId - L'ID du modal à ouvrir
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log(`📂 Modal ouvert: ${modalId}`);
        } else {
            console.error(`❌ Modal non trouvé: ${modalId}`);
        }
    }
    
    /**
     * Ferme un modal spécifique
     * @param {HTMLElement} modal - L'élément modal à fermer
     */
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        console.log('📪 Modal fermé');
    }
    
    /**
     * Initialise les gestionnaires d'événements pour fermer les modals
     */
    function initializeModalClosing() {
        // Utiliser la délégation d'événements pour gérer tous les modals dynamiques
        document.addEventListener('click', function(e) {
            // Fermeture via le bouton X
            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.contact-modal');
                if (modal) {
                    closeModal(modal);
                }
            }
            
            // Fermeture via l'overlay
            if (e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.contact-modal');
                if (modal) {
                    closeModal(modal);
                }
            }
        });
        
        // Fermeture avec la touche ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModals = document.querySelectorAll('.contact-modal.active');
                activeModals.forEach(modal => {
                    closeModal(modal);
                });
            }
        });
        
        console.log('✅ Gestionnaires de fermeture initialisés');
    }
});
