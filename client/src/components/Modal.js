class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalBtn = document.getElementById('modal-btn');
        this.attachListeners();
    }

    attachListeners() {
        this.modalBtn.addEventListener('click', this.show.bind(this));
        document.addEventListener('click', this.outsideClick.bind(this));
        document.addEventListener('closemodal', this.close.bind(this));
    }

    show() {
        this.modal.style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
        document.dispatchEvent(new Event('resetform'));
    }

    outsideClick(e) {
        if (e.target === this.modal) {
            this.close();
        }
    }
}

export default Modal;
