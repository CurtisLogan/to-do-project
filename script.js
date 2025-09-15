
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const authContainer = document.getElementById('auth-container');
            const appContainer = document.getElementById('app-container');
            const loginToggle = document.getElementById('login-toggle');
            const signupToggle = document.getElementById('signup-toggle');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const paymentModal = document.getElementById('payment-modal');
            const modalOkBtn = document.getElementById('modal-ok-btn');
            const showSignupLink = document.getElementById('show-signup');
            const showLoginLink = document.getElementById('show-login');
            
            // Show signup form when "Sign Up" link is clicked
            showSignupLink.addEventListener('click', function(e) {
                e.preventDefault();
                signupToggle.click();
            });
            
            // Show login form when "Login" link is clicked
            showLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                loginToggle.click();
            });
            
            // Form Toggle
            loginToggle.addEventListener('click', function() {
                loginToggle.classList.add('active');
                signupToggle.classList.remove('active');
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            });
            
            signupToggle.addEventListener('click', function() {
                signupToggle.classList.add('active');
                loginToggle.classList.remove('active');
                signupForm.style.display = 'block';
                loginForm.style.display = 'none';
            });
            
            // Initially show login form and hide signup form
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            
            // Login Form Submission
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                // Simple validation
                if (email && password) {
                    // In a real app, you would verify credentials with a server
                    // For this demo, we'll just simulate a successful login
                    simulateLogin();
                }
            });
            
            // Signup Form Submission
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirm = document.getElementById('signup-confirm').value;
                
                // Simple validation
                if (password !== confirm) {
                    alert('Passwords do not match!');
                    return;
                }
                
                if (name && email && password) {
                    // In a real app, you would send this data to a server
                    // For this demo, we'll just simulate a successful signup and login
                    simulateLogin();
                }
            });
            
            // Modal OK Button
            modalOkBtn.addEventListener('click', function() {
                paymentModal.style.display = 'none';
            });
            
            // Simulate Login
            function simulateLogin() {
                // Hide auth container and show app container
                authContainer.style.display = 'none';
                appContainer.style.display = 'flex';
                
                // Initialize the app functionality
                initApp();
            }
            
            // Initialize the app functionality
            function initApp() {
                // Navigation functionality
                const navLinks = document.querySelectorAll('.nav-links li');
                const sections = document.querySelectorAll('.section');
                
                navLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        if (this.id === 'logout-btn') {
                            // Handle logout
                            appContainer.style.display = 'none';
                            authContainer.style.display = 'flex';
                            return;
                        }
                        
                        const target = this.getAttribute('data-target');
                        
                        // Update active navigation link
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Show corresponding section
                        sections.forEach(section => {
                            section.classList.remove('active');
                            if (section.id === target) {
                                section.classList.add('active');
                            }
                        });
                    });
                });
                
                // Task functionality
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                const newTaskInput = document.getElementById('new-task-input');
                const addTaskBtn = document.getElementById('add-task-btn');
                const tasksContainer = document.getElementById('tasks-container');
                
                function updateTaskStats() {
                    const totalTasks = tasks.length;
                    const completedTasks = tasks.filter(task => task.completed).length;
                    const pendingTasks = totalTasks - completedTasks;
                    
                    document.getElementById('total-tasks').textContent = totalTasks;
                    document.getElementById('completed-tasks').textContent = completedTasks;
                    document.getElementById('pending-tasks').textContent = pendingTasks;
                }
                
                function renderTasks() {
                    tasksContainer.innerHTML = '';
                    
                    tasks.forEach((task, index) => {
                        const taskElement = document.createElement('div');
                        taskElement.className = `task-item ${task.completed ? 'task-completed' : ''}`;
                        taskElement.innerHTML = `
                            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                            <span class="task-text">${task.text}</span>
                            <button class="action-btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                        `;
                        tasksContainer.appendChild(taskElement);
                    });
                    
                    // Add event listeners to checkboxes and delete buttons
                    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                        checkbox.addEventListener('change', function() {
                            const index = this.getAttribute('data-index');
                            tasks[index].completed = this.checked;
                            localStorage.setItem('tasks', JSON.stringify(tasks));
                            renderTasks();
                            updateTaskStats();
                        });
                    });
                    
                    document.querySelectorAll('.delete-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const index = this.getAttribute('data-index');
                            tasks.splice(index, 1);
                            localStorage.setItem('tasks', JSON.stringify(tasks));
                            renderTasks();
                            updateTaskStats();
                        });
                    });
                    
                    updateTaskStats();
                }
                
                addTaskBtn.addEventListener('click', function() {
                    const taskText = newTaskInput.value.trim();
                    if (taskText) {
                        tasks.push({ text: taskText, completed: false });
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        newTaskInput.value = '';
                        renderTasks();
                    }
                });
                
                // Members functionality
                const members = JSON.parse(localStorage.getItem('members')) || [];
                const addMemberBtn = document.getElementById('add-member-btn');
                const membersTable = document.getElementById('members-table');
                const memberSearch = document.getElementById('member-search');
                const searchMemberBtn = document.getElementById('search-member-btn');
                const clearSearchBtn = document.getElementById('clear-search-btn');
                
                function renderMembers(membersToRender = members) {
                    membersTable.innerHTML = '';
                    
                    if (membersToRender.length === 0) {
                        const row = document.createElement('tr');
                        row.innerHTML = `<td colspan="4" style="text-align: center;">No members found</td>`;
                        membersTable.appendChild(row);
                        return;
                    }
                    
                    membersToRender.forEach((member, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${member.name}</td>
                            <td>${member.dob}</td>
                            <td>${member.desc}</td>
                            <td>
                                <button class="action-btn edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                            </td>
                        `;
                        membersTable.appendChild(row);
                    });
                    
                    // Add event listeners to buttons
                    document.querySelectorAll('#members-table .edit-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const index = this.getAttribute('data-index');
                            const member = members[index];
                            document.getElementById('member-name').value = member.name;
                            document.getElementById('member-dob').value = member.dob;
                            document.getElementById('member-desc').value = member.desc;
                            
                            // Change add button to update button
                            addMemberBtn.textContent = 'Update Member';
                            addMemberBtn.setAttribute('data-index', index);
                        });
                    });
                    
                    document.querySelectorAll('#members-table .delete-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const index = this.getAttribute('data-index');
                            members.splice(index, 1);
                            localStorage.setItem('members', JSON.stringify(members));
                            renderMembers();
                        });
                    });
                }
                
                // Search functionality
                searchMemberBtn.addEventListener('click', function() {
                    const searchTerm = memberSearch.value.toLowerCase().trim();
                    if (searchTerm === '') {
                        renderMembers();
                        return;
                    }
                    
                    const filteredMembers = members.filter(member => 
                        member.name.toLowerCase().includes(searchTerm)
                    );
                    
                    renderMembers(filteredMembers);
                });
                
                // Clear search functionality
                clearSearchBtn.addEventListener('click', function() {
                    memberSearch.value = '';
                    renderMembers();
                });
                
                addMemberBtn.addEventListener('click', function() {
                    const name = document.getElementById('member-name').value.trim();
                    const dob = document.getElementById('member-dob').value;
                    const desc = document.getElementById('member-desc').value.trim();
                    
                    if (name && dob && desc) {
                        const index = this.getAttribute('data-index');
                        
                        if (index !== null) {
                            // Update existing member
                            members[index] = { name, dob, desc };
                            this.removeAttribute('data-index');
                            this.textContent = 'Add Member';
                        } else {
                            // Add new member
                            members.push({ name, dob, desc });
                        }
                        
                        localStorage.setItem('members', JSON.stringify(members));
                        
                        // Clear form
                        document.getElementById('member-name').value = '';
                        document.getElementById('member-dob').value = '';
                        document.getElementById('member-desc').value = '';
                        
                        renderMembers();
                    }
                });
                
                // Payments functionality
                const payments = JSON.parse(localStorage.getItem('payments')) || [];
                const addPaymentBtn = document.getElementById('add-payment-btn');
                const paymentsTable = document.getElementById('payments-table');
                
                function renderPayments() {
                    paymentsTable.innerHTML = '';
                    
                    payments.forEach((payment, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>$${payment.amount}</td>
                            <td>${payment.referral}</td>
                            <td>${payment.method}</td>
                            <td>${payment.date}</td>
                            <td>
                                <button class="action-btn edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                            </td>
                        `;
                        paymentsTable.appendChild(row);
                    });
                    
                    // Add event listeners to buttons
                    document.querySelectorAll('#payments-table .edit-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const index = this.getAttribute('data-index');
                            const payment = payments[index];
                            document.getElementById('payment-amount').value = payment.amount;
                            document.getElementById('payment-referral').value = payment.referral;
                            document.getElementById('payment-method').value = payment.method;
                            
                            // Change add button to update button
                            addPaymentBtn.textContent = 'Update Payment';
                            addPaymentBtn.setAttribute('data-index', index);
                        });
                    });
                    
                    document.querySelectorAll('#payments-table .delete-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const index = this.getAttribute('data-index');
                            payments.splice(index, 1);
                            localStorage.setItem('payments', JSON.stringify(payments));
                            renderPayments();
                        });
                    });
                }
                
                addPaymentBtn.addEventListener('click', function() {
                    const amount = document.getElementById('payment-amount').value.trim();
                    const referral = document.getElementById('payment-referral').value.trim();
                    const method = document.getElementById('payment-method').value;
                    const date = new Date().toLocaleDateString();
                    
                    if (amount && referral && method) {
                        const index = this.getAttribute('data-index');
                        
                        if (index !== null) {
                            // Update existing payment
                            payments[index] = { amount, referral, method, date };
                            this.removeAttribute('data-index');
                            this.textContent = 'Add Payment';
                        } else {
                            // Add new payment
                            payments.push({ amount, referral, method, date });
                        }
                        
                        localStorage.setItem('payments', JSON.stringify(payments));
                        
                        // Clear form
                        document.getElementById('payment-amount').value = '';
                        document.getElementById('payment-referral').value = '';
                        document.getElementById('payment-method').value = '';
                        
                        renderPayments();
                        
                        // Show payment success message
                        paymentModal.style.display = 'flex';
                    }
                });
                
                // Initialize the application
                renderTasks();
                renderMembers();
                renderPayments();
            }
        });

        // Function to validate payment amount (prevent negative values)
        function validatePaymentAmount(input) {
            if (input.value < 0) {
                input.value = 0;
            }
        }

