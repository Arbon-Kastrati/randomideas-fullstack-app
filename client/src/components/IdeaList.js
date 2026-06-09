import ideasApi from '../services/ideasApi.js';

class IdeaList {
    constructor() {
        this.ideaList = document.getElementById('idea-list');
        this.userMsg = document.getElementById('user-msg');
        this.ideas = [];
        this.attachListeners();
        this.getIdeas();
    }

    attachListeners() {
        this.ideaList.addEventListener(
            'click',
            this.handleListClick.bind(this),
        );
        document.addEventListener('updatelist', this.getIdeas.bind(this));
    }

    handleListClick(e) {
        const card = e.target.closest('.card');
        if (!card) return;

        const isEditClicked = e.target.closest('.edit');
        const isDeleteClicked = e.target.closest('.delete');

        if (!isEditClicked && !isDeleteClicked) return;

        const ideaId = card.dataset.id;
        console.log(ideaId);
        const idea = this.ideas.find((ideaOfList) => ideaOfList._id === ideaId);

        if (!idea) {
            const error = new Error(
                `Operation could not be perfomed, idea with ${ideaId} could not be located in the user state`,
            );
            console.error(error);
            return;
        }
        idea._id = ideaId;
        if (isEditClicked) {
            document.dispatchEvent(
                new CustomEvent('editmode', { detail: idea }),
            );
        } else if (isDeleteClicked) {
            this.delete(idea._id, idea.username);
        }
    }

    async delete(id, username) {
        const res = await ideasApi.deleteIdea(id, username);
        if (res.success) {
            const index = this.ideas.findIndex((idea) => idea._id === id);
            this.ideas.splice(index, 1);
            this.render();
            const userMsg = 'Deletion was successful';
            this.showUserMessage(userMsg, 'success');
        } else {
            const userMsg = res.error;
            this.showUserMessage(userMsg, 'error');
        }
    }
    async getIdeas() {
        const res = await ideasApi.getIdeas();
        if (!res.success) {
            const userMsg = res.error;
            this.showUserMessage(userMsg, 'error');
            return;
        }
        this.ideas = res.data;
        if (this.ideas.length === 0) {
            const us = 'There are no ideas to be shown';
            this.showUserMessage(userMsg, 'info');
            return;
        }
        this.render();
    }

    showUserMessage(message, type = 'error', duration = 4000) {
        this.userMsg.textContent = message;
        this.userMsg.classList.add(`alert-${type}`, `alert-show`);

        setTimeout(() => {
            this.userMsg.classList.remove('alert-show');
        }, duration);
    }

    render() {
        this.ideaList.innerHTML = '';
        this.ideas.forEach((idea) => {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('data-id', idea._id);
            card.innerHTML = `
                    <button class="delete"><i class="fas fa-times"></i></button>
                    <button class="edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <h3>
                        ${idea.text}
                    </h3>
                    <p class="tag tag-${idea.tag.toLowerCase()}">${idea.tag.toUpperCase()}</p>
                    <p>
                        Posted on <span class="date">${idea.date}</span> by
                        <span class="author">${idea.username}</span>
                    </p>
        `;
            this.ideaList.appendChild(card);
        });
    }
}

export default IdeaList;
