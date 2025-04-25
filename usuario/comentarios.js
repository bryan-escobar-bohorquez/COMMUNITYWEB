document.addEventListener('DOMContentLoaded', function() {
    const commentsContainer = document.getElementById('commentsContainer');
    const commentInput = document.getElementById('commentInput');
    const submitBtn = document.getElementById('submitComment');
    
    // Clave para el LocalStorage
    const STORAGE_KEY = 'cristobal_comments';
    
    // Cargar comentarios desde LocalStorage o inicializar array vacío
    let comments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Función para guardar en LocalStorage
    function saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
        updateConsole();
    }
    
    // Función para actualizar la consola
    function updateConsole() {
        console.clear();
        console.log("Comentarios almacenados:");
        console.table(comments);
        console.log("Datos en LocalStorage:", localStorage.getItem(STORAGE_KEY));
    }
    
    // Función para renderizar comentarios
    function renderComments() {
        commentsContainer.innerHTML = '';
        comments.forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <div class="comment-user">Usuario ${index + 1}</div>
                <p class="comment-text">${comment.text}</p>
                <div class="comment-actions">
                    <span class="comment-date">${new Date(comment.date).toLocaleString()}</span>
                    <button class="delete-btn" data-id="${comment.id}">Eliminar</button>
                </div>
            `;
            commentsContainer.appendChild(commentDiv);
        });
        
        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const commentId = parseInt(this.getAttribute('data-id'));
                deleteComment(commentId);
            });
        });
    }
    
    // Función para agregar comentario
    function addComment(text) {
        if (!text.trim()) return;
        
        const newComment = {
            id: Date.now(),
            text: text,
            date: new Date().toISOString()
        };
        
        comments.push(newComment);
        saveToStorage();
        renderComments();
        commentInput.value = '';
    }
    
    // Función para eliminar comentario
    function deleteComment(id) {
        comments = comments.filter(comment => comment.id !== id);
        saveToStorage();
        renderComments();
    }
    
    // Event Listeners
    submitBtn.addEventListener('click', function() {
        addComment(commentInput.value);
    });
    
    commentInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addComment(commentInput.value);
        }
    });
    
    // Comentarios de ejemplo solo si no hay ninguno guardado
    if (comments.length === 0) {
        comments = [
            {
                id: 1,
                text: "Excelente profesional, siempre puntual.",
                date: new Date().toISOString()
            },
            {
                id: 2,
                text: "Muy confiable y responsable en su trabajo.",
                date: new Date().toISOString()
            },
            {
                id: 3,
                text: "Recomendado 100%, gran capacidad de trabajo.",
                date: new Date().toISOString()
            }
        ];
        saveToStorage();
    }
    
    // Renderizar inicialmente
    renderComments();
    updateConsole();
});