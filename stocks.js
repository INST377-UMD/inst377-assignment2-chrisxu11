const apiKey = "XCK3aHoHEFowZUleVMdE5a0moO2cdhdw";

let stockChart = null;

async function loadStockData() {
  const ticker = document.getElementById("tickerInput").value.trim().toUpperCase();
  const days = parseInt(document.getElementById("daysSelect").value);

  if (!ticker) {
    alert("Please enter a stock ticker.");
    return;
  }

  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);

  const formatDate = (d) => d.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(fromDate)}/${formatDate(toDate)}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("No data found.");
      return;
    }

    const labels = data.results.map((point) => {
      const date = new Date(point.t);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    });

    const values = data.results.map((point) => point.c);

    renderChart(ticker, labels, values);
}


if (annyang) {
  annyang.removeCommands();
  annyang.addCommands({
    'hello': () => alert('Hello!'),
    'change color to :color': (color) => {
        document.body.style.backgroundColor = color;
    },
    'navigate to :page': (page) => {
        window.location.href = `${page.toLowerCase()}.html`;
    }
});
  annyang.addCommands({
      'lookup :ticker': (ticker) => {
          document.getElementById('tickerInput').value = ticker.toUpperCase();
          loadStockData();
      }
  });
  annyang.start(); 
}
function renderChart(ticker, labels, dataPoints) {
  const ctx = document.getElementById("stockChart").getContext("2d");

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `${ticker} Closing Prices`,
        data: dataPoints,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Date"
          }
        },
        y: {
          title: {
            display: true,
            text: "Closing Price (USD)"
          }
        }
      }
    }
  });
}

window.onload = function () {
    const bullishImg = "https://www.investopedia.com/thmb/qM1G6UYKuca3JzzgVu229nAK87w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-499170981-20e252a7742340ab9b03118f93e8d58c.jpg";
    const bearishImg = "https://cdn.corporatefinanceinstitute.com/assets/bear-market.jpeg";
  
    async function loadRedditStocks() {
        const response = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
        const data = await response.json();
  
        const top5 = data.slice(0, 5);
        const tableBody = document.getElementById("tableBody");
  
        top5.forEach(stock => {
          const row = document.createElement("tr");
  
          const tickerCell = document.createElement("td");
          const link = document.createElement("a");
          link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
          link.textContent = stock.ticker;
          link.target = "_blank";
          tickerCell.appendChild(link);
  
          const commentCountCell = document.createElement("td");
          commentCountCell.textContent = stock.no_of_comments;
  
          const sentimentCell = document.createElement("td");
          sentimentCell.textContent = stock.sentiment + " ";
          const icon = document.createElement("img");
          icon.src = stock.sentiment.toLowerCase() === "bullish" ? bullishImg : bearishImg;
          icon.alt = stock.sentiment;
          icon.style.width = "50px";
          sentimentCell.appendChild(icon);
  
          row.appendChild(tickerCell);
          row.appendChild(commentCountCell);
          row.appendChild(sentimentCell);
  
          tableBody.appendChild(row);
        });
    }
  
    loadRedditStocks();
  };