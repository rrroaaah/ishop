// class Countdown {
//     static UNITS = ['seconds', 'minutes', 'hours', 'days'];
//     static DEFAULT_SEPARATOR = ':';
//     static INTERVAL = 10;
  
//     constructor(element, options = {}) {
//       this.element = element;
//       this.separator = options.separator || Countdown.DEFAULT_SEPARATOR;
//       this.parts = (element.dataset.countdown || '0').split(':').map(Number).reverse();
//       this.unitCount = this.parts.length;
//       this.totalSeconds = this.toSeconds(this.parts);
//       this.timer = null;
  
//       this.build();
//       this.start();
//     }
  
//     // --- Helpers ---
//     toSeconds([seconds = 0, minutes = 0, hours = 0, days = 0]) {
//       return seconds + minutes * 60 + hours * 3600 + days * 86400;
//     }
  
//     fromSeconds(total) {
//       const limits = [60, 60, 24, Infinity];
//       return limits.map(limit => {
//         const value = total % limit;
//         total = Math.floor(total / limit);
//         return value;
//       });
//     }
  
//     createSeparator() {
//       const sep = document.createElement('span');
//       sep.className = 'countdown-separator';
//       sep.textContent = this.separator;
//       return sep;
//     }
  
//     createItem(value, unit) {
//       const item = document.createElement('div');
//       item.className = `countdown-item ${unit}`;
//       String(value).padStart(2, '0').split('').forEach(digit => {
//         const span = document.createElement('span');
//         span.className = 'fields';
//         span.textContent = digit;
//         item.appendChild(span);
//       });
//       return item;
//     }
  
//     // --- Build DOM ---
//     build() {
//       this.element.innerHTML = '';
//       this.parts.forEach((value, index) => {
//         const unit = Countdown.UNITS[index];
//         if (!unit) return;
//         this.element.appendChild(this.createItem(value, unit));
//         if (index < this.unitCount - 1) this.element.appendChild(this.createSeparator());
//       });
//     }
  
//     // --- Update DOM ---
//     update(values) {
//       this.element.querySelectorAll('.countdown-item').forEach((item, index) => {
//         String(values[index]).padStart(2, '0').split('').forEach((digit, i) => {
//           item.querySelectorAll('.fields')[i].textContent = digit;
//         });
//       });
//     }
  
//     // --- Timer ---
//     tick() {
//       if (this.totalSeconds <= 0) {
//         clearInterval(this.timer);
//         return;
//       }
//       this.totalSeconds--;
//       this.update(this.fromSeconds(this.totalSeconds));
//     }
  
//     start() {
//       this.timer = setInterval(() => this.tick(), Countdown.INTERVAL);
//     }
  
//     pause() {
//       clearInterval(this.timer);
//       this.timer = null;
//     }
  
//     resume() {
//       if (!this.timer) this.start();
//     }
//   }
  
//   // Auto-init
//   document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.countdown[data-countdown]').forEach(el => new Countdown(el));
//   });  