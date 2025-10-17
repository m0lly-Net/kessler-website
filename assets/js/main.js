
// Kessler Industries - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const navbarBurger = document.querySelector('.navbar-burger');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarBurger && navbarMenu) {
        navbarBurger.addEventListener('click', function() {
            navbarBurger.classList.toggle('is-active');
            navbarMenu.classList.toggle('is-active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-item[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 60;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbarMenu && navbarMenu.classList.contains('is-active')) {
                    navbarBurger.classList.remove('is-active');
                    navbarMenu.classList.remove('is-active');
                }
            }
        });
    });
    
    // Add glow effect to elements on hover
    const glowElements = document.querySelectorAll('.cyber-card, .stat-box, .cyber-news-item');
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.3)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        });
    });
    
    // Typing effect for subtitle
    function typeWriter(element, text, speed) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Initialize typing effect if subtitle exists
    const subtitle = document.querySelector('.cyber-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        setTimeout(() => {
            typeWriter(subtitle, originalText, 100);
        }, 2000);
    }
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.cyber-hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.cyber-card, .cyber-news-item, .cyber-data-panel, .stat-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add random glitch effect to title periodically
    function addGlitchEffect() {
        const title = document.querySelector('.glitch');
        if (title) {
            title.classList.add('glitching');
            setTimeout(() => {
                title.classList.remove('glitching');
            }, 200);
        }
    }
    
    // Random glitch every 5-10 seconds
    setInterval(addGlitchEffect, Math.random() * 5000 + 5000);
    
    // Add matrix rain effect to background (optional)
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-2';
        canvas.style.opacity = '0.05';
        
        document.body.appendChild(canvas);
        
        const chars = '01';
        const charArray = chars.split('');
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00d4ff';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(draw, 35);
    }
    
    // Initialize matrix rain effect
    createMatrixRain();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
    
    // Add click effects to buttons and cards
    document.addEventListener('click', function(e) {
        // Create ripple effect
        if (e.target.closest('.cyber-card, .stat-box, .report-item')) {
            const element = e.target.closest('.cyber-card, .stat-box, .report-item');
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '4px';
            ripple.style.height = '4px';
            ripple.style.backgroundColor = 'rgba(0, 212, 255, 0.6)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            element.style.position = 'relative';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(20);
                opacity: 0;
            }
        }
        
        .glitching {
            animation: intense-glitch 0.2s;
        }
        
        @keyframes intense-glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(style);
});
