document.addEventListener('DOMContentLoaded', function() {
    // ========== GESTIÓN DE HABILIDADES ==========
    const skillsManager = {
        skillsContainer: document.querySelector('.skills-container'),
        skillInput: document.getElementById('skill-input'),
        addSkillBtn: document.getElementById('add-skill-btn'),
        
        init: function() {
            this.addSkillBtn.addEventListener('click', () => this.addSkill());
            this.skillInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addSkill();
            });
            
            this.skillsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-skill')) {
                    e.target.parentElement.remove();
                    this.saveSkills();
                }
            });
            
            this.loadSkills();
        },
        
        addSkill: function() {
            const skillName = this.skillInput.value.trim();
            if (!skillName) return;
            
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            skillElement.innerHTML = `
                <span>${skillName}</span>
                <button class="delete-skill">&times;</button>
            `;
            
            this.skillsContainer.insertBefore(skillElement, this.skillsContainer.firstChild);
            this.skillInput.value = '';
            this.saveSkills();
        },
        
        saveSkills: function() {
            const skills = Array.from(this.skillsContainer.querySelectorAll('.skill-item span'))
                .map(skill => skill.textContent);
            localStorage.setItem('userSkills', JSON.stringify(skills));
        },
        
        loadSkills: function() {
            const savedSkills = JSON.parse(localStorage.getItem('userSkills') || '[]');
            savedSkills.forEach(skill => {
                this.skillInput.value = skill;
                this.addSkill();
            });
        }
    };

    // ========== GESTIÓN DE DISPONIBILIDAD ==========
    const availabilityManager = {
        checkboxes: document.querySelectorAll('.availability-option input[type="checkbox"]'),
        
        init: function() {
            this.checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => this.saveAvailability());
            });
            this.loadAvailability();
        },
        
        saveAvailability: function() {
            const availability = {};
            this.checkboxes.forEach(checkbox => {
                availability[checkbox.id] = checkbox.checked;
            });
            localStorage.setItem('userAvailability', JSON.stringify(availability));
        },
        
        loadAvailability: function() {
            const savedAvailability = JSON.parse(localStorage.getItem('userAvailability') || '{}');
            this.checkboxes.forEach(checkbox => {
                checkbox.checked = savedAvailability[checkbox.id] || false;
            });
        }
    };

    // ========== GESTIÓN DE DOCUMENTOS ==========
    // ========== GESTIÓN DE DOCUMENTOS ==========
const documentsManager = {
    uploadInput: document.getElementById('document-upload'),
    documentsList: document.querySelector('.documents-list'),

    init: function() {
        this.uploadInput.addEventListener('change', (e) => this.handleUpload(e));
        this.documentsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-doc')) {
                e.target.closest('.document-item').remove();
                this.saveDocuments();
            }

            if (e.target.classList.contains('download-doc')) {
                const link = e.target.dataset.link;
                const name = e.target.dataset.name;
                const a = document.createElement('a');
                a.href = link;
                a.download = name;
                a.click();
            }
        });
        this.loadDocuments();
    },

    handleUpload: function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo no debe exceder 5MB');
            return;
        }

        if (!file.type.includes('pdf')) {
            alert('Solo se permiten archivos PDF');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.addDocument(file.name, reader.result);
            this.saveDocuments();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    },

    addDocument: function(filename, fileData) {
        const docElement = document.createElement('div');
        docElement.className = 'document-item';
        docElement.innerHTML = `
            <span class="document-name">${filename}</span>
            <div>
                <button class="download-doc" data-link="${fileData}" data-name="${filename}" title="Descargar">⬇️</button>
                <button class="delete-doc" title="Eliminar">&times;</button>
            </div>
        `;
        this.documentsList.appendChild(docElement);
    },

    saveDocuments: function() {
        const documents = Array.from(this.documentsList.querySelectorAll('.document-item')).map(item => {
            const name = item.querySelector('.document-name').textContent;
            const link = item.querySelector('.download-doc').dataset.link;
            return { name, link };
        });
        localStorage.setItem('userDocuments', JSON.stringify(documents));
    },

    loadDocuments: function() {
        const savedDocuments = JSON.parse(localStorage.getItem('userDocuments') || '[]');
        savedDocuments.forEach(doc => this.addDocument(doc.name, doc.link));
    }
};



    // Inicializar todos los managers
    skillsManager.init();
    availabilityManager.init();
    documentsManager.init();

    // ========== FUNCIONES AUXILIARES ==========
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 10);
    }
});