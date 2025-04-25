document.addEventListener('DOMContentLoaded', function() {
    // Idiomas disponibles con sus niveles
    const languageOptions = {
        "Español": ["Nativo", "Avanzado", "Intermedio", "Básico"],
        "Inglés": ["Nativo", "Avanzado (C2)", "Intermedio Alto (B2-C1)", "Intermedio (B1)", "Básico (A1-A2)"],
        "Francés": ["Avanzado (C2)", "Intermedio Alto (B2-C1)", "Intermedio (B1)", "Básico (A1-A2)"],
        "Alemán": ["Avanzado (C2)", "Intermedio Alto (B2-C1)", "Intermedio (B1)", "Básico (A1-A2)"],
        "Portugués": ["Nativo", "Avanzado", "Intermedio", "Básico"],
        "Italiano": ["Avanzado", "Intermedio", "Básico"],
        "Chino Mandarín": ["Intermedio", "Básico"],
        "Japonés": ["Intermedio", "Básico"],
        "Árabe": ["Intermedio", "Básico"],
        "Ruso": ["Intermedio", "Básico"]
    };

    // Elementos editables del perfil
    const profileElements = {
        name: document.getElementById('profile-name'),
        title: document.getElementById('profile-title'),
        location: document.getElementById('profile-location'),
        email: document.getElementById('profile-email'),
        phone: document.getElementById('profile-phone'),
        description: document.getElementById('profile-description'),
        documentUpload: document.getElementById('document-upload'),
        documentsContainer: document.querySelector('.documents-container')
    };

    // Elementos de idiomas
    const languageElements = {
        container: document.getElementById('languages-container'),
        addBtn: document.getElementById('add-language-btn'),
        select: document.getElementById('language-select'),
        levelContainer: document.getElementById('level-container')
    };

    // Cargar datos guardados
    loadSavedData();

    // Activar modo edición para todos los campos
    enableEditing();

    // Event Listeners
    languageElements.addBtn.addEventListener('click', addLanguage);
    languageElements.select.addEventListener('change', showLevelOptions);
    profileElements.documentUpload.addEventListener('change', handleDocumentUpload);
    document.getElementById('add-exp-btn').addEventListener('click', addExperience);
    document.getElementById('add-edu-btn').addEventListener('click', addEducation);
    
    // Guardar automáticamente al hacer cambios
    Object.values(profileElements).forEach(element => {
        if (element && element.contentEditable !== undefined) {
            element.addEventListener('input', debounce(saveProfile, 1000));
        }
    });

    // Mostrar opciones de nivel para el idioma seleccionado
    function showLevelOptions() {
        const selectedLanguage = languageElements.select.value;
        languageElements.levelContainer.innerHTML = '';
        
        if (selectedLanguage && languageOptions[selectedLanguage]) {
            const levels = languageOptions[selectedLanguage];
            
            levels.forEach((level, index) => {
                const levelId = `level-${selectedLanguage.toLowerCase().replace(' ', '-')}-${index}`;
                
                const levelDiv = document.createElement('div');
                levelDiv.className = 'level-option';
                
                levelDiv.innerHTML = `
                    <input type="radio" id="${levelId}" name="language-level" value="${level}">
                    <label for="${levelId}">${level}</label>
                `;
                
                languageElements.levelContainer.appendChild(levelDiv);
            });
            
            languageElements.levelContainer.style.display = 'block';
        } else {
            languageElements.levelContainer.style.display = 'none';
        }
    }

    // Añadir nuevo idioma
    function addLanguage() {
        const selectedLanguage = languageElements.select.value;
        const selectedLevelRadio = document.querySelector('input[name="language-level"]:checked');
        
        if (selectedLanguage && selectedLevelRadio) {
            const languageId = `lang-${Date.now()}`;
            const selectedLevel = selectedLevelRadio.value;
            
            const languageCard = document.createElement('div');
            languageCard.className = 'language-card';
            languageCard.dataset.language = selectedLanguage;
            languageCard.dataset.level = selectedLevel;
            
            languageCard.innerHTML = `
                <div class="language-info">
                    <span class="language-name">${selectedLanguage}</span>
                    <span class="language-level">${selectedLevel}</span>
                </div>
                <button class="remove-language">×</button>
            `;
            
            languageElements.container.appendChild(languageCard);
            
            // Resetear el formulario
            languageElements.select.value = '';
            languageElements.levelContainer.innerHTML = '';
            languageElements.levelContainer.style.display = 'none';
            document.querySelectorAll('input[name="language-level"]').forEach(radio => radio.checked = false);
            
            // Guardar automáticamente
            saveProfile();
            
            // Mostrar notificación
            showNotification('Idioma añadido');
        } else {
            showNotification('Selecciona un idioma y nivel', 'error');
        }
    }

    // Manejar subida de documentos
    function handleDocumentUpload(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            addDocumentToUI(file.name);
            saveProfile();
        }
    }

    function addDocumentToUI(filename) {
        const documentId = `doc-${Date.now()}`;
        
        const documentItem = document.createElement('div');
        documentItem.className = 'document-item';
        documentItem.dataset.filename = filename;
        documentItem.dataset.id = documentId;
        
        documentItem.innerHTML = `
            <span class="document-name">${filename}</span>
            <button class="remove-document">×</button>
        `;
        
        // Insertar antes del botón de subir
        const uploadDiv = document.querySelector('.add-document');
        uploadDiv.parentNode.insertBefore(documentItem, uploadDiv);
        
        showNotification('Documento añadido');
    }

    // Añadir experiencia profesional
    function addExperience() {
        const expId = `exp-${Date.now()}`;
        
        const expItem = document.createElement('div');
        expItem.className = 'experience-item editable-field';
        expItem.contentEditable = true;
        expItem.dataset.id = expId;
        
        expItem.innerHTML = `
            <p><strong>Nueva Experiencia</strong></p>
            <p><em>Fecha: </em><span class="date-range">[Fecha inicio] - [Fecha fin]</span></p>
            <p><em>Empresa: </em><span class="company">[Nombre empresa]</span></p>
            <p><em>Descripción: </em><span class="description">[Descripción de funciones]</span></p>
            <button class="remove-item">Eliminar</button>
        `;
        
        document.getElementById('experiences-container').insertBefore(expItem, document.querySelector('#experiences-container .add-new'));
        saveProfile();
    }

    // Añadir educación
    function addEducation() {
        const eduId = `edu-${Date.now()}`;
        
        const eduItem = document.createElement('div');
        eduItem.className = 'education-item editable-field';
        eduItem.contentEditable = true;
        eduItem.dataset.id = eduId;
        
        eduItem.innerHTML = `
            <p class="institution">[Institución educativa]</p>
            <p class="date-range">[Fecha inicio] - [Fecha fin]</p>
            <p class="degree">[Título obtenido]</p>
            <button class="remove-item">Eliminar</button>
        `;
        
        document.getElementById('education-container').insertBefore(eduItem, document.querySelector('#education-container .add-new'));
        saveProfile();
    }

    // Eliminar elementos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-language')) {
            e.target.closest('.language-card').remove();
            saveProfile();
            showNotification('Idioma eliminado');
        }
        
        if (e.target.classList.contains('remove-document')) {
            e.target.closest('.document-item').remove();
            saveProfile();
            showNotification('Documento eliminado');
        }
        
        if (e.target.classList.contains('remove-item')) {
            e.target.closest('.experience-item, .education-item').remove();
            saveProfile();
            showNotification('Elemento eliminado');
        }
    });

    // Habilitar edición de todos los campos
    function enableEditing() {
        Object.values(profileElements).forEach(element => {
            if (element && element.contentEditable !== undefined) {
                element.contentEditable = true;
                element.classList.add('editable-field');
            }
        });
    }

    // Validar email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Calcular porcentaje de completado del perfil
    function calculateProfileCompletion() {
        let completedFields = 0;
        const totalFields = 12; // Total de campos a completar
        
        // Campos básicos
        if (profileElements.name.textContent.trim()) completedFields++;
        if (profileElements.title.textContent.trim()) completedFields++;
        if (profileElements.location.textContent.trim()) completedFields++;
        if (profileElements.email.textContent.trim() && validateEmail(profileElements.email.textContent)) completedFields++;
        if (profileElements.phone.textContent.trim()) completedFields++;
        if (profileElements.description.textContent.trim()) completedFields++;
        
        // Idiomas
        if (document.querySelectorAll('.language-card').length > 0) completedFields++;
        
        // Experiencia
        if (document.querySelectorAll('.experience-item').length > 1) completedFields++;
        
        // Educación
        if (document.querySelectorAll('.education-item').length > 1) completedFields++;
        
        // Habilidades
        if (document.querySelectorAll('.skill-tag').length > 0) completedFields++;
        
        // Documentos
        if (document.querySelectorAll('.document-item').length > 1) completedFields++;
        
        const percentage = Math.round((completedFields / totalFields) * 100);
        updateProgressBar(percentage);
    }

    function updateProgressBar(percentage) {
        const progressBar = document.querySelector('.progress');
        progressBar.style.width = `${percentage}%`;
        
        const percentageText = document.querySelector('.progress-container p');
        percentageText.textContent = `Perfil completado al ${percentage}%`;
    }

    // Guardar perfil automáticamente
    function saveProfile() {
        // Validar email antes de guardar
        const email = profileElements.email.textContent;
        if (email && !validateEmail(email)) {
            showNotification('Por favor ingresa un email válido', 'error');
            profileElements.email.focus();
            return;
        }

        const profileData = {
            profile: {},
            languages: [],
            experiences: [],
            education: [],
            documents: []
        };

        // Recoger datos del perfil
        Object.keys(profileElements).forEach(key => {
            if (profileElements[key] && profileElements[key].textContent !== undefined) {
                profileData.profile[key] = profileElements[key].textContent;
            }
        });

        // Recoger idiomas
        document.querySelectorAll('.language-card').forEach(card => {
            profileData.languages.push({
                language: card.dataset.language,
                level: card.dataset.level
            });
        });

        // Recoger experiencias
        document.querySelectorAll('.experience-item').forEach(item => {
            if (item.dataset.id) { // Excluir el botón de añadir
                profileData.experiences.push({
                    id: item.dataset.id,
                    html: item.innerHTML
                });
            }
        });

        // Recoger educación
        document.querySelectorAll('.education-item').forEach(item => {
            if (item.dataset.id) { // Excluir el botón de añadir
                profileData.education.push({
                    id: item.dataset.id,
                    html: item.innerHTML
                });
            }
        });

        // Recoger documentos
        document.querySelectorAll('.document-item').forEach(item => {
            if (item.dataset.id) { // Excluir el botón de subir
                profileData.documents.push({
                    id: item.dataset.id,
                    filename: item.dataset.filename
                });
            }
        });

        // Guardar en localStorage
        localStorage.setItem('profileData', JSON.stringify(profileData));
        
        // Calcular porcentaje de completado
        calculateProfileCompletion();
        
        // Mostrar notificación de autoguardado
        showAutoSaveNotification();
    }

    // Cargar datos guardados
    function loadSavedData() {
        const savedData = localStorage.getItem('profileData');
        if (savedData) {
            const profileData = JSON.parse(savedData);
            
            // Cargar datos del perfil
            Object.keys(profileData.profile || {}).forEach(key => {
                if (profileElements[key]) {
                    profileElements[key].textContent = profileData.profile[key];
                }
            });
            
            // Cargar idiomas
            if (profileData.languages) {
                profileData.languages.forEach(lang => {
                    const languageCard = document.createElement('div');
                    languageCard.className = 'language-card';
                    languageCard.dataset.language = lang.language;
                    languageCard.dataset.level = lang.level;
                    
                    languageCard.innerHTML = `
                        <div class="language-info">
                            <span class="language-name">${lang.language}</span>
                            <span class="language-level">${lang.level}</span>
                        </div>
                        <button class="remove-language">×</button>
                    `;
                    
                    languageElements.container.appendChild(languageCard);
                });
            }
            
            // Cargar experiencias
            if (profileData.experiences) {
                profileData.experiences.forEach(exp => {
                    const expItem = document.createElement('div');
                    expItem.className = 'experience-item editable-field';
                    expItem.contentEditable = true;
                    expItem.dataset.id = exp.id;
                    expItem.innerHTML = exp.html;
                    document.getElementById('experiences-container').insertBefore(expItem, document.querySelector('#experiences-container .add-new'));
                });
            }
            
            // Cargar educación
            if (profileData.education) {
                profileData.education.forEach(edu => {
                    const eduItem = document.createElement('div');
                    eduItem.className = 'education-item editable-field';
                    eduItem.contentEditable = true;
                    eduItem.dataset.id = edu.id;
                    eduItem.innerHTML = edu.html;
                    document.getElementById('education-container').insertBefore(eduItem, document.querySelector('#education-container .add-new'));
                });
            }
            
            // Cargar documentos
            if (profileData.documents) {
                profileData.documents.forEach(doc => {
                    const docItem = document.createElement('div');
                    docItem.className = 'document-item';
                    docItem.dataset.id = doc.id;
                    docItem.dataset.filename = doc.filename;
                    docItem.innerHTML = `
                        <span class="document-name">${doc.filename}</span>
                        <button class="remove-document">×</button>
                    `;
                    document.querySelector('.documents-container').insertBefore(docItem, document.querySelector('.add-document'));
                });
            }
            
            // Calcular porcentaje de completado
            calculateProfileCompletion();
        }
    }

    // Mostrar notificaciones
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Notificación de autoguardado (más discreta)
    function showAutoSaveNotification() {
        const existingNotification = document.querySelector('.auto-save-notification');
        if (existingNotification) existingNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = 'auto-save-notification';
        notification.textContent = 'Cambios guardados';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 1000);
    }

    // Debounce para guardar después de dejar de escribir
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    // Elementos del DOM
    const skillElements = {
        container: document.getElementById('skills-container'),
        input: document.getElementById('new-skill-input'),
        addBtn: document.getElementById('add-skill-btn')
    };

    // Event listeners
    skillElements.addBtn.addEventListener('click', addSkill);
    skillElements.input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addSkill();
    });

    function addSkill() {
        const skillName = skillElements.input.value.trim();
        
        if (skillName) {
            // Crear elemento de habilidad
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag editable-field';
            skillTag.textContent = skillName;
            skillTag.contentEditable = true;
            
            // Añadir a la lista
            skillElements.container.appendChild(skillTag);
            
            // Limpiar input
            skillElements.input.value = '';
            
            // Guardar cambios
            saveProfile();
            showNotification('Habilidad añadida');
        } else {
            showNotification('Ingresa un nombre para la habilidad', 'error');
        }
    }

        // Manejar eliminación de habilidades
        skillElements.container.addEventListener('click', function(e) {
            if (e.target.classList.contains('skill-tag') && e.ctrlKey) {
                e.target.remove();
                saveProfile();
                showNotification('Habilidad eliminada');
            }
    });
});