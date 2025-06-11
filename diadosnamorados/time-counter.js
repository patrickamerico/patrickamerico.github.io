document.addEventListener('DOMContentLoaded', function() {
  const startDate = new Date('2009-09-25');
  const today = new Date();
  
  // Calculate total difference in milliseconds
  const diffTime = Math.abs(today - startDate);
  
  // Calculate years, months and remaining days
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();
  
  if (days < 0) {
    months--;
    // Get the last day of the previous month
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += lastDay;
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Calculate total time components
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffTime / (1000 * 60));
  
  // Calculate remaining hours and minutes (opcional - descomente se quiser mostrar)
  // const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  // Animate all counters
  animateCounter('years', years);
  animateCounter('months', months);
  animateCounter('days', days);
  animateCounter('total-days', totalDays);
  animateCounter('hours', totalHours);
  animateCounter('minutes', totalMinutes);
});

function animateCounter(id, target) {
  const element = document.getElementById(id);
  if (!element) return; // Proteção caso o elemento não exista
  
  const duration = 2000; // Animation duration in ms
  const stepTime = 20; // Time between steps in ms
  const steps = duration / stepTime;
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      clearInterval(timer);
      current = target;
    }
    element.textContent = Math.floor(current).toLocaleString();
  }, stepTime);
}