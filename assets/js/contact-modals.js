/*
 * CONTACT MODALS - NOUVEAU SYSTÈME DE MODALS SÉPARÉS
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Contact Modals - Nouveau système initialisé');
    
    // ===== CONFIGURATION DES BOUTONS POUR TALIA VOSS =====
    
    // Bouton "Voir le profil" de Talia Voss
    const btnProfileTalia = document.getElementById('btn-profile-talia');
    if (btnProfileTalia) {
        btnProfileTalia.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Empêche la propagation au parent
            openModal('modal-talia-profile');
            console.log('✅ Modal profil Talia ouvert');
        });
    }
    
    // Bouton "Envoyer un message" de Talia Voss
    const btnMessageTalia = document.getElementById('btn-message-talia');
    if (btnMessageTalia) {
        btnMessageTalia.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Empêche la propagation au parent
            openModal('modal-talia-message');
            console.log('✅ Modal message Talia ouvert');
        });
    }
    
    // ===== FONCTIONS DE GESTION DES MODALS =====
    
    /**
     * Ouvre un modal spécifique
     * @param {string} modalId - L'ID du modal à ouvrir
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Empêche le scroll en arrière-plan
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
        document.body.style.overflow = ''; // Restaure le scroll
        console.log('📪 Modal fermé');
    }
    
    // ===== GESTION DE LA FERMETURE DES MODALS =====
    
    // Récupère tous les nouveaux modals (ceux avec les IDs spécifiques)
    const newModals = [
        document.getElementById('modal-talia-profile'),
        document.getElementById('modal-talia-message')
    ].filter(modal => modal !== null);
    
    // Ajoute les événements de fermeture pour chaque modal
    newModals.forEach(modal => {
        // Bouton de fermeture (X)
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        
        // Fermeture en cliquant sur l'overlay (fond sombre)
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeModal(modal);
            });
        }
    });
    
    // Fermeture avec la touche ESC (Échap)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            newModals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
    
    // ===== GESTION DU FORMULAIRE =====
    
    // Le formulaire est géré par Netlify, pas besoin de JavaScript supplémentaire
    // Le formulaire se soumettra naturellement et redirigera vers /merci.html
    
    console.log('✨ Système de modals séparés initialisé avec succès');
    console.log(`📊 Nombre de nouveaux modals gérés: ${newModals.length}`);
});
