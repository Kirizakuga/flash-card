let flashcardsData = [];
let currentCardIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupBlock = document.getElementById('popup-block');
    const flashcard = document.getElementById('flashcard');
    const flashcardInner = document.querySelector('.flashcard-inner');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const resetBtn = document.getElementById('resetBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    const cardCounter = document.getElementById('cardCounter');
    
    let isFlipped = false;
    let toastCollapsed = false; 

    function showToast(message, type = 'info', timeout = 3500) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        container.appendChild(toast);

        anime({
            targets: toast,
            translateX: [-40, 0],
            opacity: [0, 1],
            duration: 350,
            easing: 'easeOutQuad'
        });

        const tid = setTimeout(() => {
            anime({
                targets: toast,
                translateX: [0, -40],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => toast.remove()
            });
        }, timeout);

        toast.addEventListener('click', () => {
            clearTimeout(tid);
            anime({
                targets: toast,
                translateX: [0, -40],
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuad',
                complete: () => toast.remove()
            });
        });

        window.requestAnimationFrame(() => {
            const container = document.getElementById('toast-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                if (rect.top <= 10) {
                    collapseToastStack();
                    showLimitPopup();
                }
            }
        });

        return toast;
    }

    function showLimitPopup() {
        if (document.getElementById('limit-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'limit-overlay';
        overlay.className = 'limit-overlay';

        const modal = document.createElement('div');
        modal.id = 'limit-modal';
        modal.className = 'limit-modal';

        const msg = document.createElement('div');
        msg.className = 'limit-msg';
        msg.textContent = 'Bấm ít thôi bạn ơi!';

        const btnPrev = document.createElement('button');
        btnPrev.className = 'limit-btn';
        btnPrev.textContent = 'lmao, tiếp đi';

        const btnClear = document.createElement('button');
        btnClear.className = 'limit-btn limit-btn-clear';
        btnClear.textContent = 'đùa đấy, bấm thoải mái';

        modal.appendChild(msg);
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.justifyContent = 'center';
        controls.style.gap = '12px';
        controls.appendChild(btnPrev);
        controls.appendChild(btnClear);
        modal.appendChild(controls);

        overlay.style.opacity = '0';
        modal.style.opacity = '0';
        modal.style.transform = 'translateY(24px) scale(0.94)';

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        anime.timeline()
            .add({ targets: overlay, opacity: [0, 1], duration: 220, easing: 'linear' })
            .add({ targets: modal, translateY: [24, -8, 0], scale: [0.94, 1.03, 1], opacity: [0, 1], duration: 520, easing: 'easeOutElastic(1, .7)' }, '-=80');

        const dismiss = () => {
            anime.timeline()
                .add({ targets: modal, translateY: [0, -20], opacity: [1, 0], scale: [1, 0.95], duration: 260, easing: 'easeInQuad' })
                .add({ targets: overlay, opacity: [1, 0], duration: 160, easing: 'linear', complete: () => { try { overlay.remove(); } catch (e) {} } }, '-=120');
        };

        btnPrev.addEventListener('click', () => {
            try { prevBtn.click(); } catch (e) {}
            dismiss();
        });

        btnClear.addEventListener('click', () => {
            collapseToastStack();
            dismiss();
        });
    }

    function showConfirm(message, title = '') {
        return new Promise((resolve) => {
            if (document.getElementById('confirm-overlay')) return resolve(false);

            const overlay = document.createElement('div');
            overlay.id = 'confirm-overlay';
            overlay.className = 'limit-overlay';

            const modal = document.createElement('div');
            modal.id = 'confirm-modal';
            modal.className = 'limit-modal';

            if (title) {
                const h = document.createElement('div');
                h.style.fontSize = '24px';
                h.style.fontWeight = '900';
                h.style.marginBottom = '8px';
                h.textContent = title;
                modal.appendChild(h);
            }

            const msg = document.createElement('div');
            msg.className = 'limit-msg';
            msg.style.fontSize = '18px';
            msg.style.textTransform = 'none';
            msg.style.webkitTextStroke = '0';
            msg.textContent = message;

            const btnConfirm = document.createElement('button');
            btnConfirm.className = 'limit-btn';
            btnConfirm.textContent = 'Confirm';

            const btnCancel = document.createElement('button');
            btnCancel.className = 'limit-btn limit-btn-clear';
            btnCancel.textContent = 'Cancel';

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.justifyContent = 'center';
            controls.style.gap = '12px';
            controls.style.marginTop = '12px';
            controls.appendChild(btnConfirm);
            controls.appendChild(btnCancel);

            modal.appendChild(msg);
            modal.appendChild(controls);

            overlay.style.opacity = '0';
            modal.style.opacity = '0';
            modal.style.transform = 'translateY(20px) scale(0.96)';

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            anime.timeline()
                .add({ targets: overlay, opacity: [0, 1], duration: 200, easing: 'linear' })
                .add({ targets: modal, translateY: [20, -6, 0], scale: [0.96, 1.02, 1], opacity: [0, 1], duration: 420, easing: 'easeOutElastic(1, .7)' }, '-=80');

            const cleanup = (val) => {
                anime.timeline()
                    .add({ targets: modal, translateY: [0, 16], opacity: [1, 0], scale: [1, 0.96], duration: 240, easing: 'easeInQuad' })
                    .add({ targets: overlay, opacity: [1, 0], duration: 160, easing: 'linear', complete: () => { try { overlay.remove(); } catch (e) {} resolve(val); } }, '-=120');
            };

            btnConfirm.addEventListener('click', () => cleanup(true));
            btnCancel.addEventListener('click', () => cleanup(false));

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(false);
            });
        });
    }

    function collapseToastStack() {
        if (toastCollapsed) return;
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toasts = Array.from(container.children);
        if (toasts.length === 0) return;

        toastCollapsed = true;
        toasts.forEach((t, i) => {
            const dirX = (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 200);
            const dirY = -150 - Math.random() * 200;
            const rot = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
            anime({
                targets: t,
                translateX: [0, dirX],
                translateY: [0, dirY],
                rotate: [0, rot],
                opacity: [1, 0],
                scale: [1, 0.6],
                duration: 700,
                delay: i * 45,
                easing: 'cubicBezier(.2,.8,.2,1)'
            });
        });

        const flash = document.createElement('div');
        flash.id = 'dramatic-flash';
        flash.style.position = 'fixed';
        flash.style.inset = 0;
        flash.style.background = '#fff';
        flash.style.opacity = '0';
        flash.style.zIndex = 99997;
        document.body.appendChild(flash);

        anime.timeline()
            .add({
                targets: flash,
                opacity: [0, 0.85],
                duration: 120,
                easing: 'linear'
            })
            .add({
                targets: flash,
                opacity: [0.85, 0],
                duration: 220,
                easing: 'linear',
                offset: '+=80',
                complete: function() { try { flash.remove(); } catch(e){} }
            });

        document.body.classList.add('dramatic-shake');
        setTimeout(() => document.body.classList.remove('dramatic-shake'), 700);

        setTimeout(() => { try { container.remove(); } catch (e) {} }, 900);

        setTimeout(() => { showLimitPopup(true); }, 350);

        setTimeout(() => { toastCollapsed = false; }, 1400);
    }

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    resetBtn.addEventListener('click', async () => {
            const ok = await showConfirm('Reset all uploaded data and allow a new upload?', 'Reset data');
            if (!ok) return;

        resetBtn.disabled = true;
        try {
            const resp = await fetch('/reset', { method: 'POST' });
            const data = await resp.json();
            if (data.success) {
                flashcardsData = [];
                currentCardIndex = 0;
                questionText.textContent = 'Nhap file excel di';
                answerText.textContent = 'No answer yet';
                cardCounter.textContent = '0 / 0';
                popupOverlay.classList.remove('active');
                popupBlock.classList.remove('active');
                uploadBtn.textContent = 'Nhap file excel di';
                uploadBtn.disabled = false;
                showToast('Uploaded data reset. You can upload a new file now.', 'info');
            } else {
                showToast('Failed to reset data', 'error');
            }
        } catch (err) {
            showToast('Error resetting data: ' + (err.message || err), 'error');
        } finally {
            resetBtn.disabled = false;
        }
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            uploadBtn.textContent = 'Uploading...';
            uploadBtn.disabled = true;

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                flashcardsData = data.flashcards;
                currentCardIndex = 0;
                updateCard();
                uploadBtn.textContent = `✅ ${data.count} Cards Loaded`;
                uploadBtn.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    uploadBtn.textContent = 'Nhập file excel';
                    uploadBtn.style.backgroundColor = '';
                    uploadBtn.disabled = false;
                }, 2000);
            } else {
                showToast('Error: ' + data.error, 'error');
                uploadBtn.textContent = 'Upload Failed';
                uploadBtn.disabled = false;
            }
        } catch (error) {
            showToast('Error uploading file: ' + error.message, 'error');
            uploadBtn.textContent = 'Upload Failed';
            uploadBtn.disabled = false;
        }

        fileInput.value = '';
    });

    openButton.addEventListener('click', () => {
        if (flashcardsData.length === 0) {
            showToast('đã nhập file excel chưa :>>?', 'warning');
            return;
        }
        
        popupOverlay.classList.add('active');
        popupBlock.classList.add('active');
        
        isFlipped = false;
        flashcardInner.style.transform = 'rotateY(0deg)';
        
        anime({
            targets: flashcard,
            scale: [0.5, 1],
            rotateY: [360, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutElastic(1, .6)'
        });
    });

    popupOverlay.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
        popupBlock.classList.remove('active');
    });
    
    popupBlock.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    flashcard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        
        anime({
            targets: flashcardInner,
            rotateY: isFlipped ? 180 : 0,
            duration: 600,
            easing: 'easeInOutQuad'
        });
    });

    prevBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            anime({
                targets: flashcard,
                rotateY: -90,
                opacity: 0,
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    currentCardIndex--;
                    updateCard();
                    resetFlip();
                    anime({
                        targets: flashcard,
                        rotateY: [90, 0],
                        opacity: [0, 1],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentCardIndex < flashcardsData.length - 1) {
            anime({
                targets: flashcard,
                rotateY: 90,
                opacity: 0,
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    currentCardIndex++;
                    updateCard();
                    resetFlip();
                    anime({
                        targets: flashcard,
                        rotateY: [-90, 0],
                        opacity: [0, 1],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }
    });

    function updateCard() {
        if (flashcardsData.length === 0) return;

        const card = flashcardsData[currentCardIndex];
        questionText.textContent = card.question;
        answerText.textContent = card.answer;
        cardCounter.textContent = `${currentCardIndex + 1} / ${flashcardsData.length}`;

        prevBtn.disabled = currentCardIndex === 0;
        nextBtn.disabled = currentCardIndex === flashcardsData.length - 1;
    }

    function resetFlip() {
        isFlipped = false;
        anime({
            targets: flashcardInner,
            rotateY: 0,
            duration: 300,
            easing: 'easeInOutQuad'
        });
    }
});