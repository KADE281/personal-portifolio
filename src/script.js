const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// Set active link based on current page
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        if (href === currentPage || (!currentPage && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}
setActiveLink();

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    
    // Toggle between hamburger lines and X
    if (isOpen) {
        hamburger.innerHTML = '✕';
        hamburger.style.color = 'var(--accent)';
        document.body.style.overflow = 'hidden';
    } else {
        hamburger.innerHTML = '☰';
        hamburger.style.color = 'var(--white)';
        document.body.style.overflow = 'auto';
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.innerHTML = '☰';
        hamburger.style.color = 'var(--white)';
        document.body.style.overflow = 'auto';
        setActiveLink();
    });
});

const togglePreviewBtn = document.getElementById('toggle-preview-btn');
const cvPreviewContainer = document.getElementById('cv-preview-container');
const uploadBtn = document.getElementById('upload-btn');
const fileUpload = document.getElementById('file-upload');
const fileUploadName = document.getElementById('file-upload-name');

if (togglePreviewBtn && cvPreviewContainer) {
    togglePreviewBtn.addEventListener('click', () => {
        const visible = cvPreviewContainer.style.display !== 'none';
        if (visible) {
            cvPreviewContainer.style.display = 'none';
            togglePreviewBtn.textContent = 'Show Document Preview';
        } else {
            cvPreviewContainer.style.display = 'flex';
            togglePreviewBtn.textContent = 'Hide Document Preview';
        }
    });
}

if (uploadBtn && fileUpload) {
    uploadBtn.addEventListener('click', () => {
        fileUpload.click();
    });
}

// Store all accumulated files
let accumulatedFiles = [];

function renderFileList() {
    const selectedFiles = document.getElementById('selected-files');
    const fileUploadName = document.getElementById('file-upload-name');
    
    if (accumulatedFiles.length === 0) {
        fileUploadName.textContent = '';
        selectedFiles.innerHTML = '';
        const togglePreviewBtn = document.getElementById('toggle-preview-btn');
        togglePreviewBtn.style.display = 'none';
        return;
    }
    
    fileUploadName.textContent = `${accumulatedFiles.length} file(s) total`;
    const togglePreviewBtn = document.getElementById('toggle-preview-btn');
    togglePreviewBtn.style.display = 'inline-block';
    
    selectedFiles.innerHTML = `<div style="color: var(--accent); font-weight:700; margin-bottom:16px; font-size:1.1rem;">📁 Uploaded Files (${accumulatedFiles.length}):</div>` + accumulatedFiles
        .map((file, index) => {
            const isPreviewable = file.type.startsWith('application/pdf') || file.type.startsWith('image/');
            const fileIcon = file.type.startsWith('image/') ? '🖼️' : file.type === 'application/pdf' ? '📄' : '📎';
            
            return `<div style="display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center; margin-bottom:12px; padding:14px; background:var(--card-bg); border-radius:10px; border:1px solid var(--accent-dim); transition:all 0.2s;">
                <div style="display:flex; align-items:center; gap:10px; min-width:0;">
                    <span style="font-size:1.3rem;">${fileIcon}</span>
                    <button type="button" data-index="${index}" class="file-link-btn" style="flex:1; text-align:left; color:var(--accent); cursor:pointer; text-decoration:underline; background:none; border:none; font-size:0.95rem; word-break:break-word; padding:0; font-weight:500; transition:0.2s;" onmouseover="this.style.color='#4f46e5'" onmouseout="this.style.color='var(--accent)'">${file.name}</button>
                </div>
                <div style="display:flex; gap:8px; flex-shrink:0;">
                    ${isPreviewable ? `<button type="button" data-index="${index}" class="preview-btn" style="padding:8px 14px; font-size:0.8rem; cursor:pointer; background:var(--accent); color:white; border:none; border-radius:6px; font-weight:600; transition:0.2s;" onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='var(--accent)'">Preview</button>` : ''}
                    <button type="button" data-index="${index}" class="download-btn" style="padding:8px 14px; font-size:0.8rem; cursor:pointer; background:var(--accent-dim); color:var(--white); border:1px solid var(--accent); border-radius:6px; font-weight:600; transition:0.2s;" onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='var(--accent-dim)'">Download</button>
                    <button type="button" data-index="${index}" class="remove-btn" style="padding:8px 14px; font-size:0.8rem; cursor:pointer; background:#dc2626; color:white; border:none; border-radius:6px; font-weight:600; transition:0.2s;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">Remove</button>
                </div>
            </div>`;
        })
        .join('');
    
    // Attach event listeners
    attachFileListeners();
}

function attachFileListeners() {
    const selectedFiles = document.getElementById('selected-files');
    const togglePreviewBtn = document.getElementById('toggle-preview-btn');
    const previewIframe = document.getElementById('cv-preview');
    const imagePreview = document.getElementById('image-preview');
    const cvPreviewContainer = document.getElementById('cv-preview-container');
    
    // File name link click handlers
    selectedFiles.querySelectorAll('.file-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            const file = accumulatedFiles[index];
            const blobUrl = URL.createObjectURL(file);
            
            if (file.type.startsWith('image/') || file.type.startsWith('application/pdf')) {
                // Open in new tab
                window.open(blobUrl, '_blank');
            } else {
                // Download other types
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });
    
    selectedFiles.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            const file = accumulatedFiles[index];
            
            if (file.type.startsWith('image/')) {
                const blobUrl = URL.createObjectURL(file);
                imagePreview.innerHTML = `<img src="${blobUrl}" style="max-width:95%; max-height:95%; width:auto; height:auto;" />`;
                imagePreview.style.display = 'flex';
                previewIframe.style.display = 'none';
                cvPreviewContainer.style.display = 'flex';
                togglePreviewBtn.textContent = 'Hide Document Preview';
            } else if (file.type.startsWith('application/pdf')) {
                const blobUrl = URL.createObjectURL(file);
                previewIframe.src = blobUrl;
                previewIframe.style.display = 'block';
                imagePreview.style.display = 'none';
                cvPreviewContainer.style.display = 'flex';
                togglePreviewBtn.textContent = 'Hide Document Preview';
            }
        });
    });
    
    selectedFiles.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            const file = accumulatedFiles[index];
            const blobUrl = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        });
    });

    selectedFiles.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            accumulatedFiles.splice(index, 1);
            renderFileList();
        });
    });
}

if (fileUpload && fileUploadName) {
    fileUpload.addEventListener('change', (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length > 0) {
            // Add new files to accumulated list
            accumulatedFiles = [...accumulatedFiles, ...newFiles];
            renderFileList();
            
            // Reset file input
            fileUpload.value = '';
        }
    });
}

