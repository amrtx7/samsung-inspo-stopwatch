 let startStopBtn = document.querySelector(".start-stopBtn");
    let lapResetBtn = document.querySelector(".lap-resetBtn");
    let mainDisplay = document.querySelector(".main-display")
    let lapDisplay = document.querySelector(".lap-display")
    let isRunning = false;
    let stopped = false;
    let lapMode = false;
    let timer = null;
    let lapTimer = null;
    let lapCount = 0;

    let h = 0, m = 0, s = 0;
    let lapH = 0, lapM = 0, lapS = 0;
    function updateMainDisplay() {
      let hrs = String(h).padStart(2, '0');
      let min = String(m).padStart(2, '0');
      let sec = String(s).padStart(2, '0');
      mainDisplay.innerHTML = `${hrs}:${min}:${sec}`;
    }
    function startTimer() {
      timer = setInterval(() => {
        s++;
        if (s == 60) {
          s = 0;
          m++;
          if (m == 60) {
            m = 0;
            h++;
          }
        }
        updateMainDisplay();
      }, 1000);
    }

    function updateLapDisplay() {
      let hrs = String(lapH).padStart(2, '0');
      let min = String(lapM).padStart(2, '0');
      let sec = String(lapS).padStart(2, '0');
      lapDisplay.innerHTML = `${hrs}:${min}:${sec}`;
    }
    function startLapTimer() {
      lapTimer = setInterval(() => {
        lapS++;
        if (lapS == 60) {
          lapS = 0;
          lapM++;
          if (lapM == 60) {
            lapM = 0;
            lapH++;
          }
        }
        updateLapDisplay();
      }, 1000);
    }

    startStopBtn.addEventListener("click", (e) => {
      //on first start
      if (!isRunning && !stopped) {
        startTimer();
        startStopBtn.classList.add("stopped");
        startStopBtn.innerHTML = "Stop";
        lapResetBtn.disabled = false;
        isRunning = true;
        lapMode = true;
      }
      //on resume
      else if (isRunning && !stopped) {
        clearInterval(timer);
        clearInterval(lapTimer);
        mainDisplay.classList.add("blink");
        lapDisplay.classList.add("blink");
        startStopBtn.classList.remove("stopped");
        startStopBtn.innerHTML = "Resume";
        stopped = true;
        isRunning = false;
        lapResetBtn.innerHTML = "Reset";
        lapMode = false;
      }
      //resumed and running
      else {
        startTimer();
        startLapTimer();
        mainDisplay.classList.remove("blink");
        lapDisplay.classList.remove("blink");
        startStopBtn.classList.add("stopped");
        startStopBtn.innerHTML = "Stop";
        stopped = false;
        isRunning = true;
        lapResetBtn.innerHTML = "Lap";
        lapMode = true;
        lapResetBtn.disabled = false;
      }
    });

    let table = document.querySelector(".table-container table");
    lapResetBtn.addEventListener("click", (e) => {
      if (!lapMode) {
        //on reset
        lapCount = 0;
        mainDisplay.classList.remove("blink");
        lapDisplay.classList.remove("blink");
        startStopBtn.classList.remove("stopped");
        startStopBtn.innerHTML = "Start";
        lapResetBtn.innerHTML = "Lap";
        lapResetBtn.disabled = true;
        h = 0, s = 0, m = 0;
        updateMainDisplay();
        clearInterval(lapTimer);
        lapH = lapM = lapS = 0;
        updateLapDisplay();

        //removin the laps

        let rows = table.querySelectorAll("tr");
        for (let i = 0; i < rows.length; i++) {
          if (i > 0) {
            table.removeChild(rows[i]);
          }
        }
        //removing the table
        table.parentElement.style.display = "none";
      } else {
        //first time lap table enabling
        table.parentElement.style.display = "block";
        let lap = mainDisplay.innerHTML;
        let lapInterval = lapDisplay.innerHTML;
        lapH = 0, lapM = 0, lapS = 0;
        updateLapDisplay();
        clearInterval(lapTimer);

        startLapTimer();

        //adding data to table
        let tr = document.createElement("tr");
        let lapTD = document.createElement("td");
        let lapTimesTD = document.createElement("td");
        let overallTimeTD = document.createElement("td");
        tr.append(lapTD, lapTimesTD, overallTimeTD);
        lapCount++;
        lapTD.innerHTML = String(lapCount).padStart(2, '0');
        lapTimesTD.innerHTML = lapInterval;
        overallTimeTD.innerHTML = lap;

        let rows = table.querySelectorAll("tr");
        if (rows.length == 1) {
          table.appendChild(tr);
        } else {
          table.insertBefore(tr, rows[1]);
        }
      }

    });