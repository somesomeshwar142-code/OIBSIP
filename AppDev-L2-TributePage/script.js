/**
 * Tribute Page Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Quote Carousel Array
    const quotes = [
        {
            text: '"Dream is not that which you see while sleeping; it is something that does not let you sleep."',
            author: '— Dr. A.P.J. Abdul Kalam'
        },
        {
            text: '"If you want to shine like a sun, first burn like a sun."',
            author: '— Dr. A.P.J. Abdul Kalam'
        },
        {
            text: '"Excellence is a continuous process and not an accident."',
            author: '— Dr. A.P.J. Abdul Kalam'
        },
        {
            text: '"You cannot change your future, but you can change your habits, and surely your habits will change your future."',
            author: '— Dr. A.P.J. Abdul Kalam'
        }
    ];

    let currentQuoteIndex = 0;

    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const quoteIndicator = document.getElementById('quoteIndicator');
    const prevQuoteBtn = document.getElementById('prevQuoteBtn');
    const nextQuoteBtn = document.getElementById('nextQuoteBtn');

    function updateQuote(index) {
        if (!quoteText || !quoteAuthor) return;

        // Fade transition effect
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';

        setTimeout(() => {
            quoteText.textContent = quotes[index].text;
            quoteAuthor.textContent = quotes[index].author;
            quoteIndicator.textContent = `${index + 1} / ${quotes.length}`;

            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 200);
    }

    if (prevQuoteBtn && nextQuoteBtn) {
        prevQuoteBtn.addEventListener('click', () => {
            currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
            updateQuote(currentQuoteIndex);
        });

        nextQuoteBtn.addEventListener('click', () => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            updateQuote(currentQuoteIndex);
        });
    }

    // Auto rotate quotes every 6 seconds
    setInterval(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        updateQuote(currentQuoteIndex);
    }, 6000);

    // 2. Navbar Sticky Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // 3. Simple Theme Toggle Button
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    let isDarkTheme = false;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkTheme = !isDarkTheme;
            if (isDarkTheme) {
                document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
                themeToggleBtn.textContent = '☀️';
            } else {
                document.body.style.filter = 'none';
                themeToggleBtn.textContent = '🌙';
            }
        });
    }
});
