//timer JavaScript code
        // ...
               // Simulated parking data
               const totalSlots = 50;
        const reservedSlots = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // Reserved slots
        const parkingSlots = Array(totalSlots).fill(false); // all slots are vacant initially
        let selectedSlot = null;
        let bookingStartTime = null;
        let parkingFee = 0;
        let fine = 0;

        // Function to toggle parking slot selection
        function toggleSlot(slotIndex) {
            selectedSlot = slotIndex;
            updateSlotDisplay();
        }

        // Function to update the display of parking slots
        function updateSlotDisplay() {
            const parkingSlotsContainer = document.getElementById('parkingSlots');
            parkingSlotsContainer.innerHTML = '';

            for (let i = 0; i < totalSlots; i++) {
                const slot = document.createElement('div');
                slot.className = 'parking-slot' + (i === selectedSlot ? ' occupied' : '') + (reservedSlots.includes(i) ? ' reserved' : '');
                slot.textContent = i + 1; // Display slot number
                slot.onclick = function () {
                    toggleSlot(i);
                };

                parkingSlotsContainer.appendChild(slot);
            }
        }

        // Function to handle admin login
        function loginAdmin() {
            const adminId = document.getElementById('adminId').value;
            const adminPassword = document.getElementById('adminPassword').value;

            // Simulated admin login (replace with real authentication)
            if (adminId === 'admin' && adminPassword === 'password') {
                document.getElementById('adminLoginForm').style.display = 'none';
                document.getElementById('customerDetailsPage').style.display = 'block';
            } else {
                alert('Invalid credentials');
            }

            return false;
        }

        // Function to submit customer details
        function submitCustomerDetails() {
            const bookingDate = new Date(document.getElementById('bookingDate').value);
            const bookingTime = document.getElementById('bookingTime').value;
            const durationHours = parseInt(document.getElementById('durationHours').value);

            if (isNaN(durationHours) || durationHours <= 0) {
                alert('Duration must be a positive number.');
                return false;
            }

            bookingStartTime = new Date(bookingDate);
            bookingStartTime.setHours(parseInt(bookingTime.split(':')[0]), parseInt(bookingTime.split(':')[1]));
            parkingFee = durationHours * 1; // $1 per hour

            document.getElementById('customerDetailsPage').style.display = 'none';
            document.getElementById('parkingPage').style.display = 'block';
            updateSlotDisplay();

            return false;
        }
       

        // Function to calculate fine
        function calculateFine() {
            if (bookingStartTime) {
                const currentTime = new Date();
                const elapsedTime = (currentTime - bookingStartTime) / (1000 * 60 * 60); // Hours
                if (elapsedTime > 0) {
                    fine = elapsedTime * 0.5; // $0.5 per hour
                }
            }
        }

        // Function to confirm booking
        function confirmBooking() {
            if (selectedSlot !== null) {
                if (parkingSlots[selectedSlot] || reservedSlots.includes(selectedSlot)) {
                    alert('Selected slot is already occupied or reserved. Please choose another slot.');
                } else {
                    calculateFine();
                    parkingSlots[selectedSlot] = true;
                    updateSlotDisplay();
                    const totalCost = parkingFee + fine;
                    alert(`Booking confirmed for Slot ${selectedSlot + 1}.\nTotal fee: $${totalCost}`);
                }
            } else {
                alert('Please select a parking slot.');
            }
        }


        const FULL_DASH_ARRAY = 283;
        const WARNING_THRESHOLD = 900;
        const ALERT_THRESHOLD = 300;

        const COLOR_CODES = {
            info: {
                color: "green"
            },
            warning: {
                color: "orange",
                threshold: WARNING_THRESHOLD
            },
            alert: {
                color: "red",
                threshold: ALERT_THRESHOLD
            }
        };

        const TIME_LIMIT = 7200;
        let timePassed = 0;
        let timeLeft = TIME_LIMIT;
        let timerInterval = null;
        let remainingPathColor = COLOR_CODES.info.color;

        document.getElementById("app").innerHTML = `
        <div class="base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                    <path
                        id="base-timer-path-remaining"
                        stroke-dasharray="283"
                        class="base-timer__path-remaining ${remainingPathColor}"
                        d="
                        M 50, 50
                        m -45, 0
                        a 45,45 0 1,0 90,0
                        a 45,45 0 1,0 -90,0
                    "
                    ></path>
                </g>
            </svg>
            <span id="base-timer-label" class="base-timer__label">${formatTime(
                timeLeft
            )}</span>
        </div>
        `;

        const startButton = document.getElementById("start-button");
        startButton.addEventListener("click", startTimer);

        function onTimesUp() {
            clearInterval(timerInterval);
            startButton.style.display = "none"; // Hide the "Start" button when time is up.
        }

        function startTimer() {
            startButton.style.display = "none"; // Hide the "Start" button when the timer starts.
            timerInterval = setInterval(() => {
                timePassed = timePassed += 1;
                timeLeft = TIME_LIMIT - timePassed;
                document.getElementById("base-timer-label").innerHTML = formatTime(
                    timeLeft
                );
                setCircleDasharray();
                setRemainingPathColor(timeLeft);

                if (timeLeft === 0) {
                    onTimesUp();
                }
            }, 1000);
        }

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;

            if (seconds < 10) {
                seconds = `0${seconds}`;
            }

            return `${minutes}:${seconds}`;
        }

        function setRemainingPathColor(timeLeft) {
            const { alert, warning, info } = COLOR_CODES;
            if (timeLeft <= alert.threshold) {
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.remove(warning.color);
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.add(alert.color);
            } else if (timeLeft <= warning.threshold) {
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.remove(info.color);
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.add(warning.color);
            }
        }

        function calculateTimeFraction() {
            const rawTimeFraction = timeLeft / TIME_LIMIT;
            return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
        }

        function setCircleDasharray() {
            const circleDasharray = `${calculateTimeFraction() * FULL_DASH_ARRAY} 283`;
            document
                .getElementById("base-timer-path-remaining")
                .setAttribute("stroke-dasharray", circleDasharray);
        }