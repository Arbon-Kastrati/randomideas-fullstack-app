import ideasApi from '../services/ideasApi';

class IdeaForm {
    constructor() {
        this.formModal = document.getElementById('form-modal');
        this.isEditing = false;
        this.idea = null;
        this.render();
        this.attachListeners();
    }

    attachListeners() {
        this.formModal.addEventListener('submit', this.handleSubmit.bind(this));
        document.addEventListener(
            'editmode',
            this.setFormToEditMode.bind(this),
        );
        document.addEventListener(
            'resetform',
            this.resetFormSettings.bind(this),
        );
    }

    setFormToEditMode(event) {
        this.isEditing = true;
        this.idea = event.detail;
        this.render();
        document.getElementById('modal-btn').click();
    }

    resetFormSettings() {
        this.isEditing = false;
        this.idea = null;
        this.render();
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const idea = Object.fromEntries(formData);
        if (this.isEditing) {
            idea._id = this.idea._id;
            const res = await ideasApi.updateIdea(idea);
            if (res.success) {
                const message = 'You idea was updated successfully';
                this.showUserMessage(message, 'success', 1000);
                document.dispatchEvent(new Event('updatelist'));
                return;
            }
            const message =
                res.type === 'VALIDATION'
                    ? res.error
                    : 'Update was not successful, an error in our end';
            this.showUserMessage(message, 'error', 3000);
        } else {
            const res = await ideasApi.createIdea(idea);
            if (res.success) {
                const message = 'You idea was created successfully';
                this.showUserMessage(message, 'success', 1000);
                document.dispatchEvent(new Event('updatelist'));
                return;
            }
            const message =
                res.type === 'VALIDATION'
                    ? res.error
                    : 'Creation was not successful, an error in our end';
            this.showUserMessage(message, 'error', null);
        }
    }

    showUserMessage(message, type = 'success', duration = 2000) {
        const userEl = document.getElementById('form-user-msg');
        userEl.textContent = message;
        userEl.classList.add(`alert-${type}`, `alert-show`);
        if (duration) {
            setTimeout(() => {
                userEl.classList.remove('alert-show');
                document.dispatchEvent(new Event('closemodal'));
            }, duration);
            return;
        }
    }
    render() {
        this.formModal.innerHTML = `
                <form id="idea-form">
                    <div class="form-control">
                        <label for="idea-text">Enter a Username</label>
                        <input type="text" name="username" id="username" ${this.isEditing ? 'value=' + this.idea.username + ' readonly' : ''}/>
                    </div>
                    <div class="form-control">
                        <label for="idea-text">What's Your Idea?</label>
                        <textarea name="text" id="idea-text">${this.isEditing ? this.idea.text : ''}</textarea>
                    </div>
                    <div class="form-control">
                        <label for="tag">Tag</label>
                        <input type="text" name="tag" id="tag" value="${this.isEditing ? this.idea.tag : ''}"/>
                    </div>
                    <div class="alert" id="form-user-msg"></div>

                    <button class="btn" type="submit" id="${this.isEditing ? 'update' : 'submit'}">
                        ${this.isEditing ? 'Update' : 'Submit'}
                    </button>

                </form>
        `;
    }
}

export default IdeaForm;
