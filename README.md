
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Trade With Soni | Feedback</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px 14px;
      background: #f1f6ff;
      color: #183153;
      font-family: Arial, sans-serif;
    }
    .card {
      max-width: 460px;
      margin: 20px auto;
      padding: 26px 22px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 30px #173e7514;
    }
    .brand { color: #1769e0; font-size: 25px; font-weight: 800; }
    .sub { color: #64748b; margin: 8px 0 24px; }
    label { display: block; margin: 18px 0 8px; font-weight: 700; }
    input, textarea {
      width: 100%;
      padding: 13px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 16px;
      background: white;
    }
    textarea { min-height: 110px; resize: vertical; }
    .stars { display: flex; gap: 10px; }
    .star {
      border: 0;
      padding: 0;
      background: none;
      color: #cbd5e1;
      font-size: 36px;
      cursor: pointer;
    }
    .star.active { color: #f5a623; }
    button.submit {
      width: 100%;
      margin-top: 22px;
      padding: 15px;
      background: #1769e0;
      color: white;
      border: 0;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
    }
    #message { margin-top: 14px; line-height: 1.5; }
    footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 13px; }
  </style>
</head>
<body>
  <main class="card">
    <div class="brand">📈 Trade With Soni</div>
    <p class="sub">Apna Feedback Dein | Share Your Experience</p>

    <form id="feedbackForm">
      <label for="name">Naam / Name</label>
      <input id="name" name="name" maxlength="80"
        placeholder="Apna naam likhein / Your name" required>

      <label>Rating dein / Rate us</label>
      <div class="stars" aria-label="Choose a rating">
        <button class="star" type="button" data-rating="1"
          aria-label="1 star">★</button>
        <button class="star" type="button" data-rating="2"
          aria-label="2 stars">★</button>
        <button class="star" type="button" data-rating="3"
          aria-label="3 stars">★</button>
        <button class="star" type="button" data-rating="4"
          aria-label="4 stars">★</button>
        <button class="star" type="button" data-rating="5"
          aria-label="5 stars">★</button>
      </div>

      <label for="suggestion">
        Aapko trading seekhkar kaisa laga?<br>
        <span style="font-weight:400">How was your learning experience?</span>
      </label>
      <textarea id="suggestion" name="suggestion" maxlength="1500"
        placeholder="Apna suggestion likhein / Write your feedback"
        required></textarea>

      <button class="submit" type="submit">
        Submit Feedback / Feedback Bhejein
      </button>
      <p id="message" role="status"></p>
    </form>
    <footer>Thank you for supporting Trade With Soni!</footer>
  </main>

  <script>
    let rating = 0;
    const stars = document.querySelectorAll(".star");

    stars.forEach(star => {
      star.addEventListener("click", () => {
        rating = Number(star.dataset.rating);
        stars.forEach(s => {
          const selected = Number(s.dataset.rating) <= rating;
          s.classList.toggle("active", selected);
          s.setAttribute("aria-pressed", String(
            Number(s.dataset.rating) === rating
          ));
        });
      });
    });

    document.getElementById("feedbackForm").addEventListener(
      "submit", async event => {
        event.preventDefault();
        const message = document.getElementById("message");

        if (!rating) {
          message.textContent = "Please select a rating / Rating chunein.";
          return;
        }

        // Connect a secure feedback backend before publishing.
        message.textContent =
          "Submission service abhi connect nahi hai. / " +
          "The feedback service is not connected yet.";
      }
    );
  </script>
</body>
</html>
