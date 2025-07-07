document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushWidth = document.getElementById('brushWidth');
    const clearCanvas = document.getElementById('clearCanvas');
    const brushPreview = document.getElementById('brushPreview');
            
    // Установка размеров холста
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 50;
        canvas.height = 500;
                
        // Начальные настройки рисования
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushWidth.value;
                
        // Очистка холста
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
                
        // Обновление предпросмотра кисти
        updateBrushPreview();
    }
            
    // Обновление предпросмотра кисти
    function updateBrushPreview() {
        const size = brushWidth.value;
        brushPreview.style.width = `${size}px`;
        brushPreview.style.height = `${size}px`;
        brushPreview.style.backgroundColor = colorPicker.value;
    }
            
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
            
    // Переменные для отслеживания состояния рисования
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
            
    // Начало рисования
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }
            
            // Рисование
    function draw(e) {
        if (!isDrawing) return;
                
        const [currentX, currentY] = getCoordinates(e);
                
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
                
        [lastX, lastY] = [currentX, currentY];
    }
            
    // Получение координат с учетом поддержки touch-событий
    function getCoordinates(e) {
        if (e.type.includes('touch')) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0] || e.changedTouches[0];
            return [
                touch.clientX - rect.left,
                touch.clientY - rect.top
            ];
        } else {
            return [
                e.offsetX,
                e.offsetY
            ];
        }
    }
            
    // Окончание рисования
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Обновление цвета кисти
    colorPicker.addEventListener('input', function() {
        ctx.strokeStyle = this.value;
        updateBrushPreview();
    });
    
    // Обновление толщины кисти
    brushWidth.addEventListener('input', function() {
        ctx.lineWidth = this.value;
        updateBrushPreview();
    });
    
    // Очистка холста
    clearCanvas.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить холст?')) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    });
    
    // Добавление поддержки touch-устройств
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        draw(e);
    });
    
    canvas.addEventListener('touchend', stopDrawing);
    
    // Добавление поддержки мыши
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Инициализация предпросмотра кисти
    updateBrushPreview();
    
    // Добавление примера приветственного рисунка
    setTimeout(() => {
        ctx.font = '30px Arial';
        ctx.fillStyle = '#e0e0e0';
        ctx.textAlign = 'center';
        ctx.fillText('Начните рисовать здесь!', canvas.width/2, canvas.height/2);
    }, 500);
});