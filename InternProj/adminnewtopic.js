// Background particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particlesCount = 50;

    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(32, 125, 132, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            animation: float ${Math.random() * 10 + 5}s infinite linear;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Initialize topic ID counter
function getNextTopicId() {
    let topicIdCounter = parseInt(localStorage.getItem('topicIdCounter') || '1');
    const id = topicIdCounter++;
    localStorage.setItem('topicIdCounter', topicIdCounter.toString());
    return id;
}

// Tab functionality
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.options-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    event.target.classList.add('active');
    const content = document.getElementById(tabName + '-content');
    if (content) {
        content.classList.add('active');
        content.style.display = 'block';
    }
}

// Text formatting
function formatText(command) {
    const editor = document.getElementById('message');
    editor.focus();
    document.execCommand(command, false, null);
}

function changeFontSize(size) {
    const editor = document.getElementById('message');
    editor.focus();
    document.execCommand('fontSize', false, size);
}

function insertImage() {
    const editor = document.getElementById('message');
    const url = prompt('Enter image URL:');
    if (url) {
        editor.focus();
        document.execCommand('insertImage', false, url);
    }
}

function insertLink() {
    const editor = document.getElementById('message');
    const url = prompt('Enter URL:');
    if (url) {
        const text = prompt('Enter link text:') || url;
        editor.focus();
        document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
    }
}

function insertSmiley(smiley) {
    const editor = document.getElementById('message');
    editor.focus();
    document.execCommand('insertHTML', false, smiley);
}

// File upload
document.getElementById('fileUpload').addEventListener('change', function(e) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    Array.from(e.target.files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.style.cssText = `
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px; background: rgba(32,125,132,0.1); margin-bottom: 10px;
            border-radius: 6px; border-left: 3px solid #207D84;
        `;

        fileItem.innerHTML = `
            <div>
                <strong>${file.name}</strong>
                <div style="font-size: 12px; color: #999;">
                    ${(file.size / 1024).toFixed(1)} KB • ${file.type || 'Unknown type'}
                </div>
            </div>
            <button type="button" onclick="removeFile(${index})"
                    style="background: #dc3545; color: white; border: none;
                           padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                Remove
            </button>
        `;

        fileList.appendChild(fileItem);
    });
});

function removeFile(index) {
    const fileInput = document.getElementById('fileUpload');
    const dt = new DataTransfer();

    Array.from(fileInput.files).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
    });

    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change'));
}

// Poll options
function addPollOption() {
    const pollOptions = document.getElementById('pollOptions');
    const optionCount = pollOptions.children.length + 1;

    const newOption = document.createElement('div');
    newOption.className = 'poll-option-row';
    newOption.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center;';

    newOption.innerHTML = `
        <input type="text" placeholder="Option ${optionCount}" class="poll-option-input"
               style="flex: 1; padding: 8px; background: #222831; color: white;
                      border: 2px solid #393E46; border-radius: 6px;">
        <button type="button" onclick="removePollOption(this)" class="remove-option-btn"
                style="background: #dc3545; color: white; border: none;
                       padding: 8px 12px; border-radius: 6px; cursor: pointer;">×</button>
    `;

    pollOptions.appendChild(newOption);
}

function removePollOption(button) {
    const pollOptions = document.getElementById('pollOptions');
    if (pollOptions.children.length > 2) {
        button.parentElement.remove();
    } else {
        alert('A poll must have at least 2 options.');
    }
}

// Form submission
document.getElementById('newTopicForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value.trim();
    const messageElement = document.getElementById('message');
    const message = messageElement.innerHTML.trim() || messageElement.textContent.trim();

    if (!subject) return alert('Please enter a subject for your topic.');
    if (!message) return alert('Please enter a message for your topic.');

    const formData = {
        id: getNextTopicId(),
        title: subject,
        message: message,
        author: 'Admin',
        date: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', ''),
        type: document.querySelector('input[name="topicType"]:checked').value,
        locked: document.getElementById('lockTopic').checked,
        files: [],
        poll: false,
        pollQuestion: '',
        pollOptions: [],
        pollDuration: 7,
        maxVotes: 1
    };

    const fileInput = document.getElementById('fileUpload');
    if (fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
            formData.files.push({
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file)
            });
        });
    }

    const pollQuestion = document.getElementById('pollQuestion').value.trim();
    if (pollQuestion) {
        const pollOptionInputs = document.querySelectorAll('.poll-option-input');
        const pollOptions = Array.from(pollOptionInputs).map(input => input.value.trim()).filter(Boolean);

        if (pollOptions.length >= 2) {
            formData.poll = true;
            formData.pollQuestion = pollQuestion;
            formData.pollOptions = pollOptions;
            formData.pollDuration = parseInt(document.getElementById('pollDuration').value) || 7;
            formData.maxVotes = parseInt(document.getElementById('maxVotes').value) || 1;
        }
    }

    const storedTopics = JSON.parse(localStorage.getItem('adminTopics') || '[]');
    storedTopics.unshift(formData);
    localStorage.setItem('adminTopics', JSON.stringify(storedTopics));

    showSuccessMessage('Topic created successfully! Redirecting...');
    setTimeout(() => {
        window.location.href = `admin.html?newTopic=${encodeURIComponent(JSON.stringify(formData))}`;
    }, 1500);
});

// Save draft
function saveDraft() {
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').innerHTML;

    const draft = {
        subject,
        message,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('adminTopicDraft', JSON.stringify(draft));
    showSuccessMessage('Draft saved successfully!');
}

// Preview
function previewPost() {
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').innerHTML;

    if (!subject || !message) return alert('Please enter both subject and message to preview.');

    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview: ${subject}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
                .preview-header { border-bottom: 2px solid #207D84; padding-bottom: 10px; margin-bottom: 20px; }
                .preview-content { line-height: 1.6; }
            </style>
        </head>
        <body>
            <div class="preview-header">
                <h2>${subject}</h2>
                <p>By: Admin • ${new Date().toLocaleString()}</p>
            </div>
            <div class="preview-content">${message}</div>
        </body>
        </html>
    `);
}

// Success toast
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: #28a745; color: white;
        padding: 15px 20px; border-radius: 8px;
        z-index: 1000; font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.5s ease-out;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => successDiv.remove(), 500);
    }, 3000);
}

// Go to board
function goToBoard() {
    window.location.href = 'index.html';
}

// Logout
function logout() {
    showSuccessMessage('Logged out successfully!');
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 1000);
}

// Load draft on page load
function loadDraft() {
    const savedDraft = localStorage.getItem('adminTopicDraft');
    if (savedDraft) {
        try {
            const draft = JSON.parse(savedDraft);
            if (confirm('A saved draft was found. Would you like to load it?')) {
                document.getElementById('subject').value = draft.subject || '';
                document.getElementById('message').innerHTML = draft.message || '';
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    loadDraft();

    const messageEditor = document.getElementById('message');
    messageEditor.addEventListener('focus', function() {
        if (this.innerHTML === '') this.innerHTML = '';
    });
    messageEditor.addEventListener('blur', function() {
        if (this.innerHTML.trim() === '') this.innerHTML = '';
    });
});

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
