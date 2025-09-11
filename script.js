// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginToggle = document.getElementById('login-toggle');
const signupToggle = document.getElementById('signup-toggle');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const modal = document.getElementById('payment-modal');
const modalOkBtn = document.getElementById('modal-ok-btn');
const navLinks = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.section');

// Task Elements
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const totalTasksElement = document.getElementById('total-tasks');
const completedTasksElement = document.getElementById('completed-tasks');
const pendingTasksElement = document.getElementById('pending-tasks');

// Member Elements
const memberNameInput = document.getElementById('member-name');
const memberDobInput = document.getElementById('member-dob');
const memberDescInput = document.getElementById('member-desc');
const addMemberBtn = document.getElementById('add-member-btn');
const membersTable = document.getElementById('members-table');
const memberSearchInput = document.getElementById('member-search');
const searchMemberBtn = document.getElementById('search-member-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');

// Payment Elements
const paymentAmountInput = document.getElementById('payment-amount');
const paymentReferralInput = document.getElementById('payment-referral');
const paymentMethodSelect = document.getElementById('payment-method');
const addPaymentBtn = document.getElementById('add-payment-btn');
const paymentsTable = document.getElementById('payments-table');

// Data Storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let members = JSON.parse(localStorage.getItem('members')) || [];
let payments = JSON.parse(localStorage.getItem('payments')) || [];

// Initialize the application
function init() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showApp();
    }
    
    // Load data
    renderTasks();
    renderMembers();
    renderPayments();
    updateTaskStats();
}

// Show the app container and hide the auth container
function showApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';
}

// Show the auth container and hide the app container
function showAuth() {
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
}

// Toggle between login and signup forms
function toggleForm(formType) {
    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginToggle.classList.add('active');
        signupToggle.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginToggle.classList.remove('active');
        signupToggle.classList.add('active');
    }
}

// Show the payment success modal
function showPaymentModal() {
    modal.style.display = 'flex';
}

// Hide the payment success modal
function hidePaymentModal() {
    modal.style.display = 'none';
}

// Validate payment amount input
function validatePaymentAmount(input) {
    if (input.value < 0) {
        input.value = 0;
    }
}

// Add a new task
function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === '') return;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    newTaskInput.value = '';
    renderTasks();
    updateTaskStats();
}

// Toggle task completion status
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateTaskStats();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateTaskStats();
}

// Render all tasks
function renderTasks() {
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="no-tasks">No tasks yet. Add a new task to get started!</p>';
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        taskElement.querySelector('.task-checkbox').addEventListener('change', () => {
            toggleTaskCompletion(task.id);
        });
        
        tasksContainer.appendChild(taskElement);
    });
}

// Update task statistics
function updateTaskStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
    pendingTasksElement.textContent = pendingTasks;
}

// Add a new member
function addMember() {
    const name = memberNameInput.value.trim();
    const dob = memberDobInput.value;
    const description = memberDescInput.value.trim();
    
    if (name === '' || dob === '' || description === '') {
        alert('Please fill in all fields');
        return;
    }
    
    const newMember = {
        id: Date.now(),
        name,
        dob,
        description
    };
    
    members.push(newMember);
    localStorage.setItem('members', JSON.stringify(members));
    
    // Clear input fields
    memberNameInput.value = '';
    memberDobInput.value = '';
    memberDescInput.value = '';
    
    renderMembers();
}

// Delete a member
function deleteMember(id) {
    members = members.filter(member => member.id !== id);
    localStorage.setItem('members', JSON.stringify(members));
    renderMembers();
}

// Render all members
function renderMembers() {
    membersTable.innerHTML = '';
    
    if (members.length === 0) {
        membersTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px;">
                    No members yet. Add a new member to get started!
                </td>
            </tr>
        `;
        return;
    }
    
    members.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${formatDate(member.dob)}</td>
            <td>${member.description}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteMember(${member.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        membersTable.appendChild(row);
    });
}

// Search members by name
function searchMembers() {
    const searchTerm = memberSearchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        renderMembers();
        return;
    }
    
    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm)
    );
    
    membersTable.innerHTML = '';
    
    if (filteredMembers.length === 0) {
        membersTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px;">
                    No members found with that name.
                </td>
            </tr>
        `;
        return;
    }
    
    filteredMembers.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${formatDate(member.dob)}</td>
            <td>${member.description}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteMember(${member.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        membersTable.appendChild(row);
    });
}

// Clear search and show all members
function clearSearch() {
    memberSearchInput.value = '';
    renderMembers();
}

// Add a new payment
function addPayment() {
    const amount = parseFloat(paymentAmountInput.value);
    const referral = paymentReferralInput.value.trim();
    const method = paymentMethodSelect.value;
    
    if (isNaN(amount) || amount <= 0 || referral === '' || method === '') {
        alert('Please fill in all fields with valid values');
        return;
    }
    
    const newPayment = {
        id: Date.now(),
        amount,
        referral,
        method,
        date: new Date().toISOString()
    };
    
    payments.push(newPayment);
    localStorage.setItem('payments', JSON.stringify(payments));
    
    // Clear input fields
    paymentAmountInput.value = '';
    paymentReferralInput.value = '';
    paymentMethodSelect.value = '';
    
    renderPayments();
    showPaymentModal();
}

// Delete a payment
function deletePayment(id) {
    payments = payments.filter(payment => payment.id !== id);
    localStorage.setItem('payments', JSON.stringify(payments));
    renderPayments();
}

// Render all payments
function renderPayments() {
    paymentsTable.innerHTML = '';
    
    if (payments.length === 0) {
        paymentsTable.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px;">
                    No payments yet. Add a new payment to get started!
                </td>
            </tr>
        `;
        return;
    }
    
    payments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>$${payment.amount.toFixed(2)}</td>
            <td>${payment.referral}</td>
            <td>${payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</td>
            <td>${formatDate(payment.date)}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deletePayment(${payment.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        paymentsTable.appendChild(row);
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', init);

loginToggle.addEventListener('click', () => toggleForm('login'));
signupToggle.addEventListener('click', () => toggleForm('signup'));
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForm('signup');
});
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForm('login');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (email && password) {
        localStorage.setItem('isLoggedIn', 'true');
        showApp();
    } else {
        alert('Please enter both email and password');
    }
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    // Simple validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (name && email && password) {
        localStorage.setItem('isLoggedIn', 'true');
        showApp();
    } else {
        alert('Please fill in all fields');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.setItem('isLoggedIn', 'false');
    showAuth();
    toggleForm('login');
});

modalOkBtn.addEventListener('click', hidePaymentModal);

navLinks.forEach(link => {
    if (link.id !== 'logout-btn') {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-target');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Show the corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        });
    }
});

addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

addMemberBtn.addEventListener('click', addMember);
searchMemberBtn.addEventListener('click', searchMembers);
clearSearch