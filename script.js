const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateUI() {
  list.innerHTML = "";
  let balance = 0;
  let expenses = 0;
  let incomes = 0;

  transactions.forEach((tx, index) => {
    const li = document.createElement("li");
    li.classList.add(tx.type);
    li.innerHTML = `
      ${tx.title} - ₹${tx.amount}
      <button onclick="deleteTx(${index})">❌</button>
    `;
    list.appendChild(li);

    if (tx.type === "income") incomes += tx.amount;
    else expenses += tx.amount;
  });

  balance = incomes - expenses;
  balanceEl.textContent = balance;

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateChart(incomes, expenses);
}

function addTransaction() {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (title === "" || amount <= 0) {
    alert("Please enter valid details!");
    return;
  }

  transactions.push({ title, amount, type });
  titleInput.value = "";
  amountInput.value = "";

  updateUI();
}

function deleteTx(index) {
  transactions.splice(index, 1);
  updateUI();
}

// ====== Chart.js setup ======
let chart;
function updateChart(incomes, expenses) {
  const ctx = document.getElementById("expenseChart").getContext("2d");

  if (chart) chart.destroy(); // Prevent multiple charts

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [incomes, expenses],
          backgroundColor: ["#00c853", "#ff1744"],
        },
      ],
    },
  });
}

addBtn.addEventListener("click", addTransaction);
updateUI();